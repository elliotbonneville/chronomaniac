import PerlinGenerator from "proc-noise";
import Rect from "~/utils/rect";
import WallTile from "~/tiles/wall.tile";

export default function (map, mt) {
	let mapRect = new Rect(0, 0, map.options.width, map.options.height),
		Perlin = new PerlinGenerator(mt());

	mapRect.forEach(p => {
		let tile = map.tile(p);

		if (tile instanceof WallTile) {
			return;
		}

		map.tile(p).elevation = Math.round(Perlin.noise(p.x / 4, p.y / 4) * 10);
	});
}