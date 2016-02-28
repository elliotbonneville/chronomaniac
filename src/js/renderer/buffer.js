import EventEmitter from "events";

import Cell from "./cell";
import Point from "~/utils/point";

let _cells = [],
	_views = [];

let buffer = Object.assign({}, EventEmitter.prototype, {
	settings: {
		width: 50,
		height: 50
	},

	registerView: function (view) {
		_views.push(view);
		return _cells;
	}
});

for (let x = 0; x < buffer.settings.width; x++) {
	_cells[x] = [];

	for (let y = 0; y < buffer.settings.height; y++) {
		_cells[x][y] = new Cell(buffer, new Point(x, y));
	}
}

export default buffer;