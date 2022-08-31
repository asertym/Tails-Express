import * as ProjectConfig from 'Models/utils/project-config';

export default function generateIcon (iconName, isSymbol = false) {
	if (isSymbol) {
		return `<div class="icon"><svg><use xlink:href="${ProjectConfig.get('assetsUrl')}icons/symbols.svg#icon-${iconName}" /></svg></div>`;
	}
}
