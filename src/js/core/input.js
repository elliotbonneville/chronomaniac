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
			"space": game => {return game.player.do(new ThrowLeverAction())},
			">": game => {
				input.state.direction = "forward";
				input.initiateTravelInput();
				return {
					occurred: false
				};
			},
			"<": game => {
				input.state.direction = "backward";
				input.initiateTravelInput();
				return {
					occurred: false
				};
			}
		},

		type: {
			1: true,
			2: true,
			3: true,
			4: true,
			5: true,
			6: true,
			7: true,
			8: true,
			9: true,
			0: true,
			backspace: () => {
				let val = input.state.value;
				input.state.value = val.substr(0, val.length - 1);
				input.updateTravelInput();
			},
			enter: () => {
				let temporalDistance = parseInt(input.state.value, 10) *
					(input.state.direction === "forward" ? 1 : -1);

				if (temporalDistance == 0 || isNaN(temporalDistance)) {
					game.log.message("Why, that's silly!");
					input.rejectTravelInput();
				} else {
					input.acceptTravelInput(temporalDistance);
				}
			},
			escape: () => {
				game.log.replaceMessage(`You decide to travel ${input.state.direction}. How far? ${input.state.value}`);
				game.log.message(`You resist the urge to turn your watch ${input.state.direction}.`);
				input.rejectTravelInput();
			}
		}
	},
	state: {
		direction: null,
		value: ""
	},

	init (game) {
		this.setContext("walk");

		return this;
	},

	initiateTravelInput() {
		game.log.message(`You decide to travel ${this.state.direction}. How far? _`);
		this.setContext("type");
	},

	rejectTravelInput() {
		input.state.direction = null;
		input.state.value = "";
		input.setContext("walk");
	},

	updateTravelInput() {
		game.log.replaceMessage(`You decide to travel ${this.state.direction}. How far? ${this.state.value}_`);
	},

	acceptTravelInput(temporalDistance) {
		game.log.replaceMessage(`You decide to travel ${this.state.direction}. How far? ${this.state.value}`);
		input.state.direction = null;
		input.state.value = "";
		game.timeTravel(temporalDistance);
		input.setContext("walk");
	},

	setContext(context) {
		let oldTriggers = this.events[this.context];
		for (let eventTrigger in oldTriggers) {
			Mousetrap.unbind(eventTrigger);
		}

		let contextEvents = this.events[context];
		
		for (let eventTrigger in contextEvents) {
			Mousetrap.bind(eventTrigger, (e) => {
				e.preventDefault();
				if (context !== "type") {
					let event = contextEvents[eventTrigger](game);

					if (!this.waiting && event.occurred) {
						this.waiting = true;
						game.tick();
					}
				} else {
					// if we are typing, handle this specially...
					if (e.code.indexOf("Digit") > -1) {
						this.state.value += e.code.replace("Digit", "");
						this.updateTravelInput();
					} else {
						contextEvents[eventTrigger]();
					}
				}
			});
		}
	},

	waiting: false
}

export default input;