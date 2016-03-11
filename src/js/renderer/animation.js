export default class Animation {
	constructor(position) {
		this.position = position;
	}

	render() {
		console.log("Animation not implemented.");
	}

	tick() {
		this.frame++;
		this.render();
	}
}