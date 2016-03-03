import Point from "~/utils/point";

export default class Tile {
	constructor(map) {
		let x = map.tiles.length - 1,
			y = map.tiles[x].length;

		this.map = map;
		this.position = new Point(x, y);

		this._actor = null;
		
		this._character = "";
		this._color = "white";
		this._backgroundColor = "black";
	}

	get character() {
		return this._actor ? this._actor.character : this._character;
	}

	set character(character) {
		this._character = character;
		this.map.update(this);
	}

	get color() {
		return this._actor ? this._actor.color : this._color;
	}

	set color(color) {
		this._color = color;
		this.map.update(this);
	}

	get backgroundColor() {
		return this._actor ? this._actor.backgroundColor : this._backgroundColor;
	}

	set backgroundColor(backgroundColor) {
		this._backgroundColor = backgroundColor;
		this.map.update(this);
	}

	get actor() {
		return this._actor;
	}

	set actor(actor) {
		this._actor = actor;
		this.map.update(this);
	}

	get neighbors() {
		return [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]]
			.map(delta => this.map.tile(this.position.add(delta))).filter(Boolean);
	}
}