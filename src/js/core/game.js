import Display from "~/renderer/display";
import View from "~/renderer/view";
import TileMap from "~/map/map";
import Color from "~/renderer/color";

import Rect from "~/utils/rect";
import Point from "~/utils/point";

import {Light} from "~/map/light";
import Player from "~/actor/player.actor";
import TimeTravelAction from "~/actor/actions/timeTravel.action";

import LogUI from "~/ui/log.ui";
import InfoPanelUI from "~/ui/infoPanel.ui";
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
			width: 35,
			height: 25
		});

		this.infoPanel = new InfoPanelUI({
			width: 15,
			height: 25
		});

		// dev
		this.map.lit = true;

		// create a new view for the map
		this.display.addView("mapBox", new View(new Rect(0, 0, 35, 25), this.outerBox));
		this.display.addView("map", new View(new Rect(1, 1, 34, 24), this.map));
		this.display.addView("log", new View(new Rect(0, 25, 50, 35), this.log));
		this.display.addView("infoPanel", new View(new Rect(35, 0, 50, 25), this.infoPanel));

		this.outerBox.drawBox(new Rect(0, 0, 34, 24));
		this.map.generate();
		this.log.draw();
		this.infoPanel.draw();

		// create a new list of actors for the map
		this.actors = [];

		// create the player on a random tile
		let tile = this.map.randomTile(undefined, undefined, 15, 15);

		this.player = new Player(this.map, tile);

		// and render the new stuff
		this.display.render();
	}

	lose() {
		console.log("Your character died. You lost the game.");
	}

	tick() {
		this.currentTick++;
		this.map.tick(this.currentTick + this.startTime);
		this.map.light.update();
		this.actors.forEach(actor => actor.takeTurn());

		this.input.waiting = false;
	}

	// do what's necessary to make time travel happen
	timeTravel(temporalDistance) {
		if (this.currentTick + temporalDistance < 0 || Math.abs(temporalDistance) > 50) {
			game.log.message("Your watch won't go that far.");
			return;
		}

		// store the current tick so we can compare whatever the future tick ends up
		// being against it in order to determine if we've traveled into the past or into
		// the future
		let lastTick = this.currentTick;

		// set the current tick of the entire game to the tick defined by the last tick
		// plus the distance traveled, whether that be forward or backward
		this.currentTick += temporalDistance;

		// generate all lava from beginning of time up until this tick
		this.map.generateLava(this.startTime, this.currentTick + this.startTime);
		
		// if the current tick is now less than the last tick, the player has traveled 
		// back in time
		if (this.currentTick < lastTick) {
			// ...so we need to clone them in order to keep all their actions in the 
			// timeline, and by leaving the player alone allow them to create a new
			// span of time in which to act
			let clone = this.player.clone();
			clone.color = new Color("lightgrey");
			this.actors.push(clone);
		}

		// play all actors from beginning of time up until this tick
		this.actors.forEach(actor => actor.timeline.replayUntil(this.currentTick));
		this.player.tile.actor = this.player;

		// set the current tick of the actor to match the tick of the rest of the game,
		// but don't replay any events, as we want to overwrite them all, of course
		

		// add a TimeTravel action to current player's timeline (which is really a null
		// action, as clones won't actually time travel, they'll just be removed)
		this.player.do(new TimeTravelAction({
			destination: this.currentTick,
			distance: temporalDistance
		}));
	}

	win() {
		console.log("You win the game!");
	}
}