import Display from "~/renderer/display";
import View from "~/renderer/view";
import TileMap from "~/map/map";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

import {Light} from "~/map/light";
import Player from "~/actor/player.actor";

import WatchUI from "~/ui/watch.ui";

import input from "~/core/input";

export default class Game {
	constructor() {
		this.settings = Object.freeze({
			width: 80,
			height: 30
		});

		// create a new display as well, the first time the page is loaded
		this.display = new Display(this.settings);
		this.begin();

		// bind keyboard handlers
		this.input = input.init(this);

		// initialize tick count
		this.currentTick = 0;
		this.timeFrontier = 0;
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
		this.watch.draw();

		// make da player
		let tile = this.map.randomTile(undefined, 15, 15);

		this.currentPlayer = new Player(this.map, tile);

		// center camera on player
		// this.display.views.map.origin = tile.subtract(15, 15);

		// and render the new stuff
		this.display.render();
	}

	tick() {
		if (this.currentTick == this.timeFrontier) {
			this.timeFrontier++;
		}

		this.currentTick++;

		// calculates light from lights on the map
		game.map.light.update();

		// update lava flows

		// make any mobs move

		// save game state

		this.input.waiting = false;
	}

	// do what's necessary to make time travel happen
	timeTravel(temporalDistance) {
		this.currentTick += temporalDistance;


	}
}