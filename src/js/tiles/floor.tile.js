import Tile from "./tile";

export default class FloorTile extends Tile {
	constructor(map) {
		super(map);

		this._character = ".";
		this._color = "white";
		this._backgroundColor = "black";
	}	
}