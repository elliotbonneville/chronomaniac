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
		return this.cells[pos.x][pos.y];
	},

	rect: function (x1, y1, x2, y2) {
		return {
			forEach: callback => {
				for (let x = x1; x < x2; x++) {
					for (let y = y1; y < y2; y++) {
						callback(this.cell(x, y));
					}
				}
			}
		};
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