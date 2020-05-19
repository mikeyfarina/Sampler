import { drumPads, uploadButtons, context, fileInputs } from "./constants.js";
import { makeSource } from "./setupPads.js";

//upload file
// User selects file, read it as an ArrayBuffer
// and pass to the API.
let touched;
export function setupUploadButtons() {
  console.log("setupUploadButtons");

  [].forEach.call(uploadButtons, (el) => {
    //when upload button is clicked
    let touched;
    el.addEventListener("mousedown", (ev) => {
      ev.stopPropagation();
      if (!touched) {
        console.log("clicked upload button");
        configFileChange(ev);
      }
    });
    el.addEventListener("touchstart", (ev) => {
      ev.stopPropagation();
      touched = true;
      console.log("touched upload button");
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
      uploadFile(event, parentPad, parentInput, ev);
    },
    { once: true }
  );
}

function uploadFile(event, parentPad, parentInput, ev) {
  readFile(event).then((buffer) => {
    loadSoundToPad(buffer, parentPad, parentInput);

    //label
    parentPad.querySelector("p.drum-machine__pads__label").innerText =
      buffer.name;
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
  console.log("loading " + sample.name + " to ", parentPad);

  let addSampleToParentPad = (e) => {
    //stop propagation to prevent sample from playing twice on mobile
    e.stopPropagation();
    e.preventDefault();
    console.log("playing", sample.name);
    let sampleSource = makeSource(sample);
    sampleSource.source.start(0);
  };
  //make pad play sound on click
  parentPad.addEventListener("mousedown", addSampleToParentPad);
  parentPad.addEventListener("touchstart", addSampleToParentPad);
  //remove event listener if file is changed
  parentInput.addEventListener("change", () => {
    parentPad.removeEventListener("mousedown", addSampleToParentPad);
    parentPad.removeEventListener("touchstart", addSampleToParentPad);
  });
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
