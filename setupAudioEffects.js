import { trackObject } from "./setupSeqTracks.js";
import { context, sequencerDisplay } from "./constants.js";
import { loadedReverbs } from "./setup.js";
import { addToTrackEffectInfoHash } from "./hashTable.js";

let openEffectPanelButtons = [];

export function configAudioEffects() {
  //get all open panel buttons
  openEffectPanelButtons = document.querySelectorAll(
    ".sequencer__display__track__show-effects"
  );
  //have clicking button open panel that has many effects for audio
  [].forEach.call(openEffectPanelButtons, (button) => {
    button.addEventListener("click", (ev) => {
      //display panel
      displayEffectPanel(ev);
    });
  });
}

//displays effect panel or hides panel if displayed
export function displayEffectPanel(event) {
  let effectPanelTrack = event.target.parentNode;
  let effectPanel = event.target.parentNode.nextSibling;
  let effectPanelTrackContainerDiv = effectPanelTrack.parentNode;

  let showEffectsButton = effectPanelTrack.querySelector(
    ".sequencer__display__track__show-effects"
  );

  effectPanelTrackContainerDiv.classList.toggle("displaying-track-effect-div");

  effectPanelTrack.classList.toggle("displaying-effect-panel");

  if (
    effectPanelTrack.classList.contains("displaying-effect-panel") &&
    window.innerWidth < 1175
  ) {
    showEffectsButton.innerText = "\u2716"; //bold X
  } else {
    showEffectsButton.innerText = "\u21b3"; // arrow down-right
  }

  effectPanel.classList.toggle("hide");
  effectPanel.classList.toggle("effect-panel-dropdown");
}

