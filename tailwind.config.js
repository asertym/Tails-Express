module.exports = {
	content: ["./src/**/*.{twig,js,vue}"],
	theme: {
		container: {
			center: false, // default: false
			padding: "2rem",
		},
		extend: {
			screens: {},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/aspect-ratio"),
	],
};
