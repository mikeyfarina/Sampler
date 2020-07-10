import { replaceTrack } from "./setupSeqTracks.js";
import { loadSamples } from "./loadSamples.js";
import { setupUploadButtons } from "./uploadSamples.js";
import { screenSubtitle, reverbsToLoad } from "./constants.js";
import { setUpSequencer } from "./sequencer.js";
import { configAudioEffects, loadReverbPresets } from "./setupAudioEffects.js";
let loadedReverbs = [];
export function init() {
  loadReverbPresets(reverbsToLoad).then((loaded) => {
    loadedReverbs = loaded;
    loadSamples().then((arrayOfLoadedPads) => {
      arrayOfLoadedPads.forEach(function (pad) {
        replaceTrack(pad);
      });
      setUpSequencer();
      configAudioEffects();
    })
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

export { loadedReverbs };