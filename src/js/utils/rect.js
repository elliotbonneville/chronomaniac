import Point from "./point";

export default class Rect {
	constructor(x1, y1, x2, y2) {
		if (!new.target) {
			return new Rect(topLeft, bottomRight);
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

	equals(other) {
		return this.topLeft.equals(other.topLeft) && this.bottomRight.equals(other.bottomRight);
	}

	forEach(callback) {
		for (let x = this.topLeft.x; x < this.bottomRight.x; x++) {
			for (let y = this.topLeft.y; y < this.bottomRight.y; y++) {
				callback(new Point(x, y));
			}
		}
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