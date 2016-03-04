import Tile from "./tile";
import Color from "~/renderer/color";

export default class WallTile extends Tile {
	constructor(map) {
		super(map);

		this._character = "#";
		this._color = new Color("white");
		this._backgroundColor = new Color("black");

		this.map.update(this);
	}	
}