module.exports = {

	// BrowserSync configs
	browserSync: {
		localUrl: 'test.devlocal', // Specify the local url for the project (this will enable the BrowserSync plugin and let you test the project on various devices simultaneously)
		open: true, // Decide which URL to open automatically when Browsersync starts. Use false to disable.
		ghostMode: false, // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
	},

	twig: {
		data: {
			tails: {
				assets: '/assets/', // Assets folder
			}
		}
	}
}