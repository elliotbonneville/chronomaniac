import UI from "~/ui/ui";
import Point from "~/utils/point";
import Rect from "~/utils/rect";

export default class LogUI extends UI {
	constructor(settings) {
		super(settings);

		this.messages = [];
	}

	draw() {
		this.drawBox(new Rect(0, 0, this.settings.width - 1, this.settings.height - 1));
	}

	message(message) {
		this.messages.unshift(message);

		this.clear(new Rect(1, 1, this.settings.width - 2, this.settings.height - 2));
		this.messages.every((message, i) => {
			if (message.length > 40) {
				message = message.substr(0, 45) + "...";
			}

			this.drawLabel(new Point(1, 8 - i), message);

			if (i == 7) {
				return false;
			}

			return true;
		});
	}
}