import React from "react";
import ReactDOM from "react-dom";

import Display from "~/renderer/display";

function create(container) {
	window.display = new Display(container);
};

module.exports = {
	create: create
};