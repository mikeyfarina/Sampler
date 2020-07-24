export function hashTableConversion(trackEffectInfo) {
  return new Promise((resolve) => {
    let i = 0;
    console.log("\n\n\n\nhashTableInfo\n\n\n\n\n", trackEffectInfo);

    let formattedTrackEInfo = trackEffectInfo.reduce((map, obj) => {
      map[obj.trackObjectInfo.trackName] = obj;
      return map;
    }, []);

    console.log("\n\n\n hashTable Done \n\n\n", formattedTrackEInfo);
    resolve(formattedTrackEInfo);
  });
}
