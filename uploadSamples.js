import {drumPads, uploadButtons, context, fileInputs} from "./constants.js";
import {makeSource} from "./setupPads.js";

//upload file
// User selects file, read it as an ArrayBuffer
// and pass to the API.

export function setupUploadButtons(){
  [].forEach.call(uploadButtons, (el)=>{
    el.addEventListener("mousedown", (ev) => {
      //when upload button is clicked
      let parentPad = ev.target.parentNode;
      let parentInput = parentPad.querySelector(".audio-file");

      ev.stopPropagation();
      parentInput.addEventListener("change", (ev) => {
        uploadFile(ev).then((buffer)=>{
          console.log("loading " +  buffer.name + " to pad");
          loadSoundToPad(buffer, parentPad, parentInput);
          parentPad.querySelector("p.drum-machine__pads__label").innerText = buffer.name;
        });
      }, {once: true});
    });
  });
}

function uploadFile(event){
  return new Promise((resolve)=>{
    readFile(event).then(buffer => {
      resolve(buffer);
    });
  });
}

function readFile({target}) {
  return new Promise((resolve, reject)=>{
    //pass file into blob
    let fileData = new Blob([target.files[0]]);
    let reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = function(){
      context.decodeAudioData(reader.result,
      (buffer)=>{
        buffer.name = /([.\S]+)[.]/.exec(target.files[0].name)[1];
        resolve(buffer);
      },
      (error)=>{
        reject(error);
      });
    }
  });
}

function loadSoundToPad(sample, parentPad, parentInput){
  console.log("lSTP buffer:",sample," parent:", parentPad);
  let addSampleToParentPad = ()=>{
    console.log("playing", sample.name);
    let sampleSource = makeSource(sample);
    sampleSource.source.start(0);
  }
  //make pad play sound on click
  parentPad.addEventListener("mousedown", addSampleToParentPad);
  //
  parentInput.addEventListener("change", ()=>{
    parentPad.removeEventListener("mousedown", addSampleToParentPad);
  })
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
