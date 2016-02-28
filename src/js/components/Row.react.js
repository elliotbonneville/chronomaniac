import React, {Component} from "react";

import Cell from "~/components/Cell.react";

export default class Row extends Component {
	render() {
		return (
			<div>
				{this.props.row.map((cell, i) => <Cell cell={cell} key={i} /> )}
			</div>
		);
	}
}