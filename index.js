import "./styles.css";
import  {init} from "./setup.js";
import {startButton} from "./constants.js";
import {samplesLoaded} from "./setupPads.js";

startButton.addEventListener("click", function(){
  init();
  startButton.disabled = true;
  startButton.innerText = "ready";
});
