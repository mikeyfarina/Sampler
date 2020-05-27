import {loadSamples} from "./loadSamples.js";
import {setupUploadButtons} from "./uploadSamples.js";
import {screenSubtitle} from "./constants.js";
import {setUpSequencer} from "./sequencer.js";
import {createSequencerTracksFromPadsWithSamples} from "./setupSeqTracks.js";


export function init() {
  loadSamples().then(createSequencerTracksFromPadsWithSamples);
  setupUploadButtons();
  screenSubtitle.innerHTML = "ready to play";
  quickHideAddressBar();
  setUpSequencer();
}

function quickHideAddressBar() {
  setTimeout(function () {
    if (window.pageYOffset !== 0) return;
    window.scrollTo(0, window.pageYOffset + 1);
  }, 1000);
}
