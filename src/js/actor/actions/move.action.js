import Action from "./action";
import Point from "~/utils/point";

export default class MoveAction extends Action {
	constructor(data) {
		super(data);

	}

	_apply(actor) {
		let newPos = actor.position.add(this.data.direction),
			tile = actor.map.tile(newPos);

		if (tile.walkable && tile.lava === 0) {
			actor.position = newPos;
			return true;
		} else if (actor === game.player) {
			game.log.message("You decide against walking into the wall.");
		}
	}

	get inverse() {
		return new MoveAction({
			direction: this.data.direction.inverse
		});
	}
}