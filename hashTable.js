import { trackObject } from "./setupSeqTracks.js";

let hashTable = [];
export function hashTableConversion(trackEffectInfo) {
  return new Promise((resolve) => {
    console.log("\n\n\n\nhashTableInfo\n\n\n\n\n", trackEffectInfo);

    let formattedTrackEInfo = trackEffectInfo.reduce((map, obj) => {
      map[Object.keys(obj.trackObjectInfo)] = obj;
      return map;
    }, []);

    console.log("\n\n\n hashTable Done \n\n\n", formattedTrackEInfo);
    hashTable = formattedTrackEInfo;
    resolve(formattedTrackEInfo);
  });
}

export function uploadConversionToHash(trackInfo) {
  return new Promise((resolve) => {
    console.log("\n\n\n\nhashTableInfo\n\n\n\n\n", trackInfo);

    let formattedTrackEInfo = {};
    formattedTrackEInfo[Object.keys(trackInfo.trackObjectInfo)] = trackInfo;

    console.log("\n\n\n hashTable Done \n\n\n", formattedTrackEInfo);
    editHashTable(trackInfo, formattedTrackEInfo);
    resolve(formattedTrackEInfo);
  });
}
function editHashTable(trackInfo, newTrackInfo) {
  hashTable[Object.keys(newTrackInfo)] = trackInfo;
  console.log(hashTable);
}

export { hashTable };
