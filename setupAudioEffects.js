import { trackObject } from "./setupSeqTracks.js";
import { context, reverbsToLoad } from "./constants.js";
import loadAllUrls from "./BufferLoader.js";
import { loadedReverbs } from "./setup.js";

let openEffectPanelButtons = [];
let reverbDiv = document.createElement("select");

export function configAudioEffects() {
  //get all open panel buttons
  openEffectPanelButtons = document.querySelectorAll(
    ".sequencer__display__track__show-effects"
  );
  console.log("openEffectPanelButtons", openEffectPanelButtons);
  //have clicking button open panel that has many effects for audio
  [].forEach.call(openEffectPanelButtons, (button) => {
    button.addEventListener("click", (ev) => {
      console.log("clicked");

      //display panel
      displayEffectPanel(ev);
    });
  });
}

export function loadReverbPresets(reverbArray) {
  return new Promise((resolve) => {
    loadAllUrls(reverbArray).then((loadedReverbs) => {
      for (let i = 0; i < loadedReverbs.length; i++) {
        let name = reverbArray[i].split('/').pop()
          .replace('.wav', '').split(".")[0];
        loadedReverbs[i].name = name;
      }
      resolve(loadedReverbs);
    });
  });
}
//displays effect panel or hides panel if displayed
function displayEffectPanel(event) {
  let effectPanel = event.target.parentNode.nextSibling;

  if (effectPanel.style.display === "none") {
    effectPanel.style.display = "flex";
  } else {
    effectPanel.style.display = "none";
  }
}

