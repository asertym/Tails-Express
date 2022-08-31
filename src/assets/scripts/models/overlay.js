import { dimPage, undimPage } from 'Models/dimmer';
import { lockPage, unlockPage } from 'Models/locker';
import { call } from 'Models/http-request';
import { showPreloader, hidePreloader } from 'Models/preloader';
import { parse } from 'Models/utils/app';
import { listen, unlisten } from 'Models/utils/event-bus';
import generateIcon from 'Models/icon';

let overlayEl;
let overlayOpen = false;
let overlayOpening = false;
let lastOverlayParameters = false;
const classes = {
	link: 'js-overlay__link',
	content: 'js-overlay__content',
	close: 'js-overlay__close',
};

const elements = {
	links: document.querySelectorAll('a[target="_top"], .' + classes.link),
};

export function initOverlaySystem () {
	addListeners();
}

function addListeners () {
	elements.links.forEach(link => {
		link.addEventListener('click', linkClickHandler);
	});
}

function removeListeners () {
	elements.links.forEach(link => {
		link.removeEventListener('click', linkClickHandler);
	});
}

function addInnerListeners () {
	document.addEventListener('click', innerDocumentClickHandler);
	document.addEventListener('keyup', innerDocumentKeypressHandler);
	listen('close-overlay', closeOverlayHandler);
}

function removeInnerListeners () {
	document.removeEventListener('click', innerDocumentClickHandler);
	document.removeEventListener('keyup', innerDocumentKeypressHandler);
	unlisten('close-overlay', closeOverlayHandler);
}

function linkClickHandler (e) {
	e.preventDefault();
	const href = e.currentTarget.getAttribute('href');
	const contentWrapperParams = e.currentTarget.dataset.contentWrapperParams;
	openOverlay(href, false, contentWrapperParams);
}

function innerDocumentClickHandler (e) {
	if (e.target.classList.contains(classes.close) || !e.target.closest('.' + classes.content)) {
		closeOverlay();
	}
}

function innerDocumentKeypressHandler (e) {
	if (e.key === 'Escape') {
		closeOverlay();
	}
}

function closeOverlayHandler () {
	closeOverlay();
}

export function openOverlay (contentHolder, contentType = false, contentWrapperParams = false, callParameters = {}) {
	if (overlayOpening) return false;
	if (overlayOpen) {
		// handle a case of opening new overlay while previous is still open
		closeOverlay({ contentHolder, contentType, contentWrapperParams, callParameters });
		return false;
	}
	overlayOpening = true;
	createOverlayBase();
	dimPage();
	lockPage();
	requestAnimationFrame(() => {
		addInnerListeners();
	});
	contentType = contentType || getContentType(contentHolder);

	switch (contentType) {
	case 'url':
		loadContent(contentHolder, callParameters);
		break;

	case 'element':
		appendContent(getContentFromElement(contentHolder), contentWrapperParams);
		break;

	case 'html':
		appendContent(contentHolder, contentWrapperParams);
		break;
	}

	lastOverlayParameters = {
		contentHolder,
		contentType,
		contentWrapperParams,
		callParameters,
	};
}

function getContentType (href) {
	if (href.charAt(0) === '#') {
		return 'element';
	} else {
		return 'url';
	}
}

function createOverlayBase () {
	overlayEl = document.createElement('section');
	overlayEl.classList.add('overlay');

	showPreloader(overlayEl, { color: 'white', size: 'big' });
	document.body.appendChild(overlayEl);
	overlayEl.focus();
}

async function loadContent (url, customCallParameters) {
	const defaultCallParameters = {
		method: 'GET',
		params: {},
	};
	const callParameters = { ...defaultCallParameters, ...customCallParameters };
	try {
		const response = await call(url, callParameters.method, callParameters.params);
		if (response.meta.success) {
			appendContent(response.data.html);
		} else {
			hidePreloader(overlayEl);
			closeOverlay(false, true);
			console.error(response.meta.error_message);
			console.error(`There was a problem with the overlay "${url}" endpoint.`, response);
		}
	} catch (e) {
		closeOverlay(false, true);
		hidePreloader(overlayEl);
		console.error(e);
	}
}

function getContentFromElement (selector) {
	const targetEl = document.querySelector(selector);
	return targetEl.innerHTML;
}

function appendContent (content, contentWrapperParams = false) {
	if (contentWrapperParams) {
		content = wrapContentInContainer(content, contentWrapperParams);
	}
	overlayEl.innerHTML = content;
	focusOnContent();
	overlayOpening = false;
	overlayOpen = true;
}

function focusOnContent () {
	const contentEl = overlayEl.firstElementChild;
	contentEl.setAttribute('tabindex', '-1');
	contentEl.setAttribute('aria-dialog', true);
	contentEl.setAttribute('role', 'dialog');
	// contentEl.focus();
	parse(contentEl);
	parseOverlayLinks();
}

export function closeOverlay (relaunchOverlayConfig = false, forceClose = false) {
	if (!overlayOpen && !forceClose) {
		return false;
	}
	overlayEl.classList.add('is-removed');
	removeInnerListeners();
	undimPage();
	setTimeout(() => {
		document.body.removeChild(overlayEl);
		unlockPage();
		overlayOpen = false;
		if (relaunchOverlayConfig) {
			openOverlay(relaunchOverlayConfig.contentHolder, relaunchOverlayConfig.contentType, relaunchOverlayConfig.contentWrapperParams, relaunchOverlayConfig.callParameters);
		}
	}, 400);
}

export function parseOverlayLinks () {
	removeListeners();
	elements.links = document.querySelectorAll('a[target="_top"], .' + classes.link);
	addListeners();
}

export function reloadOverlay () {
	if (!lastOverlayParameters) {
		return false;
	}
	openOverlay(lastOverlayParameters.contentHolder, lastOverlayParameters.contentType, lastOverlayParameters.contentWrapperParams, lastOverlayParameters.callParameters);
}

export function wrapContentInContainer (content, options) {
	const markup = `
	<div class="overlay__content overlay__content--${options.size ? options.size : 'default'} js-overlay__content">
		${options.closeIcon ? `<div class="overlay__close js-overlay__close">${generateIcon('close', true)}</div>` : ``}
			${content}
	</div>`;
	return markup;
}
