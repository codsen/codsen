/**
 * string-uglify
 * Uglify - generate unique short names for sets of strings
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
 */

var version = "1.1.0";

const isArr = Array.isArray;
function tellcp(str, idNum) {
  return str.codePointAt(idNum);
}
function uglifyById(refArr, idNum) {
  return uglifyArr(refArr)[idNum];
}
function uglifyArr(arr) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";
  const res = [];
  if (!isArr(arr) || !arr.length) {
    return arr;
  }
  for (let id = 0, len = arr.length; id < len; id++) {
    if (arr.indexOf(arr[id]) < id) {
      res.push(res[arr.indexOf(arr[id])]);
      continue;
    }
    const prefix = `.#`.includes(arr[id][0]) ? arr[id][0] : "";
    const codePointSum = Array.from(arr[id]).reduce(
      (acc, curr) => acc + tellcp(curr),
      0
    );
    if (
      (`.#`.includes(arr[id][0]) && arr[id].length < 4) ||
      (!`.#`.includes(arr[id][0]) && arr[id].length < 3)
    ) {
      if (!res.includes(arr[id])) {
        res.push(arr[id]);
        continue;
      }
    }
    const generated = `${prefix}${letters[codePointSum % letters.length]}${
      lettersAndNumbers[codePointSum % lettersAndNumbers.length]
    }`;
    if (!res.includes(generated)) {
      res.push(generated);
    } else {
      let soFarWeveGot = generated;
      let counter = 0;
      const reducedCodePointSum = Array.from(arr[id]).reduce(
        (acc, curr) =>
          acc < 200
            ? acc + tellcp(curr)
            : (acc + tellcp(curr)) % lettersAndNumbers.length,
        0
      );
      const magicNumber = Array.from(arr[id])
        .map(val => tellcp(val))
        .reduce((accum, curr) => {
          let temp = accum + curr;
          do {
            temp = String(temp)
              .split("")
              .reduce((acc, curr) => acc + Number.parseInt(curr), 0);
          } while (temp >= 10);
          return temp;
        }, 0);
      while (res.includes(soFarWeveGot)) {
        counter++;
        soFarWeveGot +=
          lettersAndNumbers[
            (reducedCodePointSum * magicNumber * counter) %
              lettersAndNumbers.length
          ];
      }
      res.push(soFarWeveGot);
    }
  }
  return res;
}

export { uglifyArr, uglifyById, version };
