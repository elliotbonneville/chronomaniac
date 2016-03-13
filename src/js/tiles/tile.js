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

		if (this.lighting.length) {
			if (this.particle) {
				return this.particle.character;
			}
			
			if (this.lava > 20) {
				baseChar = "*";
			} else if (this.lava) {
				baseChar = "÷"
			}

			if (this._actor) {
				baseChar = this._actor.character;
			} else if (this.memory) {
				baseChar = "@";
			}
		}

		return baseChar;
	}

	set character(character) {
		this._character = character;
		this.map.update(this);
	}

	get color() {
		let baseColor = this.lava ? new Color("orange") : this._color;

		if (this._actor) {
			baseColor = this._actor.color;
		} else if (this.memory) {
			baseColor = new Color("purple");
			baseColor.a = (10 - this.memory.temporalDistance) / 10;
		}

		if (this.map.lit) {
			return baseColor;
		}

		if (this.lighting.length) {
			if (this.particle) {
				return this.particle.color;
			}

			let col = new Color(baseColor, ...this.lighting.map(light => light.color));
			col.a = this.lighting.reduce((a, source) => {
				return a += source.strength;
			}, 0) / this.lighting.length;

			return col;
		} else if (this.seen) {
			return new Color(255, 255, 255, 0.1);
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
		} else if (this.seen) {
			baseColor.a = 0.3;
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

			// kill any actors if they step on this tile
			if (this.actor) {
				this.actor.die();
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

	get memory() {
		return this.map.memory[this.position.toString()];
	}

	set memory(memory) {
		this.map.memory[this.position.toString()] = memory;
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

		let scaledElevation = (elevation / 10) * 15;

		let bgChannel = scaledElevation * 7,
			fgChannel = scaledElevation * 30;

		this.backgroundColor = new Color(bgChannel, bgChannel, bgChannel);
		this.color = new Color(fgChannel, fgChannel, fgChannel);
	}

	get particle() {
		return this._particle;
	}

	set particle(p) {
		this._particle = p;
		this.render();
	}

	replace(tile) {
		this.map.tiles[this.position.x][this.position.y] = tile;
	}

	render() {
		this.map.update(this);
	}

	updateLava(mt) {
		this.neighbors.sort((a, b) => {
			return (a.lava + a.elevation) - (b.lava + b.elevation);
		}).every(tile => {
			if (this.lava <= 1) {
				return false;
			}

			if (!tile.walkable || tile.lever) {
				return;
			}

			if (this.elevation + this.lava > tile.elevation + tile.lava) {
				tile.lava++;
				this.lava--;
			}
		});

		this.render();
		// this.map.light.calculate(this.lightSource);
	}
}