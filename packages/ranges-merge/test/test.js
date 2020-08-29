import tap from "tap";
import clone from "lodash.clonedeep";
import mergeRanges from "../dist/ranges-merge.esm";

// 00. throws
// ==========================

tap.test("01 - does not throw when the first arg is wrong", (t) => {
  t.same(mergeRanges("z"), null, "01.01");
  t.same(mergeRanges(true), null, "01.02");
  t.end();
});

tap.test("02 - throws when opts.progressFn is wrong", (t) => {
  t.throws(() => {
    mergeRanges(
      [
        [1, 2],
        [0, 1],
      ],
      { progressFn: "z" }
    );
  }, /THROW_ID_01/);
  t.end();
});

tap.test("03 - throws when opts.mergeType is wrong", (t) => {
  t.throws(() => {
    mergeRanges(
      [
        [1, 2],
        [0, 1],
      ],
      { mergeType: "z" }
    );
  }, /THROW_ID_02/);
  t.end();
});

tap.test("04 - throws when the second arg is wrong", (t) => {
  t.throws(() => {
    mergeRanges(
      [
        [1, 2],
        [0, 1],
      ],
      1
    );
  }, /THROW_ID_03/);
  t.end();
});

tap.test("05 - throws when opts.joinRangesThatTouchEdges is wrong", (t) => {
  t.throws(() => {
    mergeRanges(
      [
        [1, 2],
        [0, 1],
      ],
      {
        joinRangesThatTouchEdges: "z",
      }
    );
  }, /THROW_ID_04/);
  t.end();
});

tap.test("06", (t) => {
  t.doesNotThrow(() => {
    mergeRanges(
      [
        [1, 2],
        [0, 1],
      ],
      {
        progressFn: {},
      }
    );
  }, "06");
  t.end();
});

// 01. mergeRanges()
// ==========================

tap.test("07 - simples: merges three overlapping ranges", (t) => {
  const input = [
    [3, 8],
    [1, 4],
    [2, 5],
  ];
  const inputBackup = clone(input);
  t.same(mergeRanges(input), [[1, 8]], "07.01 - two args");
  t.same(
    mergeRanges(input, {
      joinRangesThatTouchEdges: false,
    }),
    [[1, 8]],
    "07.02 - two args"
  );

  // input argument mutation checks:
  t.same(input, inputBackup, "07.03 - no mutation happened");
  t.end();
});

tap.test("08 - nothing to merge", (t) => {
  t.same(
    mergeRanges([
      [3, 8],
      [1, 2],
    ]),
    [
      [1, 2],
      [3, 8],
    ],
    "08.01 - just sorted"
  );
  t.same(
    mergeRanges(
      [
        [3, 8],
        [1, 2],
      ],
      {
        joinRangesThatTouchEdges: false,
      }
    ),
    [
      [1, 2],
      [3, 8],
    ],
    "08.02"
  );
  t.end();
});

