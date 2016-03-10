import Rect from "~/utils/rect";
import FloorTile from "~/tiles/floor.tile";
import WallTile from "~/tiles/wall.tile";

import Random from "random-js";

export default function (map, mt) {
	let mapRect = new Rect(0, 0, map.options.width, map.options.height);
	mapRect.forEach(p => {
		map.tile(p).replace(new (Random.real(0, 1)(mt) < 0.45 ? WallTile : FloorTile)(p, map));
	});

	let i = 2;
	while(i--) {
		mapRect.forEach(p => {
			let tile = map.tile(p),
				neighboringWalls = tile.neighbors.filter(tile => tile instanceof WallTile),
				nearbyWalls = tile.neighbors.reduce((prev, tile) => {
					tile.neighbors.forEach(tile => {
						if (tile instanceof WallTile) {
							prev.add(tile);
						}
					});
					return prev;
				}, new Set()),
				tileType = FloorTile;
			
			let neighboringWallsLength = neighboringWalls.length + ({
				3: 5,
				5: 3
			}[tile.neighbors.length] || 0);
			if (tile instanceof WallTile && neighboringWallsLength > 3) {
				tileType = WallTile;
			} else if (tile instanceof FloorTile && neighboringWallsLength > 4) {
				tileType = WallTile;
			} else if (nearbyWalls < 4) {
				tileType = WallTile;
			}

			if (!(tile instanceof tileType)) {
				map.tile(p).replace(new tileType(p, map));
			}
		});
	}
}