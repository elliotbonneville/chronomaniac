import EventEmitter from "events";

import Cell from "./cell";
import Point from "~/utils/point";

export default class Buffer extends EventEmitter {
	constructor() {
		super();

		this.height = 50;
		this.width = 50;
		this._cells = [];

		for (let x = 0; x < this.width; x++) {
			this._cells[x] = [];

			for (let y = 0; y < this.height; y++) {
				this._cells[x][y] = new Cell(x, y);
			}
		}

		setInterval(() => {
			let i = 20;

			while (i--) {
				var character = String.fromCharCode(60 + Math.round(Math.random() * 60)),
				cell = this.cell(Point.random(this.width, this.height));

				cell.character = character;
				this.emit("render");
			}
		}, 30);
	}

	get cells() {
		return this._cells;
	}

	cell() {
		let pos = Point.read(arguments);
		return this._cells[pos.x][pos.y];
	}
}