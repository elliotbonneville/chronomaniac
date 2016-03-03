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

	get color() {
		return this._actor ? this._actor.color : this._color;
	}

	get backgroundColor() {
		return this._actor ? this._actor.backgroundColor : this._backgroundColor;
	}

	get actor() {
		return this._actor;
	}

	set actor(actor) {
		this._actor = actor;
		this.map.update(this);
	}
}