tap.test("09 - null input", (t) => {
  t.same(mergeRanges(null), null, "09.01");
  t.same(
    mergeRanges(null, {
      mergeType: 1,
    }),
    null,
    "09.02"
  );
  t.same(
    mergeRanges(null, {
      mergeType: 2,
    }),
    null,
    "09.03"
  );
  t.same(
    mergeRanges(null, {
      mergeType: "1",
    }),
    null,
    "09.04"
  );
  t.same(
    mergeRanges(null, {
      mergeType: "2",
    }),
    null,
    "09.05"
  );

  t.same(
    mergeRanges(null, {
      joinRangesThatTouchEdges: true,
    }),
    null,
    "09.06"
  );
  t.same(
    mergeRanges(null, {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "09.07"
  );

  t.end();
});

tap.test("10 - empty array", (t) => {
  t.same(mergeRanges([]), null, "10.01");
  t.same(
    mergeRanges([], {
      mergeType: 1,
    }),
    null,
    "10.02"
  );
  t.same(
    mergeRanges([], {
      mergeType: 2,
    }),
    null,
    "10.03"
  );
  t.same(
    mergeRanges([], {
      mergeType: "1",
    }),
    null,
    "10.04"
  );
  t.same(
    mergeRanges([], {
      mergeType: "2",
    }),
    null,
    "10.05"
  );

  t.same(
    mergeRanges([], {
      joinRangesThatTouchEdges: true,
    }),
    null,
    "10.06"
  );
  t.same(
    mergeRanges([], {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "10.07"
  );
  t.end();
});

tap.test("11 - empty array with null inside", (t) => {
  t.same(mergeRanges([null]), null, "11.01");
  t.same(
    mergeRanges([null], {
      mergeType: 1,
    }),
    null,
    "11.02"
  );
  t.same(
    mergeRanges([null], {
      mergeType: 2,
    }),
    null,
    "11.03"
  );
  t.same(
    mergeRanges([null], {
      mergeType: "1",
    }),
    null,
    "11.04"
  );
  t.same(
    mergeRanges([null], {
      mergeType: "2",
    }),
    null,
    "11.05"
  );

  t.same(
    mergeRanges([null], {
      joinRangesThatTouchEdges: true,
    }),
    null,
    "11.06"
  );
  t.same(
    mergeRanges([null], {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "11.07"
  );
  t.end();
});

tap.test("12 - more complex case", (t) => {
  let counter = 0;
  t.same(
    mergeRanges([[1, 5], null, [11, 15], [6, 10], null, [16, 20], [10, 30]]),
    [
      [1, 5],
      [6, 30],
    ],
    "12.01"
  );
  t.same(
    mergeRanges(
      [
        [1, 5],
        [11, 15],
        [6, 10],
        [16, 20],
        [10, 30],
      ],
      {
        mergeType: 1,
      }
    ),
    [
      [1, 5],
      [6, 30],
    ],
    "12.02"
  );
  t.same(
    mergeRanges(
      [
        [1, 5],
        [11, 15],
        [6, 10],
        [16, 20],
        [10, 30],
      ],
      {
        mergeType: "1",
      }
    ),
    [
      [1, 5],
      [6, 30],
    ],
    "12.03"
  );
  t.same(
    mergeRanges(
      [
        [1, 5],
        [11, 15],
        [6, 10],
        [16, 20],
        [10, 30],
      ],
      {
        progressFn: (perc) => {
          // console.log(`done: ${perc}`);
          t.ok(typeof perc === "number");
          counter += 1;
        },
      }
    ),
    [
      [1, 5],
      [6, 30],
    ],
    "12.04"
  );
  t.ok(counter > 5, "12.05");

  // with opts
  t.same(
    mergeRanges(
      [
        [1, 5],
        [11, 15],
        [6, 10],
        [16, 20],
        [10, 30],
      ],
      {
        joinRangesThatTouchEdges: false,
      }
    ),
    [
      [1, 5],
      [6, 10],
      [10, 30],
    ],
    "12.06"
  );
  t.same(
    mergeRanges(
      [
        [1, 5],
        [11, 15],
        [6, 10],
        [16, 20],
        [10, 30],
      ],
      {
        mergeType: 1,
        joinRangesThatTouchEdges: false,
      }
    ),
    [
      [1, 5],
      [6, 10],
      [10, 30],
    ],
    "12.07"
  );
  t.end();
});

tap.test("13 - even more complex case", (t) => {
  let last;
  const counter = 0;
  t.same(
    mergeRanges(
      [
        [40, 40, "rrrr"],
        [20, 25, "yyy"],
        [5, 5],
        [15, 16],
        [3, 4, "y"],
        [29, 38],
        [0, 0, "rrr"],
        [30, 30],
        [17, 19, "zzz"],
        [8, 11],
        [24, 28, "aaaa"],
        [4, 5],
        [29, 37],
        [22, 23],
        [30, 33],
        [1, 2, "z"],
        [30, 37],
        [5, 7],
      ],
      {
        progressFn: (perc) => {
          // console.log(`done: ${perc}`);
          // ensure there are no repetitions on status percentages reported
          t.ok(perc !== last);
          last = perc;
        },
      }
    ),
    [
      [0, 0, "rrr"],
      [1, 2, "z"],
      [3, 7, "y"],
      [8, 11],
      [15, 16],
      [17, 19, "zzz"],
      [20, 28, "yyyaaaa"],
      [29, 38],
      [40, 40, "rrrr"],
    ],
    "13.01"
  );
  t.ok(counter < 100, "13.02");
  t.end();
});

tap.test("14 - more merging examples", (t) => {
  t.same(
    mergeRanges([
      [7, 14],
      [24, 28, " "],
      [29, 31],
      [28, 28, " "],
    ]),
    [
      [7, 14],
      [24, 28, "  "],
      [29, 31],
    ],
    "14"
  );
  t.end();
});

tap.test(
  "15 - superset range discards to-add content of their subset ranges #1",
  (t) => {
    t.same(
      mergeRanges([
        [5, 6, " "],
        [1, 10],
      ]),
      [[1, 10]],
      "15"
    );
    t.end();
  }
);

tap.test(
  "16 - superset range discards to-add content of their subset ranges #2",
  (t) => {
    t.same(
      mergeRanges([
        [5, 7, " "],
        [6, 8, " "],
        [7, 9, " "],
        [1, 10],
      ]),
      [[1, 10]],
      "16"
    );
    t.end();
  }
);

tap.test(
  "17 - superset range discards to-add content of their subset ranges #3",
  (t) => {
    t.same(
      mergeRanges([
        [5, 7, " "],
        [1, 3, " "],
        [6, 8, " "],
        [7, 9, " "],
        [3, 10],
      ]),
      [[1, 10, " "]],
      "17.01"
    );
    t.same(
      mergeRanges([
        [3, 10],
        [5, 7, " "],
        [1, 3, " "],
        [6, 8, " "],
        [7, 9, " "],
      ]),
      [[1, 10, " "]],
      "17.02"
    );
    t.same(
      mergeRanges([
        [5, 7, " "],
        [1, 3, " "],
        [3, 10],
        [6, 8, " "],
        [7, 9, " "],
      ]),
      [[1, 10, " "]],
      "17.03"
    );
    t.same(
      mergeRanges([
        [5, 7, " "],
        [1, 2, " "],
        [6, 8, " "],
        [7, 9, " "],
        [3, 10],
      ]),
      [
        [1, 2, " "],
        [3, 10],
      ],
      "17.04"
    );
    t.end();
  }
);

tap.test("18 - third arg is null", (t) => {
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, null],
      [2, 5, "b"],
    ]),
    [[1, 8, null]],
    "18.01"
  );
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, null],
    ]),
    [[1, 8, null]],
    "18.02"
  );
  t.same(
    mergeRanges([
      [1, 4, null],
      [3, 8, "c"],
    ]),
    [[1, 8, null]],
    "18.03"
  );
  t.same(
    mergeRanges([
      [1, 4, "c"],
      [3, 8, null],
    ]),
    [[1, 8, null]],
    "18.04"
  );
  t.same(
    mergeRanges([
      [3, 8, null],
      [1, 4, "c"],
    ]),
    [[1, 8, null]],
    "18.05"
  );
  t.end();
});

