import Actor from "~/actor/actor";
import Color from "~/renderer/color";

import {difference} from "lodash";

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
		let actorsVisible = this.visible(t => t.actor !== null && t.actor !== this),
			pastActorsVisible = this.timeline.currentEvent.after.actorsVisible,
			visibleDifference = difference(actorsVisible, pastActorsVisible);

		if (visibleDifference.length) {
			let currentParadox = visibleDifference
				.filter(tile => tile.actor === game.player).length;

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
					if (lever.thrower == game.actors[i]) {
						lever.thrower = null;
						lever.thrownTime = null;
					}
				});

				i++;
			}

			game.actors.length = game.actors.indexOf(this);

			this.timeline.clearFuture();
			game.log.message("Your temporal paradox collapse alert chimes...");

			console.log(currentParadox);
			if (currentParadox) {
				game.log.message("You suddenly remember watching yourself vanish",
					"as you feel reality warping around you, time",
					"itself bending to set things right.");
			} else {
				game.log.message("You ruefully realize you made a paradox earlier",
					"as the walls of reality collapse about you.");
			}
		}
	}
}