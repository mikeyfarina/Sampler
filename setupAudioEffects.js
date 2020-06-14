import { trackObject } from "./setupSeqTracks.js";
import { context } from "./constants.js";
import { doc } from "prettier";

let openEffectPanelButtons = [];

let isPitchShifted = false;

export function configAudioEffects() {
  //get all open panel buttons
  openEffectPanelButtons = document.querySelectorAll(
    ".sequencer__display__track__show-effects"
  );
  console.log("openEffectPanelButtons", openEffectPanelButtons);
  //have clicking button open panel that has many effects for audio
  [].forEach.call(openEffectPanelButtons, (button) => {
    button.addEventListener("click", (ev) => {
      console.log("clicked");
      //display panel
      displayEffectPanel(ev);
    });
  });
}
//displays effect panel or hides panel if displayed
function displayEffectPanel(event) {
  let effectPanel = event.target.parentNode.nextSibling;

  if (effectPanel.style.display === "none") {
    effectPanel.style.display = "flex";
  } else {
    effectPanel.style.display = "none";
  }
}

//create panel with multiple audio effects
// to manipulate played samples
export function createEffectPanel(track) {
  console.log("cEP trackDiv", track);

  let trackName = track.querySelector("span").innerText;
  let trackInfo = trackObject.find((o) => o.trackName === trackName);

  console.log("loading effects for: ", trackInfo, track);

  let effectDiv = document.createElement("div");
  effectDiv.className = "sequencer__display__track__effects-panel";
  console.log(track.style.background);
  effectDiv.style.background = track.style.background;

  //start with loading sample to play with button to test effects
  let effectTestButton = document.createElement("button");
  effectTestButton.className = "effects-panel__test-button";
  effectTestButton.innerText = "test";

  //create a pitch shifter and a user input to decide semitones
  let pitch = document.createElement("div");
  pitch.className = "effects-panel__pitch";

  let pitchInput = document.createElement("input");
  pitchInput.className = "effects-panel__pitch__input";

  let pitchInfo = document.createElement("span");
  let semitones = 0;

  pitchInput.type = "range";
  pitchInput.min = "-12";
  pitchInput.max = "12";
  pitchInput.value = "0";

  pitchInfo.innerText = `pitch: ${pitchInput.value}`;

  pitchInput.addEventListener("input", () => {
    semitones = pitchInput.value; // -12 -> 12 in semitones
    pitchInfo.innerText = `pitch: ${semitones}`;
  });

  //create a gain node and a user input to control the volume
  let volumeControl = document.createElement("div");
  volumeControl.className = "effects-panel__gain";

  let volumeControlInput = document.createElement("input");
  volumeControlInput.className = "effects-panel__gain__input";

  volumeControlInput.type = "range";
  volumeControlInput.min = "0";
  volumeControlInput.max = "1";
  volumeControlInput.step = "0.05";

  let volume = 1;

  volumeControlInput.addEventListener("input", () => {
    volume = volumeControlInput.value;
  });

  let volumeInfo = document.createElement("span");
  volumeInfo.innerText = `Volume: `;

  effectTestButton.addEventListener("click", () => {
    let source = context.createBufferSource();
    source.buffer = trackInfo.trackBuffer;

    //connect source to effects
    connectSourceToEffects(source, semitones, volume);
  });

  //add button to panel
  effectDiv.append(effectTestButton);

  pitch.append(pitchInfo);
  pitch.append(pitchInput);
  effectDiv.append(pitch);

  //attach effect panel to track
  track.parentNode.insertBefore(effectDiv, track.nextSibling);
}

//it will need to take the buffer from each track and add effects
function connectSourceToEffects(source, semitones, volume) {
  let gainNode = context.createGain();
  gainNode.gain.value = volume;

  source.detune.value = semitones * 100; //100 cents

  return source;
}
