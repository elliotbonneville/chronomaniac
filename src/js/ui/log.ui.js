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

	renderMessages() {
		this.clear(new Rect(1, 1, this.settings.width - 1, this.settings.height - 1));
		this.messages.every((message, i) => {
			if (message.length > this.settings.width - 2) {
				message = message.substr(0, this.settings.width - 5) + "...";
			}

			this.drawLabel(new Point(1, 8 - i), message);

			if (i == 7) {
				return false;
			}

			return true;
		});
	}

	message() {
		// no more messages after the game's over! That wouldn't be sensical
		if (this.settings.game.won || this.settings.game.lost) {
			return;
		}

		let messages = [...arguments];
		messages.reverse();
		this.messages = messages.concat(this.messages);

		this.renderMessages();
	}

	replaceMessage(replacement) {
		this.messages[0] = replacement;
		this.renderMessages();
	}
}