//create panel with multiple audio effects
// to manipulate played samples
export function createEffectPanel(track) {
  console.log("cEP trackDiv", track);

  let trackName = track.querySelector("span").innerText;
  let trackInfo = trackObject.find((o) => o.trackName === trackName);

  console.log("loading effects for: ", trackInfo, track);
  let panel = document.createElement("div");
  panel.className = "sequencer__display__track__effects-panel";

  let effectDiv = document.createElement("div");
  effectDiv.className = "sequencer__display__track__effects-panel__controls";
  console.log(track.style.background);
  effectDiv.style.background = track.style.background;

  //start with loading sample to play with button to test effects
  let effectTestButton = document.createElement("button");
  effectTestButton.className = "effects-panel__controls__test-button";
  effectTestButton.innerText = "test";

  //create a pitch shifter and a user input to decide semitones
  let pitchControl = document.createElement("div");
  pitchControl.className = "effects-panel__controls__pitch";

  let pitchInput = document.createElement("input");
  pitchInput.className = "effects-panel__controls__pitch__input";

  let pitchInfo = document.createElement("span");
  let semitones = 0;

  pitchInput.type = "range";
  pitchInput.min = "-12";
  pitchInput.max = "12";
  pitchInput.value = "0";

  pitchInfo.innerText = `pitch: ${pitchInput.value}`;

  pitchInput.addEventListener("input", () => {
    semitones = pitchInput.value; // -12 -> 12 in semitones
    pitchInfo.innerText = `pitch: ${semitones}`;
  });

  //append pitchinfo and input to pitch div
  pitchControl.append(pitchInfo);
  pitchControl.append(pitchInput);

  //create a gain node and a user input to control the volume
  let volumeControl = document.createElement("div");
  volumeControl.className = "effects-panel__controls__gain";

  let volumeInput = document.createElement("input");
  volumeInput.className = "effects-panel__controls__gain__input";

  volumeInput.type = "range";
  volumeInput.value = "1";
  volumeInput.min = "0";
  volumeInput.max = "3";
  volumeInput.step = "0.1";

  let volume = 1;

  volumeInput.addEventListener("input", () => {
    volume = volumeInput.value;
  });

  let volumeInfo = document.createElement("span");
  volumeInfo.innerText = `Volume: `;

  //attach volume info and input to div
  volumeControl.append(volumeInfo);
  volumeControl.append(volumeInput);

  //create pan effect and user input to decide direction
  let panControl = document.createElement("div");
  panControl.className = "effects-panel__controls__pan";

  let panValue = 0;
  let panInput = document.createElement("input");
  panInput.className = "effects-panel__controls__pan__input";
  panInput.type = "range";
  panInput.value = "0";
  panInput.min = "-1";
  panInput.max = "1";
  panInput.step = "0.1";

  let panInfo = document.createElement("span");
  panInfo.innerText = `Panning: ${(panValue < 0) ? "L " + panValue : "R " + panValue}`

  panInput.addEventListener("input", () => {
    panValue = panInput.value;
    panInfo.innerText = `Panning: ${(panValue < 0) ? "L " + panValue : "R " + panValue}`
  });

  panControl.append(panInfo);
  panControl.append(panInput);

  //create filter effect and 
  // allow user input for multiple factors of the filter
  // type, freq
  let filterControl = document.createElement("div");
  filterControl.className = "effects-panel__controls__filter";

  let filterInfo = document.createElement("span");
  filterInfo.innerText = "filter";
  filterInfo.className = "effects-panel__controls__filter__info";

  //create a select option for each type of filter
  let optionsArray = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass"];
  let filterOptions = document.createElement("select");
  filterOptions.className = "effects-panel__controls__filter__select";
  let chosenFilter = "allpass";

  //append each option to the select
  for (let i = 0; i < optionsArray.length; i++) {
    let option = document.createElement("option");
    option.value = optionsArray[i];
    option.text = optionsArray[i];
    filterOptions.appendChild(option);
  }
  //update chosenFilter whenever option is changed
  filterOptions.addEventListener("change", () => {
    console.log(
      "seleect changed to: ",
      filterOptions[filterOptions.selectedIndex].value
    );
    chosenFilter = filterOptions[filterOptions.selectedIndex].value;
    filterObject.type = chosenFilter;
  });

  //create a slider for frequency of the filter
  let filterFreq = 0;
  let filterFreqInput = document.createElement("input");
  filterFreqInput.type = "range";
  filterFreqInput.value = "0";
  filterFreqInput.min = "50";
  filterFreqInput.max = "2500";
  filterFreqInput.step = "1";

  filterFreqInput.className = "effects-panel__controls__filter__input";

  let filterFreqInfo = document.createElement("span");
  filterFreqInfo.innerText = "Freq. " + filterFreq;

  filterFreqInput.addEventListener("input", () => {
    filterFreq = filterFreqInput.value;
    filterFreqInfo.innerText = `Freq. ${filterFreq}`;
    filterObject.freq = filterFreq;
  });

  filterControl.append(filterInfo);
  filterControl.append(filterOptions);

  filterControl.append(filterFreqInfo);
  filterControl.append(filterFreqInput);

  let filterObject = {
    type: chosenFilter,
    freq: filterFreq
  }

  //create delay effect and user input for selecting time
  let delayControl = document.createElement("div");
  delayControl.className = "effects-panel__controls__delay";

  let delayInfo = document.createElement("span");
  delayInfo.className = "effects-panel__controls__delay__info";
  delayInfo.innerText = "delay ";

  let delayObject = { time: 0, feedback: 0 };

  //create a select option for each type of delay
  let delayArray = ["off", "1/2", "1/4", "1/8", "1/16", "1/32"];
  let delayOptions = document.createElement("select");
  delayOptions.className = "effects-panel__controls__delay__select";
  //append each option to the select
  for (let i = 0; i < delayArray.length; i++) {
    let option = document.createElement("option");
    option.text = delayArray[i];
    delayOptions.appendChild(option);
  }

  let delayTimeValue;

  //create delay feedback slider for user input
  let delayFeedbackInfo = document.createElement("span");
  delayFeedbackInfo.innerText = "feedback: 0.00";
  let delayFeedbackInput = document.createElement("input");
  let feedbackValue = 0.00;
  delayFeedbackInput.type = "range";
  delayFeedbackInput.value = "0";
  delayFeedbackInput.min = "0";
  delayFeedbackInput.max = "0.85";
  delayFeedbackInput.step = ".01";

  delayFeedbackInput.addEventListener("input", () => {
    feedbackValue = delayFeedbackInput.value;
    delayFeedbackInfo.innerText = `feedback: ${feedbackValue}`;
    delayObject.feedback = feedbackValue;
    console.log("feedback dO", delayObject);
  });

  //update chosenFilter whenever option is changed
  delayOptions.addEventListener("change", () => {
    console.log(
      "delay changed to: ",
      delayOptions[delayOptions.selectedIndex]
    );
    delayTimeValue = delayOptions[delayOptions.selectedIndex].text;
    console.log("dti", typeof delayTimeValue);
    delayObject.time = getBPMForDelay(delayTimeValue);
    console.log("options dO", delayObject);
  });

  //get value of selection, compute time value of beat to set delay

  delayControl.append(delayInfo);
  delayControl.append(delayOptions);
  delayControl.append(delayFeedbackInfo);
  delayControl.append(delayFeedbackInput);

  //create reverb section
  let reverbControl = document.createElement("div");
  reverbControl.className = "effects-panel__controls__reverb";
  let reverbInfo = document.createElement("span");
  reverbInfo.className = "effects-panel__controls__reverb__info";
  reverbInfo.innerText = "reverb";

  let reverbObject = {
    reverbBuffer: null,
    feedback: 0,
    reverbSource: null,
    wetValue: null,
  };

  //wet = effected (reverbed) audio
  let wetInfo = document.createElement("span");
  wetInfo.innerText = `wet: 1`;
  let wetInput = document.createElement("input");
  let wetValue = 0.00;
  wetInput.type = "range";
  wetInput.value = "1";
  wetInput.min = "0";
  wetInput.max = "3";
  wetInput.step = ".01";

  wetInput.addEventListener("input", () => {
    wetValue = wetInput.value;
    wetInfo.innerText = `wet: ${wetValue}`;
    reverbObject.wetValue = wetValue;
    console.log("wet rO", reverbObject);
  });

  let reverbSelect = document.createElement("select");
  reverbSelect.className = "effects-panel__controls__reverb__select";

  let offOption = document.createElement("option");
  offOption.text = "off";
  reverbSelect.append(offOption);

  console.log("ra", loadedReverbs);
  //create options for reverb
  for (let i = 0; i < loadedReverbs.length; i++) {
    //create reverb selection options
    let reverbOption = document.createElement("option");
    reverbOption.text = loadedReverbs[i].name;
    reverbOption.id = loadedReverbs[i].name;
    reverbSelect.append(reverbOption);
  }

  //get buffer of selected reverb to send to effects chain
  reverbSelect.addEventListener("change", () => {
    if (reverbSelect.selectedIndex === 0) {
      reverbObject.reverbBuffer = null;
      return;
    }
    let reverbSelection = reverbSelect[reverbSelect.selectedIndex];
    console.log("reverbSelection", reverbSelection);
    let rBuffer = loadedReverbs.find((reverb) => reverb.name === reverbSelection.text);
    reverbObject.reverbBuffer = rBuffer;
  });

  //append all reverb sections
  reverbControl.append(reverbInfo);
  reverbControl.append(reverbSelect);
  reverbControl.append(wetInfo);
  reverbControl.append(wetInput);



  //set up test button to combine all effects
  effectTestButton.addEventListener("click", () => {
    let source = context.createBufferSource();
    source.buffer = trackInfo.trackBuffer;

    //create reverbSource
    reverbObject.reverbSource = context.createBufferSource();
    reverbObject.reverbSource.buffer = trackInfo.trackBuffer;
    //connect source to effects
    let testEffectedSource = connectSourceToEffects(source, semitones, volume, panValue, filterObject, delayObject, reverbObject);

    console.log("tES", testEffectedSource);
    let eBuffer = testEffectedSource.source;
    let reverb = testEffectedSource.reverbObj.reverbSource;
    console.log("buffer", eBuffer);
    eBuffer.start(0);
    if (reverb.reverbBuffer) {
      reverb.start(0)
    }
  });

  let emptyDiv = document.createElement("div");
  //add effects to panel
  effectDiv.append(effectTestButton);
  effectDiv.append(volumeControl);
  effectDiv.append(panControl);
  effectDiv.append(pitchControl);
  effectDiv.append(emptyDiv);
  effectDiv.append(filterControl);
  effectDiv.append(delayControl);
  effectDiv.append(reverbControl);

  panel.append(effectDiv);
  //attach effect panel to track
  track.parentNode.insertBefore(panel, track.nextSibling);
}

