import Mousetrap from "mousetrap";
import Point from "~/utils/point";

import * as camera from "~/tools/camera";
import MoveAction from "~/actor/actions/move.action";
import ThrowLeverAction from "~/actor/actions/throwLever.action";

// convenience method to move the player
function movePlayer(game, direction) {
	return game.player.do(new MoveAction({direction}));
}

let input = {
	context: "walk",
	events: {
		walk: {
			"up": game => {return movePlayer(game, new Point(0, -1))},
			"down": game => {return movePlayer(game, new Point(0, 1))},
			"left": game => {return movePlayer(game, new Point(-1, 0))},
			"right": game => {return movePlayer(game, new Point(1, 0))},
			"space": game => {return game.player.do(new ThrowLeverAction())}
		}
	},

	init: function (game) {
		this.setContext("walk");

		return this;
	},

	setContext(context) {
		let oldTriggers = this.events[this.context];
		for (let eventTrigger in oldTriggers) {
			Mousetrap.unbind(eventTrigger);
		}

		let contextEvents = this.events[context];
		
		for (let eventTrigger in contextEvents) {
			Mousetrap.bind(eventTrigger, () => {
				let event = contextEvents[eventTrigger](game);

				if (!this.waiting && event.occurred) {
					this.waiting = true;
					game.tick();
				}
			});
		}	
	},

	waiting: false
}

export default input;