const samplesToLoad = [
  "../sounds/hat.wav",
  "../sounds/hit.wav",
  "../sounds/N6P20.WAV",
  "../sounds/N6P21.WAV",
  "../sounds/N6P22.WAV",
  "../sounds/N6P23.WAV"
];

window.AudioContext = 
  window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
let source, audioBuffer;
const drumPads = document.querySelectorAll(".drum-machine__pads button");
const drumMachine = document.querySelector(".drum-machine");
const startButton = document.querySelector(".start-button");

export  {samplesToLoad, drumPads, drumMachine, context, source, audioBuffer, startButton};