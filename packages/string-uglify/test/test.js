// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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

test(`01 - api bits - exported uglify is a function`, () => {
  equal(typeof uglifyById, "function", "01.01");
});

test(`02 - api bits - exported version is a semver version`, () => {
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

test("03 - generates unique and short class names", () => {
  let randomArr = makeRandomArr();
  randomArr.forEach((key, idx) => {
    ok(typeof uglifyById(randomArr, idx) === "string", "01.01 - it exists");
    ok(
      uglifyById(randomArr, idx).length > 1,
      `03.02 - result name has more than one character not counting dot/hash (${idx})`,
    );
    equal(
      key[0],
      uglifyById(randomArr, idx)[0],
      `03.01 - ${key[0]} is retained`,
    );
  });
});

test(`04 - makeRandomArr - generates uglified array from reference array`, () => {
  let generated = makeRandomArr(5000);
  equal(generated.length, uglifyArr(generated).length, "04.01");
});

test(`05 - makeRandomArr - generates unique elements array`, () => {
  // all are unique
  let length = 1000;
  let generated = uglifyArr(makeRandomArr(length));
  equal(generated.length, length, "05.01");
  generated.forEach((name1, index1) => {
    equal(
      generated.some((name2, index2) => name1 === name2 && index1 !== index2),
      false,
      `05.02 - ${`${name1} is not unique`}`,
    );
  });
});

test("06 - uglifyArr rejects invalid inputs deliberately", () => {
  const revoked = Proxy.revocable([], {});
  revoked.revoke();
  const invalidContainers = [
    true,
    "z",
    1,
    null,
    undefined,
    { 0: "name", length: 1 },
    revoked.proxy,
  ];
  const invalidMembers = [
    [true],
    [null],
    [undefined],
    [{}],
    Array(1),
  ];
  let assertion = 1;

  for (const input of invalidContainers) {
    throws(
      () => {
        uglifyArr(input);
      },
      /string-uglify\/uglifyArr\(\): \[THROW_ID_01\]/,
      `06.${String(assertion).padStart(2, "0")}`,
    );
    assertion += 1;
  }

  for (const input of invalidMembers) {
    throws(
      () => {
        uglifyArr(input);
      },
      /string-uglify\/uglifyArr\(\): \[THROW_ID_02\]/,
      `06.${String(assertion).padStart(2, "0")}`,
    );
    assertion += 1;
  }
});

// -----------------------------------------------------------------------------
// aims
// -----------------------------------------------------------------------------

const howMany = 5000;
test(`07 - aims - ${howMany} random string array should be 99% resilient`, () => {
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

test(`08 - aims - repetitions should be OK`, () => {
  let randArr1 = makeRandomArr(1);

  for (let i = 0; i < 100; i++) {
    randArr1.push(randArr1[0]);
  }
  let generated = uglifyArr(randArr1);
  equal(generated.length, randArr1.length, "08.01");
  generated.forEach((val, i) => {
    // all values are repeated on both:
    equal(generated[i], generated[0], "08.02");
    equal(randArr1[i], randArr1[0], "08.03");
  });
});

test(`09 - aims - should work if strings don't have hashes/dots`, () => {
  // all are still unique
  let length = 1000;
  let generated = uglifyArr(makeRandomArr(length, false));
  equal(generated.length, length, "09.01");
  generated.forEach((name1, index1) => {
    equal(
      generated.some((name2, index2) => name1 === name2 && index1 !== index2),
      false,
      `09.02 - ${`${name1} is not unique`}`,
    );
  });
});

test(`10 - aims - should work if strings don't have hashes/dots`, () => {
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
    "10.01",
  );
});

test(`11 - aims - bunch of identical just-names should be turned into single letter`, () => {
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
    "11.01",
  );
});

test(`12 - aims - single and double letter name, repeating, cross-type`, () => {
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
    "12.01",
  );
});

test("13 - readme examples", () => {
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
    ".oscar",
  );
});

