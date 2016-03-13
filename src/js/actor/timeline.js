export default class Timeline {
	constructor(actor, events = [], tick = 0) {
		this.tick = tick;
		this.actor = actor;
		this.events = events;
	}

	get currentEvent() {
		return this.events[this.tick];
	}

	get inPast() {
		return this.tick < this.events.length - 1;
	}

	get inFuture() {
		return this.tick > this.events.length;
	}

	get inPresent() {
		return !this.inPast && !this.inFuture;
	}

	// timeline can only advance when an event which takes one tick is added
	advance(event) {
		this.events[this.tick] = event;
		this.tick++;
	}

	clone() {
		return new Timeline(null, this.events.map((event) => {
			return {
				action: event.action.clone(),
				before: {
					actorsVisible: [...event.before.actorsVisible],
					position: event.before.position.clone()
				},
				after: {
					actorsVisible: [...event.after.actorsVisible],
					position: event.after.position.clone()
				}
			};
		}, this.tick));
	}

	getFuturePositions(distance) {
		return this.events.slice(this.tick + 1, this.tick + distance + 2).map((event, i) => {
			return {
				position: event.after.position,
				temporalDistance: i + 1
			};
		});
	}

	replayUntil(targetTick) {
		this.tick = targetTick;

		if (this.currentEvent) {
			this.actor.position = this.currentEvent.after.position;
		} else {
			this.actor.remove();
		}
	}

	travel(temporalDistance) {
		this.tick += temporalDistance;

		if (this.currentEvent) {
			this.actor.position = this.currentEvent.before.position;
			this.actor.do(this.currentEvent.action, false);
		} else {
			this.actor.remove();
		}
	}

	clearFuture() {
		this.events.length = this.tick + 1;
	}
}