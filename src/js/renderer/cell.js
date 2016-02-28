export default class Cell {
	constructor(
			buffer,
			position,
			character = ".",
			color = "white",
			backgroundColor = "black"
		) {

		this.position = position;
		this._backgroundColor = backgroundColor;
		this._character = character;
		this._color = color;
	}

	get backgroundColor() {
		return this._backgroundColor;
	}

	set backgroundColor(backgroundColor) {
		this._backgroundColor = backgroundColor;
		this._view._dirty.push(this);
	}

	get character() {
		return this._character;
	}

	set character(character) {
		if (character.length > 1) {
			throw new TypeError("Cell can only contain one character.");
		}

		this._character = character;
		this._view._dirty.push(this);
	}

	get color() {
		return this._color;
	}

	set color(color) {
		this._color = color;
		this._view._dirty.push(this);
	}
}