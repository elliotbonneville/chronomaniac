import Actor from "~/actor/actor";

export default class Player extends Actor {
	constructor(map, position, timeline) {
		super(map, position, timeline);

		this.type = "player";
	}

	takeTurn() {
		if (this.timeline.inPast) {
			this.timeline.travel(1);
		} else {
			this.remove();
		}

		// check for paradoxes
		if (this.visible(t => t.actor !== null && t.actor !== this).length !== 
			this.timeline.currentEvent.actorsVisible.length) {

			this.map.tile(game.player.position).actor = null;
			
			game.player = this;
			game.actors.splice(game.actors.indexOf(this), 1);
			this.timeline.clearFuture();
		}
	}
}