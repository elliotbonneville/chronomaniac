import Display from "~/renderer/display";
import View from "~/renderer/view";
import TileMap from "~/map/map";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

import {Light} from "~/map/light";
import Player from "~/actor/player";

import WatchUI from "~/ui/watch.ui";

import {bindEvents} from "~/core/eventHandling";

export default class Game {
	constructor() {
		this.settings = Object.freeze({
			width: 80,
			height: 30
		});

		// create a new display as well, the first time the page is loaded
		this.display = new Display(this.settings);
		this.begin();

		// and finally bind keyboard handlers
		bindEvents(this);
	}

	begin() {
		// clear the display if there was anything on it before
		this.display.clear();

		// create a new map
		this.map = new TileMap(this.settings);
		this.watch = new WatchUI({
			width: 11,
			height: 13
		});

		// dev
		this.map.lit = true;

		// create a new view for the map
		this.display.addView("map", new View(new Rect(0, 0, 30, 30), this.map));
		this.display.addView("watch", new View(new Rect(31, 0, 42, 13), this.watch));
		this.map.generate();
		this.watch.generate();

		// make da player
		let tile = this.map.randomTile(undefined, 15, 15);

		this.player = new Player(this.map, tile);

		// this.display.views.map.origin = tile.subtract(15, 15);

		// and render the new stuff
		this.display.render();
	}

	tick() {
		// calculates light from lights on the map
		game.map.light.update();

		// update lava flows

		// make any mobs move

		// save game state
	}
}