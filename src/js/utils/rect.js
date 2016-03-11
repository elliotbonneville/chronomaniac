import Point from "./point";

export default class Rect {
	constructor(x1, y1, x2, y2) {
		if (!new.target) {
			return new Rect(x1, y1, x2, y2);
		}

		let topLeft = new Point(x1, y1),
			bottomRight = new Point(x2, y2);

		if (!bottomRight) {
			bottomRight = new Point(y1);
		}

		if (!(topLeft instanceof Point) || !(bottomRight instanceof Point)) {
			throw new TypeError("Rect got some crappy arguments. Check yourself, m8.");
		}

		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
	}

	static read(args) {
		if (args[0] instanceof Point && args[1] instanceof Point) {
			return new Rect(args[0].x, args[0].y, args[1].x, args[1].y);
		} else if ([...args].every(arg => !isNaN(arg)) && args.length === 4) {
			return new Rect(args[0], args[1], args[2], args[3]);
		} else if (args[0] instanceof Rect) {
			return args[0];
		}

		return undefined;
	}

	equals(other) {
		return this.topLeft.equals(other.topLeft) && this.bottomRight.equals(other.bottomRight);
	}

	forEach(callback) {
		for (let x = this.topLeft.x; x < this.bottomRight.x; x++) {
			for (let y = this.topLeft.y; y < this.bottomRight.y; y++) {
				callback(new Point(x, y));
			}
		}

		return this;
	}

	intersects(other) {
		if (!(other instanceof Rect)) {
			throw new TypeError("intersects expects to be passed a Rect!!!1!!");
		}

		return !(this.topLeft.x > other.bottomRight.x ||
			other.bottomRight.x < this.topLeft.x ||
			other.topLeft.y > this.bottomRight.y ||
			other.bottomRight.y < this.topLeft.y);
	}

	toString() {
		return this.topLeft + ":" + this.bottomRight;
	}

	get width() {
		return this.bottomRight.x - this.topLeft.x;
	}

	get height() {
		return this.bottomRight.y - this.topLeft.y;
	}
}