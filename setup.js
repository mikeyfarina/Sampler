import {loadSamples} from "./loadSamples.js";
import {setupUploadButtons} from "./uploadSamples.js";
import {screenSubtitle} from "./constants.js";

export function init(){
  loadSamples();
  setupUploadButtons();
  screenSubtitle.innerHTML = "ready to play";

  window.addEventListener("load",function() {
    // Set a timeout...
    setTimeout(function(){
      // Hide the address bar!
      window.scrollTo(0, 1);
    }, 0);
  });
}
