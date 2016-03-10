import Color from "~/renderer/color";
import Timeline from "~/actor/timeline";

export default class Actor {
	constructor(
		map,
		position,
		timeline = new Timeline(this)
	) {
		this.map = map;

		this._position = position;
		this._character = "@";
		this._color = new Color("white");

		this.timeline = timeline;

		this.visionRadius = 5;

		this.tile.actor = this;
	}

	get position() {
		return this._position;
	}

	set position(pos) {
		this.tile.actor = null;
		this._position = pos;
		this.tile.actor = this;
	}

	get character() {
		return this._character;
	}

	set character(character) {
		this._character = character;
		this.tile.render();
	}

	get color() {
		return this._color;
	}

	set color(color) {
		this._color = color;
		this.tile.render();
	}

	get tile() {
		return this.map.tile(this.position);
	}

	clone(temporalDistance = 0) {
		if (temporalDistance + game.currentTick === this.timeline.currentTick) {
			throw new Error("Cannot clone actor to same position and time!");
		}

		let clone = new this.constructor(this.map, this.position.clone(), null);

		clone.timeline = this.timeline.clone();
		clone.timeline.actor = clone;

		this.tile.actor = this;
		
		return clone;
	}

	die() {
		this.character = "%";
		this.dead = true;

		if (this.type === "player") {
			game.lose();
		}
	}

	do(action, save) {
		if (this.dead) {
			return;
		}

		let pastState = this.save(),
			event = action.apply(this);

		if (save !== false && event.occurred) {
			this.timeline.advance({
				before: pastState,
				after: this.save()
			});
		}

		return event;
	}

	// remove this actor from the world (i.e. they time traveled)
	remove() {
		if (this.tile.actor === this) {
			this.tile.actor = null;
		}
	}

	// break in case of emergency paradox
	erase() {
		this.tile.actor = null;
		game.actors.splice(game.actors.indexOf(this), 1);
	}

	visible(filter = () => true) {
		let tiles = [];

		this.map.visibleFromPoint(this.position, this.visionRadius, p => {
			let tile = this.map.tile(p);

			if (filter(tile)) {
				tiles.push(tile);
			}
		});

		return tiles;
	}

	render() {
		this.tile.render();
	}

	// returns a new event representing the action the actor just took
	save() {
		return {
			actorsVisible: this.visible(t => t.actor !== null && t.actor !== this),
			position: this.position.clone()
		};
	}
}