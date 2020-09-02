const trackEffectInfoHash = {}; //{name: effect info}

export function getTrackEffectInfo(key) {
  return trackEffectInfoHash[key];
}
//add item to trackEffectInfoHash
export function addToTrackEffectInfoHash(key, value) {
  trackEffectInfoHash[key] = value;
}
export function removeItemFromTrackEffectInfoHash(key) {
  if (trackEffectInfoHash.hasOwnProperty(key)) {
    delete trackEffectInfoHash[key];
  }
}
export function resetTrackEffectHashValues(trackName) {
  let trackInfo = getTrackEffectInfo(trackName);
  let resetTrackEffectInfo = {
    trackBuffer: trackInfo.trackBuffer,
    colorIndex: trackInfo.colorIndex,
    semitones: 0,
    volume: 1,
    pan: 0,
    filterType: "allpass",
    filterFreq: 0,
    filterQ: 0,
    delayFeedback: 0,
    delayTime: 0,
    reverbWet: 0,
    reverbBuffer: null,
    isBufferEffected: false,
    effectedBuffer: null,
  };
  removeItemFromTrackEffectInfoHash(trackName);
  console.log("after removal", trackInfo, trackEffectInfoHash, trackName);
  addToTrackEffectInfoHash(trackName, resetTrackEffectInfo);
  console.log("after adding", trackEffectInfoHash);
  return resetTrackEffectInfo;
}
