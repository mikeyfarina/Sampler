import loadAllUrls from "./BufferLoader.js";
import {assignSoundsToPads} from "./setupPads.js";
import {samplesToLoad} from "./constants.js";

export function loadSamples() {
  loadAllUrls(samplesToLoad).then(assignSoundsToPads);
}
