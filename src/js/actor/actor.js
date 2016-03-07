import Color from "~/renderer/color";

export default class Actor {
	constructor(map, position = map.randomTile()) {
		this.map = map;

		this._position = position;
		this._character = "@";
		this._color = new Color("white");
		
		this.pastActions = [];

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

	do(action) {
		this.pastActions.push(action.apply(this));
	}

	render() {
		this.tile.render();
	}
}