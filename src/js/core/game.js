import Display from "~/renderer/display";
import View from "~/renderer/view";
import Map from "~/core/map";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

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
		this.map = new Map();

		// create a new view for the map
		this.display.addView("map", new View(new Rect(0, 0, this.settings.width, this.settings.height), this.map));

		// now that everything's set up, we can generate the map
		this.map.generate();
	}
}