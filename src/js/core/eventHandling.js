import Mousetrap from "mousetrap";
import Point from "~/utils/point";

import * as camera from "~/tools/camera";
import MoveAction from "~/actor/actions/move.action";

// convenience method to move the player
function movePlayer(game, direction) {
	if (game.player.do(new MoveAction({direction}))) {
		camera.move(game.display.views.map, direction.inverse());
	}
}

let events = {
	"up": game => {movePlayer(game, new Point(0, -1))},
	"down": game => {movePlayer(game, new Point(0, 1))},
	"left": game => {movePlayer(game, new Point(-1, 0))},
	"right": game => {movePlayer(game, new Point(1, 0))}
};

export function bindEvents(game) {
	for (let event in events) {
		let handler = events[event];

		Mousetrap.bind(event, handler.bind(null, game));
	}
}