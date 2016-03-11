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

			// loop through actors including this one and remove them from the map and
			// the future, because their timeline has been actually completely erased
			let i = game.actors.indexOf(this),
				end = game.actors.length;

			while (i < end) {
				if (game.actors[i] !== game.player) {
					game.actors[i].remove();
				}

				this.map.levers.forEach(lever => {
					console.log(lever.thrower === game.actors[i], lever.thrower, game.actors[i]);
					if (lever.thrower == game.actors[i]) {
						lever.thrower = null;
						lever.thrownTime = null;

						console.log(lever);
					}
				});

				i++;
			}

			game.actors.length = game.actors.indexOf(this);

			this.timeline.clearFuture();
			game.log.message(
				"You spot an older, worn version of yourself",
				"  looking at you in horror. Immediately, you",
				"  begin to fade...");
		}
	}
}