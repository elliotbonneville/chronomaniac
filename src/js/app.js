import Game from "~/core/game";

import Point from "~/utils/point";
import Rect from "~/utils/rect";
import Color from "~/renderer/color";

function create(container) {
	window.game = new Game();
};

module.exports = {
	create: create,
	Point,
	Rect,
	Color
};