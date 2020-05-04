import {loadSamples} from "./loadSamples.js";
import {setupUploadButtons} from "./uploadSamples.js";

export function init(){
  loadSamples();
  setupUploadButtons();
}
