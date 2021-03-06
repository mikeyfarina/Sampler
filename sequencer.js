import {
  context,
  beatSelector,
  tempoSlider,
  tempoDisplay,
} from "./constants.js";
import {
  connectSourceToEffects,
  resetTrackEffectsValues,
} from "./setupAudioEffects.js";
import { getTrackEffectInfo } from "./hashTable.js";

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

let isPlaying = false; // Are we currently playing?
let current16thNote; // What note is currently last scheduled?
let tempo = 120.0; // tempo (in beats per minute)
let lookahead = 25.0; // How frequently to call scheduling function
//(in milliseconds)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps
// with next interval (in case the timer is late)
let nextNoteTime = 0.0; // when the next note is due.
let noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note

let timerID;

let last16thNoteDrawn = -1; // the last "box" we drew on the screen
let notesInQueue = []; // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}
let seqTracks;
let playButton;

export function setUpSequencer() {
  playButton = document.querySelector(".sequencer__controls__buttons__play");
  let resetButton = document.querySelector(
    ".sequencer__controls__buttons__reset"
  );
  let resetEffectsButton = document.querySelector(
    ".sequencer__controls__buttons__reset-effects"
  );
  playButton.addEventListener("click", (ev) => {
    playButton.style.border = "5px #7c7c7c solid";
    setTimeout(() => {
      playButton.style.border = "5px #c4c4c4 solid";
    }, 250);
    play(ev.target);
  });
  resetButton.addEventListener("click", () => {
    resetButton.style.border = "5px #7c7c7c solid";
    setTimeout(() => {
      resetButton.style.border = "5px #c4c4c4 solid";
    }, 250);

    if (isPlaying) {
      play(playButton);
    }
    resetSequencer();
  });
  resetEffectsButton.addEventListener("click", () => {
    console.log("resetting all effects");
    resetTrackEffectsValues();

    resetEffectsButton.style.border = "5px #7c7c7c solid";
    setTimeout(() => {
      resetEffectsButton.style.border = "5px #c4c4c4 solid";
    }, 250);
  });

  tempoSlider.addEventListener("input", () => {
    tempoDisplay.innerText = tempoSlider.value;
  });
}

function resetSequencer() {
  let currentNote = last16thNoteDrawn;

  [].forEach.call(seqTracks, (track) => {
    let beats = track.querySelectorAll(".sequencer__display__track__button");
    track.classList.remove("beat-color");
    [].forEach.call(beats, (beat) => {
      //remove clicked beats
      if (beat.classList.contains("clicked")) {
        beat.classList.remove("clicked");
      }
    });

    //set playhead back to beat 0 if not th`e`re already
    if (currentNote !== 0) {
      beats[0].style.background = "rgba(72, 128, 255, 1)";
    }
    for (let i = 1; i < 16; i++) {
      if (i < 4 || (i >= 8 && i < 12)) {
        beats[i].style.background = "rgba(0, 0, 0, 0.05)";
      } else {
        beats[i].style.background = "rgba(255, 255, 255, 0.15)";
      }
    }
  });

  last16thNoteDrawn = 0;
  current16thNote = 0;
}

function nextNote() {
  tempo = tempoSlider.value; //always updating the tempo
  noteResolution = beatSelector.selectedIndex;

  // Advance current note and time by a 16th note...
  let secondsPerBeat = 60.0 / tempo;

  // Add beat length to last beat time
  nextNoteTime += 0.25 * secondsPerBeat;

  current16thNote++; // Advance the beat number, wrap to zer0
  if (current16thNote == 16) {
    current16thNote = 0;
  }
}

function scheduleNote(beatNumber, time) {
  noteResolution = beatSelector.selectedIndex; //get note res

  // push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time });

  seqTracks = document.querySelectorAll(".sequencer__display__track");

  // we're not playing non-8th 16th notes
  if (noteResolution == 1 && beatNumber % 2) return;
  // we're not playing non-quarter 8th notes
  if (noteResolution == 2 && beatNumber % 4) return;

  //bottle neck
  for (let i = 0; i < seqTracks.length; i++) {
    let trackButtons = seqTracks[i].querySelectorAll(
      ".sequencer__display__track__button"
    );

    if (trackButtons[beatNumber].classList.contains("clicked")) {
      let name = trackButtons[beatNumber].id.split("_")[0];
      console.log(name);
      let trackEffectInfo = getTrackEffectInfo(name);
      console.log(`!! playing ${trackEffectInfo} on beat ${beatNumber}\n`);
      playSample(trackEffectInfo);
    }
  }
}

