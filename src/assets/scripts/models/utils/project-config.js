import _get from 'lodash/get';

let config;

function initConfig() {
	if (config) {
		return;
	}

	parseConfig();
}

function parseConfig() {
	const script = document.getElementById('project-config');

	if (!script) {
		throw new Error("Can't find #project-config element");
	}

	config = JSON.parse(script.textContent);
}

/**
 * Get config value by dot notation
 *
 * @param {string} path
 * @return {*}
 */
export function get(path) {
	try {
		initConfig();

		return _get(config, path);
	} catch (e) {
		window.console.error(e);
	}
}