//it will need to take the buffer from each track and add effects
function connectSourceToEffects(source, semitones, volume, panValue, filter, delayObj, reverbObj) {
  console.log("delay", delayObj)
  //create pan node and set value
  let panNode = context.createStereoPanner();
  panNode.pan.value = panValue;

  //create filter and set
  let filterNode = context.createBiquadFilter();
  filterNode.type = filter.type;
  filterNode.frequency.value = filter.freq;
  console.log(filter, filterNode);

  //create delay and set value
  let delay = context.createDelay();
  let feedback = context.createGain();
  delay.delayTime.value = delayObj.time;
  feedback.gain.value = eval(delayObj.feedback);

  //create reverb node and set values 
  console.log(reverbObj);
  let reverb = context.createConvolver();
  reverb.buffer = reverbObj.reverbBuffer;
  let wetVolume = context.createGain();
  wetVolume.gain.value = reverbObj.wetValue;

  //create gainNode and set value
  let gainNode = context.createGain();
  gainNode.gain.value = volume;

  //detune sample accordingly before connecting other effects
  source.detune.value = semitones * 100; //100 cents
  reverbObj.reverbSource.detune.value = semitones * 100;

  //set up delay looper
  source.connect(delay).connect(feedback).connect(delay);
  feedback.connect(context.destination);

  //if reverb is selected, 
  if (reverbObj.reverbBuffer) {
    //connect wet reverbed buffer to output 
    reverbObj.reverbSource.connect(wetVolume);
    wetVolume.connect(panNode);
    panNode.connect(filterNode)
    filterNode.connect(reverb);
    reverb.connect(gainNode)
    gainNode.connect(context.destination);

    //reverbObj.reverbSource.start(0);
  }

  // source -> pan -> filter -> gain -> output
  source.connect(panNode);
  panNode.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(context.destination);

  //create object with source effected buffer and reverb buffer to be played together
  let effectedBufferObj = {
    source,
    reverbObj
  }
  //return source later so that it plays in the sequencer
  return effectedBufferObj;
}

function getBPMForDelay(timeSig) {
  if (timeSig === "off") {
    return 0;
  }
  let tempo = document.getElementById("tempo").value;
  let secondsPerBeat = 60.0 / tempo;

  console.log("BPM", eval(timeSig), secondsPerBeat * eval(timeSig));
  return secondsPerBeat * eval(timeSig);

}

function createReverbOptions(reverbArray) {
  for (let i = 0; i < reverbArray.length; i++) {
    console.log("reverb", reverbArray);
    let offOption = document.createElement("option");
    offOption.text = "off";
    reverbSelect.append(offOption);
    //create reverb selection options
    let reverbOption = document.createElement("option");
    reverbOption.text = reverbArray[i].name;
    reverbOption.id = reverbArray[i].name;
    reverbSelect.append(reverbOption);
  }
}