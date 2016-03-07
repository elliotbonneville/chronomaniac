import Mousetrap from "mousetrap";
import Point from "~/utils/point";

import MoveAction from "~/actor/actions/move.action";

let events = {
	"up": game => {
		game.player.do(new MoveAction({
			direction: new Point(0, -1)
		}));
	},

	"down": game => {
		game.player.do(new MoveAction({
			direction: new Point(0, 1)
		}));
	},

	"left": game => {
		game.player.do(new MoveAction({
			direction: new Point(-1, 0)
		}));
	},

	"right": game => {
		game.player.do(new MoveAction({
			direction: new Point(1, 0)
		}));
	}
};

export function bindEvents(game) {
	for (let event in events) {
		let handler = events[event];

		Mousetrap.bind(event, handler.bind(null, game));
	}
}