import React from "react";
import ReactDOM from "react-dom";

import Display from "~/renderer/display";
import Map from "~/core/map";
import Rect from "~/utils/rect";

function create(container) {
	window.map = new Map();
	window.display = new Display({map});
	window.Rect = Rect;
};

module.exports = {
	create: create
};