import EventHandler from "events";
import Point from "~/utils/point";
import Rect from "~/utils/rect";
import Color from "~/renderer/color";

import FloorTile from "~/tiles/floor.tile";
import LeverTile from "~/tiles/lever.tile";
import WallTile from "~/tiles/wall.tile";
import generateCellularAutomata from "~/map/generators/cellularAutomata";
import generatePerlinNoise from "~/map/generators/perlinNoise";
import findCaverns from "~/map/generators/findCaverns";
import createBorders from "~/map/generators/createBorders";

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

		this.options.height = 30;
		this.options.width = 60;

		this.lighting = {};
		this.memory = {};
		this.tiles = [];
		this.lavaTiles = [];
		this.levers = [];

		this.visibleFromPoint = visibleFromPoint.bind(null, this);

		mt.seed(seed);
	}

	createLavaFlow() {
		let tile = this.tile(this.randomTile(undefined, FloorTile));

		while (Random.real(0, 1)(mt) < .97 && tile.elevation > 5) {
			tile = this.tile(this.randomTile(undefined, FloorTile));
		}

		// tile.lavaSource = true;
		tile.lava = Random.integer(10, 30)(mt);		
	}

	generate() {
		for (let x = 0; x < this.options.width; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < this.options.height; y++) {
				this.tiles[x][y] = new FloorTile(null, this);
			}
		}

		let mapRect = new Rect(0, 0, this.options.width, this.options.height);

		// generate some random caverns with cellular automata
		generateCellularAutomata(this, mt, mapRect);

		// use floodfill to drop all disconnected caverns
		let caverns = findCaverns(this, mapRect),
			main = caverns.sort().pop();

		caverns.forEach(cavern => cavern.forEach(tile => {
			tile.replace(new WallTile(tile.position.clone(), this));
		}));

		// generate perlin noise to assign elevations to all floor tiles
		generatePerlinNoise(this, mt);

		// place walls around the entire map so the player can't go off it anywhere
		createBorders(this);

		this.light = new LightRenderer(this);

		// place levers for le win condition
		let i = 0;
		while (i < 4) {
			let p = this.randomTile(undefined, FloorTile);

			while (this.levers.map(lever => {
				return lever.position.distance(p)
			}).sort((a, b) => a - b)[0] < 10) {
				p = this.randomTile(undefined, FloorTile);
			}

			let tile = this.tile(p),
				elevation = tile.elevation,
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

		if (Random.bool(0.2)(mt)) {
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