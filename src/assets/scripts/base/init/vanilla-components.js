import * as ComponentParser from "Models/utils/component-parser";
import * as VanillaFactory from "Models/utils/vanilla-factory";

// Define static components
// import cookieInfo from /* webpackChunkName: "cookie-info" */ 'Components/vanilla/cookie-info'; // remove if you don't use default LOOP Cookie Info component

// Register static components
// VanillaFactory.registerComponent('cookie-info', cookieInfo);

// Define async components
const asyncComponents = [
	// 'cookie-overlay',
];

// Register async components
asyncComponents.forEach((asyncComponent) => {
	VanillaFactory.registerComponent(asyncComponent, () =>
		import(
			/* webpackChunkName: "[request]" */ "Components/vanilla/" + asyncComponent
		)
	);
});

ComponentParser.registerFactory("vanilla", VanillaFactory.create);
