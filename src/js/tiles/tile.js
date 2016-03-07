import Point from "~/utils/point";
import Color from "~/renderer/color";

export default class Tile {
	constructor(point, map) {
		if (point == null) {
			let x = map.tiles.length - 1,
				y = map.tiles[x].length;

			this.position = new Point(x, y);
		} else {
			this.position = point.clone();
		}

		this.map = map;

		this._actor = null;
		
		this._character = "";
		this._color = new Color("white");
		this._backgroundColor = new Color("black");

		this._noise = 0;

		this.opaque = false;
		this.lighting = [];
	}

	get character() {
		return this._actor ? this._actor.character : this._character;
	}

	set character(character) {
		this._character = character;
		this.map.update(this);
	}

	get color() {
		let baseColor = this._actor ? this._actor.color : this._color;

		if (this.lighting.length) {
			let col = new Color(baseColor, ...this.lighting.map(light => light.color));
			col.a = this.lighting.reduce((a, source) => {
				return a += source.strength;
			}, 0) / this.lighting.length;
			return col;
		} else {
			return new Color(0, 0, 0, 0);
		}
	}

	set color(color) {
		this._color = color;
		this.map.update(this);
	}

	get backgroundColor() {
		let baseColor = this._actor ? 
			this._actor.backgroundColor.clone() : 
			this._backgroundColor.clone();

		if (this.lighting.length) {
			baseColor.a = this.lighting.reduce((a, source) => {
				return a += source.strength;
			}, 0) / this.lighting.length;
			return baseColor;
		}
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

	get noise() {
		return this._noise;
	}

	set noise(noise) {
		this._noise = noise;

		let channel = noise * 7;
		this.backgroundColor = new Color(channel, channel, channel);
	}

	replace(tile) {
		this.map.tiles[this.position.x][this.position.y] = tile;
	}

	update() {
		this.map.update(this)
	}
}