import {
  context,
  beatSelector,
  tempoSlider,
  tempoDisplay,
} from "./constants.js";
import { makeSource, loadedPadsWithSamples } from "./setupPads.js";
import { trackObject } from "./setupSeqTracks.js";

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

export function setUpSequencer() {
  let playButton = document.querySelector(".sequencer__controls__buttons__play");
  playButton.addEventListener("click", (ev) => {
    play(ev);
  });
  let resetButton = document.querySelector(".sequencer__controls__buttons__reset");
  resetButton.addEventListener("click", resetSequencer);

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

  requestAnimFrame(draw); // start the drawing loop.
}
function resetSequencer() {
  seqTracks = document.querySelectorAll(".sequencer__display__track");
  [].forEach.call(seqTracks, (track) => {
    let beats = track.querySelectorAll(".sequencer__display__track__button");
    [].forEach.call(beats, (beat) => {
      if (beat.classList.contains("clicked")) {
        beat.classList.remove("clicked");
      }
    });
  });
  current16thNote = 0;
}
function nextNote() {
  tempo = tempoSlider.value; //always updating the tempo
  tempoDisplay.innerText = tempo; //and note resolution
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
  console.log("schedule beat ", beatNumber);
  noteResolution = beatSelector.selectedIndex; //get note res

  // push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time });

  // we're not playing non-8th 16th notes
  if (noteResolution == 1 && beatNumber % 2) return;
  // we're not playing non-quarter 8th notes
  if (noteResolution == 2 && beatNumber % 4) return;

  [].forEach.call(seqTracks, (track) => {
    let trackButtons = track.querySelectorAll(
      ".sequencer__display__track__button"
    );
    let name = track.querySelector("span").innerText;
    let trackInfo = trackObject.find((o) => o.trackName === name);

    if (trackButtons[beatNumber].classList.contains("clicked")) {
      console.log(
        `!! playing ${trackInfo.trackBuffer.name} on beat ${beatNumber}\n`,
        trackInfo.trackBuffer
      );
      playSample(trackInfo.trackBuffer);
    }
  });
}

function playSample(buffer) {
  let source = makeSource(buffer);
  source.source.start(0);
}

function scheduler() {
  while (nextNoteTime < context.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime);
    nextNote();
  }

  timerID = window.setTimeout(scheduler, lookahead);
}

function play(ev) {
  console.log("play", trackObject, isPlaying);
  isPlaying = !isPlaying;

  if (isPlaying) {
    // start playing
    current16thNote = 0;
    nextNoteTime = context.currentTime;
    //kick off scheduling
    scheduler();
    ev.target.innerText = "stop";
  } else {
    window.clearTimeout(timerID);
    ev.target.innerText = "play";
  }
}

function draw() {
  let currentNote = last16thNoteDrawn;
  let currentTime = context.currentTime;

  seqTracks = document.querySelectorAll(".sequencer__display__track");

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    currentNote = notesInQueue[0].note;
    notesInQueue.splice(0, 1); // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (last16thNoteDrawn != currentNote) {
    last16thNoteDrawn = currentNote;
    for (let track of seqTracks) {
      for (let i = 0; i < 16; i++) {
        let note = track.children[i + 1];
        //seqTracks[0].children[i+1].style.background = ( currentNote == i ) ?
        //(( currentNote % 4 == 0 ) ? "#4880ff" : "white" ) : "#7c7c7c";
        note.style.background =
          currentNote == i
            ? note.classList.contains("clicked")
              ? "yellow"
              : currentNote % 4 == 0
                ? "#4880ff"
                : "white"
            : i < 4 || (i >= 8 && i < 12)
              ? "#c4c4c4"
              : "#7c7c7c";
        /*
        if (currentNote == i){
          if (note.classList.contains("clicked")){  
            note.style.background = "yellow";
          } else if (currentNote % 4 == 0) {  //cursor if 1/4 beat
            note.style.background = "#4880ff";
          } else {
            note.style.background = "white"; // cursor if not 1/4 beat
          }
        } else {
          if (i < 4 || i >= 8 && i < 12){
            note.style.background = "gray";
          } else {
            note.style.background = "teal";
          }
        }
        */
      }
    }
  }
  // set up to draw again
  requestAnimFrame(draw);
}
