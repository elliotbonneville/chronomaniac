import Color from "~/renderer/color";
import Point from "~/utils/point";

import WallTile from "~/tiles/wall.tile";
import {sample} from "lodash";

export default class Particle {
	constructor(map, animation, position, vector) {
		this.map = map;
		this.animation = animation;
		this.position = position;

		this.characters = [" "];
		this.character = " ";
		this.color = new Color("white");
		this.vector = vector || new Point(sample([-1, 0, 1]), sample([-1, 0, 1]));

		while (this.vector.equals(new Point(0, 0))) {
			this.vector = new Point(sample([-1, 0, 1]), sample([-1, 0, 1]));
		}

		this.dead = false;
	}

	tick() {
		if (this.dead) return;
		let pos = this.position.add(this.vector).ceil();
		
		this.character = sample(this.characters);
		if (this.tile) {
			this.tile.particle = null;
		}

		if (this.position.equals(pos)) {
			this.kill();
		} else {
			this.position = pos;
		}

		if (this.tile && !(this.tile instanceof WallTile)) {
			this.tile.particle = this;
		} else {
			this.kill();
		}

		this.color.a = this.animation.radius - 
			this.position.distance(this.animation.position);
	}

	kill() {
		this.dead = true;

		if (this.tile) {
			this.tile.particle = null;
		}
	}

	get tile() {
		return this.map.tile(this.position);
	}
}