import domready from "domready";
import { init } from "Models/utils/app";
import { dispatch } from "Models/utils/event-bus";
import "Base";

domready(() => {
	dispatch("domready");
	init();
});
