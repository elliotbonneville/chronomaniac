import UI from "~/ui/ui";
import Point from "~/utils/point";
import Rect from "~/utils/rect";

export default class LogUI extends UI {
	constructor(settings) {
		super(settings);

		this.markers = [];
	}

	draw() {
		this.clear();
		this.drawBox(new Rect(0, 0, this.settings.width - 1, this.settings.height - 1));

		this.drawLabel(new Point(2, 2), `Turn: ${this.settings.game.currentTick}`);
		this.drawLabel(new Point(1, 4), " - markers - ");

		this.markers.forEach((marker, i) => {
			let difference = game.currentTick - marker.time;

			this.drawLabel(new Point(2, 6 + i), `${marker.name}: ${difference}`);
		});
	}

	addMarker(data) {
		this.markers.push(data);
	}
}