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

			game.resolveParadox(this, currentParadox);
		}
	}
}