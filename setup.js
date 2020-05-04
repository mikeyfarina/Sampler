import "./styles.css";
import {loadSamples} from "./loadSamples.js";
import {setupUploadButtons} from "./uploadSamples.js";
import {startButton} from "./constants.js";

export function init(){
  loadSamples();
  setupUploadButtons();
  startButton.disabled = true;
  startButton.innerText = "ready";
}
