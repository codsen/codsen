const t = require("tap");
const { uglifyArr, uglifyById, version } = require("../dist/string-uglify.cjs");

const letters = "abcdefghijklmnopqrstuvwxyz";
function rand(from, to) {
  from = Math.ceil(from);
  to = Math.floor(to);
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

// -----------------------------------------------------------------------------
// 00. api bits
// -----------------------------------------------------------------------------

t.test(
  `01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported uglify is a function`,
  t => {
    t.equal(typeof uglifyById, "function", "01");
    t.end();
  }
);

t.test(
  `02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`,
  t => {
    t.equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

function makeRandomArr(len = 500, dotshashes = true) {
  const randomArr = [];
  while (randomArr.length !== len) {
    const randStrLen = rand(1, 20);
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

t.test(
  `03 - ${`\u001b[${33}m${`uglifyById`}\u001b[${39}m`} - generates unique and short class names`,
  t => {
    const randomArr = makeRandomArr();
    randomArr.forEach((key, idx) => {
      t.ok(typeof uglifyById(randomArr, idx) === "string", "01.01 - it exists");
      t.ok(
        uglifyById(randomArr, idx).length > 1,
        `03.02 - result name has more than one character not counting dot/hash (${idx})`
      );
      t.equal(
        key[0],
        uglifyById(randomArr, idx)[0],
        `03.03 - ${key[0]} is retained`
      );
    });
    t.end();
  }
);

t.test(
  `04 - ${`\u001b[${35}m${`makeRandomArr`}\u001b[${39}m`} - generates uglified array from reference array`,
  t => {
    const generated = makeRandomArr(5000);
    t.equal(generated.length, uglifyArr(generated).length, "04");
    t.end();
  }
);

t.test(
  `05 - ${`\u001b[${35}m${`makeRandomArr`}\u001b[${39}m`} - generates unique elements array`,
  t => {
    // all are unique
    const length = 1000;
    const generated = uglifyArr(makeRandomArr(length));
    t.equal(generated.length, length);
    generated.forEach((name1, index1) =>
      t.false(
        generated.some((name2, index2) => name1 === name2 && index1 !== index2),
        `${name1} is not unique`
      )
    );
    t.end();
  }
);

t.test(
  `06 - ${`\u001b[${31}m${`wrong cases`}\u001b[${39}m`} - bypasses for everything else`,
  t => {
    t.equal(uglifyArr(true), true, "06.01");
    t.equal(uglifyArr("z"), "z", "06.02");
    t.equal(uglifyArr(1), 1, "06.03");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// aims
// -----------------------------------------------------------------------------

const howMany = 5000;
t.test(
  `07 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - ${howMany} random string array should be 99% resilient`,
  t => {
    // generate two arrays: {howMany}-long random class/id names array and clone of it
    // where there's extra thing on top.
    const randArr1 = makeRandomArr(howMany);
    const randArr2 = [".something"].concat(randArr1);
    t.equal(randArr1.length, howMany);
    t.equal(randArr2.length, howMany + 1);
    // alphabet has 26 letters so two position uglified names should cover at
    // least 26 * 36 = 936 variations and should definitely accommodate 500
    // uglified class/id names.
    const generated1 = uglifyArr(randArr1);
    const generated2 = uglifyArr(randArr2);
    generated2.shift();

    let counter = 0;
    generated1.forEach(key => {
      if (!generated2.includes(key)) {
        counter++;
      }
    });
    // console.log(
    //   `${`\u001b[${33}m${`differs`}\u001b[${39}m`}: ${JSON.stringify(
    //     counter,
    //     null,
    //     4
    //   )}`
    // );
    t.ok(
      counter < generated2.length * 0.001,
      "07 - less than 1% of classes/id's affected "
    );
    t.end();
  }
);

t.test(
  `08 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - repetitions should be OK`,
  t => {
    const randArr1 = makeRandomArr(1);

    for (let i = 0; i < 100; i++) {
      randArr1.push(randArr1[0]);
    }
    const generated = uglifyArr(randArr1);
    t.equal(generated.length, randArr1.length);
    generated.forEach((val, i) => {
      // all values are repeated on both:
      t.equal(generated[i], generated[0]);
      t.equal(randArr1[i], randArr1[0]);
    });
    t.end();
  }
);

t.test(
  `09 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - should work if strings don't have hashes/dots`,
  t => {
    // all are still unique
    const length = 1000;
    const generated = uglifyArr(makeRandomArr(length, false));
    t.equal(generated.length, length);
    generated.forEach((name1, index1) =>
      t.false(
        generated.some((name2, index2) => name1 === name2 && index1 !== index2),
        `${name1} is not unique`
      )
    );
    t.end();
  }
);

t.test(
  `10 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - should work if strings don't have hashes/dots`,
  t => {
    t.same(
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
        ".class10"
      ]),
      [".f", ".f", ".f", ".g", ".h", ".i", ".j", ".k", ".l", ".m", ".n", ".b"],
      "10"
    );
    t.end();
  }
);

t.test(
  `11 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - bunch of identical just-names should be turned into single letter`,
  t => {
    t.same(
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
        "zzz"
      ]),
      ["c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c"],
      "11"
    );
    t.end();
  }
);

t.test(
  `12 - ${`\u001b[${36}m${`aims`}\u001b[${39}m`} - single and double letter name, repeating, cross-type`,
  t => {
    t.same(
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
        "#bbk"
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
        "#ao" // <---------- notice it does not take #a because #a is already taken
      ],
      "12"
    );
    t.end();
  }
);
