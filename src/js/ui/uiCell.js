import Color from "~/renderer/color";

export default class UICell {
	constructor(ui, position) {
		this.ui = ui;
		
		this._character = "",
		this._color = new Color("white"),
		this._backgroundColor = new Color("black"),
		
		this.position = position;
	}

	set character(character) {
		this._character = character;
		this.ui.emit("update", this);
	}

	get character() {
		return this._character;
	}

	set color(color) {
		this._color = color;
		this.ui.emit("update", this);
	}

	get color() {
		return this._color;
	}

	set backgroundColor(backgroundColor) {
		this._backgroundColor = backgroundColor;
		this.ui.emit("update", this);
	}

	get backgroundColor() {
		return this._backgroundColor;
	}
}