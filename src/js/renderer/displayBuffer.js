import EventEmitter from "events";

import Cell from "./cell";
import Point from "~/utils/point";

export default class DisplayBuffer extends EventEmitter {
	constructor(settings) {
		super();

		this.settings = Object.freeze(Object.assign({
			width: 50,
			height: 50,
			position: new Point(0, 0)
		}, settings));

		this.cells = [];
		this.dirty = [];

		for (let x = 0; x < this.settings.width; x++) {
			this.cells[x] = [];

			for (let y = 0; y < this.settings.height; y++) {
				this.cells[x][y] = new Cell(this, new Point(x, y));
				this.dirty.push(this.cells[x][y]);
			}
		}
	}

	cell() {
		let pos = Point.read(arguments);
		return this.cells[pos.x][pos.y];
	}

	rect(x1, y1, x2, y2) {
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
}