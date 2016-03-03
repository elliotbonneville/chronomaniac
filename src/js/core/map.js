import EventHandler from "events";
import Point from "~/utils/point";

import FloorTile from "~/tiles/floor.tile";

export default class Map extends EventHandler {
	constructor(options) {
		super();

		this.options = Object.assign({
			width: 50,
			height: 50
		}, options);

		this.generate();
	}

	generate() {
		this.tiles = [];

		for (let x = 0; x < this.options.width; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < this.options.height; y++) {
				this.tiles[x][y] = new FloorTile(this);
			}
		}
	}

	update(tile) {
		this.emit("update", tile);
	}
}