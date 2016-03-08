export default class Timeline {
	constructor(events = []) {
		this.currentTick = events.length;
		this.events = events;
	}

	get inPast() {
		return this.currentTick < this.timeFrontier;
	}

	get inFuture() {
		return this.currentTick > this.timeFrontier;
	}

	get inPresent() {
		return !this.inPast && !this.inFuture;
	}

	// timeline can only advance when an event which takes one tick is added
	advance(event) {
		this.events.push(event);
		this.tick();
	}

	clone() {
		return new Timeline(this.events.map((event) => {
			return {
				action: event.action.clone(),
				actorsVisible: [...event.actorsVisible],
				position: event.position.clone()
			};
		}));
	}

	tick() {
		this.currentTick++;
	}
}