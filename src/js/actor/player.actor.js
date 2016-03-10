import Actor from "~/actor/actor";
import Color from "~/renderer/color";

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
			return;
		}

		if (!this.timeline.currentEvent) {
			return;
		}

		// check for paradoxes
		if (this.visible(t => t.actor !== null && t.actor !== this).length !== 
			this.timeline.currentEvent.after.actorsVisible.length) {

			game.player.remove();
			
			game.player = this;
			game.player.color = new Color("white");
			game.actors.splice(game.actors.indexOf(this), 1);

			// let i = game.actors.length - 1;

			// while (i--) {
			// 	if (game.actors[i].spawnTime > this.spawnTime) {
			// 		game.actors[i].erase();
			// 	}
			// }

			this.timeline.clearFuture();
			game.log.message(
				"You spot an older, worn version of yourself",
				"  looking at you in horror. Immediately, you",
				"  begin to fade...");
		}
	}
}