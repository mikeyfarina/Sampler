import "./styles.css";
import { init } from "./setup.js";
import { screen } from "./constants.js";

let initialized = false;

//for mobile devices
screen.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    if (!initialized) {
      init();
      initialized = true;
    }
  },
  { once: true }
);

//for mouse events
screen.addEventListener(
  "click",
  () => {
    if (!initialized) {
      init();
      initialized = true;
    }
  },
  { once: true }
);
