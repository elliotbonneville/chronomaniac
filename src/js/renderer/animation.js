import Particle from "./particle";
import TimeVortexParticle from "~/renderer/timeVortex.particle";

import {sample, noop} from "lodash";

export default class Animation {
	constructor(
		map,
		position, 
		particleCount = 18, 
		radius = 2.5,
		particleTypes = [TimeVortexParticle]
	) {
		this.map = map;
		this.position = position;
		this.particleCount = particleCount;
		this.radius = radius;
		this.particleTypes = particleTypes;

		this.particles = new Array(particleCount).fill(null);
		this.particles.forEach((particleSlot, i) => {
			this.particles[i] = new (sample(this.particleTypes))(map, this, position);
		});
	}

	tick() {
		this.particles.forEach((particle) => {
			particle.tick();

			if (particle.position.distance(this.position) > this.radius) {
				particle.kill();
			}
		});
	}

	render(callback = noop) {
		this.interval = setInterval(() => {
			this.tick();
			game.render();

			if (!this.particles.filter(particle => !particle.dead).length) {
				clearInterval(this.interval);
				callback();
			}
		}, 200);
	}
}