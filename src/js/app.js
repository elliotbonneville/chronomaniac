import Game from "~/core/game";

import Point from "~/utils/point";
import Rect from "~/utils/rect";

function create(container) {
	window.game = new Game();
};

module.exports = {
	create: create,
	Point,
	Rect
};