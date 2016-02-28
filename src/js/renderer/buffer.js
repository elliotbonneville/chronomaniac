import EventEmitter from "events";

import Cell from "./cell";
import Point from "~/utils/point";

let buffer = Object.assign({}, EventEmitter.prototype, {
	settings: {
		width: 50,
		height: 50
	},

	cells: [],
	dirty: [],

	cell: function () {
		let pos = Point.read(arguments);

		if (!pos) {
			throw new TypeError("Invalid argument(s) supplied");
		}

		return this.cells[pos.x][pos.y];
	}
});

for (let x = 0; x < buffer.settings.width; x++) {
	buffer.cells[x] = [];

	for (let y = 0; y < buffer.settings.height; y++) {
		buffer.cells[x][y] = new Cell(buffer, new Point(x, y));
		buffer.dirty.push(buffer.cells[x][y]);
	}
}

export default buffer;