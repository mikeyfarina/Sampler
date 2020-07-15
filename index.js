import "./styles.css";
import { init } from "./setup.js";
import { instructionScreen } from "./constants.js";

let initialized = false;

//for mobile devices
instructionScreen.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();

    if (initialized) {
      return;
    }
    init();
    initialized = true;
  },
  { once: true }
);

//for mouse events
instructionScreen.addEventListener(
  "click",
  () => {
    if (initialized) {
      return;
    }
    init();
    initialized = true;
  },
  { once: true }
);
