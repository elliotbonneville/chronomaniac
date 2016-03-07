import Point from "~/utils/point";

const mult = [
	[1,  0,  0, -1, -1,  0,  0,  1],
	[0,  1, -1,  0,  0, -1,  1,  0],
	[0,  1,  1,  0,  0, -1, -1,  0],
	[1,  0,  0,  1, -1,  0,  0, -1]
];

// uses shadowcasting to calculate lighting at specified position
export class LightRenderer {
	constructor (map) {
		this.map = map;
	}

	calculateOctant(cx, cy, row, start, end, radius, xx, xy, yx, yy, id) {	
		let newStart = 0,
			radiusSquared = radius * radius;	

		if (start < end) return;
		
		for(let i = row; i < radius + 1; i++) {
			let dx = -i - 1,
				dy = -i,
				blocked = false;
			
			while (dx <= 0) {
				dx += 1;
				
				let X = cx + dx * xx + dy * xy,
					Y = cy + dx * yx + dy * yy;
				
				if (X < this.map.options.width && X >= 0 && Y < this.map.options.height && Y >=0) { 
					let lSlope = (dx - 0.5) / (dy + 0.5),
						rSlope = (dx + 0.5) / (dy - 0.5);
					
					if (start < rSlope) {
						continue;
					} else if (end > lSlope) {
						break;
					} else {
						if (dx * dx + dy * dy < radiusSquared) {
							let pos1 = new Point(X, Y),
								pos2 = this.light.position,
								d = (pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y),
								t = this.map.tile(X, Y),
								l = Math.max(.2, 1 - (d / (this.light.radius * this.light.radius)));
							
								// add the light interaction to the tile
								t.lighting.push(new LightInteraction(this.light.color, l));
								t.update();
						} 
						
						if (blocked) {
							if (this.map.tile(X, Y).opaque) {
								newStart = rSlope;
								continue;
							} else {
								blocked = false;
								start = newStart;
							}
						} else {
							if (this.map.tile(X, Y).opaque && i < radius) {
								blocked = true;
								this.calculateOctant(cx, cy, i + 1, start, lSlope, this.light.radius, xx, xy, yx, yy, id + 1);
								
								newStart = rSlope;
							}
						}
					}
				}
			}
			
			if (blocked) break;
		}
	};
	
	// calculate light
	calculate(light) {
		let that = this,
			i;
		
		// update the internal reference used for calculation
		this.light = light;

		// update the tile the light is on because it won't be calculated
		this.map.tile(this.light.position).lighting = 
			[new LightInteraction(light.color, light.radius)];

		this.map.tile(this.light.position).update();

		// calculate each octant
		for(i = 0; i < 8; i++) {
			this.calculateOctant(this.light.position.x, this.light.position.y, 1, 1.0, 0.0, this.light.radius, 
				mult[0][i], mult[1][i], mult[2][i], mult[3][i], 0);
		}
	}
}

export class LightInteraction {
	constructor(color, strength) {
		this.color = color;
		this.strength = strength;
	}
}

export class Light {
	constructor(position, radius, color) {
		this.position = position;
		this.radius = radius;
		this.color = color;
	}
}