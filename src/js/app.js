import React from "react";
import ReactDOM from "react-dom";
import App from "~/components/App.react";

function create(container) {
	ReactDOM.render(<App />, container);
};

module.exports = {
	create: create
};