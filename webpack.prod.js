const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
	resolve: {
		extensions: [".js"],
	},
	output: {
		chunkFilename: "[name].[contenthash].js",
	},
	optimization: {
		minimize: true,
		minimizer: [],
	},

});
