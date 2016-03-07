import Display from "~/renderer/display";
import View from "~/renderer/view";
import GameMap from "~/map/map";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

import {Light} from "~/map/light";
import Player from "~/actor/player";

export default class Game {
	constructor() {
		this.settings = Object.freeze({
			width: 80,
			height: 25
		});

		// create a new display as well, the first time the page is loaded
		this.display = new Display(this.settings);
		this.begin();
	}

	begin() {
		// clear the display if there was anything on it before
		this.display.clear();

		// create a new map
		this.map = new GameMap();

		// create a new view for the map
		this.display.addView("map", new View(new Rect(0, 0, this.settings.width, this.settings.height), this.map));
		this.map.generate();

		// make da player
		let tile = this.map.randomTile(undefined, 15, 15),
			lamp = new Light(tile, 10, new Color("orange"));

		this.map.light.calculate(lamp);
		let player = new Player(this.map, tile);

		// and render the new stuff
		this.display.render();
	}
}