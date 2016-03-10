import Tile from "./tile";
import Color from "~/renderer/color";

export default class LeverTile extends Tile {
	constructor(point, map) {
		super(point, map);

		this._character = "/";
		this._color = new Color("red");
		this._backgroundColor = new Color("black");

		this.opaque = true;
		this.walkable = true;

		this.leverThrown = false;

		this.map.update(this);
	}

	throwLever() {
		this.leverThrown = true;

		if (game.player.visible(tile => tile === this).length) {
			game.log.message("You throw the lever, and a booming crash echoes out.");
		} else {
			game.log.message("You hear a booming crash echoing through the caverns.");
		}

		// check if other levers were thrown
	}

	unthrowLever() {
		this.leverThrown = false;
	}
}