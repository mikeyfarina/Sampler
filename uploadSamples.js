import {drumPads, uploadButton, context, fileInput,} from "./constants.js";
import {makeSource} from "./setupPads.js";
import loadAllUrls from "./BufferLoader.js"
//upload file
// User selects file, read it as an ArrayBuffer
// and pass to the API.

uploadButton.addEventListener("mousedown", e => {
  //when upload button is clicked
  let parentPad = e.target.parentNode;
  let parentInput = parentPad.querySelector(".audio-file");
  console.log("uploading", e, "e.target.parentNode", parentPad);
  e.stopPropagation();
  parentInput.addEventListener("change", (ev) => {
    uploadFile(ev).then((buffer)=>{
      loadSoundToPad(buffer, parentPad);
    });
  });
});

export function uploadFile(event){
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
        console.log("file",reader.result,"name", target.files[0].name);
        buffer.name = /[^\s]+/.exec(target.files[0].name);
        resolve(buffer);
      },
      (error)=>{
        reject(error);
      });
    }
  });
}

function loadSoundToPad(sample, parent){
  console.log("lSTP buffer:",sample," parent:", parent);
  let addSampleToParentPad = ()=>{
    console.log("playing", sample);
    let sampleSource = makeSource(sample);
    sampleSource.source.start(0);
  }
  //make pad play sound on click
  parent.addEventListener("mousedown", addSampleToParentPad);

  //
  parent.querySelector(".audio-file").addEventListener("change", ()=>{
    console.log("removed event listener");
    parent.removeEventListener("mousedown", addSampleToParentPad);
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
