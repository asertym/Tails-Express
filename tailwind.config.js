// tailwind config
module.exports = {
	purge: {
		enabled: false,
		content: ["./build/**/*.html"],
	},
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: '#fff'
		},
		fontFamily: {
		},
		fontSize: {
		},
		borderRadius: {
		},
		container: {
			center: true,
		},
	},
	variants: {},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio')
	],
};
