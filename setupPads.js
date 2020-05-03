import {drumPads, context, fileInput, uploadButton} from "./constants.js";
import {uploadFile} from "./uploadSamples.js";
let source;
export function assignSoundsToPads(bufferList) {
  console.log("aSTP bufferList", bufferList);

  for (let i = 0; i < bufferList.length; i++) {
    console.log('assigning... ', bufferList[i] + " to " + i);

    makeLabel(drumPads[i], bufferList[i].name);

    let makeSourceFromBufferAndPlay = () => {
      let bufferSource = makeSource(bufferList[i]);
      bufferSource.source.start(0);
    };

    drumPads[i].addEventListener("mousedown", makeSourceFromBufferAndPlay);

              //chage to i, after adding all buttons
    fileInput[0].addEventListener("change", ()=>{
      drumPads[0].removeEventListener("mousedown", makeSourceFromBufferAndPlay);
    })
  }
}
export function makeSource(buffer){
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  return {source: source};
}

/*
export function playSound(sound) {
  let source = context.createBufferSource();
  console.log("playing sound", sound);
  source.buffer = sound;
  source.connect(context.destination);
  source.start(0);
  source.onended = function(){
    console.log("onended,", source.buffer, context.destination);
  }
}
*/
function makeLabel(drumPad, name){
  let label = drumPad.querySelector("p.drum-machine__pads__label");
  label.innerText = name;
}
