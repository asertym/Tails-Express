const components = {};

export function registerComponent (key, component) {
	components[key] = component;
}

export function create (element, config) {
	if (components[config.component] === undefined) {
		console.error(`Component "${config.component}" doesn't exist`);
		return false;
	}
	const promise = components[config.component](element);
	if (promise) {
		promise.then((component) => {
			component.default(element);
		});
	}
}
