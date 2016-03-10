import EventEmitter from "events";
import Color from "~/renderer/color";
import UICell from "./uiCell";

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
				this.tiles[x][y] = new UICell(this, new Point(x, y));
			}
		}
	}

	tile() {
		let p = Point.read(arguments);
		return this.tiles[p.x] ? this.tiles[p.x][p.y] : null;
	}

	clear(rect = new Rect(0, 0, this.settings.width, this.settings.height)) {
		rect.forEach(p => {
			let tile = this.tile(p);

			tile.character = "";
			tile.color = new Color("white");
			tile.backgroundColor = new Color("black");
		});
	}

	drawLabel(point, text) {
		text.split("").forEach((character, i) => {
			let tile = this.tile(point.add(i, 0));
			tile.character = character;
			this.emit("update", tile);
		});
	}

	drawAreaText(rect, text) {
		text.forEach((line, y) => {
			drawLabel(point.add(0, y), line);
		});
	}

	drawBox(rect) {
		// draw top edge
		for (let x = rect.topLeft.x; x < rect.bottomRight.x; x++) {
			this.tile(x, 0).character = "-";
		}

		// draw bottom edge
		for (let x = rect.topLeft.x; x < rect.bottomRight.x; x++) {
			this.tile(x, rect.bottomRight.y).character = "-";
		}

		// draw left edge
		for (let y = rect.topLeft.y; y < rect.bottomRight.y; y++) {
			this.tile(0, y).character = "|";
		}

		// draw right edge
		for (let y = rect.topLeft.y; y < rect.bottomRight.y; y++) {
			this.tile(rect.bottomRight.x, y).character = "|";
		}

		// draw corners
		this.tile(rect.topLeft).character = "Ú";
		this.tile(rect.topLeft.x, rect.bottomRight.y).character = "À";
		this.tile(rect.bottomRight.x, rect.topLeft.y).character = "¿";
		this.tile(rect.bottomRight).character = "Ù";
	}
}