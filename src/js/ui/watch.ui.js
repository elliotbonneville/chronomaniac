import UI from "./ui";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

export default class WatchUI extends UI {
	constructor(settings) {
		super(settings);
	}

	generate() {
		let center = new Point(5, 5);

		// get circle that represents watch face
		new Rect(0, 0, this.settings.width, this.settings.height - 2).forEach(p => {
			let tile = this.tile(p),
				distance = p.distance(center);

			// draw a circle
			if (distance > 4.4 && distance < 5.8) {
				let angle = Math.round((Math.atan2(p.y - center.y, p.x - center.x) * 
					180 / Math.PI) / 30) * 30,
					abs = Math.abs(angle);

				tile.character = "°";
				this.emit("update", tile);
			}

			if (distance > 3.8 && distance < 4.4) {
				tile.character = "°";
				tile.color = new Color(60, 60, 60);
				this.emit("update", tile);
			}
		});

		this.drawLabel(new Point(0, this.settings.height - 1), `Turn: ${1}`);
	}

	update() {
		this.drawLabel(new Point(0, this.settings.height - 1), `Turn: ${1}`);	
	}
}