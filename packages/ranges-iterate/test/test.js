import tap from "tap";
import iterate from "../dist/ranges-iterate.esm";
// import apply from "ranges-apply";

// ==============================
// 0. THROWS
// ==============================

tap.test(
  `01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 1st arg not string`,
  (t) => {
    t.throws(() => {
      iterate(1);
    }, /THROW_ID_01/);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 1st arg empty string`,
  (t) => {
    t.throws(() => {
      iterate("");
    }, /THROW_ID_02/);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 2nd arg not array`,
  (t) => {
    t.throws(() => {
      iterate("z", 1);
    }, /THROW_ID_03/);
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 3rd arg missing`,
  (t) => {
    t.throws(() => {
      iterate("z", [[0, 1]]);
    }, /THROW_ID_04/);
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - 3rd arg not a callback function`,
  (t) => {
    t.throws(() => {
      iterate("z", [[0, 1]], 1);
    }, /THROW_ID_05/);
    t.end();
  }
);

// ==============================
// 01. ITERATING ONLY
// ==============================

tap.test(
  `06 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to replace range, middle`,
  (t) => {
    // we'll concatenate all pinged characters into one string, then compare
    // were all intended characters pinged
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[2, 7, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `072t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `abxyzhij`, "06");
    t.end();
  }
);

tap.test(
  `07 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to insert, middle`,
  (t) => {
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[2, 2, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `090t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `abxyzcdefghij`, "07");
    t.end();
  }
);

tap.test(
  `08 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to replace range, start`,
  (t) => {
    // we'll concatenate all pinged characters into one string, then compare
    // were all intended characters pinged
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `110t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `xyzhij`, "08");
    t.end();
  }
);

tap.test(
  `09 - \u001b[${33}m${`iterating`}\u001b[${39}m - range with characters to insert at the end`,
  (t) => {
    // we'll concatenate all pinged characters into one string, then compare
    // were all intended characters pinged
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[10, 10, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `130t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `abcdefghijxyz`, "09");
    t.end();
  }
);

tap.test(
  `10 - \u001b[${33}m${`iterating`}\u001b[${39}m - inserting over undefined character that is located just after end`,
  (t) => {
    // still fine
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[10, 11, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `149t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `abcdefghijxyz`, "10");
    t.end();
  }
);

tap.test(
  `11 - \u001b[${33}m${`iterating`}\u001b[${39}m - inserting beyond string end`,
  (t) => {
    // not fine, won't be inserted because it's not clear what to put at str[10]
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[11, 11, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `168t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `abcdefghij`, "11");
    t.end();
  }
);

tap.test(
  `12 - \u001b[${33}m${`iterating`}\u001b[${39}m - multiple ranges`,
  (t) => {
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
        t.equal(i, index);
        index += 1;
      }
    );
    t.equal(pinged, `abxyzhi_`, "12");
    t.end();
  }
);

tap.test(
  `13 - \u001b[${33}m${`iterating`}\u001b[${39}m - replace whole thing`,
  (t) => {
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[0, 10, "xyz"]], ({ i, val }) => {
      // console.log(
      //   `211t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, `xyz`, "13");
    t.end();
  }
);

tap.test(
  `14 - \u001b[${33}m${`iterating`}\u001b[${39}m - delete whole thing`,
  (t) => {
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [[0, 10]], ({ i, val }) => {
      // console.log(
      //   `229t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, "", "14");
    t.end();
  }
);

tap.test(
  `15 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges array is empty`,
  (t) => {
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", [], ({ i, val }) => {
      // console.log(
      //   `247t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, "abcdefghij", "15");
    t.end();
  }
);

tap.test(
  `16 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges array is null`,
  (t) => {
    let pinged = "";
    let index = 0;
    iterate("abcdefghij", null, ({ i, val }) => {
      // console.log(
      //   `265t ${`\u001b[${32}m${`CB`}\u001b[${39}m`}: i = ${`\u001b[${33}m${i}\u001b[${39}m`}; val = ${`\u001b[${33}m${val}\u001b[${39}m`}`
      // );
      pinged += val;
      t.equal(i, index);
      index += 1;
    });
    t.equal(pinged, "abcdefghij", "16");
    t.end();
  }
);

tap.test(
  `17 - \u001b[${33}m${`iterating`}\u001b[${39}m - touching ranges to delete, adding up to everything`,
  (t) => {
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
        t.equal(i, index);
        index += 1;
      }
    );
    t.equal(pinged, "", "17");
    t.end();
  }
);

tap.test(
  `18 - \u001b[${33}m${`iterating`}\u001b[${39}m - overlapping ranges to delete, adding up to everything`,
  (t) => {
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
        t.equal(i, index);
        index += 1;
      }
    );
    t.equal(pinged, "", "18");
    t.end();
  }
);

tap.test(
  `19 - \u001b[${33}m${`iterating`}\u001b[${39}m - ranges exclude single character`,
  (t) => {
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
        t.equal(i, 0);
        t.equal(val, "f");
      }
    );
    t.end();
  }
);

tap.test(
  `20 - \u001b[${33}m${`iterating`}\u001b[${39}m - two empty ranges`,
  (t) => {
    // not fine, won't be inserted because it's not clear what to put at str[10]
    let pinged = "";
    let index = 0;
    const source = "abcdefghij";
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
        t.equal(i, index);
        index += 1;
      }
    );
    t.equal(pinged, source, "20");
    t.end();
  }
);

tap.test(
  `21 - \u001b[${33}m${`iterating`}\u001b[${39}m - two empty non-existent ranges`,
  (t) => {
    let pinged = "";
    let index = 0;
    const source = "abcdefghij";
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
        t.equal(i, index);
        index += 1;
      }
    );
    t.equal(pinged, source, "21");
    t.end();
  }
);

// ==============================
// 02. PUSHING
// ==============================

// tap.test(`02.01 - \u001b[${34}m${`pushing`}\u001b[${39}m - pushing outside existing ranges`, t => {
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
//   t.strictSame(originalRanges, [[2, 9, "xyz"]]);
// });
