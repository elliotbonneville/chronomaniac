import Tile from "./tile";
import Color from "~/renderer/color";

export default class LeverTile extends Tile {
	constructor(point, map) {
		super(point, map);

		this._character = "\\";
		this._color = new Color("red");
		this._backgroundColor = new Color("black");

		this.opaque = false;
		this.walkable = true;

		this.lever = true;
		this.leverThrown = false;
		this.thrownTime = null;
		this.thrower = null;

		this.map.update(this);
	}

	throwLever(actor, silently) {
		if (this.leverThrown) {
			if (!silently && game.player.visible(tile => tile === this).length) {
				game.log.message("You take a good, long look at the thrown lever.");
			}
		} else {
			if (!silently && game.player.visible(tile => tile === this).length) {
				game.log.message("You throw the lever. There is a rumble.");
			} else if (!silently) {
				game.log.message("You hear a booming rumble echoing about.");
			}
			
			this.leverThrown = true;
			this.thrownTime = this.thrownTime === null ?
				game.currentTick :
				this.thrownTime;
			this.thrower = actor || this.thrower;

			this._character = "/";
			this.render();
		}

		// check if other levers were thrown
		let recentlyThrownLevers = this.map.levers.filter(lever => {
			if (!lever.leverThrown || lever === this) {
				return false;
			}
			
			return Math.abs(lever.thrownTime - this.thrownTime) < 3;
		});

		if (recentlyThrownLevers.length === 3) {
			game.win();
		}
	}

	unthrowLever() {
		this.leverThrown = false;
		this._character = "\\";

		this.render();
	}
}