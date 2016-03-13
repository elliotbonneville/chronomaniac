import Mousetrap from "mousetrap";
import Point from "~/utils/point";

import * as camera from "~/tools/camera";
import MoveAction from "~/actor/actions/move.action";
import ThrowLeverAction from "~/actor/actions/throwLever.action";
import DeployMarkerAction from "~/actor/actions/deployMarker.action";

// convenience method to move the player
function movePlayer(game, direction) {
	return game.player.do(new MoveAction({direction}));
}

let input = {
	context: "walk",
	events: {
		walk: {
			"up": game => {return movePlayer(game, new Point(0, -1))},
			"k": "up",
			"8": "up",
			"down": game => {return movePlayer(game, new Point(0, 1))},
			"j": "down",
			"2": "down",
			"left": game => {return movePlayer(game, new Point(-1, 0))},
			"h": "left",
			"4": "left",
			"right": game => {return movePlayer(game, new Point(1, 0))},
			"l": "right",
			"6": "right",
			".": game => {return movePlayer(game, new Point(0, 0))},
			"5": ".",
			"y": game => {return movePlayer(game, new Point(-1, -1))},
			"7": "y",
			"u": game => {return movePlayer(game, new Point(1, -1))},
			"9": "u",
			"b": game => {return movePlayer(game, new Point(-1, 1))},
			"1": "b",
			"n": game => {return movePlayer(game, new Point(1, 1))},
			"3": "n",
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
			},
			"enter": game => {
				input.initiateMarkerInput();
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
		},

		"markerInput": {
			alphabet: letter => {
				input.updateMarkerInput(letter)
			},
			backspace: () => {
				input.shortenMarkerInput();
			},
			escape: () => {
				input.rejectMarkerInput();
				game.log.message("You decide not to create a temporal marker.");
			},
			enter: () => {
				input.acceptMarkerInput();
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

	/* time travel input */
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

	/* temporal marker input */
	initiateMarkerInput() {
		game.log.message("You set your watch to place a temporal marker.");
		game.log.message("What do you want to name it? _");
		input.setContext("markerInput");
	},

	shortenMarkerInput() {
		this.state.value = this.state.value.substr(0, this.state.value.length - 1);
		game.log.replaceMessage(`What do you want to name it? ${this.state.value}_`);
	},

	updateMarkerInput(letter) {
		if (this.state.value.length >= 8) {
			return;
		}

		this.state.value += letter;
		game.log.replaceMessage(`What do you want to name it? ${this.state.value}_`);
	},

	rejectMarkerInput() {
		game.log.replaceMessage("What do you want to name it?");
		input.state.value = "";
		input.setContext("walk");
	},

	acceptMarkerInput() {
		game.log.replaceMessage(`What do you want to name it? ${this.state.value}`);

		game.infoPanel.addMarker({
			time: game.currentTick,
			name: input.state.value
		});

		game.infoPanel.draw();
		input.state.value = "";
		input.setContext("walk");
		game.log.message("You deploy a temporal marker.");
	},

	setContext(context) {
		let oldTriggers = this.events[this.context];

		for (let eventTrigger in oldTriggers) {
			if (eventTrigger === "alphabet") {
				"abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
					Mousetrap.unbind(letter);
				});
				continue;
			}

			Mousetrap.unbind(eventTrigger);
		}

		let contextEvents = this.events[context];
		this.context = context;
		
		for (let eventTrigger in contextEvents) {
			if (eventTrigger === "alphabet") {
				"abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
					Mousetrap.bind(letter, (e) => {
						e.preventDefault();
						contextEvents["alphabet"](letter);
					});
				});
				continue;
			}

			let handler = contextEvents[eventTrigger];
			if (contextEvents[handler]) {
				handler = contextEvents[contextEvents[eventTrigger]];
			}

			Mousetrap.bind(eventTrigger, (e) => {
				e.preventDefault();
				if (context !== "type" && context !== "markerInput") {
					let event = handler(game);

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