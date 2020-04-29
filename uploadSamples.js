import {drumPads, uploadButtons} from "./constants.js";
import loadAllUrls from "./BufferLoader.js";

//upload file
// User selects file, read it as an ArrayBuffer
// and pass to the API.

uploadButtons.forEach(el => {
  el.addEventListener("mousedown", e => {
    console.log("clicked", this);
    e.stopPropagation();
  });
});

/*
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
//drag and drop
//event listeners for drag and drop
/*
[].forEach.call(drumPads, (pad) =>{
  //file dragged into space
  pad.addEventListener('dragenter', handlerFunction, false);
  //file dragged out of space
  pad.addEventListener('dragleave', handlerFunction, false);
  //file held over space pings every couple hundred ms
  pad.addEventListener('dragover', handlerFunction, false);
  //file dropped
  pad.addEventListener('drop', handlerFunction, false);
});
*/
