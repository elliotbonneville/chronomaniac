import Game from "~/core/game";

function create(container) {
	window.game = new Game();
};

module.exports = {
	create: create
};