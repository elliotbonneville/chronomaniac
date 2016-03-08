import Color from "~/renderer/color";
import Timeline from "~/actor/timeline";

export default class Actor {
	constructor(
		map,
		position = map.randomTile(),
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

	get color() {
		return this._color;
	}

	get tile() {
		return this.map.tile(this.position);
	}

	clone() {
		return new this.constructor(this.position, this.timeline.clone());
	}

	do(action, save) {
		console.log(action);
		let result = action.apply(this);

		if (save !== false && result.occurred && !this.timeline.inPast) {
			this.timeline.advance(this.save(action));
		}

		return result;
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

	// returns a new event representing the action
	save(action) {
		return {
			action,
			actorsVisible: this.visible(t => t.actor !== null && t.actor !== this),
			position: this.position.clone()
		};
	}
}