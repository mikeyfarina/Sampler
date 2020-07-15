import { replaceTrack } from "./setupSeqTracks.js";
import { loadSamples } from "./loadSamples.js";
import { setupUploadButtons } from "./uploadSamples.js";
import { instructionScreen, instructionScreenText, reverbsToLoad, context } from "./constants.js";
import { setUpSequencer } from "./sequencer.js";
import { configAudioEffects, loadReverbPresets } from "./setupAudioEffects.js";
let loadedReverbs = [];
export function init() {
  let quietBuffer;
  loadReverbPresets(reverbsToLoad).then((loaded) => {
    quietBuffer = loaded[9];
    loadedReverbs = loaded;
    loadSamples().then((arrayOfLoadedPads) => {
      arrayOfLoadedPads.forEach(function (pad) {
        replaceTrack(pad);
      });
      setUpSequencer();
      configAudioEffects();
    }).then(() => {
      removeInstructionScreen(quietBuffer);
    });
    setupUploadButtons();
    quickHideAddressBar();
  });
}

function quickHideAddressBar() {
  setTimeout(function () {
    if (window.pageYOffset !== 0) return;
    window.scrollTo(0, window.pageYOffset + 1);
  }, 1000);
}

function removeInstructionScreen(quietBuffer) {
  instructionScreen.style.opacity = "0";

  let resumeBuffer = context.createBufferSource();
  resumeBuffer.buffer = quietBuffer;

  setTimeout(() => {
    instructionScreen.parentNode.removeChild(instructionScreen);
    resumeBuffer.start(0);
  }, 350);
}

export { loadedReverbs };