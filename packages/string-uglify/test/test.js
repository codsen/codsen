import test from "ava";
import { uglifyArr, uglifyById, version } from "../dist/string-uglify.esm";

const letters = "abcdefghijklmnopqrstuvwxyz";
function rand(from, to) {
  from = Math.ceil(from);
  to = Math.floor(to);
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

// -----------------------------------------------------------------------------
// 00. api bits
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported uglify is a function`, t => {
  t.is(typeof uglifyById, "function", "01");
});

test(`02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`, t => {
  t.is(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02");
});

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

function makeRandomArr(len = 500) {
  const randomArr = [];
  for (let i = 0; i < len; i++) {
    const randStrLen = rand(1, 20);
    let str = "";
    for (let y = 0; y < randStrLen; y++) {
      str += `${Math.random() > 0.3 ? "." : "#"}${letters[rand(0, 25)]}`;
    }
    if (!randomArr.includes(str)) {
      randomArr.push(str);
    }
  }
  return randomArr;
}

test(`03 - ${`\u001b[${33}m${`uglifyById`}\u001b[${39}m`} - generates unique and short class names`, t => {
  const randomArr = makeRandomArr();
  randomArr.forEach((key, idx) => {
    t.true(typeof uglifyById(randomArr, idx) === "string", "01.01 - it exists");
    t.true(
      uglifyById(randomArr, idx).length > 1,
      `03.02 - result name has more than one character not counting dot/hash (${idx})`
    );
    t.is(
      key[0],
      uglifyById(randomArr, idx)[0],
      `03.03 - ${key[0]} is retained`
    );
  });
});

test(`04 - ${`\u001b[${35}m${`makeRandomArr`}\u001b[${39}m`} - generates uglified array from reference array`, t => {
  const generated = makeRandomArr(5000);
  t.is(generated.length, uglifyArr(generated).length, "04");
});

test(`05 - ${`\u001b[${35}m${`makeRandomArr`}\u001b[${39}m`} - generates unique elements array`, t => {
  // all 5000 are unique
  const generated = uglifyArr(makeRandomArr(5000));
  generated.forEach((name1, index1) =>
    t.false(
      generated.some((name2, index2) => name1 === name2 && index1 !== index2),
      `${name1} is not unique`
    )
  );
});

test(`06 - ${`\u001b[${31}m${`wrong cases`}\u001b[${39}m`} - bypasses for everything else`, t => {
  t.is(uglifyArr(true), true, "06.01");
  t.is(uglifyArr("z"), "z", "06.02");
  t.is(uglifyArr(1), 1, "06.03");
});
