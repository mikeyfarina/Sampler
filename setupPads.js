import {drumPads, context} from "./constants.js";

export function assignSoundsToPads(bufferList) {
  console.log("aSTP bufferList", bufferList);
  for (let i = 0; i < bufferList.length; i++) {
    console.log('assigning... ', bufferList[i] + " to " + i);

    makeLabel(drumPads[i], bufferList[i].name);

    let sound = context.createBufferSource();
    sound.buffer = bufferList[i];
    drumPads[i].addEventListener("mousedown", function(e) {
      playSound(sound);
    });
  }
}

function playSound(sound) {
  console.log("playing sound", sound);
  let source = context.createBufferSource();
  source.buffer = sound.buffer;
  source.connect(context.destination);
  source.start(0);
}

function makeLabel(drumPad, name){
  let label = drumPad.querySelector("p.drum-machine__pads__label");
  label.innerText = name;
}
