import { trackBackgroundColors } from "./constants.js";
import { createEffectPanel } from "./setupAudioEffects.js";

let sequencerDisplay = document.querySelector(".sequencer__display");
let trackObject = [];
let trackNumber = 0;

export function replaceTrack(newTrack, oldPad) {
  console.log("replacing/creating track", newTrack, oldPad);
  //if theres an old track remove it
  if (oldPad !== undefined) {
    console.log("oldpad exists", trackObject);
    //select old track
    let oldPadName = oldPad.querySelector("p.drum-machine__pads__label")
      .innerText;
    let oldPadObject = trackObject.find((o) => o.trackName === oldPadName);
    let oldPadIndex = trackObject.indexOf(oldPadObject);

    console.log("upload", trackObject, oldPadIndex);
    if (oldPadObject) {
      trackObject.splice(oldPadIndex, 1, newTrack);
    }

    console.log("pushing newTrack", newTrack, trackObject, oldPadObject);

    let allTrackNames = document.querySelectorAll(
      ".sequencer__display__track__name"
    );

    //find old track and remove it
    [].forEach.call(allTrackNames, (trackName) => {
      if (trackName.innerText === oldPadName) {
        let track = trackName.parentElement;
        console.log("attempting to remove... ", track.parentElement);
        track.parentElement.removeChild(track);
      }
    });
  }
  //add new track newTrack {trackName, trackBuffer}
  transformPadToTrack(newTrack, oldPad);
}

function transformPadToTrack(padInfo, oldPad) {
  //create a track div
  console.log("tPTT", padInfo);
  let newTrackDiv = document.createElement("div");
  newTrackDiv.className = `sequencer__display__track`;

  // sequencer effect button to display panel setup

  let displayEffectsButton = document.createElement("button");
  displayEffectsButton.innerText = "\u21b3"; //unicode for down-right arrow
  displayEffectsButton.className = "sequencer__display__track__show-effects";
  newTrackDiv.append(displayEffectsButton);

  // sequencer panel setup

  // name track

  let padName = document.createElement("span");
  padName.innerText = padInfo.trackName;
  padName.className = "sequencer__display__track__name";
  newTrackDiv.append(padName);

  let padIndex = trackObject.indexOf(trackObject.find((o) => o.trackName === padInfo.trackName));


  //push info of pad into memory if not replacing old track
  if (oldPad === undefined) {
    trackObject.push(padInfo);

    //cycle background colors
    newTrackDiv.style.background = trackBackgroundColors[`${trackNumber++}`];
  } else {
    newTrackDiv.style.background = trackBackgroundColors[padIndex];

    displayEffectsButton.addEventListener("click", (event) => {
      console.log("new clicked");
      let effectPanel = event.target.parentNode.nextSibling;

      effectPanel.classList.toggle("hide");
      effectPanel.classList.toggle("effect-panel-dropdown");
    })
  }


  //create 16 buttons on a track, unique id for each
  for (let i = 0; i < 16; i++) {
    let button = document.createElement("button");
    button.className = "sequencer__display__track__button";
    button.id = `${padInfo.trackName}__${i}`;

    button.innerText = "_";

    if (i < 4 || (i >= 8 && i < 12)) {
      button.style.background = "rgba(0, 0, 0, 0.05)";
    } else {
      button.style.background = "rgba(255, 255, 255, 0.15)";
    }

    button.addEventListener("click", () => {
      if (button.classList.contains("clicked")) {
        button.classList.remove("clicked");
      } else {
        button.classList.add("clicked");
      }
    });
    newTrackDiv.append(button);
  }
  sequencerDisplay.append(newTrackDiv);
  createEffectPanel(newTrackDiv);
}

export { trackObject };
