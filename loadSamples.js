import loadAllUrls from "./BufferLoader.js";
import { assignSoundsToPads } from "./setupPads.js";
import { samplesToLoad } from "./constants.js";

export function loadSamples() {
  return new Promise((resolve, reject) => {
    resolve(loadAllUrls(samplesToLoad).then(assignSoundsToPads));
    reject("error");
  });
}