tap.test("19 - only one range, nothing to merge", (t) => {
  t.same(mergeRanges([[1, 4, null]]), [[1, 4, null]], "19.01");
  t.same(mergeRanges([[1, 4]]), [[1, 4]], "19.02");
  t.end();
});

tap.test("20 - input arg mutation prevention", (t) => {
  const originalInput = [
    [5, 7, " "],
    [1, 3, " "],
    [6, 8, " "],
    [7, 9, " "],
    [3, 10],
  ];
  const originalRef = Array.from(originalInput); // clone it

  t.same(mergeRanges(originalInput), [[1, 10, " "]], "useless test");
  t.same(originalInput, originalRef, "20.02 - mutation didn't happen");
  t.end();
});

tap.test("21 - only two identical args in the range", (t) => {
  t.same(
    mergeRanges([
      [1, 1],
      [3, 4],
      [2, 2, "zzz"],
    ]),
    [
      [2, 2, "zzz"],
      [3, 4],
    ],
    "21.01"
  );
  t.same(mergeRanges([[1, 1]]), null, "21.02");

  // opts.mergeType === 2
  t.same(
    mergeRanges(
      [
        [1, 1],
        [3, 4],
        [2, 2, "zzz"],
      ],
      { mergeType: 2 }
    ),
    [
      [2, 2, "zzz"],
      [3, 4],
    ],
    "21.03"
  );
  t.same(mergeRanges([[1, 1]], { mergeType: 2 }), null, "21.04");
  t.end();
});

