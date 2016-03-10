import Action from "./action";
import Point from "~/utils/point";

export default class TimeTravelAction extends Action {
	constructor(data) {
		super(data);
	}

	_apply(actor) {
		actor.timeline.tick = this.data.destination;

		game.log.message(`You travel ${this.data.distance > 0 ? "forward" : "back"} ` + 
			`in time ${Math.abs(this.data.distance)} turns.`);

		return true;
	}
}