const samplesToLoad = [
  require('./sounds/hat.wav'),
  require('./sounds/hit.wav'),
  require('./sounds/snare.wav'),
  require('./sounds/kick.wav'),
  require('./sounds/snap.wav'),
  require('./sounds/scratch.wav'),
];

window.AudioContext =
  window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

const drumPads = document.querySelectorAll(".drum-machine__pads button");
const drumMachine = document.querySelector(".drum-machine");
const startButton = document.querySelector(".start-button");
const uploadButton = document.querySelector(".js-upload-button");
const fileInput = document.querySelector('.audio-file');

export {samplesToLoad, drumPads, drumMachine,
  context, startButton, uploadButton, fileInput};
