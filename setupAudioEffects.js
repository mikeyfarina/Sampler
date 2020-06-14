import { trackObject } from "./setupSeqTracks.js";
import { context } from "./constants.js";

let openEffectPanelButtons = [];

export function configAudioEffects() {
  //get all open panel buttons
  openEffectPanelButtons = document.querySelectorAll(".sequencer__display__track__show-effects");
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

  //attach specific effects to the sample

  //start with loading sample to play with button to test effects
  let effectTestButton = document.createElement("button");
  effectTestButton.className = "effects-panel__test-button";
  effectTestButton.innerText = "test";

  effectTestButton.addEventListener("click", () => {
    let source = context.createBufferSource();
    source.buffer = trackInfo.trackBuffer;
    source.connect(context.destination);
    source.start(0);
  });
  //add button to panel
  effectDiv.append(effectTestButton);

  //create a gain node and a user input to control the volume

  //attach effect panel to track
  track.parentNode.insertBefore(effectDiv, track.nextSibling);


}

    //it will need to take the buffer from each track and add effects