export default class Action {
	constructor(data) {
		this.data = data;
	}

	apply(actor) {
		return {
			occurred: this._apply(actor),
			tick: game.tick
		}
	}

	clone() {
		return new this.constructor(this.data);
	}
}