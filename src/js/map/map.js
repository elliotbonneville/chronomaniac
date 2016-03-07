import EventHandler from "events";
import Point from "~/utils/point";
import Color from "~/renderer/color";

import FloorTile from "~/tiles/floor.tile";
import generateCellularAutomata from "~/map/generators/cellularAutomata";
import generatePerlinNoise from "~/map/generators/perlinNoise";

import {LightRenderer, Light} from "~/map/light";

export default class Map extends EventHandler {
	constructor(options) {
		super();

		this.options = Object.assign({
			width: 80,
			height: 25
		}, options);
	}

	generate() {
		this.tiles = [];

		for (let x = 0; x < this.options.width; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < this.options.height; y++) {
				this.tiles[x][y] = new FloorTile(null, this);
			}
		}

		generateCellularAutomata(this);
		generatePerlinNoise(this);

		this.light = new LightRenderer(this);

		let light = new Light(this.randomTile(FloorTile), 10, new Color("orange"));
		this.light.calculate(light);
		this.emit("redraw");
	}

	randomTile(tileType, width = this.options.width, height = this.options.height) {
		let p = Point.random();

		while (!(this.tile(p) instanceof tileType)) {
			p = Point.random(width, height);
		}

		return p;
	}

	tile() {
		let p = Point.read(arguments);
		return this.tiles[p.x] ? this.tiles[p.x][p.y] : null;
	}

	update(tile) {
		this.emit("update", tile);
	}
}