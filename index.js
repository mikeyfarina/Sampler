import "./styles.css";
import {init} from "./setup.js";
import {startButton} from "./constants.js";

startButton.addEventListener("click", function(){
  init();
});
