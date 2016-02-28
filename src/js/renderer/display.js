import {throttle} from "lodash";
import buffer from "./buffer";
import Rect from "~/utils/rect";

export default class Display {
	constructor(element, settings = {}) {
		if (!element) {
			throw new TypeError("No element passed to Display.");
		}

		this.settings = Object.freeze(Object.assign({
			width: 50,
			height: 50,
			padding: 12,
			cellWidth: 16,
			cellHeight: 22,
			fontSize: 24
		}, settings));

		this.nodes = {};

		let {width, height, cellWidth, cellHeight, padding} = this.settings,
			frag = document.createDocumentFragment();

		new Rect(0, 0, width, height).forEach(cell => {
			let node = document.createElement("div");

			node.style.height = cellHeight + "px";
			node.style.width = cellWidth + "px";
			node.style.textAlign = "center";
			node.style.lineHeight = (cellHeight + 7) + "px";
			node.style.fontFamily = "VideoTerminalScreen";
			node.style.fontSize = this.settings.fontSize + "px";
			node.style.display = "none";
			node.style.userSelect = "none";
			node.style.webkitUserSelect = "none";
			node.style.MozUserSelect = "none";
			
			node.style.position = "fixed";
			node.style.left = cell.position.x * cellWidth + padding + "px";
			node.style.top = cell.position.y * cellHeight + padding + "px";
			
			this.nodes[cell.position] = frag.appendChild(node);
		});

		document.body.appendChild(frag);

		this.resize();
		this.render();

		// bind render event listeners
		buffer.on("render", this.render.bind(this));
		window.addEventListener("resize", throttle(() => {
			this.resize();
			buffer.rect(0, 0, this.settings.width, this.settings.height).forEach(cell => buffer.dirty.push(cell));
			this.render();
		}, 500));
	}

	render() {
		buffer.dirty.forEach(cell => {
			let node = this.nodes[cell.position];

			if (cell.position.x > this.size.width || cell.position.y > this.size.height) {
				node.style.display = "none";
				return;
			} else if (node.style.display === "none") {
				node.style.display = "inherit";
			}

			node.innerHTML = cell.character;
			node.style.backgroundColor = cell.backgroundColor;
			node.style.color = cell.color;
		});

		buffer.dirty = [];
	}

	resize() {
		let {width, height, cellWidth, cellHeight, padding} = this.settings;

		this.size = {
			width: Math.min(width, Math.floor(Math.min(width * cellWidth + padding * 2, window.innerWidth - padding * 3) / cellWidth)),
			height: Math.min(height, Math.floor(Math.min(height * cellHeight + padding * 2, window.innerHeight - padding * 3) / cellHeight))
		};
	}
}