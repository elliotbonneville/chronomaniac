import {noop} from "lodash";
import Color from "~/renderer/color";

export default class Cell {
	constructor(
			position,
			character = ".",
			color = new Color("white"),
			backgroundColor = new Color("black")
		) {

		this.position = position;
		this._backgroundColor = backgroundColor;
		this._character = character;
		this._color = color;
	}

	static Null(x, y) {
		return {
			update: noop,
			get x() {
				console.warn("Attempting to access null cell at", this);
				return null;
			},

			get y() {
				console.warn("Attempting to access null cell at", this);
				return null;
			},

			toString: () => x + "," + y
		};
	}

	get backgroundColor() {
		return this._backgroundColor;
	}

	set backgroundColor(backgroundColor) {
		if (this._backgroundColor === backgroundColor) return;

		this._backgroundColor = backgroundColor;
		this._view.update(this);
	}

	get character() {
		return this._character;
	}

	set character(character) {
		if (character.length > 1) {
			throw new TypeError("Cell can only contain one character.");
		}

		if (this._character === character) return;

		this._character = character;
		this._view.update(this);
	}

	get color() {
		return this._color;
	}

	set color(color) {
		if (this._color === color) return;

		this._color = color;
		this._view.update(this);
	}

	_setView(view) {
		this._view = view;
		return this;
	}

	update(tile) {
		if (!tile) {
			return;
		}

		if (tile.character) this._character = tile.character;
		if (tile.color) this._color = tile.color;
		if (tile.backgroundColor) this._backgroundColor = tile.backgroundColor;
		
		this._view.update(this);
	}
}