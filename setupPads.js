import { drumPads, context, fileInputs } from "./constants.js";
import { uploadFile } from "./uploadSamples.js";
let source;

export function assignSoundsToPads(bufferList) {
  console.log("aSTP bufferList", bufferList);

  for (let i = 0; i < bufferList.length; i++) {
    console.log("assigning", bufferList[i].name + " to pad " + i);

    makeLabel(drumPads[i], bufferList[i].name);

    let makeSourceFromBufferAndPlay = (e) => {
      //stop propagation to prevent sample from playing twice on mobile
      e.stopPropagation();
      e.preventDefault();
      let bufferSource = makeSource(bufferList[i]);
      console.log("playing", bufferSource);
      bufferSource.source.start(0);
    };

    drumPads[i].addEventListener("mousedown", makeSourceFromBufferAndPlay);
    drumPads[i].addEventListener("touchstart", makeSourceFromBufferAndPlay);
    //chage to i, after adding all buttons
    fileInputs[i].addEventListener(
      "change",
      () => {
        console.log("removed default sample from pad");
        drumPads[i].removeEventListener(
          "mousedown",
          makeSourceFromBufferAndPlay
        );
        drumPads[i].removeEventListener(
          "touchstart",
          makeSourceFromBufferAndPlay
        );
      },
      { once: true }
    );
  }
}

export function makeSource(buffer) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  return { source: source };
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

function makeLabel(drumPad, name) {
  let label = drumPad.querySelector("p.drum-machine__pads__label");
  label.innerText = name;
}
