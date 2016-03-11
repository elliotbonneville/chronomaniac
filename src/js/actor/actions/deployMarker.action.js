import Action from "./action";
import Point from "~/utils/point";

export default class DeployMarkerAction extends Action {
	constructor(data) {
		super(data);

	}

	_apply(actor) {
		game.infoPanel.addMarker(this.data);
		game.infoPanel.draw();
		return true;
	}
}