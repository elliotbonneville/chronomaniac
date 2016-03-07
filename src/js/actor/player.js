import Actor from "~/actor/actor";

export default class Player extends Actor {
	constructor(map, position) {
		super(map, position);

		console.log("PLAYER IN DA HOUSE");
	}
}