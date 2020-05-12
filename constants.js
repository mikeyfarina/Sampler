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
const uploadButtons = document.querySelectorAll(".js-upload-button");
const fileInputs = document.querySelectorAll('.audio-file');
const screenTitle = document.querySelector('.drum-machine__screen__title');
const screenSubtitle = document.querySelector('.drum-machine__screen__subtitle');

export {samplesToLoad, drumPads, drumMachine,
  context, startButton, uploadButtons, fileInputs,
  screenTitle, screenSubtitle};
