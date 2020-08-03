import { trackObject } from "./setupSeqTracks.js";

export function hashTableConversion(trackEffectInfo) {
  return new Promise((resolve) => {
    console.log("\n\n\n\nhashTableInfo\n\n\n\n\n", trackEffectInfo);

    let formattedTrackEInfo = trackEffectInfo.reduce((map, obj) => {
      map[Object.keys(obj.trackObjectInfo)] = obj;
      return map;
    }, []);

    console.log("\n\n\n hashTable Done \n\n\n", formattedTrackEInfo);
    resolve(formattedTrackEInfo);
  });
}
