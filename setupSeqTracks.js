import { trackBackgroundColors } from "./constants.js";

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

    if (oldPadObject) {
      trackObject.splice(oldPadIndex, 1);
    }

    trackObject.push(newTrack);
    console.log("pushing newTrack", newTrack, trackObject, oldPadObject);

    let allTrackNames = document.querySelectorAll(
      ".sequencer__display__track__name"
    );

    //find old track and remove it
    [].forEach.call(allTrackNames, (trackName) => {
      if (trackName.innerText === oldPadName) {
        let track = trackName.parentElement;
        console.log("attempting to remove... ", track);
        track.parentElement.removeChild(track);
      }
    });
  }
  //add new track newTrack {trackName, trackBuffer}
  transformPadToTrack(newTrack);
}

function transformPadToTrack(padInfo) {
  //create a track div
  console.log("tPTT", padInfo);
  let newTrackDiv = document.createElement("div");
  newTrackDiv.className = `sequencer__display__track`;

  let padName = document.createElement("span");
  padName.innerText = padInfo.trackName;
  padName.className = "sequencer__display__track__name";
  newTrackDiv.append(padName);

  trackObject.push(padInfo);

  newTrackDiv.style.background = trackBackgroundColors[`${trackNumber++}`];

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
}

export { trackObject };