tap.test("22 - third arg", (t) => {
  // opts.mergeType === 1
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, "a"],
      [2, 5, "b"],
    ]),
    [[1, 8, "abc"]],
    "22.01"
  );
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4],
      [2, 5, "b"],
    ]),
    [[1, 8, "bc"]],
    "22.02"
  );
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, "a"],
      [2, 5],
    ]),
    [[1, 8, "ac"]],
    "22.03"
  );
  t.same(
    mergeRanges([
      [3, 8],
      [1, 4, "a"],
      [2, 5, "b"],
    ]),
    [[1, 8, "ab"]],
    "22.04"
  );

  // opts.mergeType === 2
  t.same(
    mergeRanges(
      [
        [3, 8, "c"],
        [1, 4, "a"],
        [2, 5, "b"],
      ],
      { mergeType: 2 }
    ),
    [[1, 8, "abc"]],
    "22.05"
  );
  t.same(
    mergeRanges(
      [
        [3, 8, "c"],
        [1, 4],
        [2, 5, "b"],
      ],
      { mergeType: 2 }
    ),
    [[1, 8, "bc"]],
    "22.06"
  );
  t.same(
    mergeRanges(
      [
        [3, 8, "c"],
        [1, 4, "a"],
        [2, 5],
      ],
      { mergeType: 2 }
    ),
    [[1, 8, "ac"]],
    "22.07"
  );
  t.same(
    mergeRanges(
      [
        [3, 8],
        [1, 4, "a"],
        [2, 5, "b"],
      ],
      { mergeType: 2 }
    ),
    [[1, 8, "ab"]],
    "22.08"
  );
  t.end();
});

// 02. opts.mergeType === 2
// -----------------------------------------------------------------------------

tap.test("23 - few ranges starting at the same index", (t) => {
  // hors d'oeuvres - opts.mergeType === 1
  t.same(
    mergeRanges([
      [3, 4, "aaa"],
      [3, 12, "zzz"],
    ]),
    [[3, 12, "aaazzz"]],
    "23.01 - control #1"
  );
  t.same(
    mergeRanges([
      [3, 12, "zzz"],
      [3, 4, "aaa"],
    ]), // notice order is opposite
    [[3, 12, "aaazzz"]], // <--- order does not matter, ranges are sorted
    "23.02 - control #2"
  );
  t.same(
    mergeRanges(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: 1 }
    ),
    [[3, 12, "aaazzz"]],
    "23.03 - hardcoded correct default value"
  );
  t.same(
    mergeRanges(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: "1" }
    ),
    [[3, 12, "aaazzz"]],
    "23.04 - hardcoded incorrect type default value"
  );

  // entrée - opts.mergeType === 2
  t.same(
    mergeRanges(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: 2 }
    ),
    [[3, 12, "zzz"]],
    "23.05"
  );
  t.same(
    mergeRanges(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: "2" }
    ),
    [[3, 12, "zzz"]],
    "23.06"
  );
  t.same(
    mergeRanges(
      [
        [3, 12, "zzz"],
        [3, 4, "aaa"],
      ],
      { mergeType: 2 }
    ),
    [[3, 12, "zzz"]], // ^ order does not matter
    "23.07"
  );
  t.end();
});

// 3. opts.joinRangesThatTouchEdges
// -----------------------------------------------------------------------------

tap.test("24 - third arg", (t) => {
  const inp1 = [
    [1, 3, "a"],
    [3, 6, "b"],
  ];
  const res1 = [[1, 6, "ab"]];
  t.same(mergeRanges(inp1), res1, "24.01");
  t.same(
    mergeRanges(inp1, {
      joinRangesThatTouchEdges: true,
    }),
    res1,
    "24.02"
  );
  t.same(
    mergeRanges(inp1, {
      joinRangesThatTouchEdges: false,
    }),
    inp1,
    "24.03"
  );
  t.end();
});
