import {
  screenSubtitle,
  uploadButtons,
  context,
  letterKeyCodes,
  drumPads,
  screenTitle,
} from "./constants.js";
import { makeSource, updateScreen } from "./setupPads.js";
import { replaceTrack } from "./setupSeqTracks.js";

//upload file
// User selects file, read it as an ArrayBuffer
// and pass to the API.
export function setupUploadButtons(hash) {
  console.log("setupUploadButtons", hash);

  [].forEach.call(uploadButtons, (el) => {
    //when upload button is clicked
    let touched;
    el.addEventListener("mousedown", (ev) => {
      ev.stopPropagation();
      if (touched) {
        return;
      }
      screenTitle.innerText = "Upload in progress";
      screenSubtitle.innerText = "Select an audio file";
      configFileChange(ev);
    });
    el.addEventListener("touchstart", (ev) => {
      ev.stopPropagation();
      touched = true;
      screenTitle.innerText = "Upload in progress";
      screenSubtitle.innerText = "Select an audio file";
      configFileChange(ev);
    });
  });
}

function configFileChange(ev) {
  let parentPad = ev.target.parentNode;
  let parentInput = parentPad.querySelector(".audio-file");

  console.log("pp", parentPad, "pi", parentInput);

  parentInput.addEventListener(
    "change",
    (event) => {
      console.log("Added listener to input");
      uploadFile(event, parentPad, parentInput);
    },
    { once: true }
  );
}

function uploadFile(event, parentPad, parentInput) {
  readFile(event).then((buffer) => {
    let bufferName = buffer.name;
    let newPad = {};
    newPad[bufferName] = buffer;
    console.log(newPad);
    replaceTrack(newPad, parentPad);
    loadSoundToPad(buffer, parentPad, parentInput);
    //label
    parentPad.querySelector(
      "p.drum-machine__pads__label"
    ).innerText = bufferName;
  });
}

function readFile({ target }) {
  return new Promise((resolve, reject) => {
    //pass file into blob
    let fileData = new Blob([target.files[0]]);
    let reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = function () {
      context.decodeAudioData(
        reader.result,
        (buffer) => {
          buffer.name = /([.\S]+)[.]/.exec(target.files[0].name)[1];
          resolve(buffer);
        },
        (error) => {
          reject(error);
        }
      );
    };
  });
}

function loadSoundToPad(sample, parentPad, parentInput) {
  console.log(
    "loading " + sample.name + " to ",
    parentPad.querySelector("p").innerText,
    parentPad.parentNode.parentNode
  );

  let i = 0;
  let padIndex;

  [].forEach.call(drumPads, (pad) => {
    if (pad.querySelector("p") === parentPad.querySelector("p")) {
      padIndex = i;
    }
    i++;
  });
  console.log(padIndex);

  let oldPad = drumPads[padIndex];
  let addSampleToParentPad = (e) => {
    //stop propagation to prevent sample from playing twice on mobile
    e.stopPropagation();
    e.preventDefault();

    updateScreen(sample);
    let sampleSource = makeSource(sample);
    sampleSource.source.start(0);
  };

  let addSampleToParentPadWithKeyPress = (e) => {
    //stop propagation to prevent sample from playing twice on mobile
    e.stopPropagation();
    e.preventDefault();
    if (e.keyCode === letterKeyCodes[padIndex]) {
      updateScreen(sample);
      let sampleSource = makeSource(sample);
      sampleSource.source.start(0);

      oldPad.classList.add("button-active");

      document.addEventListener("keyup", () => {
        if (e.keyCode === letterKeyCodes[i]) {
          oldPad.classList.toggle("button-active");
        }
      });
    }
    //fix "stuck" pads when multiple keys are pressed at once
    setTimeout(() => {
      if (oldPad.classList.contains("button-active")) {
        oldPad.classList.toggle("button-active");
      }
    }, 150);
  };
  //make pad play sound on click
  parentPad.addEventListener("mousedown", addSampleToParentPad);
  parentPad.addEventListener("touchstart", addSampleToParentPad);
  document.addEventListener("keydown", addSampleToParentPadWithKeyPress);
  //remove event listener if file is changed
  parentInput.addEventListener("change", () => {
    parentPad.removeEventListener("mousedown", addSampleToParentPad);
    parentPad.removeEventListener("touchstart", addSampleToParentPad);
    document.removeEventListener("keydown", addSampleToParentPadWithKeyPress);
  });

  screenTitle.innerText = "ready to play";
  screenSubtitle.innerText = "uploaded " + sample.name;
}

//drag and drop
//event listeners for drag and drop
/*
[].forEach.call(drumPads, (pad) =>{
  //file dragged into space
  pad.addEventListener('dragenter', handlerFunction, false);
  //file dragged out of space
  pad.addEventListener('dragleave', handlerFunction, false);
  //file held over space pings every couple hundred ms
  pad.addEventListener('dragover', handlerFunction, false);
  //file dropped
  pad.addEventListener('drop', handlerFunction, false);
});
*/
