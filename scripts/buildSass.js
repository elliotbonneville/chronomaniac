#!/usr/bin/env node

var fs = require("fs"),
	path = require('path'),
	sass = require("node-sass");

var rootDir = path.join(__dirname, '..'),
	distDir = path.join(rootDir, 'dist'),
	sassDir = path.join(rootDir, 'src', 'sass'),
	assetSrcDir = path.join(rootDir, 'src'),
	options = {
		file: path.join(sassDir, "app.scss"),
		outputStyle: "compressed"
	};

sass.render(options, (err, result) => {
	if (err) {
		console.log(err);
		return process.exit(1);
	};

	fs.writeFile(process.argv[2], result.css, (err) => {
		if (err) {
			console.log(err);
			process.exit(1)
		};
	});
});
