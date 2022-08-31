const path = require("path");
const scriptsPath = "src/assets/scripts";
module.exports = {
	resolve: {
		alias: {
			Scripts: path.resolve(__dirname, scriptsPath),
			Models: path.resolve(__dirname, scriptsPath + "/models"),
			Components: path.resolve(__dirname, scriptsPath + "/components"),
			Base: path.resolve(__dirname, scriptsPath + "/base"),
			Store: path.resolve(__dirname, scriptsPath + "/store"),
		},
	},
	stats: {
		version: false,
		builtAt: false,
		assets: false,
		entrypoints: false,
		moduleTrace: false,
		publicPath: false,
		errorDetails: false,
		reasons: false,
		source: false,
	},
};
