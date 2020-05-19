import { loadSamples } from "./loadSamples.js";
import { setupUploadButtons } from "./uploadSamples.js";
import { screenSubtitle } from "./constants.js";

export function init() {
  loadSamples();
  setupUploadButtons();
  screenSubtitle.innerHTML = "ready to play";
  quickHideAddressBar();
}

function quickHideAddressBar() {
  setTimeout(function () {
    if (window.pageYOffset !== 0) return;
    window.scrollTo(0, window.pageYOffset + 1);
  }, 1000);
}
