import loadAllUrls from "../modules/BufferLoader.js";
import { assignSoundsToPads } from "./setupPads.js";
import { samplesToLoad } from "./constants.js";

export function loadSamples() {
  console.log("load samples called");
  loadAllUrls(samplesToLoad).then(assignSoundsToPads);
}
