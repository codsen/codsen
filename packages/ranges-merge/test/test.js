import tap from "tap";
import clone from "lodash.clonedeep";
import mergeRanges from "../dist/ranges-merge.esm";

// 00. throws
// ==========================

tap.test("00.00 - does not throw when the first arg is wrong", (t) => {
  t.same(mergeRanges("z"), "z", "00.01.01");
  t.same(mergeRanges(true), true, "00.01.02");
  t.end();
});

tap.test("00.01 - throws when opts.progressFn is wrong", (t) => {
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

tap.test("00.02 - throws when opts.mergeType is wrong", (t) => {
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

tap.test("00.03 - throws when the second arg is wrong", (t) => {
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

tap.test("00.04 - throws when opts.joinRangesThatTouchEdges is wrong", (t) => {
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

tap.test("00.05", (t) => {
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
  });
  t.end();
});

// 01. mergeRanges()
// ==========================

tap.test("01.01 - simples: merges three overlapping ranges", (t) => {
  const input = [
    [3, 8],
    [1, 4],
    [2, 5],
  ];
  const inputBackup = clone(input);
  t.same(mergeRanges(input), [[1, 8]], "01.01.01 - two args");
  t.same(
    mergeRanges(input, {
      joinRangesThatTouchEdges: false,
    }),
    [[1, 8]],
    "01.01.02 - two args"
  );

  // input argument mutation checks:
  t.same(input, inputBackup, "01.01.03 - no mutation happened");
  t.end();
});

tap.test("01.02 - nothing to merge", (t) => {
  t.same(
    mergeRanges([
      [3, 8],
      [1, 2],
    ]),
    [
      [1, 2],
      [3, 8],
    ],
    "01.02.01 - just sorted"
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
    "01.02.02"
  );
  t.end();
});

tap.test("01.03 - empty input", (t) => {
  t.same(mergeRanges([]), [], "01.03.01 - empty array");
  t.same(mergeRanges(null), null, "01.03.02 - null");
  // with opts
  t.same(
    mergeRanges([], {
      joinRangesThatTouchEdges: false,
    }),
    [],
    "01.03.03 - empty array"
  );
  t.same(
    mergeRanges(null, {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "01.03.04 - null"
  );
  t.end();
});

tap.test("01.04 - more complex case", (t) => {
  let counter = 0;
  t.same(
    mergeRanges([
      [1, 5],
      [11, 15],
      [6, 10],
      [16, 20],
      [10, 30],
    ]),
    [
      [1, 5],
      [6, 30],
    ],
    "01.04.01"
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
    "01.04.02"
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
    "01.04.03"
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
    "01.04.04"
  );
  t.ok(counter > 5, "01.04.05");

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
    "01.04.06"
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
    "01.04.07"
  );
  t.end();
});

tap.test("01.05 - even more complex case", (t) => {
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
    "01.05.01"
  );
  t.ok(counter < 100, "01.05.02");
  t.end();
});

tap.test("01.06 - more merging examples", (t) => {
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
    "01.06.01"
  );
  t.end();
});

tap.test(
  "01.07 - superset range discards to-add content of their subset ranges #1",
  (t) => {
    t.same(
      mergeRanges([
        [5, 6, " "],
        [1, 10],
      ]),
      [[1, 10]],
      "01.07"
    );
    t.end();
  }
);

tap.test(
  "01.08 - superset range discards to-add content of their subset ranges #2",
  (t) => {
    t.same(
      mergeRanges([
        [5, 7, " "],
        [6, 8, " "],
        [7, 9, " "],
        [1, 10],
      ]),
      [[1, 10]],
      "01.08"
    );
    t.end();
  }
);

tap.test(
  "01.09 - superset range discards to-add content of their subset ranges #3",
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
      "01.09.01"
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
      "01.09.02"
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
      "01.09.03"
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
      "01.09.04"
    );
    t.end();
  }
);

tap.test("01.10 - third arg is null", (t) => {
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, null],
      [2, 5, "b"],
    ]),
    [[1, 8, null]],
    "01.10.01"
  );
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, null],
    ]),
    [[1, 8, null]],
    "01.10.02"
  );
  t.same(
    mergeRanges([
      [1, 4, null],
      [3, 8, "c"],
    ]),
    [[1, 8, null]],
    "01.10.03"
  );
  t.same(
    mergeRanges([
      [1, 4, "c"],
      [3, 8, null],
    ]),
    [[1, 8, null]],
    "01.10.04"
  );
  t.same(
    mergeRanges([
      [3, 8, null],
      [1, 4, "c"],
    ]),
    [[1, 8, null]],
    "01.10.05"
  );
  t.end();
});

