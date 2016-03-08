export default class Timeline {
	constructor(actor, events = []) {
		this.currentTick = events.length;
		this.actor = actor;
		this.events = events;
	}

	get currentEvent() {
		return this.events[this.currentTick];
	}

	get inPast() {
		return this.currentTick < this.events.length;
	}

	get inFuture() {
		return this.currentTick > this.events.length;
	}

	get inPresent() {
		return !this.inPast && !this.inFuture;
	}

	// timeline can only advance when an event which takes one tick is added
	advance(event) {
		this.events.push(event);
		this.tick();
	}

	clearFuture() {
		this.events.length = this.currentTick + 1;
	}

	clone(target) {
		return new Timeline(null, this.events.map((event) => {
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
			if (this.currentTick + temporalDistance > this.events.length) {
				return;
			}

			while (temporalDistance--) {
				this.actor.do(this.events[this.currentTick].action, false);
				this.currentTick++;
			}
		} else {
			if (this.currentTick === 0) {
				return;
			}

			while (temporalDistance++) {
				this.currentTick--;
				this.actor.do(this.events[this.currentTick].action.inverse, false);
			}
		}
	}
}