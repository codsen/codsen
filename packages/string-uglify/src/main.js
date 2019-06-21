import { version } from "../package.json";
const isArr = Array.isArray;

// tells code point of a given id number
function tellcp(str, idNum) {
  return str.codePointAt(idNum);
}

// main function - converts n-th string in a given reference array of strings
function uglifyById(refArr, idNum) {
  return uglifyArr(refArr)[idNum];
}

// converts whole array into array uglified names
function uglifyArr(arr) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";
  // const twoLetterVariations = 936; // 26 x 36

  // final array we'll assemble and eventually return
  const res = [];

  // quick end
  if (!isArr(arr) || !arr.length) {
    return arr;
  }

  // const untouched = [];
  // const singleCounts = [];
  // const doubleCounts = [];
  // const tripleCounts = [];
  // const quadrupleCounts = [];
  // const longerCounts = [];
  // let maxLen = "";

  for (let id = 0, len = arr.length; id < len; id++) {
    // insurance against duplicate reference array values
    if (arr.indexOf(arr[id]) < id) {
      // push again the calculated value from "res":
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
      // class/id name is good as it is

      // if (arr[id].length === 1) {
      //   singleCounts.push(arr[id]);
      // } else if (arr[id].length === 2) {
      //   doubleCounts.push(arr[id]);
      // } else if (arr[id].length === 3) {
      //   tripleCounts.push(arr[id]);
      // }
      if (!res.includes(arr[id])) {
        res.push(arr[id]);
        // untouched.push(arr[id]);
        continue;
      }
    }

    const generated = `${prefix}${letters[codePointSum % letters.length]}${
      lettersAndNumbers[codePointSum % lettersAndNumbers.length]
    }`;

    if (!res.includes(generated)) {
      // tripleCounts.push(generated);
      res.push(generated);
    } else {
      // add more charactets:
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
      // console.log(
      //   `${`\u001b[${33}m${`magicNumber`}\u001b[${39}m`} = ${JSON.stringify(
      //     magicNumber,
      //     null,
      //     4
      //   )}`
      // );

      while (res.includes(soFarWeveGot)) {
        counter++;
        soFarWeveGot +=
          lettersAndNumbers[
            (reducedCodePointSum * magicNumber * counter) %
              lettersAndNumbers.length
          ];
      }
      // if (maxLen.length < soFarWeveGot.length) {
      //   maxLen = soFarWeveGot;
      // }

      // if (soFarWeveGot.length === 1) {
      //   singleCounts.push(soFarWeveGot);
      // } else if (soFarWeveGot.length === 2) {
      //   doubleCounts.push(soFarWeveGot);
      // } else if (soFarWeveGot.length === 3) {
      //   tripleCounts.push(soFarWeveGot);
      // } else if (soFarWeveGot.length === 4) {
      //   quadrupleCounts.push(soFarWeveGot);
      // } else {
      //   longerCounts.push(soFarWeveGot);
      // }
      res.push(soFarWeveGot);
    }
  }

  // console.log(
  //   `139 FINAL ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
  //     res.length,
  //     null,
  //     4
  //   )} (${res.length});\n\nfirst 20 singles: ${JSON.stringify(
  //     singleCounts.filter((val, i) => i < 20),
  //     null,
  //     0
  //   )};\n\nfirst 20 doubles: ${JSON.stringify(
  //     doubleCounts.filter((val, i) => i < 20),
  //     null,
  //     0
  //   )};\n\nfirst 20 triples: ${JSON.stringify(
  //     tripleCounts.filter((val, i) => i < 20),
  //     null,
  //     0
  //   )} (${tripleCounts.length});\n\nfirst 20 quadruples: ${JSON.stringify(
  //     quadrupleCounts.filter((val, i) => i < 20),
  //     null,
  //     0
  //   )} (${quadrupleCounts.length});\n\nfirst 20 longer: ${JSON.stringify(
  //     longerCounts.filter((val, i) => i < 20),
  //     null,
  //     0
  //   )} (${longerCounts.length})\n\nuntouched: ${JSON.stringify(
  //     untouched,
  //     null,
  //     0
  //   )}(${untouched.length})\n\nmaxLen: ${maxLen} (${maxLen.length})`
  // );

  return res;
}

// main export
export { uglifyById, uglifyArr, version };

// word => [0,25]-[0,35]
