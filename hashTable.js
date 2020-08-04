const trackEffectInfoHash = {}; //{name: effect info}
const subscribers = [];
let count = 0;

export function trackEffectInfoHashConversion(trackEffectInfo) {
  return new Promise((resolve) => {
    console.log("\n\n\n\ntrackEffectInfoHashInfo\n\n\n\n\n", trackEffectInfo);

    trackEffectInfo.forEach((obj) => {
      console.log(obj, obj.trackName);
      trackEffectInfoHash[obj.trackName] = obj;
      delete trackEffectInfoHash[obj.trackName].trackName;
    });
    /*
    let formattedTrackEInfo = trackEffectInfo.reduce((map, obj) => {
      map[Object.keys(obj.trackObjectInfo)] = obj;
      return map;
    }, []);
    */
    console.log("\n\n\n trackEffectInfoHash Done \n\n\n", trackEffectInfoHash);
    resolve(trackEffectInfoHash);
  });
}

export function getTrackEffectInfo(key) {
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
