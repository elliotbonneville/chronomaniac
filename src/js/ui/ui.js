import EventEmitter from "events";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

export default class UI extends EventEmitter {
	constructor(settings) {
		super();

		this.settings = Object.assign({
			width: 11,
			height: 12
		}, settings);

		this.tiles = [];

		for (let x = 0; x < this.settings.width; x++) {
			this.tiles[x] = [];

			for (let y = 0; y < this.settings.height; y++) {
				this.tiles[x][y] = {
					character: "",
					color: new Color("white"),
					backgroundColor: new Color("black"),
					position: new Point(x, y)
				}
			}
		}
	}

	tile() {
		let p = Point.read(arguments);
		return this.tiles[p.x] ? this.tiles[p.x][p.y] : null;
	}

	drawLabel(point, text) {
		text.split("").forEach((character, i) => {
			let tile = this.tile(point.add(i, 0));
			tile.character = character;
			this.emit("update", tile);
		});
	}

	drawAreaText(point, text) {
		text.forEach((line, y) => {
			drawLabel(point.add(0, y), line);
		});
	}
}