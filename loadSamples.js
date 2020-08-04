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
      for (let i = 0; i < loadedReverbs.length; i++) {
        let name = reverbArray[i]
          .split("/")
          .pop()
          .replace(".wav", "")
          .split(".")[0];
        loadedReverbs[i].name = name;
      }
      resolve(loadedReverbs);
    });
  });
}
