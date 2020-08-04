const trackEffectInfoHash = {}; //{name: effect info}
const subscribers = [];
let count = 0;

export function getTrackEffectInfo(key) {
  console.log("looking through hashtable", trackEffectInfoHash, "for: ", key);
  return trackEffectInfoHash[key];
}
//add item to trackEffectInfoHash
export function addToTrackEffectInfoHash(key, value) {
  trackEffectInfoHash[key] = value;
  console.log("pushed object into array\n\n", key, value, trackEffectInfoHash);
}
export function removeItemFromTrackEffectInfoHash(key) {
  if (trackEffectInfoHash.hasOwnProperty(key)) {
    delete trackEffectInfoHash[key];
    console.log("removed", key, trackEffectInfoHash);
  }
}
export function resetTrackEffectHashValues(track) {
  track.semitones = 0;
  track.volume = 1;
  track.pan = 0;
  track.filterType = "allpass";
  track.filterFreq = 0;
  track.delayFeedback = 0;
  track.delayTime = 0;
  track.reverbWet = 0;
  track.reverbBuffer = null;
  track.isBufferEffected = false;
  track.effectedBuffer = null;
}
