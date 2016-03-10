import Point from "~/utils/point";
import Color from "~/renderer/color";

import Random from "random-js";
import {Light} from "~/map/light";

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

		this._elevation = 0;
		this._lava = 0;

		this.opaque = false;
		this.walkable = true;
	}

	get character() {
		let baseChar = this._character;

		if (this.lava) {
			baseChar = "÷";
		}

		return this._actor ? this._actor.character : baseChar;
	}

	set character(character) {
		this._character = character;
		this.map.update(this);
	}

	get color() {
		let baseColor = this.lava ? new Color("orange") : this._color;

		if (this._actor) {
			baseColor = this._actor.color;
		}

		if (this.map.lit) {
			return baseColor;
		}

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
		let baseColor = this._backgroundColor.clone();

		if (this.lighting.length) {
			baseColor.a = this.lighting.reduce((a, source) => {
				return a += source.strength;
			}, 0) / this.lighting.length;
			return baseColor;
		} else if (this.map.lit) {
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

	get lava() {
		return this._lava;
	}

	set lava(lava) {
		this._lava = lava;

		if (this._lava >= 1) {
			if (this.map.lavaTiles.indexOf(this) < 0) {
				this.map.lavaTiles.push(this);
			}

			// this.lightSource = new Light(this.position.clone(), 2, new Color("orange"));
		} else {
			let i = this.map.lavaTiles.indexOf(this);
			if (i > -1) {
				this.map.lavaTiles.splice(i, 1);
			}
		}
	}

	get lighting() {
		let pos = this.position.toString(),
			lighting = this.map.lighting[pos];

		if (!lighting) {
			this.map.lighting[pos] = [];
		}

		return this.map.lighting[pos];
	}

	set lighting(lighting) {
		this.map.lighting[this.position.toString()] = lighting;
	}

	get neighbors() {
		return [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]]
			.map(delta => this.map.tile(this.position.add(delta))).filter(Boolean);
	}

	get elevation() {
		return this._elevation;
	}

	set elevation(elevation) {
		this._elevation = elevation;

		let bgChannel = elevation * 7,
			fgChannel = elevation * 30;

		this.backgroundColor = new Color(bgChannel, bgChannel, bgChannel);
		this.color = new Color(fgChannel, fgChannel, fgChannel);
	}

	replace(tile) {
		this.map.tiles[this.position.x][this.position.y] = tile;
	}

	render() {
		this.map.update(this);
	}

	updateLava(mt) {
		if (this.lavaSource) {
			this.lava++;
		}

		this.neighbors.sort((a, b) => {
			return (a.lava + a.elevation) - (b.lava + b.elevation);
		}).every(tile => {
			if (this.lava <= 1) {
				return false;
			}

			if (!tile.walkable) {
				return;
			}

			if (this.elevation + this.lava * 0.04 / 2 > 
				tile.elevation + tile.lava * .04 / 2) {

				tile.lava++;
				this.lava--;
			}
		});

		// this.map.light.calculate(this.lightSource);
	}
}