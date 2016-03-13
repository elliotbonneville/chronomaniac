import Action from "./action";
import Point from "~/utils/point";

import Animation from "~/renderer/animation";

export default class TimeTravelAction extends Action {
	constructor(data) {
		super(data);
	}

	_apply(actor) {
		actor.timeline.tick = this.data.destination;

		if (actor === game.player) {
			game.log.message(`You turn your watch ${Math.abs(this.data.distance)} ` +
				`turns ${this.data.distance > 0 ? "forward" : "back"}.`);
		}
		
		(new Animation(game.map, actor.position)).render();

		return true;
	}
}