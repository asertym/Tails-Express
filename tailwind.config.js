module.exports = {
  content: ['./src/**/*.{twig,js,vue}'],
  theme: {
    extend: {},
    container: {
      center: false, // default: false
    },
  },
  plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio')
	],
}