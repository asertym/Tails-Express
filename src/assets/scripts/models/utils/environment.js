/**
 * @return {boolean}
 */
export function isDevelopment () {
	return !!window.location.href.match(/\.devlocal|localhost/);
}
