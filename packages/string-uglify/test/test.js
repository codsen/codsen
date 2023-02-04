import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { uglifyArr, uglifyById, version } from "../dist/string-uglify.esm.js";

const letters = "abcdefghijklmnopqrstuvwxyz";
function rand(from, to) {
  return (
    Math.floor(Math.random() * (Math.floor(to) - Math.ceil(from) + 1)) +
    Math.ceil(from)
  );
}

// -----------------------------------------------------------------------------
// 00. api bits
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported uglify is a function`, () => {
  equal(typeof uglifyById, "function", "01.01");
});

test(`02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`, () => {
  equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02.01");
});

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

function makeRandomArr(len = 500, dotshashes = true) {
  let randomArr = [];
  while (randomArr.length !== len) {
    let randStrLen = rand(1, 20);
    let str = dotshashes ? `${Math.random() > 0.3 ? "." : "#"}` : "";
    for (let y = 0; y < randStrLen; y++) {
      str += `${letters[rand(0, 25)]}`;
    }
    if (!randomArr.includes(str)) {
      randomArr.push(str);
    }
  }

  return randomArr;
}

test(`03 - generates unique and short class names`, () => {
  let randomArr = makeRandomArr();
  randomArr.forEach((key, idx) => {
    ok(typeof uglifyById(randomArr, idx) === "string", "01.01 - it exists");
    ok(
      uglifyById(randomArr, idx).length > 1,
      `03.02 - result name has more than one character not counting dot/hash (${idx})`
    );
    equal(
      key[0],
      uglifyById(randomArr, idx)[0],
      `03.03 - ${key[0]} is retained`
    );
  });
});

test(`04 - ${`\u001b[${35}m${`makeRandomArr`}\u001b[${39}m`} - generates uglified array from reference array`, () => {
  let generated = makeRandomArr(5000);
  equal(generated.length, uglifyArr(generated).length, "04.01");
});

test(`05 - ${`\u001b[${35}m${`makeRandomArr`}\u001b[${39}m`} - generates unique elements array`, () => {
  // all are unique
  let length = 1000;
  let generated = uglifyArr(makeRandomArr(length));
  equal(generated.length, length, "05.01");
  generated.forEach((name1, index1) =>
    equal(
      generated.some((name2, index2) => name1 === name2 && index1 !== index2),
      false,
      `${name1} is not unique`
    )
  );
});

test(`06 - ${`\u001b[${31}m${`wrong cases`}\u001b[${39}m`} - bypasses for everything else`, () => {
  equal(uglifyArr(true), true, "06.01");
  equal(uglifyArr("z"), "z", "06.02");
  equal(uglifyArr(1), 1, "06.03");
});

// -----------------------------------------------------------------------------
// aims
// -----------------------------------------------------------------------------

const howMany = 5000;
test(`07 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - ${howMany} random string array should be 99% resilient`, () => {
  // generate two arrays: {howMany}-long random class/id names array and clone of it
  // where there's extra thing on top.
  let randArr1 = makeRandomArr(howMany);
  let randArr2 = [".something"].concat(randArr1);
  equal(randArr1.length, howMany, "07.01");
  equal(randArr2.length, howMany + 1, "07.02");
  // alphabet has 26 letters so two position uglified names should cover at
  // least 26 * 36 = 936 variations and should definitely accommodate 500
  // uglified class/id names.
  let generated1 = uglifyArr(randArr1);
  let generated2 = uglifyArr(randArr2);
  generated2.shift();

  let counter = 0;
  generated1.forEach((key) => {
    if (!generated2.includes(key)) {
      counter += 1;
    }
  });
  // console.log(
  //   `${`\u001b[${33}m${`differs`}\u001b[${39}m`}: ${JSON.stringify(
  //     counter,
  //     null,
  //     4
  //   )}`
  // );
  ok(counter < generated2.length * 0.001, "07.03");
});

