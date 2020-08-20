import { replaceTrack, trackObject } from "./setupSeqTracks.js";
import { loadSamples, loadReverbPresets } from "./loadSamples.js";
import { setupUploadButtons } from "./uploadSamples.js";
import {
  screenTitle,
  screenSubtitle,
  instructionScreen,
  reverbsToLoad,
  context,
} from "./constants.js";
import { setUpSequencer } from "./sequencer.js";
import { configAudioEffects } from "./setupAudioEffects.js";

let loadedReverbs = {};

export function init() {
  //give user response on click to know that it is loading
  let loadingText = document.createElement("span");
  loadingText.innerText = "Loading...";
  loadingText.classList.add("instructions__text");
  instructionScreen.append(loadingText);

  let quietBuffer;
  loadReverbPresets(reverbsToLoad).then((loaded) => {
    quietBuffer = loaded[9];
    loaded.forEach((reverb) => {
      loadedReverbs[reverb.name] = reverb;
    });
    loadSamples()
      .then((arrayOfLoadedPads) => {
        for (let pad in arrayOfLoadedPads) {
          let hashedPad = {};
          hashedPad[pad] = arrayOfLoadedPads[pad];
          replaceTrack(hashedPad);
        }
      })
      .then(() => {
        setUpSequencer();
        configAudioEffects();
        setupUploadButtons();
      })
      .then(() => {
        removeInstructionScreen(quietBuffer);
      });
    quickHideAddressBar();
  });
}

function quickHideAddressBar() {
  setTimeout(function () {
    if (window.pageYOffset !== 0) return;
    window.scrollTo(0, window.pageYOffset + 1);
  }, 1000);
}

function removeInstructionScreen() {
  instructionScreen.style.opacity = "0";

  screenTitle.classList.add("animate-text");
  setTimeout(() => {
    instructionScreen.parentNode.removeChild(instructionScreen);
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

//creates and plays empty buffer to unlock audio context on all devices
export function unlockAudioContext() {
  let buffer = context.createBuffer(1, 1, 22050); // create empty buffer
  let source = context.createBufferSource();

  source.buffer = buffer;
  source.connect(context.destination);

  source.start(0);
}
export { loadedReverbs };
