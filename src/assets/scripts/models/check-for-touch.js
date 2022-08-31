export default function checkForTouch () {
	const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

	if (supportsTouch) {
		document.body.classList.add('touch');
	} else {
		document.body.classList.add('no-touch');
	}
}
