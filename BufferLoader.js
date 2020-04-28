import {context} from "./constants.js";
import "regenerator-runtime/runtime";

export default function loadAllUrls(urlList) {
  console.log("urlList ", urlList);
  return promisesInOrder(urlList.map(loadSampleFromUrl));
}

async function promisesInOrder(promises) {
  const values = [];
  for (const promise of promises) {
    values.push(await promise);
  }
  console.log(values);
  return values;
}

function loadSampleFromUrl(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      context.decodeAudioData(
        request.response,
        (buffer) => {
          console.log("decoded...", buffer, url);
          buffer.name = /[a-z]+/.exec(url)[0];
          resolve(buffer);
        },
        (error) => {
          console.log(error, url);
          reject(error);
        }
      );
    };

    request.onerror = function(error) {
      reject(error);
    };

    request.send();
  });
}
