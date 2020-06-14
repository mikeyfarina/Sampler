import { replaceTrack } from "./setupSeqTracks.js";
import { loadSamples } from "./loadSamples.js";
import { setupUploadButtons } from "./uploadSamples.js";
import { screenSubtitle } from "./constants.js";
import { setUpSequencer } from "./sequencer.js";
import { configAudioEffects } from "./setupAudioEffects.js";

export function init() {
  loadSamples().then((arrayOfLoadedPads) => {
    arrayOfLoadedPads.forEach(function (pad) {
      replaceTrack(pad);
    });
    setUpSequencer();
    configAudioEffects();
  });
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
