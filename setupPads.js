import {drumPads, context} from "./constants.js";
export function assignSoundsToPads(bufferList) {
  console.log("aSTP bufferList", bufferList);
  for (let i = 0; i < bufferList.length; i++) {
    console.log('assigning... ', bufferList[i] + " to " + i);
    let sound = context.createBufferSource();
    sound.buffer = bufferList[i];
    drumPads[i].addEventListener("click", function() {
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