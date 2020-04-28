import "./styles.css";
import  {init} from "./setup.js";
import {startButton} from "./constants.js";
import {samplesLoaded} from "./setupPads.js";

startButton.addEventListener("click", function(){
  init();
  startButton.disabled = true;
  startButton.innerText = "ready";

});

/*
// UPLOAD INPUT
// User selects file, read it as an ArrayBuffer and pass to the API.
let fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener(
  "change",
  function(e) {
    let reader = new FileReader();
    reader.onload = function(e) {
      initSound(this.result);
    };
    reader.readAsArrayBuffer(this.files[0]);
  },
  false
);
*/
