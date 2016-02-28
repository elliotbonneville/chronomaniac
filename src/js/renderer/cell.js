export default class Cell {
	constructor(x, y, character = ".", color = "white") {
		this.dirty = true;
		this._x = x;
		this._y = y;
		this._character = character;
		this._color = color;
	}

	render() {
		this.dirty = false;
		return {
			x: this._x,
			y: this._y,
			character: this.character,
			color: this.color
		};
	}

	get character() {
		return this._character;
	}

	set character(character) {
		if (!character) {
			return;
		}

		if (character.length > 1) {
			throw new TypeError("Cell can only contain one character.");
		}

		this._character = character;
		this.dirty = true;
	}

	get color() {
		return this._color;
	}

	set color(color) {
		this._color = color;
		this.dirty = true;
	}
}