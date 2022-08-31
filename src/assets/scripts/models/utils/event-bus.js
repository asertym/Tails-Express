const bus = document.createElement('eventbus'); // vanilla js

/**
 * @param {string} event
 * @param {mixed} args
 */
export function dispatch (event, args) {
	bus.dispatchEvent(
		new CustomEvent(event, {
			detail: args,
		}),
	); // vanilla js
}

/**
 * @param {string} event
 * @param callback
 */
export function listen (event, callback) {
	bus.addEventListener(event, callback); // vanilla js
}

/**
 * @param {string} event
 * @param callback
 */
export function unlisten (event, callback) {
	bus.removeEventListener(event, callback); // vanilla js
}
