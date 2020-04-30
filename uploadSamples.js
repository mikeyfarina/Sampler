import {drumPads, uploadButton, context, fileInput} from "./constants.js";
import {playSound} from "./setupPads.js";
import loadAllUrls from "./BufferLoader.js"
//upload file
// User selects file, read it as an ArrayBuffer
// and pass to the API.

uploadButton.addEventListener("mousedown", e => {
  let parentPad = e.target.parentNode.parentNode
  console.log("uploading", e, "e.target.parentNode", parentPad);
  e.stopPropagation();
  fileInput.addEventListener("change", (event) =>{
    readFile(event).then(buffer => {
      loadSoundToPad(buffer, parentPad);
    });
  });
});

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
        buffer.name = target.files[0].name;
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
  parent.addEventListener("mousedown", ()=>{
    playSound(sample);
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
