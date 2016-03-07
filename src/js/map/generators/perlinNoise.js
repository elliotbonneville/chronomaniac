import PerlinGenerator from "proc-noise";
import Rect from "~/utils/rect";
import WallTile from "~/tiles/wall.tile";

export default function (map) {
	let mapRect = new Rect(0, 0, map.options.width, map.options.height),
		Perlin = new PerlinGenerator();

	mapRect.forEach(p => {
		let tile = map.tile(p);

		if (tile instanceof WallTile) {
			return;
		}

		map.tile(p).noise = Math.round(Perlin.noise(p.x / 5, p.y / 5) * 15);
	});
}