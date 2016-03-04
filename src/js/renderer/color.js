export default class Color {
	constructor(r, g, b, a) {
		let args = [...arguments];

		if (arguments.length === 1) {
			if (args[0] instanceof Color) {
				return args[0].clone()
			} else if (args[0] instanceof Array && args[0].every(arg => !isNaN(arg))) {
				r = args[0][0];
				g = args[0][1];
				b = args[0][2];
				a = args[0][3];
			} else if (typeof args[0] === "string" && args[0][0] === "#") {
				return Color.fromHex(args[0]);
			}
		} else if (args.every(arg => Color.isColor(arg))) {
			return Color.average(...args);
		}

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = typeof a === "undefined" ? 1 : a;
	}

	static average(...colors) {
		return new Color(colors.map(color => new Color(color)).reduce((average, color) => {
			average[0] += color.r;
			average[1] += color.g;
			average[2] += color.b;
			average[3] += color.a;

			return average;
		}, [0, 0, 0, 0]).map(channel => channel / colors.length));
	}

	// http://stackoverflow.com/a/5624139/339852
	static fromHex(hex) {
		let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? new Color([
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		]) : null;
	}

	static isColor(arg) {
		return (arg instanceof Color ||
			(typeof arg === "string" && arg.indexOf("#") > -1) ||
			(arg.length >= 3 && arg.every(arg => !isNaN(arg))));
	}

	clone() {
		return new Color(this.r, this.g, this.b, this.a);
	}

	toString() {
		return `rgba(${this.r},${this.g},${this.b},${this.a})`;
	}
}