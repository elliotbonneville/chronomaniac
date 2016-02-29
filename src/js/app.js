import React from "react";
import ReactDOM from "react-dom";

import Display from "~/renderer/display";

function create(container) {
	window.display = new Display();
};

module.exports = {
	create: create
};