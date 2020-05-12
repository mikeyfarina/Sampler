import {loadSamples} from "./loadSamples.js";
import {setupUploadButtons} from "./uploadSamples.js";
import {screenSubtitle} from "./constants.js";

export function init(){
  loadSamples();
  setupUploadButtons();
  screenSubtitle.innerHTML = "ready to play";
}
