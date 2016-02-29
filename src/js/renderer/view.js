import Point from "~/utils/point";
import Rect from "~/utils/rect";
import buffer from "~/renderer/buffer";

export default class View {
	constructor(rect, coordinates) {
		if (!(rect instanceof Rect)) {
			rect = new (Function.prototype.bind.apply(Rect, [null, ...arguments]));
		}

		this.coordinates = coordinates || rect.topLeft.clone();
		this.rect = rect;
		this._dirty = [];
		buffer.registerView(this);

		// make all cells that have just been added to this view dirty, so they render
		this.forEach((cell) => this._dirty.push(cell._setView(this)));
	}

	_giveCells(cells) {
		this._cells = cells;
	}

	cell() {
		let pos = Point.read(arguments);

		if (!pos || !pos.in(this.rect)) {
			throw new TypeError(`Cell ${pos} is outside view (bounds are ${this.rect}).`);
			return;
		}
		
		return this._cells[pos.x][pos.y];
	}

	forEach(callback) {
		this.rect.forEach(p => callback(this.cell(p)));
		return this;
	}

	makeDirty() {
		this.forEach(cell => this._dirty.push(cell));
	}
}