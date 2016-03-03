import EventEmitter from "events";
import {debounce} from "lodash";

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
			render: buffer.render
		};
	},
});

buffer.render = debounce(() => {
	buffer.emit("render");
}, 14, {
	trailing: true
});

for (let x = 0; x < buffer.settings.width; x++) {
	_cells[x] = [];

	for (let y = 0; y < buffer.settings.height; y++) {
		_cells[x][y] = new Cell(new Point(x, y));
	}
}

export default buffer;