//create panel with multiple audio effects
// to manipulate played samples
export function createEffectPanel(track, trackName) {
  let trackInfo = {
    trackBuffer: trackObject[trackName],
    colorIndex: trackObject[trackName].colorIndex,
    semitones: 0,
    volume: 1,
    pan: 0,
    filterType: "allpass",
    filterFreq: 0,
    delayFeedback: 0,
    delayTime: 0,
    reverbWet: 0,
    reverbBuffer: null,
    isBufferEffected: false,
    effectedBuffer: null,
  };
  addToTrackEffectInfoHash(trackName, trackInfo);

  let panel = document.createElement("div");
  panel.className = "sequencer__display__track__effects-panel";
  panel.classList.add("hide");

  let effectDiv = document.createElement("div");
  effectDiv.className = "sequencer__display__track__effects-panel__controls";
  effectDiv.style.background = track.style.background;

  //start with loading sample to play with button to test effects
  let effectTestButton = document.createElement("button");
  effectTestButton.className = "effects-panel__controls__test-button";
  effectTestButton.innerText = "test";

  //make button to reset this tracks effects
  let effectResetButton = document.createElement("button");
  effectResetButton.className = "effects-panel__controls__reset-button";
  effectResetButton.innerText = "reset effects";

  //create a pitch shifter and a user input to decide semitones
  let pitchControl = document.createElement("div");
  pitchControl.className = "effects-panel__controls__pitch";

  let pitchInput = document.createElement("input");
  pitchInput.className = "effects-panel__controls__pitch__input";

  let pitchInfo = document.createElement("span");

  pitchInput.type = "range";
  pitchInput.min = "-12";
  pitchInput.max = "12";
  pitchInput.value = "0";

  pitchInfo.innerText = `pitch: ${pitchInput.value}`;

  pitchInput.addEventListener("input", () => {
    trackInfo.isBufferEffected = true;

    // -12 -> 12 in semitones
    trackInfo.semitones = pitchInput.value;

    pitchInfo.innerText = `pitch: ${pitchInput.value}`;
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
  volumeInput.step = "0.01";

  let volumeInfo = document.createElement("span");
  volumeInfo.innerText = `Volume: 0.00`;

  volumeInput.addEventListener("input", () => {
    trackInfo.isBufferEffected = true;

    trackInfo.volume = volumeInput.value;
    volumeInfo.innerText = `Volume: ${volumeInput.value}`;
  });

  //attach volume info and input to div
  volumeControl.append(volumeInfo);
  volumeControl.append(volumeInput);

  //create pan effect and user input to decide direction
  let panControl = document.createElement("div");
  panControl.className = "effects-panel__controls__pan";

  let panInput = document.createElement("input");
  panInput.className = "effects-panel__controls__pan__input";
  panInput.type = "range";
  panInput.value = "0";
  panInput.min = "-1";
  panInput.max = "1";
  panInput.step = "0.1";

  let panInfo = document.createElement("span");
  panInfo.innerText = `Panning: \n0.0`;

  panInput.addEventListener("input", () => {
    trackInfo.isBufferEffected = true;

    trackInfo.pan = panInput.value;
    panInfo.innerText = `Panning: 
      ${determinePanDisplay(trackInfo.pan)}`;
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
  let optionsArray = [
    "allpass",
    "lowpass",
    "highpass",
    "bandpass",
    "lowshelf",
    "highshelf",
    "notch",
  ];
  let filterOptions = document.createElement("select");
  filterOptions.className = "effects-panel__controls__filter__select";

  //append each option to the select
  for (let i = 0; i < optionsArray.length; i++) {
    let option = document.createElement("option");
    option.value = optionsArray[i];
    option.text = optionsArray[i];
    filterOptions.appendChild(option);
  }
  //update chosenFilter whenever option is changed
  filterOptions.addEventListener("change", () => {
    trackInfo.isBufferEffected = true;
    trackInfo.filterType = filterOptions[filterOptions.selectedIndex].value;
  });

  //create a slider for frequency of the filter
  let filterFreqInput = document.createElement("input");
  filterFreqInput.type = "range";
  filterFreqInput.value = "0";
  filterFreqInput.min = "50";
  filterFreqInput.max = "2500";
  filterFreqInput.step = "1";

  filterFreqInput.className = "effects-panel__controls__filter__freq-input";

  let filterFreqInfo = document.createElement("span");
  filterFreqInfo.innerText = "Freq. 0";
  filterFreqInfo.className = "effects-panel__controls__filter__freq-info";

  filterFreqInput.addEventListener("input", () => {
    trackInfo.isBufferEffected = true;

    filterFreqInfo.innerText = `Freq. ${filterFreqInput.value}`;
    trackInfo.filterFreq = filterFreqInput.value;
  });

  filterControl.append(filterInfo);
  filterControl.append(filterOptions);

  filterControl.append(filterFreqInfo);
  filterControl.append(filterFreqInput);

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
  let feedbackValue = 0.0;

  delayFeedbackInput.type = "range";
  delayFeedbackInput.value = "0";
  delayFeedbackInput.min = "0";
  delayFeedbackInput.max = "0.85";
  delayFeedbackInput.step = ".01";

  delayFeedbackInput.addEventListener("input", () => {
    trackInfo.isBufferEffected = true;

    feedbackValue = delayFeedbackInput.value;
    delayFeedbackInfo.innerText = `feedback: ${delayFeedbackInput.value}`;
    delayObject.feedback = feedbackValue;
    console.log("feedback dO", delayObject);
    trackInfo.delayFeedback = feedbackValue;
  });

  //update chosenFilter whenever option is changed
  delayOptions.addEventListener("change", () => {
    trackInfo.isBufferEffected = true;

    console.log("delay changed to: ", delayOptions[delayOptions.selectedIndex]);
    delayTimeValue = delayOptions[delayOptions.selectedIndex].text;
    console.log("dti", typeof delayTimeValue);
    delayObject.time = getBPMForDelay(delayTimeValue);
    console.log("options dO", delayObject);
    trackInfo.delayTime = delayObject.time;
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

  //wet = effected (reverbed) audio
  let wetInfo = document.createElement("span");
  wetInfo.innerText = `wet: 0.00`;

  let wetInput = document.createElement("input");
  wetInput.type = "range";
  wetInput.value = "0";
  wetInput.min = "0";
  wetInput.max = ".85";
  wetInput.step = ".01";

  wetInput.addEventListener("input", () => {
    trackInfo.isBufferEffected = true;

    wetInfo.innerText = `wet: ${wetInput.value}`;
    trackInfo.reverbWet = wetInput.value;
  });

  let reverbSelect = document.createElement("select");
  reverbSelect.className = "effects-panel__controls__reverb__select";

  let offOption = document.createElement("option");
  offOption.text = "off";
  reverbSelect.append(offOption);

  //create options for reverb by cycling loadedReverbs {name: buffer}
  for (let reverb in loadedReverbs) {
    //create reverb selection options
    let reverbOption = document.createElement("option");

    reverbOption.text = reverb;
    reverbOption.id = reverb;

    reverbSelect.append(reverbOption);
  }

  //get buffer of selected reverb to send to effects chain
  reverbSelect.addEventListener("change", () => {
    trackInfo.isBufferEffected = true;

    if (reverbSelect.selectedIndex === 0) {
      trackInfo.reverbBuffer = null;
      return;
    }

    let reverbSelection = reverbSelect[reverbSelect.selectedIndex];
    let reverbName = reverbSelection.text;

    trackInfo.reverbBuffer = loadedReverbs[reverbName];
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

    let reverbSource = context.createBufferSource();
    reverbSource.buffer = trackInfo.reverbBuffer;

    //connect source to effects
    let testEffectedSource = connectSourceToEffects(
      trackInfo,
      source,
      reverbSource
    );

    let eBufferSource = testEffectedSource.source;
    let reverbedSource = testEffectedSource.reverbObj.reverbSource;

    eBufferSource.start(0);
    if (testEffectedSource.reverbObj.reverbBuffer) {
      reverbedSource.start(0);
    }
  });

  let emptyDiv = document.createElement("div");
  //add effects to panel
  effectDiv.append(effectTestButton);
  effectDiv.append(effectResetButton);
  effectDiv.append(volumeControl);
  effectDiv.append(panControl);
  effectDiv.append(pitchControl);
  effectDiv.append(emptyDiv);
  effectDiv.append(filterControl);
  effectDiv.append(delayControl);
  effectDiv.append(reverbControl);

  panel.append(effectDiv);
  let trackAndEffectPanelDiv = document.createElement("div");
  trackAndEffectPanelDiv.append(track);
  trackAndEffectPanelDiv.append(panel);
  //attach effect panel to track

  trackAndEffectPanelDiv.classList.add("sequencer__display__track-panel-div");
  sequencerDisplay.append(trackAndEffectPanelDiv);

  //when reset button is clicked
  //reset all effect values in the panel
  let resetEffectsButton = document.querySelector(
    ".sequencer__controls__buttons__reset-effects"
  );

  resetEffectsButton.addEventListener("click", () => {
    pitchInput.value = 0;
    pitchInfo.innerText = "Pitch: 0";

    volumeInput.value = 1;
    volumeInfo.innerText = "Volume: 0.00";

    panInput.value = 0.0;
    panInfo.innerText = "Panning: \n0.0";

    filterOptions.selectedIndex = 0;
    filterFreqInput.value = 0;
    filterFreqInfo.innerText = "Freq: 0";

    delayOptions.selectedIndex = 0;
    delayFeedbackInput.value = 0;
    delayFeedbackInfo.innerText = "Feedback: 0.00";
    reverbSelect.selectedIndex = 0;

    wetInput.value = 0;
    wetInfo.innerText = "Wet: 0.00";

    resetTrackEffectsValues();
  });
}

function resetTrackEffectsValues() {
  //reset effect information for each track to default
  [].forEach.call(tracksEffectInfo, (track) => {
    resetTrackEffectsHashValues(track);
  });
}
function determinePanDisplay(panValue) {
  let display;
  if (panValue == "0") {
    display = "0.0";
  } else if (panValue < 0) {
    display = "L " + panValue;
  } else if (panValue == "1") {
    display = "1" + " R  ";
  } else {
    display = "" + panValue + " R";
  }
  return display;
}
//it will need to take the buffer from each track and add effects
export function connectSourceToEffects(trackInfo, source, reverbSource) {
  //create pan node and set value
  let panNode = context.createStereoPanner();
  panNode.pan.value = trackInfo.pan;

  //create filter and set
  let filterNode = context.createBiquadFilter();
  filterNode.type = trackInfo.filterType;
  filterNode.frequency.value = trackInfo.filterFreq;

  //create delay and set value
  let delay = context.createDelay();
  let feedback = context.createGain();
  delay.delayTime.value = trackInfo.delayTime;
  feedback.gain.value = eval(trackInfo.delayFeedback);

  //create reverb node and set values
  let reverb = context.createConvolver();
  reverb.buffer = trackInfo.reverbBuffer;
  let wetVolume = context.createGain();
  wetVolume.gain.value = trackInfo.reverbWet;

  //create gainNode and set value
  let gainNode = context.createGain();
  gainNode.gain.value = trackInfo.volume;

  //detune sample accordingly before connecting other effects
  source.detune.value = trackInfo.semitones * 100; //100 cents
  reverbSource.detune.value = trackInfo.semitones * 100;

  //set up delay looper
  source.connect(delay).connect(feedback).connect(delay);
  feedback.connect(context.destination);

  //if reverb is selected,
  if (trackInfo.reverbBuffer) {
    //connect wet reverbed buffer to output
    reverbSource.connect(wetVolume);
    wetVolume.connect(panNode);
    panNode.connect(filterNode);
    filterNode.connect(reverb);
    reverb.connect(gainNode);
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
    reverbObj: {
      reverbSource,
      reverbBuffer: trackInfo.reverbBuffer,
    },
  };
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
