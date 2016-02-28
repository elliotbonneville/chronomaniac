import React, {Component} from "react";
import Buffer from "~/renderer/buffer";
import Display from "~/components/Display.react";

export default class App extends Component {
	constructor() {
		super();

		this.buffer = new Buffer();
	}

	render() {
		return (
			<Display buffer={this.buffer} />
		);
	}
};
