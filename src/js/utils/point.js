import Rect from "~/utils/rect";
import Random from "random-js";

export default class Point {
	constructor(x, y) {
		if (!new.target) {
			return new Point(x, y);
		}

		this._x = typeof x.x === "undefined" ? x : x.x;
		this._y = typeof x.y === "undefined" ? y : x.y;
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

	static random(engine, x = 1, y = 1) {
		let rx = Random.integer(0, x)(engine),
			ry = Random.integer(0, y)(engine);

		return new Point(rx, ry);
	}

	get inverse() {
		return new Point(this.x * -1, this.y * -1);
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	add() {
		let other = Point.read(arguments);
		return new Point(this.x + other.x, this.y + other.y);
	}

	ceil() {
		return new Point(Math.ceil(this.x), Math.ceil(this.y));
	}

	clone() {
		return new Point(this);
	}

	distance() {
		let other = Point.read(arguments),
			dx = other.x - this.x,
			dy = other.y - this.y;
		
		return Math.abs(Math.sqrt((dx * dx) + (dy * dy)));
	}

	equals(other) {
		return this.x === other.x && this.y === other.y;
	}

	in(rect) {
		if (typeof rect === "undefined") {
			console.warn("Unknown value passed to Point.in.");
			return false;
		}

		if (arguments.length > 1 || !(arguments[0] instanceof Rect)) {
			return this.in(Rect.read(arguments));
		}

		return this.x >= rect.topLeft.x &&
			this.x < rect.bottomRight.x &&
			this.y >= rect.topLeft.y &&
			this.y < rect.bottomRight.y;
	}

	interpolate(other, n) {
		if (!(other instanceof Point)) {
			throw new TypeError("Point.interpolate expects to be passed a Point!");
		}

		let dx = other.x - this.x,
			dy = other.y - this.y;

		return new Point(this.x + Math.round(dx * n), this.y + Math.round(dy * n));
	}

	manhattan(other) {
		return(Math.abs(this.x - other.x) + Math.abs(this.y - other.y));
	}

	subtract() {
		let other = Point.read(arguments);
		return new Point(this.x - other.x, this.y - other.y);
	}

	toString() {
		return this.x + "," + this.y;
	}
}