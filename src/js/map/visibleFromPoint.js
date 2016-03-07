import Point from "~/utils/point";

const mult = [
	[1,  0,  0, -1, -1,  0,  0,  1],
	[0,  1, -1,  0,  0, -1,  1,  0],
	[0,  1,  1,  0,  0, -1, -1,  0],
	[1,  0,  0,  1, -1,  0,  0, -1]
];

function calculateOctant(map, callback, cx, cy, radius, row, start, end, xx, xy, yx, yy, id) {	
	let newStart = 0,
		radiusSquared = radius * radius;	

	if (start < end) return;
	
	for (let i = row; i < radius + 1; i++) {
		let dx = -i - 1,
			dy = -i,
			blocked = false;
		
		while (dx <= 0) {
			dx += 1;
			
			let X = cx + dx * xx + dy * xy,
				Y = cy + dx * yx + dy * yy;
			
			if (X < map.options.width && X >= 0 && Y < map.options.height && Y >=0) { 
				let lSlope = (dx - 0.5) / (dy + 0.5),
					rSlope = (dx + 0.5) / (dy - 0.5);
				
				if (start < rSlope) {
					continue;
				} else if (end > lSlope) {
					break;
				} else {
					if (dx * dx + dy * dy < radiusSquared) {
						callback(new Point(X, Y));
					} 
					
					if (blocked) {
						if (map.tile(X, Y).opaque) {
							newStart = rSlope;
							continue;
						} else {
							blocked = false;
							start = newStart;
						}
					} else {
						if (map.tile(X, Y).opaque && i < radius) {
							blocked = true;
							calculateOctant(cx, cy, i + 1, start, lSlope, radius, xx, xy, yx, yy, id + 1);
							
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
export default function visibleFromPoint(map, point, radius, callback) {
	callback(point);

	// calculate each octant
	for (let i = 0; i < 8; i++) {
		calculateOctant(map, callback, point.x, point.y, radius, 1, 1.0, 0.0, 
			mult[0][i], mult[1][i], mult[2][i], mult[3][i], 0);
	}
}