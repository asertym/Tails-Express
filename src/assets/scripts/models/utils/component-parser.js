import debounce from 'lodash/debounce';
import { isDevelopment } from 'Models/utils/environment';

const factories = {};
const queue = [];
const componentSelectorAttribute = 'data-component';
const timings = [];
let timestamp;

const defaultConfig = {
	immediate: false,
	factory: 'vanilla',
	ignoreOnPageLoad: false,
};

function startQueue () {
	window.requestIdleCallback(processQueue);
}

function processQueue (idleDeadline) {
	let count = queue.length;

	while (idleDeadline.timeRemaining() > 0 && count) {
		initializeComponent(queue.shift());

		count = queue.length;
	}

	if (!count) {
		return;
	}

	startQueue();
}

function startTimer () {
	timestamp = window.performance.now();
}

function stopTimer (element) {
	const duration = window.performance.now() - timestamp;

	timings.push({
		element,
		duration,
	});
}

function initializeComponent (queueItem) {
	const element = queueItem.element;
	const config = queueItem.config;
	const isDev = isDevelopment();

	if (isDev) {
		startTimer();
	}

	element.removeAttribute(componentSelectorAttribute);

	if (factories[config.factory] === undefined) {
		console.error(
			`Specified script factory (${config.factory}) is not defined.${
				config.factory === 'vue'
					? ' Please make sure to enable Vue.js integration by following instructions in the readme.md file.'
					: ''
			}`,
		);
		return false;
	}
	factories[config.factory](element, config);

	if (!isDev) {
		return;
	}

	stopTimer(element);
	outputTimings();
}

function isWithinVueComponent (element) {
	const parentComponent = element.parentNode.closest(
		`[${componentSelectorAttribute}]`,
	);

	if (parentComponent) {
		let config = element.getAttribute(componentSelectorAttribute) || {};

		if (typeof config === 'string' && config.length) {
			config = JSON.parse(config);
		}

		config = { ...defaultConfig, ...config };

		if (config.factory === 'vue') {
			return true;
		} else {
			return isWithinVueComponent(parentComponent);
		}
	} else {
		return false;
	}
}

/**
 * Output component initialization timings to the console
 */
const outputTimings = debounce(() => {
	timings.sort((a, b) => (a.duration < b.duration ? 1 : -1));

	console.warn('Total components initialized: ' + timings.length);
	console.warn('Component initialization timings');
	console.warn(timings.slice(0, 5));
}, 500);

export function registerFactory (key, factory) {
	factories[key] = factory;
}

/**
 * Parse DOM and initialize components
 *
 * @param {HTMLElement} context
 * @param {boolean} skipNested
 */
export function parse (context, skipNested = true) {
	let elements = context.querySelectorAll(`[${componentSelectorAttribute}]`);

	if (!elements.length && context.hasAttribute('data-component')) {
		elements = [context];
	}

	for (let i = 0, len = elements.length; i < len; i++) {
		const element = elements[i];

		let config = element.getAttribute(componentSelectorAttribute) || {};

		if (typeof config === 'string' && config.length) {
			config = JSON.parse(config);
		}

		config = { ...defaultConfig, ...config };

		if (config.ignoreOnPageLoad) {
			config.ignoreOnPageLoad = false;
			element.setAttribute(componentSelectorAttribute, JSON.stringify(config));
			continue;
		}

		// skip vanilla components within vue components, as they will be rendered later in a global vue mixin
		if (
			skipNested &&
			config.factory === 'vanilla' &&
			isWithinVueComponent(element)
		) {
			continue;
		}

		const queueItem = { element, config };

		if (!('requestIdleCallback' in window) || config.immediate) {
			initializeComponent(queueItem);
			continue;
		}

		queue.push(queueItem);
	}

	if (!queue.length) {
		return;
	}

	startQueue();
}
