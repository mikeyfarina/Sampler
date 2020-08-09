import loadAllUrls from "./BufferLoader.js";
import { assignSoundsToPads } from "./setupPads.js";
import { samplesToLoad } from "./constants.js";

export function loadSamples() {
  return new Promise((resolve, reject) => {
    resolve(loadAllUrls(samplesToLoad).then(assignSoundsToPads));
    reject("error");
  });
}

export function loadReverbPresets(reverbArray) {
  return new Promise((resolve) => {
    loadAllUrls(reverbArray).then((loadedReverbs) => {
      let i = 0;
      loadedReverbs.forEach((reverb) => {
        let name = getNameFromFile(reverbArray[`${i++}`]);
        reverb.name = name;
      });
      resolve(loadedReverbs);
    });
  });
}
function getNameFromFile(reverbFile) {
  let reverbName = reverbFile
    .split("/")
    .pop()
    .replace(".wav", "")
    .split(".")[0];
  return reverbName;
}
