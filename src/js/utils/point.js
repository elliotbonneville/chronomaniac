export default class Point {
	constructor(x, y) {
		this._x = x.x || x;
		this._y = x.y || y;
	}

	static read(args) {
		if (args.length === 0) {
			throw new TypeError("No arguments passed in to Point.read");
		}

		let x = args[0],
			y = args[1];

		if (!isNaN(x.x) && !isNaN(x.y)) {
			return new Point(x.x, x.y);
		} else if (!isNaN(x[0]) && !isNaN(x[1])) {
			return new Point(x[0], x[1]);
		} else if (!isNaN(x) && !isNaN(y)) {
			return new Point(x, y);
		}
	}

	static random(x = 1, y = 1) {
		return new Point(Math.floor(Math.random() * x), Math.floor(Math.random() * y));
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	toString() {
		return this.x + " " + this.y;
	}
}