import Point from "~/utils/point";
import Rect from "~/utils/rect";

import buffer from "~/renderer/buffer";
import Cell from "~/renderer/cell";

export default class View {
	constructor(rect, map) {
		this._origin = new Point(0, 0);
		this.rect = rect;
		this.map = map;

		this._dirty = [];

		let {cells, render} = buffer.registerView(this);
		this._cells = cells;
		this._render = render;

		// make all cells that have just been added to this view dirty, so they render
		this.forEach((cell) => this._dirty.push(cell._setView(this)));

		// listen to the map for changes
		this.map.on("update", tile => {
			let cell = this.cell(tile.position.add(this.rect.topLeft).add(this.origin));
			if (cell) cell.update(tile);
		});

		this.map.on("redraw", this.render.bind(this));
	}

	get origin() {
		return this._origin;
	}

	set origin(point) {
		this._origin = point;
		this.forEach(cell => cell.update(this.map.tile(cell.position.subtract(this.origin).subtract(this.rect.topLeft))));
		this._render();
	}

	cell() {
		let pos = Point.read(arguments);

		if (!pos || !pos.in(this.rect)) {
			return null;
		}
		
		return this._cells[pos.x][pos.y];
	}

	forEach(callback) {
		this.rect.forEach(p => callback(this.cell(p)));
		return this;
	}

	_makeDirty() {
		this.forEach(cell => this._dirty.push(cell));
	}

	render() {
		this._makeDirty();
		this._render();
	}

	update(cell) {
		this._dirty.push(cell);
		this._render();
	}
}