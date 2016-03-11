import Point from "~/utils/point";
import WallTile from "~/tiles/wall.tile";

export default function (map, BorderTile = WallTile) {
	console.log(map.options);

	for (let x = 0, y = 0; x < map.options.width; x++) {
		map.tile(x, y).replace(new BorderTile(new Point(x, y), map));
	}

	for (let x = 0, y = map.options.height - 1; x < map.options.width; x++) {
		map.tile(x, y).replace(new BorderTile(new Point(x, y), map));
	}


	for (let x = 0, y = 0; y < map.options.height; y++) {
		map.tile(x, y).replace(new BorderTile(new Point(x, y), map));
	}

	for (let x = map.options.width - 1, y =0; y < map.options.height; y++) {
		map.tile(x, y).replace(new BorderTile(new Point(x, y), map));
	}
}