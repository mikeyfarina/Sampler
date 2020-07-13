const samplesToLoad = [
  require("./sounds/hat.wav"),
  require("./sounds/hit.wav"),
  require("./sounds/snare.wav"),
  require("./sounds/kick.wav"),
  require("./sounds/snap.wav"),
  require("./sounds/scratch.wav"),
  require("./sounds/shake.wav"),
  require("./sounds/clap.wav"),
  require("./sounds/snaretwo.wav")
];
const reverbsToLoad = [
  require("./reverb_impulses/Block Inside.wav"),
  require("./reverb_impulses/Bottle Hall.wav"),
  require("./reverb_impulses/Cement Blocks 1.wav"),
  require("./reverb_impulses/Cement Blocks 2.wav"),
  require("./reverb_impulses/Conic Long Echo Hall.wav"),
  require("./reverb_impulses/Deep Space.wav"),
  require("./reverb_impulses/Direct Cabinet N1.wav"),
  require("./reverb_impulses/Direct Cabinet N2.wav"),
  require("./reverb_impulses/Direct Cabinet N3.wav"),
  require("./reverb_impulses/Direct Cabinet N4.wav"),
  require("./reverb_impulses/Five Columns Long.wav"),
  require("./reverb_impulses/Going Home.wav"),
  require("./reverb_impulses/Greek 7 Echo Hall.wav"),
  require("./reverb_impulses/Highly Damped Large Room.wav"),
  require("./reverb_impulses/Large Bottle Hall.wav"),
  require("./reverb_impulses/On a Star.wav"),
  require("./reverb_impulses/Narrow Bumpy Space.wav"),
  require("./reverb_impulses/Rays.wav"),
  require("./reverb_impulses/Right Glass Triangle.wav"),
  require("./reverb_impulses/Ruby Room.wav"),
  require("./reverb_impulses/Scala Milan Opera Hall.wav"),
  require("./reverb_impulses/Small Prehistoric Cave.wav"),
  require("./reverb_impulses/St Nicolaes Church.wav"),
  require("./reverb_impulses/Trig Room.wav"),
  require("./reverb_impulses/Vocal Duo.wav"),
  require("./reverb_impulses/French 18th Century Salon.wav"),
  require("./reverb_impulses/Parking Garage.wav"),
  require("./reverb_impulses/Masonic Lodge.wav")
];

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

const drumPads = document.querySelectorAll(".drum-machine__pads button");
const drumMachine = document.querySelector(".drum-machine");
const padLabels = document.querySelectorAll(".drum-machine__pads__label");
const startButton = document.querySelector(".start-button");
const uploadButtons = document.querySelectorAll(".js-upload-button");
const fileInputs = document.querySelectorAll(".audio-file");
const screen = document.querySelector(".drum-machine__screen");
const screenTitle = document.querySelector(".drum-machine__screen__title");
const screenSubtitle = document.querySelector(
  ".drum-machine__screen__subtitle"
);

/* sequencer */

//controls
const beatSelector = document.querySelector(".beat-selector");
const tempoSlider = document.getElementById("tempo");
const tempoDisplay = document.getElementById("tempo-value");

//display
const trackBackgroundColors = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#84d2f6",
  "#0096c7",
  "#386fa4",
];

export {
  samplesToLoad,
  reverbsToLoad,
  drumPads,
  drumMachine,
  padLabels,
  context,
  startButton,
  uploadButtons,
  fileInputs,
  screenTitle,
  screenSubtitle,
  screen,
  beatSelector,
  tempoSlider,
  tempoDisplay,
  trackBackgroundColors,
};
