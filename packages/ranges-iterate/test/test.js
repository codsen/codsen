const t = require("tap");
const i = require("../dist/ranges-iterate.cjs");
// import apply from "ranges-apply";

// ==============================
// 0. THROWS
// ==============================

t.test(
  `00.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 1st arg not string`,
  (t) => {
    t.throws(() => {
      i(1);
    }, /THROW_ID_01/);
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 1st arg empty string`,
  (t) => {
    t.throws(() => {
      i("");
    }, /THROW_ID_02/);
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 2nd arg not array`,
  (t) => {
    t.throws(() => {
      i("z", 1);
    }, /THROW_ID_03/);
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 3rd arg missing`,
  (t) => {
    t.throws(() => {
      i("z", [[0, 1]]);
    }, /THROW_ID_04/);
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 3rd arg not a callback function`,
  (t) => {
    t.throws(() => {
      i("z", [[0, 1]], 1);
    }, /THROW_ID_05/);
    t.end();
  }
);

// ==============================
// 01. ITERATING ONLY
// ==============================

t.test(
  `01.01 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to replace range, middle`,
  (t) => {
    // we'll concatenate all pinged characters into one string, then compare
    // were all intended characters pinged
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[2, 7, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `072t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `abxyzhij`, "01.01");
    t.end();
  }
);

t.test(
  `01.02 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to insert, middle`,
  (t) => {
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[2, 2, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `090t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `abxyzcdefghij`, "01.02");
    t.end();
  }
);

t.test(
  `01.03 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to replace range, start`,
  (t) => {
    // we'll concatenate all pinged characters into one string, then compare
    // were all intended characters pinged
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `110t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `xyzhij`, "01.03");
    t.end();
  }
);

t.test(
  `01.04 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to insert at the end`,
  (t) => {
    // we'll concatenate all pinged characters into one string, then compare
    // were all intended characters pinged
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[10, 10, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `130t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `abcdefghijxyz`, "01.04");
    t.end();
  }
);

t.test(
  `01.05 - \u001b[${33}m${`iterating`}\u001b[${39}m - inserting over undefined character that is located just after end`,
  (t) => {
    // still fine
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[10, 11, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `149t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `abcdefghijxyz`, "01.05");
    t.end();
  }
);

t.test(
  `01.06 - \u001b[${33}m${`iterating`}\u001b[${39}m - inserting beyond string end`,
  (t) => {
    // not fine, won't be inserted because it's not clear what to put at str[10]
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[11, 11, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `168t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `abcdefghij`, "01.06");
    t.end();
  }
);

t.test(
  `01.07 - \u001b[${33}m${`iterating`}\u001b[${39}m - multiple ranges`,
  (t) => {
    let pinged = "";
    let index = 0;
    i(
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
        t.equal(i, index);
        index++;
      }
    );
    t.equal(pinged, `abxyzhi_`, "01.07");
    t.end();
  }
);

t.test(
  `01.08 - \u001b[${33}m${`iterating`}\u001b[${39}m - replace whole thing`,
  (t) => {
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[0, 10, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `211t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, `xyz`, "01.08");
    t.end();
  }
);

t.test(
  `01.09 - \u001b[${33}m${`iterating`}\u001b[${39}m - delete whole thing`,
  (t) => {
    let pinged = "";
    let index = 0;
    i("abcdefghij", [[0, 10]], ({ i, val }) => {
      // console.log(
      //   `229t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, "", "01.09");
    t.end();
  }
);

t.test(
  `01.10 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges array is empty`,
  (t) => {
    let pinged = "";
    let index = 0;
    i("abcdefghij", [], ({ i, val }) => {
      // console.log(
      //   `247t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, "abcdefghij", "01.10");
    t.end();
  }
);

t.test(
  `01.11 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges array is null`,
  (t) => {
    let pinged = "";
    let index = 0;
    i("abcdefghij", null, ({ i, val }) => {
      // console.log(
      //   `265t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index++;
    });
    t.equal(pinged, "abcdefghij", "01.11");
    t.end();
  }
);

t.test(
  `01.12 - \u001b[${33}m${`iterating`}\u001b[${39}m - touching ranges to delete, adding up to everything`,
  (t) => {
    // this should not happen, two ranges have not been merged, it's not a clean
    // input
    let pinged = "";
    let index = 0;
    i(
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
        t.equal(i, index);
        index++;
      }
    );
    t.equal(pinged, "", "01.12");
    t.end();
  }
);

t.test(
  `01.13 - \u001b[${33}m${`iterating`}\u001b[${39}m - overlapping ranges to delete, adding up to everything`,
  (t) => {
    // this should not happen, two ranges have not been merged, it's not a clean
    // input
    let pinged = "";
    let index = 0;
    i(
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
        t.equal(i, index);
        index++;
      }
    );
    t.equal(pinged, "", "01.13");
    t.end();
  }
);

t.test(
  `01.14 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges exclude single character`,
  (t) => {
    i(
      "abcdefghij",
      [
        [0, 5],
        [6, 10],
      ],
      ({ i, val }) => {
        // console.log(
        //   `341t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
        // );
        t.equal(i, 0);
        t.equal(val, "f");
      }
    );
    t.end();
  }
);

t.test(
  `01.15 - \u001b[${33}m${`iterating`}\u001b[${39}m - two empty ranges`,
  (t) => {
    // not fine, won't be inserted because it's not clear what to put at str[10]
    let pinged = "";
    let index = 0;
    const source = "abcdefghij";
    i(
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
        t.equal(i, index);
        index++;
      }
    );
    t.equal(pinged, source, "01.15");
    t.end();
  }
);

t.test(
  `01.16 - \u001b[${33}m${`iterating`}\u001b[${39}m - two empty non-existent ranges`,
  (t) => {
    let pinged = "";
    let index = 0;
    const source = "abcdefghij";
    i(
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
        t.equal(i, index);
        index++;
      }
    );
    t.equal(pinged, source, "01.16");
    t.end();
  }
);

// ==============================
// 02. PUSHING
// ==============================

// t.test(`02.01 - \u001b[${34}m${`pushing`}\u001b[${39}m - pushing outside existing ranges`, t => {
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
//       `421 test.js: ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
//     );
//     if (i === 5) {
//       originalRanges = push([5, 8]);
//     }
//   });
//
//   t.same(originalRanges, [[2, 9, "xyz"]]);
// });
