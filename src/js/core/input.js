import Mousetrap from "mousetrap";
import Point from "~/utils/point";

import * as camera from "~/tools/camera";
import MoveAction from "~/actor/actions/move.action";

// convenience method to move the player
function movePlayer(game, direction) {
	if (game.player.do(new MoveAction({direction}))) {
		input.waiting = true;
		game.tick();
		// camera.move(game.display.views.map, direction.inverse());
	}
}

let input = {
	events: {
		"up": game => {movePlayer(game, new Point(0, -1))},
		"down": game => {movePlayer(game, new Point(0, 1))},
		"left": game => {movePlayer(game, new Point(-1, 0))},
		"right": game => {movePlayer(game, new Point(1, 0))}
	},

	init: function (game) {
		for (let event in this.events) {
			Mousetrap.bind(event, () => {
				if (!this.waiting) {
					this.events[event](game);
				}
			});
		}

		return this;
	},

	waiting: false
}

export default input;