import EventHandler from "events";
import Point from "~/utils/point";
import Color from "~/renderer/color";

import FloorTile from "~/tiles/floor.tile";
import LeverTile from "~/tiles/lever.tile";
import generateCellularAutomata from "~/map/generators/cellularAutomata";
import generatePerlinNoise from "~/map/generators/perlinNoise";

import {LightRenderer, Light} from "~/map/light";
import visibleFromPoint from "~/map/visibleFromPoint";

import Random from "random-js";

let mt = Random.engines.mt19937();
export default class Map extends EventHandler {
	constructor(options, seed) {
		super();

		this.options = Object.assign({
			width: 80,
			height: 30
		}, options);

		this.lighting = {};
		this.tiles = [];
		this.lavaTiles = [];
		this.levers = [];

		this.visibleFromPoint = visibleFromPoint.bind(null, this);

		mt.seed(seed);
	}

	createLavaFlow() {
		let tile = this.tile(this.randomTile(undefined, FloorTile, 30, 30));

		while (Random.real(0, 1)(mt) < .97 && tile.elevation > 5) {
			tile = this.tile(this.randomTile(undefined, FloorTile, 30, 30));
		}

		tile.lavaSource = true;
		tile.lava = 1;		
	}

	generate() {
		for (let x = 0; x < this.options.width; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < this.options.height; y++) {
				this.tiles[x][y] = new FloorTile(null, this);
			}
		}

		// generateCellularAutomata(this, mt);
		generatePerlinNoise(this, mt);

		this.light = new LightRenderer(this);

		// place levers for le win condition
		let i = 0;
		while (i < 4) {
			let p = this.randomTile(undefined, FloorTile, 25, 25),
				tile = this.tile(p);

			let elevation = tile.elevation,
				lever = new LeverTile(p, this);
			
			tile.replace(lever);
			this.levers.push(lever);

			let lastColor = lever.color;
			lever.elevation = elevation;
			lever.color = lastColor;
			
			i++;
		}

		this.emit("redraw");
	}

	// generate lava from 0 to tick x (cic)
	generateLava(startTime, finalTick) {
		// remove all lava from the scene and recalculate it from start
		let i = this.lavaTiles.length;
		while (i--) {
			let tile = this.lavaTiles[i];

			tile.lava = 0;
			tile.lavaSource = false;
			tile.render();
		}

		for (let i = startTime; i <= finalTick; i++) {
			this.tick(i);
		}
	}

	randomTile(
		engine = mt,
		tileType = FloorTile,
		width = this.options.width,
		height = this.options.height
	) {
		let p = Point.random(mt, width, height);
		while (!(this.tile(p) instanceof tileType)) {
			p = Point.random(mt, width, height);
		}

		return p;
	}

	// handle map changes for one tick -- this includes lava
	tick(currentTick) {
		mt.seed(currentTick);

		if (Random.bool(0.03)(mt)) {
			this.createLavaFlow();
		}

		this.lavaTiles.forEach(tile => tile.updateLava(mt));
	}

	tile() {
		let p = Point.read(arguments);
		return this.tiles[p.x] ? this.tiles[p.x][p.y] : null;
	}

	update(tile) {
		this.emit("update", tile);
	}
}