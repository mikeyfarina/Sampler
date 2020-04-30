import {drumPads, context, fileInput} from "./constants.js";

export function assignSoundsToPads(bufferList) {
  console.log("aSTP bufferList", bufferList);
  for (let i = 1; i < bufferList.length; i++) {
    console.log('assigning... ', bufferList[i] + " to " + i);

    makeLabel(drumPads[i], bufferList[i].name);
    drumPads[i].addEventListener("mousedown", () => {
      playSound(bufferList[i]);
    });
  }
}

export function playSound(sound) {
  console.log("playing sound", sound);
  let source = context.createBufferSource();
  source.buffer = sound;
  source.connect(context.destination);
  source.start(0);
}

function makeLabel(drumPad, name){
  let label = drumPad.querySelector("p.drum-machine__pads__label");
  label.innerText = name;
}
