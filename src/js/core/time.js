export default class Time() {
	constructor() {
		this._startingTime = Date.now();
		this._tick = 0;
	}

	get tick() {
		return this._tick;
	}

	step() {

	}
}