export default class Point {
	constructor(x, y) {
		if (!new.target) {
			return new Point(x, y);
		}

		this._x = x.x || x;
		this._y = x.y || y;
	}

	static read(args) {
		if (args.length === 0) {
			throw new TypeError("No arguments passed in to Point.read");
		}

		let x = args[0],
			y = args[1],
			p;

		if (!isNaN(x.x) && !isNaN(x.y)) {
			p = new Point(x.x, x.y);
		} else if (!isNaN(x[0]) && !isNaN(x[1])) {
			p = new Point(x[0], x[1]);
		} else if (!isNaN(x) && !isNaN(y)) {
			p = new Point(x, y);
		}

		return p;
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

	equals(other) {
		return this.x === other.x && this.y === other.y;
	}

	in(rect) {
		return this.x >= rect.topLeft.x &&
			this.x < rect.bottomRight.x &&
			this.y >= rect.topLeft.y &&
			this.y < rect.bottomRight.y;
	}

	toString() {
		return this.x + "," + this.y;
	}
}