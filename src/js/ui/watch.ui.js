import UI from "./ui";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

export default class WatchUI extends UI {
	constructor(settings) {
		super(settings);
	}

	generate() {
		// get circle that represents watch face
		new Rect(0, 0, this.settings.width, this.settings.height - 2).forEach(p => {
			let tile = this.tile(p),
				distance = p.distance(5, 5);

			// draw a circle
			if (distance > 4 && distance < 5.6) {
				tile.character = "#";
				this.emit("update", tile);
			}
		});

		this.drawLabel(new Point(0, this.settings.height - 1), `Turn: ${1}`);
	}

	update() {
		this.drawLabel(new Point(0, this.settings.height - 1), `Turn: ${1}`);	
	}
}