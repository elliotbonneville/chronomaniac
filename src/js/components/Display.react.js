import React, {Component} from "react";

import Row from "~/components/Row.react";

export default class Display extends Component {
	componentDidMount() {
		this.props.buffer.on("render", () => {
			this.forceUpdate();
		});
	}

	render() {
		return (
			<div>
				{this.props.buffer.cells.map((row, i) => <Row row={row} key={i} />)}
			</div>
		);
	}
}