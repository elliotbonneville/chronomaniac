import Action from "./action";
import Point from "~/utils/point";

import LeverTile from "~/tiles/lever.tile";
import UnthrowLeverAction from "./unthrowLever.action";

export default class ThrowLeverAction extends Action {
	constructor(data) {
		super(data);
	}

	_apply(actor) {
		if (actor.tile instanceof LeverTile) {
			actor.tile.throwLever();
		}
	}

	get inverse() {
		return new UnthrowLeverAction();
	}
}