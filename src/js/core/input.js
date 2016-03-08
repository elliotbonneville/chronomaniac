import Mousetrap from "mousetrap";
import Point from "~/utils/point";

import * as camera from "~/tools/camera";
import MoveAction from "~/actor/actions/move.action";

// convenience method to move the player
function movePlayer(game, direction) {
	return game.player.do(new MoveAction({direction}));
}

let input = {
	events: {
		"up": game => {return movePlayer(game, new Point(0, -1))},
		"down": game => {return movePlayer(game, new Point(0, 1))},
		"left": game => {return movePlayer(game, new Point(-1, 0))},
		"right": game => {return movePlayer(game, new Point(1, 0))}
	},

	init: function (game) {
		for (let event in this.events) {
			Mousetrap.bind(event, () => {
				let eventOccurred = this.events[event](game);

				if (!this.waiting && eventOccurred) {
					this.waiting = true;
					game.tick();
				}
			});
		}

		return this;
	},

	waiting: false
}

export default input;