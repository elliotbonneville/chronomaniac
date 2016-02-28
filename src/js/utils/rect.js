import Point from "./point";

export default class Rect {
	constructor(topLeft, bottomRight) {
		if (!(topLeft instanceof Point) || !(bottomRight instanceof Point)) {
			throw new TypeError("Rect expects to be defined by Points.");
		}

		this.topLeft = topleft;
		this.bottomRight = bottomRight;
	}

	intersects(other) {
		if (!(other instanceof Rect)) {
			throw new TypeError("intersects expects to be passed a Rect.");
		}
	}

	get width() {
		return this.bottomRight.x - this.topLeft.x;
	}

	get height() {
		return this.bottomRight.y - this.topLeft.y;
	}

	get borders() {

	}

	get forEach() {
		
	}
}