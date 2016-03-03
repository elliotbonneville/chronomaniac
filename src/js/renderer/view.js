import Point from "~/utils/point";
import Rect from "~/utils/rect";
import buffer from "~/renderer/buffer";

export default class View {
	constructor(rect, map) {
		this.coordinates = new Point(0, 0);
		this.rect = rect;
		this.map = map;

		this._dirty = [];

		let {cells, render} = buffer.registerView(this);
		this._cells = cells;
		this._render = render;

		// make all cells that have just been added to this view dirty, so they render
		this.forEach((cell) => this._dirty.push(cell._setView(this)));

		// listen to the map for changes
		this.map.on("update", tile => this.cell(tile.position.add(this.coordinates)).update(tile));
	}

	cell() {
		let pos = Point.read(arguments);

		if (!pos || !pos.in(this.rect)) return Cell.Null;
		
		return this._cells[pos.x][pos.y];
	}

	forEach(callback) {
		this.rect.forEach(p => callback(this.cell(p)));
		return this;
	}

	makeDirty() {
		this.forEach(cell => this._dirty.push(cell));
	}

	update(cell) {
		this._dirty.push(cell);
		this._render();
	}
}