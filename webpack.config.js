//webpack.config.js
const path = require("path")

module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	entry: {
		polyfill: "babel-polyfill",
		main: "./src/ts/index.ts",
	},
	output: {
		path: path.resolve(__dirname, "./dist/js"),
		filename: "[name]-bundle.js", // <--- Will be compiled to this single file
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
}
