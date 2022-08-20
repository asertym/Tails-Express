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
				// Projects folders
				assets: '/assets', // Path to the assets folder
				styles: '/assets/styles', // Path to the styles folder
				scripts: '/assets/scripts', // Path to the scripts folder
				images: '/assets/images', // Path to the images folder

				// Add any data you want to be available in your Twig templates
			}
		}
	}
}