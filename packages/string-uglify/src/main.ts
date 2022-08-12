import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// tells code point of a given id number
function tellcp(str: string, idNum = 0): number {
  return str.codePointAt(idNum) || 0;
}

export interface Obj {
  [key: string]: any;
}

// converts whole array into array uglified names
function uglifyArr(arr: string[]): string[] {
  let letters = "abcdefghijklmnopqrstuvwxyz";
  let lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";

  let singleClasses: Obj = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false,
  };
  let singleIds: Obj = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false,
  };
  let singleNameonly: Obj = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false,
  };

  // final array we'll assemble and eventually return
  let res: string[] = [];

  // quick end
  if (!Array.isArray(arr) || !arr.length) {
    return arr;
  }

  for (let id = 0, len = arr.length; id < len; id++) {
    // insurance against duplicate reference array values
    if (arr.indexOf(arr[id]) < id) {
      // push again the calculated value from "res":
      res.push(res[arr.indexOf(arr[id])]);
      continue;
    }

    let prefix = `.#`.includes(arr[id][0]) ? arr[id][0] : "";
    let codePointSum = Array.from(arr[id]).reduce(
      (acc, curr) => acc + tellcp(curr),
      0
    );

    if (
      (`.#`.includes(arr[id][0]) && arr[id].length < 4) ||
      (!`.#`.includes(arr[id][0]) && arr[id].length < 3)
    ) {
      let val = arr[id];
      if (!res.includes(val)) {
        res.push(val);

        // the first candidates for single-character value are 2-char long classes:
        if (
          val.startsWith(".") &&
          val.length === 2 &&
          singleClasses[val.slice(1)] === false
        ) {
          // mark the letter as used
          singleClasses[val.slice(1)] = true;
        } else if (
          val.startsWith("#") &&
          val.length === 2 &&
          singleIds[val.slice(1)] === false
        ) {
          // mark the letter as used
          singleIds[val.slice(1)] = true;
        } else if (
          !val.startsWith(".") &&
          !val.startsWith("#") &&
          val.length === 1 &&
          singleNameonly[val] === false
        ) {
          // mark the letter as used
          singleNameonly[val] = true;
        }
        continue;
      }
    }

    let generated = `${prefix}${letters[codePointSum % letters.length]}${
      lettersAndNumbers[codePointSum % lettersAndNumbers.length]
    }`;

    if (res.includes(generated)) {
      // add more characters:
      let soFarWeveGot = generated;
      let counter = 0;

      let reducedCodePointSum = Array.from(arr[id]).reduce(
        (acc, curr) =>
          acc < 200
            ? acc + tellcp(curr)
            : (acc + tellcp(curr)) % lettersAndNumbers.length,
        0
      );
      let magicNumber = Array.from(arr[id])
        .map((val) => tellcp(val))
        .reduce((accum, curr) => {
          let temp = accum + curr;
          do {
            temp = String(temp)
              .split("")
              .reduce((acc, curr1) => acc + Number.parseInt(curr1, 10), 0);
          } while (temp >= 10);
          return temp;
        }, 0);
      // DEV && console.log(
      //   `${`\u001b[${33}m${`magicNumber`}\u001b[${39}m`} = ${JSON.stringify(
      //     magicNumber,
      //     null,
      //     4
      //   )}`
      // );

      while (res.includes(soFarWeveGot)) {
        counter += 1;
        soFarWeveGot +=
          lettersAndNumbers[
            (reducedCodePointSum * magicNumber * counter) %
              lettersAndNumbers.length
          ];
      }
      generated = soFarWeveGot;
    }

    res.push(generated);
    if (
      generated.startsWith(".") &&
      generated.length === 2 &&
      singleClasses[generated.slice(1)] === false
    ) {
      singleClasses[generated.slice(1)] = true;
    } else if (
      generated.startsWith("#") &&
      generated.length === 2 &&
      singleIds[generated.slice(1)] === false
    ) {
      singleIds[generated.slice(1)] = true;
    } else if (
      !generated.startsWith(".") &&
      !generated.startsWith("#") &&
      generated.length === 1 &&
      singleNameonly[generated] === false
    ) {
      singleNameonly[generated] = true;
    }
  }

  DEV &&
    console.log(
      `235 ${`\u001b[${33}m${`singleClasses`}\u001b[${39}m`} = ${JSON.stringify(
        singleClasses,
        null,
        4
      )}\n${`\u001b[${33}m${`singleIds`}\u001b[${39}m`} = ${JSON.stringify(
        singleIds,
        null,
        4
      )}\n${`\u001b[${33}m${`singleNameonly`}\u001b[${39}m`} = ${JSON.stringify(
        singleNameonly,
        null,
        4
      )}`
    );

  // loop through all uglified values again and if the one letter name that
  // matches current name's first letter (considering it might be id, class or
  // just name), shorten that value up to that single letter.
  for (let i = 0, len = res.length; i < len; i++) {
    DEV && console.log("----------------------------------------");
    DEV &&
      console.log(
        `257 processing res[i] = ${`\u001b[${36}m${res[i]}\u001b[${39}m`}`
      );
    if (res[i].startsWith(".")) {
      // if particular class name starts with a letter which hasn't been taken
      if (singleClasses[res[i].slice(1, 2)] === false) {
        singleClasses[res[i].slice(1, 2)] = res[i];
        DEV &&
          console.log(
            `265 shortened ${`\u001b[${33}m${
              res[i]
            }\u001b[${39}m`} to ${`\u001b[${33}m${res[i].slice(
              0,
              2
            )}\u001b[${39}m`}; set ${`\u001b[${33}m${`singleClasses[${res[
              i
            ].slice(1, 2)}]`}\u001b[${39}m`} = ${
              singleClasses[res[i].slice(1, 2)]
            }`
          );
        res[i] = res[i].slice(0, 2);
      } else if (singleClasses[res[i].slice(1, 2)] === res[i]) {
        DEV &&
          console.log(
            `280 res[i] = ${res[i]} will also be shortened to ${res[i].slice(
              0,
              2
            )}`
          );
        // This means, particular class name was repeated in the list and
        // was shortened. We must shorten it to the same value.
        res[i] = res[i].slice(0, 2);
      }
    } else if (res[i].startsWith("#")) {
      if (singleIds[res[i].slice(1, 2)] === false) {
        singleIds[res[i].slice(1, 2)] = res[i];
        DEV &&
          console.log(
            `294 shortened ${`\u001b[${33}m${
              res[i]
            }\u001b[${39}m`} to ${`\u001b[${33}m${res[i].slice(
              0,
              2
            )}\u001b[${39}m`};`
          );
        res[i] = res[i].slice(0, 2);
      } else if (singleIds[res[i].slice(1, 2)] === res[i]) {
        // This means, particular id name was repeated in the list and
        // was shortened. We must shorten it to the same value.
        res[i] = res[i].slice(0, 2);
      }
    } else if (!res[i].startsWith(".") && !res[i].startsWith("#")) {
      if (!singleNameonly[res[i].slice(0, 1)]) {
        singleNameonly[res[i].slice(0, 1)] = res[i];
        DEV &&
          console.log(
            `312 shortened ${`\u001b[${33}m${
              res[i]
            }\u001b[${39}m`} to ${`\u001b[${33}m${res[i].slice(
              0,
              1
            )}\u001b[${39}m`}`
          );
        res[i] = res[i].slice(0, 1);
      } else if (singleNameonly[res[i].slice(0, 1)] === res[i]) {
        // This means, particular id name was repeated in the list and
        // was shortened. We must shorten it to the same value.
        res[i] = res[i].slice(0, 1);
      }
    }
  }

  return res;
}

// main function - converts n-th string in a given reference array of strings
function uglifyById(refArr: string[], idNum: number): string {
  return uglifyArr(refArr)[idNum];
}

// main export
export { uglifyById, uglifyArr, version };
