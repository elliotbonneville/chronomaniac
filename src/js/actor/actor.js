import Color from "~/renderer/color";
import Timeline from "~/actor/timeline";

export default class Actor {
	constructor(map, position = map.randomTile()) {
		this.map = map;

		this._position = position;
		this._character = "@";
		this._color = new Color("white");

		this.timeline = new Timeline();

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

	do(action, save) {
		let result = action.apply(this);

		if (save !== false && result.occurred && !this.timeline.inPast) {
			this.timeline.advance(this.save(action));
		} else {
			this.timeline.tick();
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