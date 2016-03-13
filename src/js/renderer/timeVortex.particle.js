import Point from "~/utils/point";
import Particle from "~/renderer/particle";
import Color from "~/renderer/color";

import {sample} from "lodash";

export default class TimeVortexParticle extends Particle {
	constructor(map, position, vector) {
		super(map, position, vector);

		this.characters = [",", "*", ":", "'"];
		this.character = sample(this.characters);
		this.color = new Color("skyblue");
	}
}