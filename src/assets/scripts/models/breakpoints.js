import { listen, dispatch } from 'Models/utils/event-bus';

export const breakpoints = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
};

export let currentlyActiveBreakpoints = getActiveBreakpoints();

export function initBreakpointWatching() {
	listen('window-resized', () => {
		updateActiveBreakpoints();
	});
}

function getActiveBreakpoints() {
	const activeBreakpoints = [];
	const windowWidth = window.innerWidth;
	for (const [key, value] of Object.entries(breakpoints)) {
		if (value <= windowWidth) {
			activeBreakpoints.push(key);
		} else {
			break;
		}
	}
	return activeBreakpoints;
}

function updateActiveBreakpoints() {
	const newActiveBreakpoints = getActiveBreakpoints();
	if (newActiveBreakpoints.length !== currentlyActiveBreakpoints.length) {
		currentlyActiveBreakpoints = newActiveBreakpoints;
		dispatch('active-breakpoints-change', currentlyActiveBreakpoints);
	}
}
