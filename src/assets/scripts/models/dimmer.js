const states = {
	isDimmed: 'is-dimmed',
};

const dimElement = document.documentElement;

export function dimPage () {
	dimElement.classList.add(states.isDimmed);
}

export function undimPage () {
	dimElement.classList.remove(states.isDimmed);
}
