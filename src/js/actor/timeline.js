export default class Timeline {
	constructor(actor, events = []) {
		this.currentTick = events.length;
		this.actor = actor;
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
		return new Timeline(this.actor, this.events.map((event) => {
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

	travel(temporalDistance) {
		if (temporalDistance === 0) {
			return;
		}

		if (temporalDistance > 0) {
			console.log(this.events, this.currentTick);
			if (this.currentTick + temporalDistance > this.events.length) {
				console.log("Tried to travel too far into the future.");
				return;
			}

			while (temporalDistance--) {
				console.log(this.events[this.currentTick]);
				this.actor.do(this.events[this.currentTick].action, false);
				this.currentTick++;
			}
		} else {
			if (this.currentTick === 0) {
				return;
			}

			while (temporalDistance++) {
				this.currentTick--;
				console.log(this.currentTick, this.events[this.currentTick].position);
				this.actor.do(this.events[this.currentTick].action.inverse, false);
				console.log(this.currentTick);
			}
		}
	}
}