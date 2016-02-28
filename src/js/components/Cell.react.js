import React, {Component} from "react";

export default class Cell extends Component {
	shouldComponentUpdate() {
		return this.props.cell.dirty;
	}

	render() {
		let cell = this.props.cell.render(),
			{width, height, padding, defaultColor} = this.props;

		if (width * cell.x + (padding * 2.6) > window.innerWidth ||
			height * cell.y + (padding * 2.6) > window.innerHeight) {
			return null;
		}

		return (
			<div 
				style={{
					position: "fixed",
					top: cell.y * height + padding,
					left: cell.x * width + padding,
					width: width,
					height: height,
					color: cell.color || defaultColor,
					fontFamily: "VideoTerminalScreen",
					fontSize: 26,
					WebkitUserSelect: "none"
				}} >

				{cell.character}
			</div>
		);
	}
}

Cell.defaultProps = {
	defaultColor: "white",
	width: 16,
	height: 22,
	padding: 12
};