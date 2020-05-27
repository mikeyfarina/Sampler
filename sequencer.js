import {context, trackOneBeats, beatSelector, 
    tempoSlider, tempoDisplay} from "./constants.js";
import loadAllUrls from "./BufferLoader.js";
import {makeSource} from "./setupPads.js";
import { setupUploadButtons } from "./uploadSamples.js";

let isPlaying = false;    // Are we currently playing?
let current16thNote;    // What note is currently last scheduled?
let tempo = 120.0;     // tempo (in beats per minute)
let lookahead = 25.0;   // How frequently to call scheduling function
              //(in milliseconds)
let scheduleAheadTime = 0.1;  // How far ahead to schedule audio (sec)
              // This is calculated from lookahead, and overlaps
              // with next interval (in case the timer is late)
let nextNoteTime = 0.0;   // when the next note is due.
let noteResolution = 0;   // 0 == 16th, 1 == 8th, 2 == quarter note

let timerID;

let last16thNoteDrawn = -1; // the last "box" we drew on the screen
let notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
const samplesToLoad = [
  require("./sounds/hat.wav"),
  require("./sounds/snare.wav"),
  require("./sounds/kick.wav")
];

let listOfSamples;

export function setUpSequencer(){
  let playButton = document.querySelector('.sequencer__controls__play-button');
  console.log("trackone",trackOneBeats);

  console.log("playButton", playButton);
  playButton.addEventListener("click", play);


  loadAllUrls(samplesToLoad)
  .then((buffer)=>{
    listOfSamples = buffer;
    console.log('listOfSamples', listOfSamples);
  });
  console.log("listofsamples", listOfSamples);
  
  // First, let's shim the requestAnimationFrame API, with a setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  requestAnimFrame(draw); // start the drawing loop.
}

function nextNote() {
  tempo = tempoSlider.value;
  tempoDisplay.innerText = tempo;
  noteResolution = beatSelector.selectedIndex;
  // Advance current note and time by a 16th note...
  let secondsPerBeat = 60.0 / tempo;  // Notice this picks up the CURRENT
                    // tempo value to calculate beat length.
  nextNoteTime += 0.25 * secondsPerBeat;  // Add beat length to last beat time

  current16thNote++;  // Advance the beat number, wrap to zero
  if (current16thNote == 16) {
    current16thNote = 0;
  }
}
function scheduleNote( beatNumber, time, listOfLoadedSamples ) {
  noteResolution = beatSelector.selectedIndex;
  // push the note on the queue, even if we're not playing.
  notesInQueue.push( { note: beatNumber, time: time } );

  if ( (noteResolution==1) && (beatNumber%2))
    return; // we're not playing non-8th 16th notes
  if ( (noteResolution==2) && (beatNumber%4))
    return; // we're not playing non-quarter 8th notes

  if ( !(beatNumber % 16) || !(beatNumber % 8) ) // beat 0 == low pitch
    playSample(listOfLoadedSamples[2]);
  else if (beatNumber % 4)  // quarter notes = medium pitch
    playSample(listOfLoadedSamples[0]);
  else                      // other 16th notes = high pitch
    playSample(listOfLoadedSamples[1]);
}

function playSample(buffer){
  let source = makeSource(buffer);
  source.source.start(0);
}

function scheduler() {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < context.currentTime + scheduleAheadTime ) {
    scheduleNote( current16thNote, nextNoteTime, listOfSamples );
    nextNote();
  }
  timerID = window.setTimeout( scheduler, lookahead );
}

function play() {
  console.log("play called");

  isPlaying = !isPlaying;

  if (isPlaying) { // start playing
    current16thNote = 0;
    nextNoteTime = context.currentTime;
    scheduler();  // kick off scheduling
    return "stop";
  } else {
    window.clearTimeout( timerID );
    return "play";
  }
}

function draw() {
  let currentNote = last16thNoteDrawn;
  let currentTime = context.currentTime;

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    currentNote = notesInQueue[0].note;
    notesInQueue.splice(0,1);   // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (last16thNoteDrawn != currentNote) {
    last16thNoteDrawn = currentNote;

    for (let i=0; i<16; i++) {
      trackOneBeats[i].style.background = ( currentNote == i ) ?
        (( currentNote % 4 == 0 ) ? "red" : "blue" ) : "lightslategray"; 
    }
  }

  // set up to draw again
  requestAnimFrame(draw);
}

