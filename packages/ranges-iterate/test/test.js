// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { rIterate as iterate } from "../dist/ranges-iterate.esm.js";

// import apply from "ranges-apply";

// ==============================
// 0. THROWS
// ==============================

test(`01 - throws - 1st arg not string`, () => {
  throws(
    () => {
      iterate(1);
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test(`02 - throws - 1st arg empty string`, () => {
  throws(
    () => {
      iterate("");
    },
    /THROW_ID_02/,
    "02.01",
  );
});

test(`03 - throws - 2nd arg not array`, () => {
  throws(
    () => {
      iterate("z", 1);
    },
    /THROW_ID_03/,
    "03.01",
  );
  throws(
    () => {
      iterate("z", false, () => {});
    },
    /THROW_ID_03/,
    "03.02",
  );
});

test(`04 - throws - 3rd arg missing`, () => {
  throws(
    () => {
      iterate("z", [[0, 1]]);
    },
    /THROW_ID_04/,
    "04.01",
  );
});

test(`05 - throws - 3rd arg not a callback function`, () => {
  throws(
    () => {
      iterate("z", [[0, 1]], 1);
    },
    /THROW_ID_05/,
    "05.01",
  );
});

// ==============================
// 01. ITERATING ONLY
// ==============================

test(`06 - iterating - range with characters to replace range, middle`, () => {
  // we'll concatenate all pinged characters into one string, then compare
  // were all intended characters pinged
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[2, 7, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `072t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "06.01");
    index += 1;
  });
  equal(pinged, "abxyzhij", "06.02");
});

test(`07 - iterating - range with characters to insert, middle`, () => {
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[2, 2, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `090t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "07.01");
    index += 1;
  });
  equal(pinged, "abxyzcdefghij", "07.02");
});

test(`08 - iterating - range with characters to replace range, start`, () => {
  // we'll concatenate all pinged characters into one string, then compare
  // were all intended characters pinged
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `110t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "08.01");
    index += 1;
  });
  equal(pinged, "xyzhij", "08.02");
});

test(`09 - iterating - range with characters to insert at the end`, () => {
  // we'll concatenate all pinged characters into one string, then compare
  // were all intended characters pinged
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[10, 10, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `130t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "09.01");
    index += 1;
  });
  equal(pinged, "abcdefghijxyz", "09.02");
});

test(`10 - iterating - inserting over undefined character that is located just after end`, () => {
  // still fine
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[10, 11, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `149t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "10.01");
    index += 1;
  });
  equal(pinged, "abcdefghijxyz", "10.02");
});

test(`11 - iterating - inserting beyond string end`, () => {
  // not fine, won't be inserted because it's not clear what to put at str[10]
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[11, 11, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `168t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "11.01");
    index += 1;
  });
  equal(pinged, "abcdefghij", "11.02");
});

test(`12 - iterating - multiple ranges`, () => {
  let pinged = "";
  let index = 0;
  iterate(
    "abcdefghij",
    [
      [2, 7, "xyz"],
      [9, 10, "_"],
    ],
    ({ i, val }) => {
      // console.log(
      //   `192t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      equal(i, index, "12.01");
      index += 1;
    },
  );
  equal(pinged, "abxyzhi_", "12.02");
});

test(`13 - iterating - replace whole thing`, () => {
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[0, 10, "xyz"]], ({ i, val }) => {
    // console.log(
    //   `211t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "13.01");
    index += 1;
  });
  equal(pinged, "xyz", "13.02");
});

test(`14 - iterating - delete whole thing`, () => {
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [[0, 10]], ({ i, val }) => {
    // console.log(
    //   `229t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "14.01");
    index += 1;
  });
  equal(pinged, "", "14.02");
});

test(`15 - iterating - ranges array is empty`, () => {
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", [], ({ i, val }) => {
    // console.log(
    //   `247t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "15.01");
    index += 1;
  });
  equal(pinged, "abcdefghij", "15.02");
});

test(`16 - iterating - ranges array is null`, () => {
  let pinged = "";
  let index = 0;
  iterate("abcdefghij", null, ({ i, val }) => {
    // console.log(
    //   `265t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
    // );
    pinged += val;
    equal(i, index, "16.01");
    index += 1;
  });
  equal(pinged, "abcdefghij", "16.02");
});

test(`17 - iterating - touching ranges to delete, adding up to everything`, () => {
  // this should not happen, two ranges have not been merged, it's not a clean
  // input
  let pinged = "";
  let index = 0;
  iterate(
    "abcdefghij",
    [
      [0, 5],
      [5, 10],
    ],
    ({ i, val }) => {
      // console.log(
      //   `291t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      equal(i, index, "17.01");
      index += 1;
    },
  );
  equal(pinged, "", "17.02");
});

test(`18 - iterating - overlapping ranges to delete, adding up to everything`, () => {
  // this should not happen, two ranges have not been merged, it's not a clean
  // input
  let pinged = "";
  let index = 0;
  iterate(
    "abcdefghij",
    [
      [0, 6],
      [4, 10],
    ],
    ({ i, val }) => {
      // console.log(
      //   `318t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      equal(i, index, "18.01");
      index += 1;
    },
  );
  equal(pinged, "", "18.02");
});

test(`19 - iterating - ranges exclude single character`, () => {
  iterate(
    "abcdefghij",
    [
      [0, 5],
      [6, 10],
    ],
    ({ i, val }) => {
      // console.log(
      //   `341t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      equal(i, 0, "19.01");
      equal(val, "f", "19.02");
    },
  );
});

test(`20 - iterating - two empty ranges`, () => {
  // not fine, won't be inserted because it's not clear what to put at str[10]
  let pinged = "";
  let index = 0;
  let source = "abcdefghij";
  iterate(
    source,
    [
      [0, 0],
      [1, 1],
    ],
    ({ i, val }) => {
      // console.log(
      //   `366t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      equal(i, index, "20.01");
      index += 1;
    },
  );
  equal(pinged, source, "20.02");
});

test(`21 - iterating - two empty non-existent ranges`, () => {
  let pinged = "";
  let index = 0;
  let source = "abcdefghij";
  iterate(
    source,
    [
      [98, 98],
      [99, 99],
    ],
    ({ i, val }) => {
      // console.log(
      //   `392t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      equal(i, index, "21.01");
      index += 1;
    },
  );
  equal(pinged, source, "21.02");
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
//   iterate("abcdefghij", originalRanges, ({ i, val, push }) => {
//     console.log(
//       `421 test.js: ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
//     );
//     if (i === 5) {
//       originalRanges = push([5, 8]);
//     }
//   });
//
//   equal(originalRanges, [[2, 9, "xyz"]]);
// });

test.run();