test("14 - uglifyById validates the array before the index", () => {
  let input = [".alpha", ".bravo"];

  equal(uglifyById(input, 0), uglifyArr(input)[0], "14.01");
  equal(uglifyById(input, 1), uglifyArr(input)[1], "14.02");

  [null, "abc", { 0: ".alpha", length: 1 }].forEach((refArr, i) => {
    throws(
      () => {
        uglifyById(refArr, 0);
      },
      /string-uglify\/uglifyById\(\): \[THROW_ID_01\]/,
      `14.${String(i + 3).padStart(2, "0")}`,
    );
  });

  [[true], Array(1)].forEach((refArr, i) => {
    throws(
      () => {
        uglifyById(refArr, 0);
      },
      /string-uglify\/uglifyById\(\): \[THROW_ID_02\]/,
      `14.${String(i + 6).padStart(2, "0")}`,
    );
  });

  [undefined, "0", 0.5, Number.NaN, Number.POSITIVE_INFINITY].forEach(
    (idx, i) => {
      throws(
        () => {
          uglifyById(input, idx);
        },
        /string-uglify\/uglifyById\(\): \[THROW_ID_03\]/,
        `14.${String(i + 8).padStart(2, "0")}`,
      );
    },
  );

  [-1, 2].forEach((idx, i) => {
    throws(
      () => {
        uglifyById(input, idx);
      },
      /string-uglify\/uglifyById\(\): \[THROW_ID_04\]/,
      `14.${String(i + 13).padStart(2, "0")}`,
    );
  });

  throws(
    () => {
      uglifyById([], 0);
    },
    /string-uglify\/uglifyById\(\): \[THROW_ID_04\]/,
    "14.15",
  );
  throws(
    () => {
      uglifyById([".alpha"], 1);
    },
    /contains 1 item\./,
    "14.16",
  );
});

test("15 - the linear-to-indexed threshold preserves output", () => {
  let below = uglifyArr(
    Array.from({ length: 47 }, (_, index) => `.candidate-${index}`),
  );
  let at = uglifyArr(
    Array.from({ length: 48 }, (_, index) => `.candidate-${index}`),
  );

  equal(below.length, 47, "15.01");
  equal(at.length, 48, "15.02");
  equal(at.slice(0, 47), below, "15.03");
  equal(below.slice(-3), [".ceq6m", ".dfzod", ".egaaa"], "15.04");
  equal(at.at(-1), ".fhn0", "15.05");
});

function isWellFormed(value) {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        return false;
      }
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      return false;
    }
  }
  return true;
}

test("16 - distinct short plain names remain distinct in either order", () => {
  const pairs = [
    ["AA", "A"],
    ["11", "1"],
    ["!!", "!"],
    ["éé", "é"],
    ["😀😀", "😀"],
  ];
  let assertion = 1;

  for (const pair of pairs) {
    for (const input of [pair, [pair[1], pair[0]]]) {
      const result = uglifyArr(input);
      equal(result, input, `16.${String(assertion).padStart(2, "0")}`);
      assertion += 1;
      equal(
        result.every(isWellFormed),
        true,
        `16.${String(assertion).padStart(2, "0")}`,
      );
      assertion += 1;
    }
  }
});

test("17 - Unicode shortening preserves duplicates and namespaces", () => {
  equal(
    uglifyArr(["😀😀", "😀😀", "😀", ".😀😀", ".😀", "#😀😀", "#😀"]),
    ["😀😀", "😀😀", "😀", ".😀😀", ".😀", "#😀😀", "#😀"],
    "17.01",
  );
  equal(uglifyArr(["😀😀", "😀😀"]), ["😀", "😀"], "17.02");
  equal(
    uglifyArr(["AA", "A", ".AA", ".A", "#AA", "#A"]),
    ["AA", "A", ".AA", ".A", "#AA", "#A"],
    "17.03",
  );
});

test("18 - Unicode uniqueness holds below and at the indexing threshold", () => {
  const belowInput = [
    ...Array.from({ length: 45 }, (_, index) => `candidate-${index}`),
    "😀😀",
    "😀",
  ];
  const atInput = [
    ...Array.from({ length: 46 }, (_, index) => `candidate-${index}`),
    "😀😀",
    "😀",
  ];
  const below = uglifyArr(belowInput);
  const at = uglifyArr(atInput);

  equal(new Set(below).size, belowInput.length, "18.01");
  equal(new Set(at).size, atInput.length, "18.02");
  equal(below.every(isWellFormed), true, "18.03");
  equal(at.every(isWellFormed), true, "18.04");
  equal(below.slice(-2), ["😀😀", "😀"], "18.05");
  equal(at.slice(-2), ["😀😀", "😀"], "18.06");
});

test("19 - an empty result is a mutation-isolated copy", () => {
  const input = [];
  const result = uglifyArr(input);

  equal(result, [], "19.01");
  is.not(result, input, "19.02");
  result.push("changed");
  equal(input, [], "19.03");
});

test.run();
