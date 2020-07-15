import {
  context,
  beatSelector,
  tempoSlider,
  tempoDisplay,
} from "./constants.js";
import { trackObject } from "./setupSeqTracks.js";
import { tracksEffectInfo, connectSourceToEffects } from "./setupAudioEffects.js";

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
  let playButton = document.querySelector(
    ".sequencer__controls__buttons__play"
  );
  playButton.addEventListener("click", (ev) => {
    play(ev);
  });
  let resetButton = document.querySelector(
    ".sequencer__controls__buttons__reset"
  );
  resetButton.addEventListener("click", resetSequencer);

  tempoSlider.addEventListener("input", () => {
    tempoDisplay.innerText = tempoSlider.value;
  })
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
      //remove clicked beats
      if (beat.classList.contains("clicked")) {
        beat.classList.remove("clicked");
      }
    });

    let currentNote = last16thNoteDrawn;
    //set playhead back to beat 0 if not there already
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

    console.log("tEI, in schedule note", tracksEffectInfo);
    let trackInfo = tracksEffectInfo.find((o) =>
      o.trackObjectInfo.trackName === name
    );
    console.log("trackInfo iS", trackInfo)

    if (trackButtons[beatNumber].classList.contains("clicked")) {
      console.log(
        `!! playing ${trackInfo} on beat ${beatNumber}\n`,
        trackInfo.trackBuffer
      );
      playSample(trackInfo);
    }
  });
}

function playSample(trackInfo) {
  let source = context.createBufferSource();
  source.buffer = trackInfo.trackObjectInfo.trackBuffer;

  let reverbSource = context.createBufferSource();
  reverbSource.buffer = trackInfo.reverbBuffer;

  let effectedSource = connectSourceToEffects(
    trackInfo,
    source,
    reverbSource
  );
  console.log("eS playSample", effectedSource, trackInfo);

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
      let beats = track.querySelectorAll(".sequencer__display__track__button");
      for (let i = 0; i < 16; i++) {
        let note = beats[i];
        //seqTracks[0].children[i+1].style.background = ( currentNote == i ) ?
        //(( currentNote % 4 == 0 ) ? "#4880ff" : "white" ) : "#7c7c7c";
        if (currentNote == i) {
          if (note.classList.contains("clicked")) {
            // if clicked
            note.style.background = "yellow";
          } else if (currentNote % 4 == 0) {
            // if quarter note
            note.style.background = "rgba(72, 128, 255, 1)";
          } else {
            //any other note played

            // we're not playing non-8th 16th notes so dont display
            if (noteResolution == 1 && i % 2) {
              console.log("nR, beat", noteResolution, i);
              if (i < 4 || (i >= 8 && i < 12)) {
                note.style.background = "rgba(255, 255, 255, 0.15)";
              } else {
                note.style.background = "rgba(255, 255, 255, 0.3)";
              }
            }
            // we're not playing non-quarter 8th notes so dont display
            else if (noteResolution == 2 && i % 4) {
              console.log("nR, beat", noteResolution, i);
              if (i < 4 || (i >= 8 && i < 12)) {
                note.style.background = "rgba(255, 255, 255, 0.15)";
              } else {
                note.style.background = "rgba(255, 255, 255, 0.3)";
              }
            } else {
              console.log("else");
              note.style.background = "rgba(255, 255, 255, .75)";
            }
          }
        } else {
          //all notes not being played
          if (i < 4 || (i >= 8 && i < 12)) {
            note.style.background = "rgba(0, 0, 0, 0.05)";
          } else {
            note.style.background = "rgba(255, 255, 255, 0.15)";
          }
        }
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
