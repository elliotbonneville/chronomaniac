import Point from "~/utils/point";
import Rect from "~/utils/rect";
import buffer from "~/renderer/buffer";

export default class View {
	constructor(rect) {
		if (!(rect instanceof Rect)) {
			rect = new (Function.prototype.bind.apply(Rect, [null, ...arguments]));
		}

		this.rect = rect;
		this._dirty = [];
		this._cells = buffer.registerView(this);

		// make all cells that have just been added to this view dirty, so they render
		this.forEach((cell) => this._dirty.push(cell));
	}

	cell() {
		let pos = Point.read(arguments);

		if (!pos || !pos.in(this.rect)) {
			throw new TypeError(`Cell ${pos} is outside view (bounds are ${this.rect}).`);
			return;
		}

		let cell = this._cells[pos.x][pos.y];
		if (cell._view !== this) {
			cell._view = this;
		}

		return cell;
	}

	forEach(callback) {
		this.rect.forEach((p) => callback(this.cell(p), p));
		return this;
	}
}