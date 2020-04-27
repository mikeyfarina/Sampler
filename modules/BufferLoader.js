import { context } from "../constants";

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
      console.log("onload called", url);
      context.decodeAudioData(
        request.response,
        buffer => {
          console.log("decoded...", buffer, url);
          resolve(buffer);
        },
        error => {
          console.log("decoding error");
          reject(error);
        }
      );
    };

    request.onprogress = () => {
      console.log("onprogress", request.status, url);
    };

    request.onerror = function(error) {
      console.log("onerror error");
      reject(error);
    };

    request.send();
  });
}
