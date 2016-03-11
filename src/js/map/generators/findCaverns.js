import FloorTile from "~/tiles/floor.tile";
import WallTile from "~/tiles/wall.tile";

export default function (map, rect) {
	let caverns = [],
		checked = {};

	// floodfill to get caverns
	rect.forEach(p => {
		// if this tile has already been checked, or if it's a wall tile, don't bother 
		// checking it or neighbors, because it's already part of a cavern or it won't
		// have any neighbors that need to be checked
		if (checked[p.toString()]) {
			return;
		}

		let cavern = [map.tile(p)];

		checked[p.toString()] = true;
		cavern[0].neighbors.forEach(function checkNeighbors(neighbor) {
			if (!(neighbor instanceof FloorTile) || 
				checked[neighbor.position.toString()]) {
				return;
			}

			// if this neighbor is a floor tile and it's not already been checked, we
			// need to check it and then check all its neighbors as well to make sure
			// that they aren't floor tiles that haven't been checked and need to be
			// added to the cavern array
			cavern.push(neighbor);
			checked[neighbor.position.toString()] = true;
			neighbor.neighbors.forEach(checkNeighbors);
		});

		if (cavern.length > 1) {
			caverns.push(cavern);
		}
	});

	return caverns;
}