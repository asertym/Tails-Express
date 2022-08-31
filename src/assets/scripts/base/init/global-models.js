import { addGlobalEventListeners } from 'Models/emit-debounced-events';
import { initBreakpointWatching } from "Models/breakpoints";
import checkForTouch from "Models/check-for-touch";
import onScreen from 'Models/on-screen';

addGlobalEventListeners();
initBreakpointWatching();
checkForTouch();
onScreen();
