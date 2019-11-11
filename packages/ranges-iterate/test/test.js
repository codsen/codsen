import test from "ava";
import i from "../dist/ranges-iterate.esm";
// import apply from "ranges-apply";

// ==============================
// 0. THROWS
// ==============================

test(`00.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 1st arg not string`, t => {
  const error1 = t.throws(() => {
    i(1);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test(`00.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 1st arg empty string`, t => {
  const error1 = t.throws(() => {
    i("");
  });
  t.regex(error1.message, /THROW_ID_02/);
});

test(`00.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 2nd arg not array`, t => {
  const error1 = t.throws(() => {
    i("z", 1);
  });
  t.regex(error1.message, /THROW_ID_03/);
});

test(`00.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 3rd arg missing`, t => {
  const error1 = t.throws(() => {
    i("z", [[0, 1]]);
  });
  t.regex(error1.message, /THROW_ID_04/);
});

test(`00.05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 3rd arg not a callback function`, t => {
  const error1 = t.throws(() => {
    i("z", [[0, 1]], 1);
  });
  t.regex(error1.message, /THROW_ID_05/);
});

// ==============================
// 01. ITERATING ONLY
// ==============================

test(`01.01 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to replace range, middle`, t => {
  // we'll concatenate all pinged characters into one string, then compare
  // were all intended characters pinged
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[2, 7, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `54t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `abxyzhij`, "01.01");
});

test(`01.02 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to insert, middle`, t => {
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[2, 2, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `68t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `abxyzcdefghij`, "01.02");
});

test(`01.03 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to replace range, start`, t => {
  // we'll concatenate all pinged characters into one string, then compare
  // were all intended characters pinged
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `84t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `xyzhij`, "01.03");
});

test(`01.04 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to insert at the end`, t => {
  // we'll concatenate all pinged characters into one string, then compare
  // were all intended characters pinged
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[10, 10, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `100t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `abcdefghijxyz`, "01.04");
});

test(`01.05 - \u001b[${33}m${`iterating`}\u001b[${39}m - inserting over undefined character that is located just after end`, t => {
  // still fine
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[10, 11, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `115t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `abcdefghijxyz`, "01.05");
});

test(`01.06 - \u001b[${33}m${`iterating`}\u001b[${39}m - inserting beyond string end`, t => {
  // not fine, won't be inserted because it's not clear what to put at str[10]
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[11, 11, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `130t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `abcdefghij`, "01.06");
});

test(`01.07 - \u001b[${33}m${`iterating`}\u001b[${39}m - multiple ranges`, t => {
  let pinged = "";
  let index = 0;
  i(
    "abcdefghij",
    [
      [2, 7, "xyz"],
      [9, 10, "_"]
    ],
    ({ i, val }) => {
      // console.log(
      //   `144t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.is(i, index);
      index++;
    }
  );
  t.is(pinged, `abxyzhi_`, "01.07");
});

test(`01.08 - \u001b[${33}m${`iterating`}\u001b[${39}m - replace whole thing`, t => {
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[0, 10, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `158t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, `xyz`, "01.08");
});

test(`01.09 - \u001b[${33}m${`iterating`}\u001b[${39}m - delete whole thing`, t => {
  let pinged = "";
  let index = 0;
  i("abcdefghij", [[0, 10]], ({ i, val }) => {
    // console.log(
    //   `172t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, "", "01.09");
});

test(`01.10 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges array is empty`, t => {
  let pinged = "";
  let index = 0;
  i("abcdefghij", [], ({ i, val }) => {
    // console.log(
    //   `186t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, "abcdefghij", "01.10");
});

test(`01.11 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges array is null`, t => {
  let pinged = "";
  let index = 0;
  i("abcdefghij", null, ({ i, val }) => {
    // console.log(
    //   `200t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    t.is(i, index);
    index++;
  });
  t.is(pinged, "abcdefghij", "01.11");
});

test(`01.12 - \u001b[${33}m${`iterating`}\u001b[${39}m - touching ranges to delete, adding up to everything`, t => {
  // this should not happen, two ranges have not been merged, it's not a clean
  // input
  let pinged = "";
  let index = 0;
  i(
    "abcdefghij",
    [
      [0, 5],
      [5, 10]
    ],
    ({ i, val }) => {
      // console.log(
      //   `216t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.is(i, index);
      index++;
    }
  );
  t.is(pinged, "", "01.12");
});

test(`01.13 - \u001b[${33}m${`iterating`}\u001b[${39}m - overlapping ranges to delete, adding up to everything`, t => {
  // this should not happen, two ranges have not been merged, it's not a clean
  // input
  let pinged = "";
  let index = 0;
  i(
    "abcdefghij",
    [
      [0, 6],
      [4, 10]
    ],
    ({ i, val }) => {
      // console.log(
      //   `232t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.is(i, index);
      index++;
    }
  );
  t.is(pinged, "", "01.13");
});

test(`01.14 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges exclude single character`, t => {
  i(
    "abcdefghij",
    [
      [0, 5],
      [6, 10]
    ],
    ({ i, val }) => {
      // console.log(
      //   `244t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      t.is(i, 0);
      t.is(val, "f");
    }
  );
});

test(`01.15 - \u001b[${33}m${`iterating`}\u001b[${39}m - two empty ranges`, t => {
  // not fine, won't be inserted because it's not clear what to put at str[10]
  let pinged = "";
  let index = 0;
  const source = "abcdefghij";
  i(
    source,
    [
      [0, 0],
      [1, 1]
    ],
    ({ i, val }) => {
      // console.log(
      //   `258t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.is(i, index);
      index++;
    }
  );
  t.is(pinged, source, "01.15");
});

test(`01.16 - \u001b[${33}m${`iterating`}\u001b[${39}m - two empty non-existent ranges`, t => {
  let pinged = "";
  let index = 0;
  const source = "abcdefghij";
  i(
    source,
    [
      [98, 98],
      [99, 99]
    ],
    ({ i, val }) => {
      // console.log(
      //   `273t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.is(i, index);
      index++;
    }
  );
  t.is(pinged, source, "01.16");
});

// ==============================
// 02. PUSHING
// ==============================

// test(`02.01 - \u001b[${34}m${`pushing`}\u001b[${39}m - pushing outside existing ranges`, t => {
//   //
//
//   // a b   c d e f g    h i j
//   // 0 1   2 3 4 5 6    7 8 9
//   //       |-------|
//
//   // a b     x y z      h i j
//   // 0 1     2 3 4      5 6 7
//
//   let originalRanges = [[2, 7, "xyz"]];
//   i("abcdefghij", originalRanges, ({ i, val, push }) => {
//     console.log(
//       `54 test.js: ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
//     );
//     if (i === 5) {
//       originalRanges = push([5, 8]);
//     }
//   });
//
//   t.deepEqual(originalRanges, [[2, 9, "xyz"]]);
// });