function playSample(trackInfo) {
  console.log("playing track ", trackInfo);
  let source = context.createBufferSource();
  source.buffer = trackInfo.trackBuffer;

  let reverbSource = context.createBufferSource();
  reverbSource.buffer = trackInfo.reverbBuffer;

  let effectedSource = connectSourceToEffects(trackInfo, source, reverbSource);

  let reverb = effectedSource.reverbObj.reverbSource;
  let eSource = effectedSource.source;

  eSource.start(0);
  if (effectedSource.reverbObj.reverbBuffer) {
    reverb.start(0);
  }
}

function scheduler() {
  while (nextNoteTime < context.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime);
    nextNote();
  }

  timerID = window.setTimeout(scheduler, lookahead);
}

function play(playButton) {
  console.log("play", isPlaying);
  isPlaying = !isPlaying;

  if (isPlaying) {
    // start playing
    last16thNoteDrawn = 0;
    current16thNote = 0;
    nextNoteTime = context.currentTime;
    playButton.style.background = "#3CB371"; //green
    playButton.style.color = "white";
    //kick off scheduling
    scheduler();
    draw();
    playButton.innerText = "stop";
  } else {
    window.clearTimeout(timerID);
    playButton.innerText = "play";
    playButton.style.background = "#ecf0f1";
    playButton.style.color = "black";
  }
}

function draw() {
  let lastNoteOfPreviousPlay;
  if (!isPlaying) {
    lastNoteOfPreviousPlay = last16thNoteDrawn;
    last16thNoteDrawn = 0;
    notesInQueue = [];
    console.log(last16thNoteDrawn);
    for (let track of seqTracks) {
      let beats = track.querySelectorAll(".sequencer__display__track__button");
      let note = beats[lastNoteOfPreviousPlay];
      if (
        lastNoteOfPreviousPlay < 4 ||
        (lastNoteOfPreviousPlay >= 8 && lastNoteOfPreviousPlay < 12)
      ) {
        note.style.background = "rgba(0, 0, 0, 0.05)";
      } else {
        note.style.background = "rgba(255, 255, 255, 0.15)";
      }
      beats[0].style.background = "rgba(72, 128, 255, 1)";
    }
    return; // stop drawing until sequencer plays
  }

  let currentNote = last16thNoteDrawn;
  let currentTime = context.currentTime;

  console.log("drawing", currentNote, last16thNoteDrawn, notesInQueue);
  //console.log("nIQ", last16thNoteDrawn, notesInQueue, currentTime, currentNote);
  // We only need to draw if the note has moved.
  if (last16thNoteDrawn != currentNote) {
    return requestAnimFrame(draw);
  }
  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    currentNote = notesInQueue[0].note;
    notesInQueue.splice(0, 1); // remove note from queue
  }
  seqTracks = document.querySelectorAll(".sequencer__display__track");

  last16thNoteDrawn = currentNote;
  console.log(currentNote, last16thNoteDrawn);
  for (let track of seqTracks) {
    let lastNoteBackground;
    let beats = track.querySelectorAll(".sequencer__display__track__button");
    let note = beats[currentNote];
    let lastNote = beats[`${currentNote > 0 ? currentNote - 1 : 15}`];

    if (
      (last16thNoteDrawn !== 0 && last16thNoteDrawn <= 4) ||
      (last16thNoteDrawn > 8 && last16thNoteDrawn <= 12)
    ) {
      lastNoteBackground = "rgba(0, 0, 0, 0.05)"; //darker
    } else {
      lastNoteBackground = "rgba(255, 255, 255, 0.15)"; //lighter
    }

    console.log(currentNote, lastNoteBackground, noteResolution);

    if (note.classList.contains("clicked")) {
      // if clicked
      note.style.background = "yellow";
    } else if (currentNote % 4 == 0) {
      // if quarter note
      note.style.background = "rgba(72, 128, 255, 1)";
    } else if (noteResolution > 0) {
      //any other note
      note.style.background = beatDisplayColor(currentNote);
    } else {
      note.style.background = "rgba(255, 255, 255, .75)";
    }
    lastNote.style.background = lastNoteBackground;
  }
  // set up to draw again
  requestAnimFrame(draw);
}

function beatDisplayColor(currentNote) {
  // we're not playing non-8th 16th notes so dont display
  if (noteResolution == 1 && currentNote % 2) {
    if (currentNote <= 4 || (currentNote >= 8 && currentNote <= 12)) {
      return "rgba(255, 255, 255, 0.05)";
    } else {
      return "rgba(255, 255, 255, 0.35)";
    }
  }
  // we're not playing non-quarter 8th notes so dont display
  else if (noteResolution == 2 && currentNote % 4) {
    if (currentNote <= 4 || (currentNote >= 8 && currentNote <= 12)) {
      return "rgba(255, 255, 255, 0.05)";
    } else {
      return "rgba(255, 255, 255, 0.35)";
    }
  } else {
    return "rgba(255, 255, 255, .75)";
  }
}
