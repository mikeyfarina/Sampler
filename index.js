import "./styles.css";
import {init} from "./setup.js";
import {screen} from "./constants.js";

let initialized = false;

screen.addEventListener("touchstart", (e)=>{
  console.log("touchstart init");
  e.preventDefault();
  if (!initialized){
   init();
   initialized = true;
  }
}, {once: true});
screen.addEventListener("click", ()=>{
  console.log("click init");
  if (!initialized){
    init();
    initialized = true;
  }
}, {once: true});

