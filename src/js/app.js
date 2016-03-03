import React from "react";
import ReactDOM from "react-dom";

import Display from "~/renderer/display";
import Map from "~/core/map";

function create(container) {
	window.map = new Map();
	window.display = new Display({map});
};

module.exports = {
	create: create
};