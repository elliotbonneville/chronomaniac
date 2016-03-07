import Action from "./action";
import Point from "~/utils/point";

export default class MoveAction extends Action {
	constructor(data) {
		super(data);
	}

	apply(actor) {
		let newPos = actor.position.add(this.data.direction),
			tile = actor.map.tile(newPos);

		if (tile.walkable) {
			actor.position = newPos;
		}

		return {
			direction: this.data.direction.inverse()
		};
	}
}