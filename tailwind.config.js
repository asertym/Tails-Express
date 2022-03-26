module.exports = {
  content: ['./src/**/*.{twig,js,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio')
	],
}