import EventEmitter from "events";
import {throttle} from "lodash";

import Cell from "./cell";
import Point from "~/utils/point";

let _cells = [];

let buffer = Object.assign({}, EventEmitter.prototype, {
	settings: {
		width: 50,
		height: 50
	},

	registerView: () => {
		return {
			cells: _cells, 
			render: throttle(() => buffer.emit("render"), 1000 / 60)
		};
	},
});

for (let x = 0; x < buffer.settings.width; x++) {
	_cells[x] = [];

	for (let y = 0; y < buffer.settings.height; y++) {
		_cells[x][y] = new Cell(new Point(x, y));
	}
}

export default buffer;