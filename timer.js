/*
How do we determine points:
- The longer one spends on finding a set, the less they get. If they reach a 
	@maxTime, the game gives a random result and moves to the next set of time.
	@maxTime can be set by players from either 30s, 60s, 90s, ..., 300s. Highest
	timer is 300s and lowest is 30s. 
- Points values are given as @maxTime - @secondSpent (seconds spent before finding
	a proper set) * @MULT (Multipliers). Multipliers goes this way:
		- All cards property match expect 1: MULT 1.2
		- All cards property match expect 2: MULT 1.8
		- Only 1 property match: MULT 2.3
		- No property match: 2.9
- Players can also choose to play different difficulty levels. Each level
	basically multiplies all multipliers by a number to make it harder or 
	easier to score more points: 
	{
		noob: x2.2, [allowed TIMES: 15 - 300]
		practitioner: x1.5, [allowed TIMES: 15 - 240]
		experienced: x1.1, [allowed TIMES: 15 - 180]
		insane: x0.7, [allowed TIMES: 15 - 120]
		foolish: x0.4, [allowed TIMES: 15 - 60]
	}
- When in multiplayer, whoever presses the Spacebar first gets 3-5 seconds to select his choice. If he hasn't picked in that time frame, he is excluded to play for the next 10 seconds. 
	- Ideally, if a players keeps not having found a set, his off time increases by 1 seconds every time. 
*/

// document.getElementsByTagName("body")[0].innerHTML = `<div id="test" style="color:white;"></div>`;
function SetsTimer(){
	this.start = Date.now();
	this.reset = function() {
		// resets the time
		this.start = Date.now();
	}
	// halting
	this.halted = false; this.haltTime = 0; this.previousHalt = 0;
	this.halt = function() {
		// set the halted to true, then find the halt time
		this.halted = true;
		this.haltTime = Date.now();
	}
	this.haltEllapsed = function() {
		// returns how many ms ellapsed since last halted if halted, otherwise null
		return this.halted ? Date.now() - this.haltTime : null;
	}
	this.resume = function() {
		this.halted = false;
		this.haltTime = Date.now() - this.haltTime;
		this.previousHalt += this.haltTime;
	}
	// now
	this.now = function() {
		// gives how many milliseconds has elapsed since we started excluding halts
		if (this.halted) {
			// if we're in halt mode, we just have the halttime - prev halts start
			return this.haltTime - this.previousHalt - this.start;
		} else {
			// otherwise we return time now - prev halts - start
			return Date.now() - this.previousHalt - this.start;
		}
	}
	this.format = function() {
		// returns seconds with 1 decimal place elapsed 
		let res = this.now();
		res = (res / 1000);
		return Math.round(res * 10) / 10;
	}
}
/*
j = new Timer();
var c = setInterval(function(){
	document.getElementById("test").innerHTML = j.format();
} , 50);
*/

