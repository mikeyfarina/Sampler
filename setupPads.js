import {
  drumPads,
  context,
  fileInputs,
  letterKeyCodes,
  screenTitle,
  screenSubtitle,
} from "./constants.js";

let source;
let loadedPadsWithSamples = {};

export function assignSoundsToPads(bufferList) {
  for (let i = 0; i < bufferList.length; i++) {
    console.log("assigning", bufferList[i].name + " to pad " + i);
    bufferList[i].colorIndex = i;

    makeLabel(drumPads[i], bufferList[i].name);

    let makeSourceFromBufferAndPlay = (e) => {
      updateScreen(bufferList[i]);

      //stop propagation to prevent sample from playing twice on mobile
      e.stopPropagation();
      e.preventDefault();

      let bufferSource = makeSource(bufferList[i]);
      bufferSource.source.start(0);
    };
    let makeSourceFromBufferAndPlayFromKeys = (e) => {
      screenTitle.innerText = "";
      //stop propagation to prevent sample from playing twice on mobile
      e.stopPropagation();
      e.preventDefault();

      if (e.keyCode === letterKeyCodes[i]) {
        updateScreen(bufferList[i]);
        console.log(
          "playing from keys",
          drumPads[i],
          e,
          e.keyCode,
          letterKeyCodes[i]
        );

        drumPads[i].classList.add("button-active");

        document.addEventListener("keyup", (e) => {
          if (e.keyCode === letterKeyCodes[i]) {
            drumPads[i].classList.toggle("button-active");
          }
        });

        let bufferSource = makeSource(bufferList[i]);
        bufferSource.source.start(0);
      }
      //fix "stuck" pads when multiple keys are pressed at once
      setTimeout(() => {
        if (drumPads[i].classList.contains("button-active")) {
          drumPads[i].classList.toggle("button-active");
        }
      }, 150);
    };
    drumPads[i].addEventListener("mousedown", makeSourceFromBufferAndPlay);
    drumPads[i].addEventListener("touchstart", makeSourceFromBufferAndPlay);
    document.addEventListener("keydown", makeSourceFromBufferAndPlayFromKeys);
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
        document.removeEventListener(
          "keydown",
          makeSourceFromBufferAndPlayFromKeys
        );
      },
      { once: true }
    );

    //create an object consisting of the html pad element
    //and the name of the buffer loaded onto the pad
    createObjectWithPadInfo(bufferList[i]);
  }
  return loadedPadsWithSamples;
}

export function makeSource(buffer) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  return { source };
}

function makeLabel(drumPad, name) {
  let label = drumPad.querySelector("p.drum-machine__pads__label");
  label.innerText = name;
}

export function updateScreen(buffer) {
  screenTitle.innerText = "";
  screenTitle.textContent = "";

  screenSubtitle.innerText = "";

  let div = document.createElement("div");
  div.innerText = `playing ${buffer.name}`;
  screenTitle.appendChild(div);

  setTimeout(() => {
    div.innerText = "";
  }, 2000);
}

function createObjectWithPadInfo(buffer) {
  loadedPadsWithSamples[buffer.name] = buffer;
}
