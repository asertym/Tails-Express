module.exports = {
	// BrowserSync configs
	browserSync: {
		localUrl: "test.devlocal", // Specify the local url for the project (this will enable the BrowserSync plugin and let you test the project on various devices simultaneously)
		open: true, // Decide which URL to open automatically when Browsersync starts. Defaults to "local" if none set.
		ghostMode: false, // CClicks, Scrolls & Form inputs on any device will be mirrored to all others.
	},

	twig: {
		data: {
			// Use for setting globally accessible variables
			tails: {
				// Projects folders
				assets: "/assets",
				styles: "/assets/styles",
				scripts: "/assets/scripts",
				images: "/assets/images",
				icons: "/assets/icons",

				// Project Specific
				gtag: "",

				// Add below any data you want to be available in your Twig templates
			},
		},
	},
};
