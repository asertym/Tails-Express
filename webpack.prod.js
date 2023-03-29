const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require('terser-webpack-plugin');
const yargv = require('yargs').argv;

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
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
					compress: {
						drop_console: yargv.dropConsole,
					},
				},
				extractComments: false,
			}),
		],
	},

});