tap.test("01.11 - only one range, nothing to merge", (t) => {
  t.same(mergeRanges([[1, 4, null]]), [[1, 4, null]], "01.11.01");
  t.same(mergeRanges([[1, 4]]), [[1, 4]], "01.11.02");
  t.end();
});

tap.test("01.12 - input arg mutation prevention", (t) => {
  const originalInput = [
    [5, 7, " "],
    [1, 3, " "],
    [6, 8, " "],
    [7, 9, " "],
    [3, 10],
  ];
  const originalRef = Array.from(originalInput); // clone it

  t.same(mergeRanges(originalInput), [[1, 10, " "]], "useless test");
  t.same(originalInput, originalRef, "01.12.01 - mutation didn't happen");
  t.end();
});

tap.test("01.13 - only two identical args in the range", (t) => {
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
    "01.13.01"
  );
  t.same(mergeRanges([[1, 1]]), [], "01.13.02");

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
    "01.13.03"
  );
  t.same(mergeRanges([[1, 1]], { mergeType: 2 }), [], "01.13.04");
  t.end();
});

tap.test("01.14 - third arg", (t) => {
  // opts.mergeType === 1
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, "a"],
      [2, 5, "b"],
    ]),
    [[1, 8, "abc"]],
    "01.14.01"
  );
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4],
      [2, 5, "b"],
    ]),
    [[1, 8, "bc"]],
    "01.14.02"
  );
  t.same(
    mergeRanges([
      [3, 8, "c"],
      [1, 4, "a"],
      [2, 5],
    ]),
    [[1, 8, "ac"]],
    "01.14.03"
  );
  t.same(
    mergeRanges([
      [3, 8],
      [1, 4, "a"],
      [2, 5, "b"],
    ]),
    [[1, 8, "ab"]],
    "01.14.04"
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
    "01.14.05"
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
    "01.14.06"
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
    "01.14.07"
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
    "01.14.08"
  );
  t.end();
});

// 02. opts.mergeType === 2
// -----------------------------------------------------------------------------

tap.test("02.01 - few ranges starting at the same index", (t) => {
  // hors d'oeuvres - opts.mergeType === 1
  t.same(
    mergeRanges([
      [3, 4, "aaa"],
      [3, 12, "zzz"],
    ]),
    [[3, 12, "aaazzz"]],
    "02.01.01 - control #1"
  );
  t.same(
    mergeRanges([
      [3, 12, "zzz"],
      [3, 4, "aaa"],
    ]), // notice order is opposite
    [[3, 12, "aaazzz"]], // <--- order does not matter, ranges are sorted
    "02.01.02 - control #2"
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
    "02.01.03 - hardcoded correct default value"
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
    "02.01.04 - hardcoded incorrect type default value"
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
    "02.01.05"
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
    "02.01.06"
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
    "02.01.07"
  );
  t.end();
});

// 3. opts.joinRangesThatTouchEdges
// -----------------------------------------------------------------------------

tap.test("03.01 - third arg", (t) => {
  const inp1 = [
    [1, 3, "a"],
    [3, 6, "b"],
  ];
  const res1 = [[1, 6, "ab"]];
  t.same(mergeRanges(inp1), res1, "03.01.01");
  t.same(
    mergeRanges(inp1, {
      joinRangesThatTouchEdges: true,
    }),
    res1,
    "03.01.02"
  );
  t.same(
    mergeRanges(inp1, {
      joinRangesThatTouchEdges: false,
    }),
    inp1,
    "03.01.03"
  );
  t.end();
});
