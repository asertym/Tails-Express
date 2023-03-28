const yargv = require('yargs').argv;

module.exports = ({
	plugins: {
		'postcss-import': {},
		'tailwindcss': {},
		'autoprefixer': {},
		'cssnano': yargv.mode === 'prod' ? {} : false,
	}
})
