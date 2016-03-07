import Tile from "./tile";
import Color from "~/renderer/color";

export default class WallTile extends Tile {
	constructor(point, map) {
		super(point, map);

		this._character = "#";
		this._color = new Color("white");
		this._backgroundColor = new Color("black");

		this.opaque = true;
		this.walkable = false;

		this.map.update(this);
	}
}