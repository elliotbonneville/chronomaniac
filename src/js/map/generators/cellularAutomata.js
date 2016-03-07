import Rect from "~/utils/rect";
import FloorTile from "~/tiles/floor.tile";
import WallTile from "~/tiles/wall.tile";

export default function (map) {
	new Rect(0, 0, map.options.width, map.options.height).forEach(p => {
		map.tiles[p.x][p.y] = new (Math.random() > .39 ? FloorTile : WallTile)(map);
	});
}