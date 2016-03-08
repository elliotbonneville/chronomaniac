import {noop} from "lodash";

export default class Action {
	constructor(data) {
		this.data = data;
	}

	apply(actor) {
		return {
			inverse: this._inverse || noop,
			occurred: this._apply ? this._apply(actor) : false,
			tick: game.tick
		};
	}

	clone() {
		return new this.constructor(this.data);
	}
}