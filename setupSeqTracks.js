import { trackBackgroundColors } from "./constants.js";
import { createEffectPanel } from "./setupAudioEffects.js";

let sequencerDisplay = document.querySelector(".sequencer__display");
let trackObject = [];
let trackNumber = 0;

export function replaceTrack(newTrack, oldPad) {
  console.log("replacing/creating track", newTrack, oldPad);
  //if theres an old track remove it
  let hashedTrack = undefined;
  let oldPadObject = undefined;
  if (oldPad !== undefined) {
    console.log("oldpad exists", trackObject);
    hashedTrack = {};
    hashedTrack[newTrack.trackName] = newTrack.trackBuffer;
    console.log("hashed newtrack", hashedTrack);
    //select old track
    let oldPadName = oldPad.querySelector("p.drum-machine__pads__label")
      .innerText;
    oldPadObject = trackObject.find((o) => {
      if (Object.keys(o)[0] === oldPadName) return o;
    });
    let oldPadIndex = trackObject.indexOf(oldPadObject);
    oldPadObject.index = oldPadIndex;

    console.log("old info", oldPadName, oldPadObject, oldPadIndex);

    console.log("upload", trackObject, oldPadIndex);
    if (oldPadObject) {
      trackObject.splice(oldPadIndex, 1, hashedTrack);
    }

    console.log("pushing newTrack", hashedTrack, trackObject);

    let allTrackNames = document.querySelectorAll(
      ".sequencer__display__track__name"
    );

    //find old track and remove it
    [].forEach.call(allTrackNames, (trackName) => {
      console.log(trackName);
      if (trackName.innerText === oldPadName) {
        let track = trackName.parentNode;
        console.log("attempting to remove... ", track);
        track.parentElement.removeChild(track);
      }
    });
  }
  //add new track newTrack {trackName, trackBuffer}
  console.log(oldPadObject);
  transformPadToTrack(newTrack, oldPad, hashedTrack, oldPadObject);
}

function transformPadToTrack(padInfo, oldPad, hashedTrack, oldPadObject) {
  console.log("tPTT args", padInfo, oldPad, hashedTrack, oldPadObject);
  let inNeedOfHash = false;
  //if uploaded new hash track exists
  let trackName;
  if (hashedTrack !== undefined) {
    inNeedOfHash = true;
    console.log("hash tPTT", hashedTrack);
    trackName = Object.keys(hashedTrack)[0];
  } else {
    //create a track div
    inNeedOfHash = false;
    console.log("tPTT", padInfo);
    trackName = Object.keys(padInfo)[0];
  }
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
  padName.innerText = trackName;
  padName.className = "sequencer__display__track__name";
  newTrackDiv.append(padName);

  let padIndex = trackObject.indexOf(
    trackObject.find((o) => o.trackName === padInfo.trackName)
  );

  //push info of pad into memory if not replacing old track
  if (oldPad === undefined) {
    trackObject.push(padInfo);

    //cycle background colors
    newTrackDiv.style.background = trackBackgroundColors[`${trackNumber++}`];
  } else {
    newTrackDiv.style.background = trackBackgroundColors[oldPadObject.index];

    displayEffectsButton.addEventListener("click", (event) => {
      console.log("new clicked");
      let effectPanel = event.target.parentNode.nextSibling;

      effectPanel.classList.toggle("hide");
      effectPanel.classList.toggle("effect-panel-dropdown");
    });
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
  createEffectPanel(newTrackDiv, trackName, inNeedOfHash);
}

export { trackObject };
