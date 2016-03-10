import Action from "./action";
import Point from "~/utils/point";

import LeverTile from "~/tiles/lever.tile";
import ThrowLeverAction from "./throwLever.action";

export default class UnthrowLeverAction extends Action {
	constructor(data) {
		super(data);
	}

	_apply(actor) {
		if (actor.tile instanceof LeverTile) {
			actor.tile.unthrowLever();
		}
	}

	get inverse() {
		return new ThrowLeverAction();
	}
}