import {throttle} from "lodash";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

import buffer from "./buffer";
import View from "./view";

export default class Display {
	constructor(settings = {}) {
		this.settings = Object.freeze(Object.assign({
			width: 50,
			height: 50,
			padding: 12,
			cellWidth: 16,
			cellHeight: 22,
			fontSize: 24
		}, settings));

		buffer.settings = Object.assign(buffer.settings, settings);
		buffer.init();

		this.nodes = {};
		this.views = {};

		let {width, height, cellWidth, cellHeight, padding} = this.settings,
			frag = document.createDocumentFragment();

		// create elements to render to
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
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
				node.style.left = x * cellWidth + padding + "px";
				node.style.top = y * cellHeight + padding + "px";
				
				this.nodes[x + "," + y] = frag.appendChild(node);
			}
		}

		// append them to the body
		document.body.appendChild(frag);

		this.resize();
		this.render();

		// bind render event listeners
		buffer.on("render", this.render.bind(this));
		window.addEventListener("resize", throttle(() => {
			this.resize();
			
			for (let viewName in this.views) {
				this.views[viewName]._makeDirty();
			}

			this.render();
		}, 500));
	}

	addView(name, view) {
		this.views[name] = view;
	}

	clear() {
		this.views = {};
	}

	render() {
		for (let viewName in this.views) {
			let view = this.views[viewName];

			if (!view._dirty.length) {
				continue;
			}

			view._dirty.forEach(cell => {
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

			view._dirty = [];
		};
	}

	resize() {
		let {width, height, cellWidth, cellHeight, padding} = this.settings;

		this.size = {
			width: Math.min(width, Math.floor(Math.min(width * cellWidth + padding * 2, window.innerWidth - padding * 3) / cellWidth)),
			height: Math.min(height, Math.floor(Math.min(height * cellHeight + padding * 2, window.innerHeight - padding * 3) / cellHeight))
		};
	}
}