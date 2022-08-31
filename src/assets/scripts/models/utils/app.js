const parsers = [];

export function parse(context) {
	parsers.forEach((parser) => parser(context));
}

export function registerParser(parser) {
	parsers.push(parser);
}

export function init() {
	parse(document.body);
}
