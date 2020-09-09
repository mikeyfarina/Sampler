import "./styles.css";
import {
  init,
  unlockAudioContext,
  addListenersToInstructionDrumPadKeys,
} from "./setup.js";
import { instructionScreen } from "./constants.js";

let initialized = false;

addListenersToInstructionDrumPadKeys();
//for mobile devices
instructionScreen.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    unlockAudioContext();
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
    unlockAudioContext();
    if (initialized) {
      return;
    }
    init();
    initialized = true;
  },
  { once: true }
);
