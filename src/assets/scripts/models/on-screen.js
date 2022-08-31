import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { listen } from 'Models/utils/event-bus';

export default function onScreen () {
	gsap.registerPlugin(ScrollTrigger);

	function init () {
		initOnScreen();
		addEventListeners();
	}

	const elements = {
		selector: document.querySelectorAll('.js-on-screen')
	}

	function addEventListeners() {
		listen('projectsLoaded', () => {
			ScrollTrigger.refresh();
		});
	}

	function initOnScreen () {
		elements.selector.forEach(el => {
			const delay = el.dataset.delay ? Number(el.dataset.delay) : null;
			gsap.to(el, {
				scrollTrigger: {
					start: 'top bottom',
					trigger: el,
					once: false,
					onEnter: () => {
						if (delay) {
							setTimeout(() => {
								el.classList.add("is-on-screen");
							}, delay);
						} else {
							el.classList.add("is-on-screen");
						}
					},
					onLeaveBack: () => {
						el.classList.remove("is-on-screen");
					},
					// markers: true,
				},
			});
		});
	}

	init();
}
