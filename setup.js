import { replaceTrack } from "./setupSeqTracks.js";
import { loadSamples } from "./loadSamples.js";
import { setupUploadButtons } from "./uploadSamples.js";
import {
  screenTitle,
  screenSubtitle,
  instructionScreen,
  reverbsToLoad,
  context,
} from "./constants.js";
import { setUpSequencer } from "./sequencer.js";
import {
  configAudioEffects,
  loadReverbPresets,
  tracksEffectInfo,
} from "./setupAudioEffects.js";
import { hashTableConversion } from "./hashTable.js";

let loadedReverbs = [];

export function init() {
  //give user response on click to know that it is loading
  let loadingText = document.createElement("span");
  loadingText.innerText = "Loading...";
  loadingText.classList.add("instructions__text");
  instructionScreen.append(loadingText);

  let quietBuffer;
  let hash;
  loadReverbPresets(reverbsToLoad).then((loaded) => {
    quietBuffer = loaded[9];
    loadedReverbs = loaded;
    loadSamples()
      .then((arrayOfLoadedPads) => {
        arrayOfLoadedPads.forEach(function (pad) {
          replaceTrack(pad);
        });
      })
      .then(() => {
        hashTableConversion(tracksEffectInfo).then((hash) => {
          setUpSequencer(hash);
          configAudioEffects();
        });
      })
      .then(() => {
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

  screenTitle.classList.add("animate-text");
  setTimeout(() => {
    instructionScreen.parentNode.removeChild(instructionScreen);
    resumeBuffer.start(0);
    screenTitle.innerText = "";
    let textDiv = document.createElement("div");
    textDiv.innerText = "Welcome to sampler";
    screenTitle.append(textDiv);

    setTimeout(() => {
      screenTitle.innerText = "";
      screenSubtitle.innerText = "";
      screenTitle.classList.remove("animate-text");
    }, 10000);
  }, 350);
}

export { loadedReverbs };
