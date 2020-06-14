import { trackObject } from "./setupSeqTracks.js";
import { context } from "./constants.js";

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
  let pitchControl = document.createElement("div");
  pitchControl.className = "effects-panel__pitch";

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

  //append pitchinfo and input to pitch div
  pitchControl.append(pitchInfo);
  pitchControl.append(pitchInput);

  //create a gain node and a user input to control the volume
  let volumeControl = document.createElement("div");
  volumeControl.className = "effects-panel__gain";

  let volumeInput = document.createElement("input");
  volumeInput.className = "effects-panel__gain__input";

  volumeInput.type = "range";
  volumeInput.value = "1";
  volumeInput.min = "0";
  volumeInput.max = "3";
  volumeInput.step = "0.1";

  let volume = 1;

  volumeInput.addEventListener("input", () => {
    volume = volumeInput.value;
  });

  let volumeInfo = document.createElement("span");
  volumeInfo.innerText = `Volume: `;

  //attach volume info and input to div
  volumeControl.append(volumeInfo);
  volumeControl.append(volumeInput);

  //create pan effect and user input to decide direction
  let panControl = document.createElement("div");
  panControl.className = "effects-panel__pan";

  let panValue = 0;
  let panInput = document.createElement("input");
  panInput.className = "effects-panel__pan__input";
  panInput.type = "range";
  panInput.value = "0";
  panInput.min = "-1";
  panInput.max = "1";
  panInput.step = "0.1";

  let panInfo = document.createElement("span");
  panInfo.innerText = `Panning: ${(panValue < 0) ? "L " + panValue : "R " + panValue}`

  panInput.addEventListener("input", () => {
    panValue = panInput.value;
    panInfo.innerText = `Panning: ${(panValue < 0) ? "L " + panValue : "R " + panValue}`
  });


  panControl.append(panInfo);
  panControl.append(panInput);

  effectTestButton.addEventListener("click", () => {
    let source = context.createBufferSource();
    source.buffer = trackInfo.trackBuffer;

    //connect source to effects
    connectSourceToEffects(source, semitones, volume, panValue);
  });

  //add effects to panel
  effectDiv.append(effectTestButton);
  effectDiv.append(volumeControl);
  effectDiv.append(panControl);
  effectDiv.append(pitchControl);

  //attach effect panel to track
  track.parentNode.insertBefore(effectDiv, track.nextSibling);
}

//it will need to take the buffer from each track and add effects
function connectSourceToEffects(source, semitones, volume, panValue) {
  //create pan node and set value
  let panNode = context.createStereoPanner();
  console.log(panNode);
  panNode.pan.value = panValue;

  //create gainNode and set value
  let gainNode = context.createGain();
  gainNode.gain.value = volume;

  //detune sample accordingly before connecting other effects
  source.detune.value = semitones * 100; //100 cents

  source.connect(panNode).connect(gainNode).connect(context.destination);
  source.start(0);

  //return source later so that it plays in the sequencer
}
