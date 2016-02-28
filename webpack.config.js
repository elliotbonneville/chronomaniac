var webpack = require("webpack");

module.exports = {
	context: __dirname + "/src",
	devtool: "source-map",

	entry: {
		html: "./index.html",
		javascript: "./js/app.js"
	},

	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: "source-map-loader"
			}
		],
		loaders: [
			{
				test: /\.(html|TTF)$/,
				loader: "file?name=[name].[ext]"
			},
			{
				exclude: /node_modules/,
				loaders: ["react-hot", "babel-loader"],
				test: /\.js$/
			},
			{
				loader: "svg-inline",
				test: /\.svg$/
			}
		]
	},
	resolve: {
		packageAlias: "browser"
	},
	output: {
		filename: "app.js",
		path: __dirname + "/dist",
		libraryTarget: "umd",
		library: "rl"
	}
};
