import { trackBackgroundColors } from "./constants.js";
import { createEffectPanel } from "./setupAudioEffects.js";
import {
  removeItemFromTrackBufferHash,
  removeItemFromTrackEffectInfoHash,
} from "./hashTable.js";

let sequencerDisplay = document.querySelector(".sequencer__display");
let trackObject = {};
let trackNumber = 0;

export function replaceTrack(newTrack, oldPad) {
  console.log("replacing/creating track", newTrack, oldPad);

  //if theres an old track remove it
  let oldPadObject = undefined;
  if (oldPad !== undefined) {
    //select old track
    let oldPadName = oldPad.querySelector("p.drum-machine__pads__label")
      .innerText;
    console.log(trackObject, "trackobj");
    oldPadObject = trackObject[oldPadName];

    //get index of old pad
    oldPadObject.colorIndex = oldPadObject.colorIndex;

    console.log(oldPadObject.colorIndex, oldPadObject);

    //remove old pad info at index and replace with new track info
    let nameOfNewTrack = Object.keys(newTrack)[0];
    trackObject[nameOfNewTrack] = newTrack[nameOfNewTrack];

    //find old track and remove it
    let allTrackNames = document.querySelectorAll(
      ".sequencer__display__track__name"
    );
    [].forEach.call(allTrackNames, (trackNameDiv) => {
      let trackName = trackNameDiv.innerText;
      if (trackName === oldPadName) {
        let track = trackNameDiv.parentNode;
        console.log("attempting to remove... ", track);
        removeItemFromTrackEffectInfoHash(trackName);
        track.parentElement.removeChild(track);
      }
    });
  }
  //add new track newTrack {trackName: trackBuffer}
  transformPadToTrack(newTrack, oldPad, oldPadObject);
}

function transformPadToTrack(padInfo, oldPad, oldPadObject) {
  console.log("tPTT args", padInfo, oldPad, oldPadObject);
  //get trackName from padInfo
  //padInfo {trackName: trackBuffer, colorIndex}
  let allTracks = document.querySelectorAll(".sequencer__display__track");
  let trackName = Object.keys(padInfo)[0];
  console.log("keys tN", trackName, padInfo);
  let newTrackDiv = document.createElement("div");
  newTrackDiv.className = `sequencer__display__track`;

  // sequencer effect button to display panel setup

  let displayEffectsButton = document.createElement("button");
  displayEffectsButton.innerText = "\u21b3"; //unicode for down-right arrow
  displayEffectsButton.className = "sequencer__display__track__show-effects";
  newTrackDiv.append(displayEffectsButton);

  // sequencer panel setup

  // name track

  let nameOfTrack = document.createElement("span");
  nameOfTrack.innerText = trackName;
  nameOfTrack.className = "sequencer__display__track__name";
  newTrackDiv.append(nameOfTrack);

  //push info of pad into memory if not replacing old track
  if (oldPad === undefined) {
    console.log(padInfo);
    trackObject[Object.keys(padInfo)] = padInfo[trackName];
    console.log(trackObject);
    //cycle background colors
    newTrackDiv.style.background = trackBackgroundColors[`${trackNumber++}`];
  } else {
    //take background color of track being replaced]
    console.log(oldPadObject.colorIndex, trackBackgroundColors);
    padInfo[trackName].colorIndex = oldPadObject.colorIndex;
    newTrackDiv.style.background =
      trackBackgroundColors[oldPadObject.colorIndex];

    displayEffectsButton.addEventListener("click", (event) => {
      let effectPanel = event.target.parentNode.nextSibling;

      effectPanel.classList.toggle("hide");
      effectPanel.classList.toggle("effect-panel-dropdown");
    });
  }

  //create 16 buttons on a track, unique id for each
  for (let i = 0; i < 16; i++) {
    let button = document.createElement("button");
    button.className = "sequencer__display__track__button";
    button.id = `${trackName}__${i}`;

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

  if (oldPad !== undefined) {
    allTracks[oldPadObject.colorIndex].parentNode.insertBefore(
      newTrackDiv,
      allTracks[oldPadObject.colorIndex]
    );
    createEffectPanel(newTrackDiv, trackName);
  } else {
    sequencerDisplay.append(newTrackDiv);
    console.log(trackName);
    createEffectPanel(newTrackDiv, trackName, padInfo.colorIndex);
  }
}

export { trackObject };