test(`08 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - repetitions should be OK`, () => {
  let randArr1 = makeRandomArr(1);

  for (let i = 0; i < 100; i++) {
    randArr1.push(randArr1[0]);
  }
  let generated = uglifyArr(randArr1);
  equal(generated.length, randArr1.length, "08.01");
  generated.forEach((val, i) => {
    // all values are repeated on both:
    equal(generated[i], generated[0]);
    equal(randArr1[i], randArr1[0]);
  });
});

test(`09 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - should work if strings don't have hashes/dots`, () => {
  // all are still unique
  let length = 1000;
  let generated = uglifyArr(makeRandomArr(length, false));
  equal(generated.length, length, "09.01");
  generated.forEach((name1, index1) =>
    equal(
      generated.some((name2, index2) => name1 === name2 && index1 !== index2),
      false,
      `${name1} is not unique`
    )
  );
});

test(`10 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - should work if strings don't have hashes/dots`, () => {
  equal(
    uglifyArr([
      ".class1",
      ".class1",
      ".class1",
      ".class2",
      ".class3",
      ".class4",
      ".class5",
      ".class6",
      ".class7",
      ".class8",
      ".class9",
      ".class10",
    ]),
    [".f", ".f", ".f", ".g", ".h", ".i", ".j", ".k", ".l", ".m", ".n", ".b"],
    "10.01"
  );
});

test(`11 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - bunch of identical just-names should be turned into single letter`, () => {
  equal(
    uglifyArr([
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
      "zzz",
    ]),
    ["c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c"],
    "11.01"
  );
});

test(`12 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - single and double letter name, repeating, cross-type`, () => {
  equal(
    uglifyArr([
      "a",
      "a",
      "a",
      "#a",
      "#a",
      "#a",
      ".a",
      ".a",
      ".a",
      ".ab",
      "#ab",
      "ab",
      ".ab",
      "#ab",
      "ab",
      "aaa",
      ".aaa",
      "#aaa",
      "bbb",
      ".bbb",
      "#bbk",
    ]),
    [
      "a",
      "a",
      "a",
      "#a",
      "#a",
      "#a",
      ".a",
      ".a",
      ".a",
      ".ab",
      "#ab",
      "ab",
      ".ab",
      "#ab",
      "ab",
      "f",
      ".z",
      "#o",
      "i",
      ".c",
      "#ao", // <---------- notice it does not take #a because #a is already taken
    ],
    "12.01"
  );
});

test(`13 - readme examples`, () => {
  let input1 = [
    ".alpha",
    ".bravo",
    ".charlie",
    ".delta",
    ".echo",
    ".foxtrot",
    ".golf",
    ".hotel",
    ".india",
    ".juliett",
    ".kilo",
    ".lima",
    ".mike",
    ".november",
    ".oscar",
    ".papa",
    ".quebec",
    ".romeo",
    ".sierra",
    ".tango",
    ".uniform",
    ".victor",
    ".whiskey",
    ".xray",
    ".yankee",
    ".zulu",
  ];
  let output1 = uglifyArr(input1);
  // console.log(`\n\n\n the first array:`);
  // console.log(input1.map((val, i) => `${val} - ${output1[i]}`).join("\n"));

  let input2 = [
    ".abandon",
    ".ability",
    ".able",
    ".about",
    ".above",
    ".abroad",
    ".absence",
    ".absent",
    ".absolute",
    ".abstract",
    ".abuse",
    ".abusive",

    ".oscar",

    ".academic",
    ".accept",
    ".acceptable",
    ".acceptance",
    ".access",
    ".accident",
    ".accompany",
    ".according",
    ".account",
    ".accountant",
    ".accurate",
  ];

  let output2 = uglifyArr(input2);
  // console.log(`\n\n\n the second array:`);
  // console.log(input2.map((val, i) => `${val} - ${output2[i]}`).join("\n"));

  is(
    output1[input1.indexOf(".oscar")],
    output2[input2.indexOf(".oscar")],
    ".oscar"
  );
});

test.run();
