import {context, beatSelector, tempoSlider, tempoDisplay} from "./constants.js";
import {makeSource, loadedPadsWithSamples} from "./setupPads.js";

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
let seqTracks;

export function setUpSequencer(){
  console.log("\n\nSEQUENCER LOGS\n\n\n")
  let playButton = document.querySelector('.sequencer__controls__play-button');

  console.log("playButton", playButton);
  playButton.addEventListener("click", (ev)=>{
    console.log("clicked playbutton");
    [].forEach.call(seqTracks, (track) =>{
      console.log("setup loop calling play", track);
      play(ev, track);
    })
  });
  
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
  tempo = tempoSlider.value;            //always updating the tempo
  tempoDisplay.innerText = tempo;       //and note resolution 
  noteResolution = beatSelector.selectedIndex;

  // Advance current note and time by a 16th note...
  let secondsPerBeat = 60.0 / tempo;
  nextNoteTime += 0.25 * secondsPerBeat;  // Add beat length to last beat time

  current16thNote++;  // Advance the beat number, wrap to zer0
  if (current16thNote == 16) {
    current16thNote = 0;
  }
}

function scheduleNote( beatNumber, time, buffer, trackButtons) {
  //get note res
  noteResolution = beatSelector.selectedIndex;

  // push the note on the queue, even if we're not playing.
  notesInQueue.push( { note: beatNumber, time } );
  console.log("scheduling note", {beatNumber, time} , notesInQueue);

  if ( (noteResolution==1) && (beatNumber%2))
    return; // we're not playing non-8th 16th notes
  if ( (noteResolution==2) && (beatNumber%4))
    return; // we're not playing non-quarter 8th notes

  console.log("scheduleNote log");
  console.log("trackButtons",trackButtons);
  console.log("beatNumber " + beatNumber);
  console.log("trackButtons " + trackButtons); 
  console.log("trackButtons[beatNumber] " + trackButtons[beatNumber]);
  console.log("contains(\"clicked\").classList.contains(\"clicked\"): ");

  console.log("schedulenote end", beatNumber, trackButtons, buffer)
  if (trackButtons[beatNumber] === undefined){
    console.log("beat undefined");
  }else if (trackButtons[beatNumber].classList.contains("clicked")){
    console.log("playing buffer");
    playSample(buffer);
  }

  //if ( !(beatNumber % 16) || !(beatNumber % 8) ) // beat 0 == low pitch
    //playSample(listOfSamples[2]);
  //else if (beatNumber % 4)  // quarter notes = medium pitch
    //playSample(listOfSamples[0]);
  //else                      // other 16th notes = high pitch
    //playSample(listOfSamples[1]);
  
}

function playSample(buffer){
  let source = makeSource(buffer);
  source.source.start(0);
}

function scheduler(trackBuffer, trackButtons) {

  while (nextNoteTime < context.currentTime + scheduleAheadTime ) {
    scheduleNote( current16thNote, nextNoteTime,trackBuffer, trackButtons);
    nextNote();
  }
  
  timerID = window.setTimeout( scheduler, lookahead );
}

function play(ev, track) {
  console.log("play called");
  let trackButtons = track.querySelectorAll(".sequencer__display__track__button");

  isPlaying = !isPlaying;

  if (isPlaying) { // start playing
    current16thNote = 0;
    nextNoteTime = context.currentTime;
    
    console.log("loop track", track, "trackButtons",trackButtons);
    // kick off scheduling
    scheduler(track, getBufferOfTrack(track), trackButtons);  
    
    ev.target.innerText = "stop";
  } else {
    window.clearTimeout( timerID );
    ev.target.innerText = "play";
  }
}

function draw() {
  let currentNote = last16thNoteDrawn;
  let currentTime = context.currentTime;

  seqTracks = document.querySelectorAll(".sequencer__display__track");

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    console.log("draw while ", notesInQueue.length, notesInQueue[0]);
    currentNote = notesInQueue[0].note;
    notesInQueue.splice(0,1);   // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (last16thNoteDrawn != currentNote) {
    last16thNoteDrawn = currentNote;
      for (let i=0; i<16; i++) {
        seqTracks[0].children[i+1].style.background = ( currentNote == i ) ?
          (( currentNote % 4 == 0 ) ? "#4880ff" : "white" ) : "#7c7c7c"; 
      }
  }
  // set up to draw again
  requestAnimFrame(draw);
}

function getBufferOfTrack(track){
  let trackName = track.querySelector(".sequencer__display__track__name").innerText;
  for (let pad of loadedPadsWithSamples){
    if (pad.buffer.name === trackName){
      return pad.buffer;
    }
  }
}