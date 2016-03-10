import Display from "~/renderer/display";
import View from "~/renderer/view";
import TileMap from "~/map/map";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

import {Light} from "~/map/light";
import Player from "~/actor/player.actor";

import LogUI from "~/ui/log.ui";
import UI from "~/ui/ui";

import input from "~/core/input";

export default class Game {
	constructor() {
		this.settings = Object.freeze({
			width: 80,
			height: 36
		});

		// create a new display as well, the first time the page is loaded
		this.display = new Display(this.settings);
		this.begin();

		// bind keyboard handlers
		this.input = input.init(this);

		// initialize tick count
		this.currentTick = 0;
		this.timeFrontier = 0;
	}

	begin() {
		this.startTime = Date.now();

		// clear the display if there was anything on it before
		this.display.clear();

		// create a new map
		this.map = new TileMap(this.settings, this.startTime);
		// this.watch = new WatchUI({
		// 	width: 11,
		// 	height: 13
		// });
		this.log = new LogUI({
			width: 50,
			height: 10
		});

		this.outerBox = new UI({
			width: 50,
			height: 25
		});

		

		// dev
		this.map.lit = true;

		// create a new view for the map
		this.display.addView("mapBox", new View(new Rect(0, 0, 50, 25), this.outerBox));
		this.display.addView("map", new View(new Rect(1, 1, 49, 24), this.map));
		this.display.addView("log", new View(new Rect(0, 25, 50, 35), this.log));

		this.outerBox.drawBox(new Rect(0, 0, 49, 24));
		this.map.generate();
		this.log.draw();
		// this.watch.draw();

		// create a new list of actors for the map
		this.actors = [];

		// make da player
		let tile = this.map.randomTile(undefined, undefined, 15, 15);

		this.player = new Player(this.map, tile);
		// this.actors.push(this.player);

		// center camera on player
		// this.display.views.map.origin = tile.subtract(15, 15);

		// and render the new stuff
		this.display.render();
	}

	lose() {
		console.log("Your character died. You lost the game.");
	}

	tick() {
		if (this.currentTick == this.timeFrontier) {
			this.timeFrontier++;
		}

		this.currentTick++;

		// update the map!
		this.map.tick(this.currentTick + this.startTime);

		// calculates light from lights on the map
		this.map.light.update();

		// update lava flows

		// make any mobs move
		this.actors.forEach(actor => actor.takeTurn());

		// save game state

		this.input.waiting = false;
	}

	// do what's necessary to make time travel happen
	timeTravel(temporalDistance) {
		if (this.currentTick + temporalDistance < 0) {
			console.log("Can't travel back that far!");
			return;
		}

		this.currentTick += temporalDistance;

		// generate all lava from beginning
		this.map.generateLava(this.startTime, this.currentTick + this.startTime);

		
		this.actors.forEach(actor => actor.timeline.travel(temporalDistance));

		// clone current player and don't add them to the list of actors
		if (this.currentTick < this.timeFrontier) {
			let clone = this.player.clone(temporalDistance);
			clone.color = new Color("lightgrey");
			clone.spawnTime = this.currentTick;
			this.actors.push(clone);
		}

		// add a TimeTravel action to current player's timeline

	}

	win() {
		console.log("You win the game!");
	}
}