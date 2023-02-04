import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import clone from "lodash.clonedeep";

import { rMerge } from "../dist/ranges-merge.esm.js";

// 00. throws
// ==========================

test("01 - does not throw when the first arg is wrong", () => {
  equal(rMerge("z"), null, "01.01");
  equal(rMerge(true), null, "01.02");
  equal(rMerge(null), null, "01.03");
  equal(rMerge([null]), null, "01.04");
  equal(rMerge([null, null]), null, "01.05");
});

test("02 - throws when opts.progressFn is wrong", () => {
  throws(
    () => {
      rMerge(
        [
          [1, 2],
          [0, 1],
        ],
        { progressFn: "z" }
      );
    },
    /THROW_ID_01/,
    "02.01"
  );
});

test("03 - throws when opts.mergeType is wrong", () => {
  throws(
    () => {
      rMerge(
        [
          [1, 2],
          [0, 1],
        ],
        { mergeType: "z" }
      );
    },
    /THROW_ID_02/,
    "03.01"
  );
});

test("04 - throws when the second arg is wrong", () => {
  throws(
    () => {
      rMerge(
        [
          [1, 2],
          [0, 1],
        ],
        1
      );
    },
    /THROW_ID_03/,
    "04.01"
  );
});

test("05 - throws when opts.joinRangesThatTouchEdges is wrong", () => {
  throws(
    () => {
      rMerge(
        [
          [1, 2],
          [0, 1],
        ],
        {
          joinRangesThatTouchEdges: "z",
        }
      );
    },
    /THROW_ID_04/,
    "05.01"
  );
});

test("06", () => {
  throws(
    () => {
      rMerge(
        [
          [1, 2],
          [0, 1],
        ],
        {
          mergeType: true,
        }
      );
    },
    "06.01",
    "06.01"
  );
  not.throws(() => {
    rMerge(
      [
        [1, 2],
        [0, 1],
      ],
      {
        progressFn: {},
      }
    );
  }, "06.02");
});

// 01. rMerge()
// ==========================

test("07 - simples: merges three overlapping ranges", () => {
  let input = [
    [3, 8],
    [1, 4],
    [2, 5],
  ];
  let inputBackup = clone(input);
  equal(rMerge(input), [[1, 8]], "07.01");
  equal(
    rMerge(input, {
      joinRangesThatTouchEdges: false,
    }),
    [[1, 8]],
    "07.02"
  );

  // input argument mutation checks:
  equal(input, inputBackup, "07.03");
});

test("08 - nothing to merge", () => {
  equal(
    rMerge([
      [3, 8],
      [1, 2],
    ]),
    [
      [1, 2],
      [3, 8],
    ],
    "08.01"
  );
  equal(
    rMerge(
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
});

test("09 - null input", () => {
  equal(rMerge(null), null, "09.01");
  equal(
    rMerge(null, {
      mergeType: 1,
    }),
    null,
    "09.02"
  );
  equal(
    rMerge(null, {
      mergeType: 2,
    }),
    null,
    "09.03"
  );
  equal(
    rMerge(null, {
      mergeType: "1",
    }),
    null,
    "09.04"
  );
  equal(
    rMerge(null, {
      mergeType: "2",
    }),
    null,
    "09.05"
  );

  equal(
    rMerge(null, {
      joinRangesThatTouchEdges: true,
    }),
    null,
    "09.06"
  );
  equal(
    rMerge(null, {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "09.07"
  );
});

test("10 - empty array", () => {
  equal(rMerge([]), null, "10.01");
  equal(
    rMerge([], {
      mergeType: 1,
    }),
    null,
    "10.02"
  );
  equal(
    rMerge([], {
      mergeType: 2,
    }),
    null,
    "10.03"
  );
  equal(
    rMerge([], {
      mergeType: "1",
    }),
    null,
    "10.04"
  );
  equal(
    rMerge([], {
      mergeType: "2",
    }),
    null,
    "10.05"
  );

  equal(
    rMerge([], {
      joinRangesThatTouchEdges: true,
    }),
    null,
    "10.06"
  );
  equal(
    rMerge([], {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "10.07"
  );
});

test("11 - empty array with null inside", () => {
  equal(rMerge([null]), null, "11.01");
  equal(
    rMerge([null], {
      mergeType: 1,
    }),
    null,
    "11.02"
  );
  equal(
    rMerge([null], {
      mergeType: 2,
    }),
    null,
    "11.03"
  );
  equal(
    rMerge([null], {
      mergeType: "1",
    }),
    null,
    "11.04"
  );
  equal(
    rMerge([null], {
      mergeType: "2",
    }),
    null,
    "11.05"
  );

  equal(
    rMerge([null], {
      joinRangesThatTouchEdges: true,
    }),
    null,
    "11.06"
  );
  equal(
    rMerge([null], {
      joinRangesThatTouchEdges: false,
    }),
    null,
    "11.07"
  );
});

test("12 - more complex case", () => {
  let counter = 0;
  equal(
    rMerge([[1, 5], null, [11, 15], [6, 10], null, [16, 20], [10, 30]]),
    [
      [1, 5],
      [6, 30],
    ],
    "12.01"
  );
  equal(
    rMerge(
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
  equal(
    rMerge(
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
  equal(
    rMerge(
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
          type(perc, "number");
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
  ok(counter > 5, "12.05");

  // with opts
  equal(
    rMerge(
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
  equal(
    rMerge(
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
});

test("13 - even more complex case", () => {
  let last;
  let counter = 0;
  equal(
    rMerge(
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
          ok(perc !== last);
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
  ok(counter < 100, "13.02");
});

test("14 - more merging examples", () => {
  equal(
    rMerge([
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
    "14.01"
  );
});

test("15 - superset range discards to-add content of their subset ranges #1", () => {
  equal(
    rMerge([
      [5, 6, " "],
      [1, 10],
    ]),
    [[1, 10]],
    "15.01"
  );
});

test("16 - superset range discards to-add content of their subset ranges #2", () => {
  equal(
    rMerge([
      [5, 7, " "],
      [6, 8, " "],
      [7, 9, " "],
      [1, 10],
    ]),
    [[1, 10]],
    "16.01"
  );
});

test("17 - superset range discards to-add content of their subset ranges #3", () => {
  equal(
    rMerge([
      [5, 7, " "],
      [1, 3, " "],
      [6, 8, " "],
      [7, 9, " "],
      [3, 10],
    ]),
    [[1, 10, " "]],
    "17.01"
  );
  equal(
    rMerge([
      [3, 10],
      [5, 7, " "],
      [1, 3, " "],
      [6, 8, " "],
      [7, 9, " "],
    ]),
    [[1, 10, " "]],
    "17.02"
  );
  equal(
    rMerge([
      [5, 7, " "],
      [1, 3, " "],
      [3, 10],
      [6, 8, " "],
      [7, 9, " "],
    ]),
    [[1, 10, " "]],
    "17.03"
  );
  equal(
    rMerge([
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
});

test("18 - third arg is null", () => {
  equal(
    rMerge([
      [3, 8, "c"],
      [1, 4, null],
      [2, 5, "b"],
    ]),
    [[1, 8, null]],
    "18.01"
  );
  equal(
    rMerge([
      [3, 8, "c"],
      [1, 4, null],
    ]),
    [[1, 8, null]],
    "18.02"
  );
  equal(
    rMerge([
      [1, 4, null],
      [3, 8, "c"],
    ]),
    [[1, 8, null]],
    "18.03"
  );
  equal(
    rMerge([
      [1, 4, "c"],
      [3, 8, null],
    ]),
    [[1, 8, null]],
    "18.04"
  );
  equal(
    rMerge([
      [3, 8, null],
      [1, 4, "c"],
    ]),
    [[1, 8, null]],
    "18.05"
  );
});

test("19 - only one range, nothing to merge", () => {
  equal(rMerge([[1, 4, null]]), [[1, 4, null]], "19.01");
  equal(rMerge([[1, 4]]), [[1, 4]], "19.02");
});

test("20 - input arg mutation prevention", () => {
  let originalInput = [
    [5, 7, " "],
    [1, 3, " "],
    [6, 8, " "],
    [7, 9, " "],
    [3, 10],
  ];
  let originalRef = Array.from(originalInput); // clone it

  equal(rMerge(originalInput), [[1, 10, " "]], "useless test");
  equal(originalInput, originalRef, "20.02");
});

test("21 - only two identical args in the range", () => {
  equal(
    rMerge([
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
  equal(rMerge([[1, 1]]), null, "21.02");

  // opts.mergeType === 2
  equal(
    rMerge(
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
  equal(rMerge([[1, 1]], { mergeType: 2 }), null, "21.04");
});

test("22 - third arg", () => {
  // opts.mergeType === 1
  equal(
    rMerge([
      [3, 8, "c"],
      [1, 4, "a"],
      [2, 5, "b"],
    ]),
    [[1, 8, "abc"]],
    "22.01"
  );
  equal(
    rMerge([
      [3, 8, "c"],
      [1, 4],
      [2, 5, "b"],
    ]),
    [[1, 8, "bc"]],
    "22.02"
  );
  equal(
    rMerge([
      [3, 8, "c"],
      [1, 4, "a"],
      [2, 5],
    ]),
    [[1, 8, "ac"]],
    "22.03"
  );
  equal(
    rMerge([
      [3, 8],
      [1, 4, "a"],
      [2, 5, "b"],
    ]),
    [[1, 8, "ab"]],
    "22.04"
  );

  // opts.mergeType === 2
  equal(
    rMerge(
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
  equal(
    rMerge(
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
  equal(
    rMerge(
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
  equal(
    rMerge(
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
});

// 02. opts.mergeType === 2
// -----------------------------------------------------------------------------

test("23 - few ranges starting at the same index", () => {
  // hors d'oeuvres - opts.mergeType === 1
  equal(
    rMerge([
      [3, 4, "aaa"],
      [3, 12, "zzz"],
    ]),
    [[3, 12, "aaazzz"]],
    "23.01"
  );
  equal(
    rMerge([
      [3, 12, "zzz"],
      [3, 4, "aaa"],
    ]), // notice order is opposite
    [[3, 12, "aaazzz"]], // <--- order does not matter, ranges are sorted
    "23.02"
  );
  equal(
    rMerge(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: 1 }
    ),
    [[3, 12, "aaazzz"]],
    "23.03"
  );
  equal(
    rMerge(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: "1" }
    ),
    [[3, 12, "aaazzz"]],
    "23.04"
  );

  // entrée - opts.mergeType === 2
  equal(
    rMerge(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: 2 }
    ),
    [[3, 12, "zzz"]],
    "23.05"
  );
  equal(
    rMerge(
      [
        [3, 4, "aaa"],
        [3, 12, "zzz"],
      ],
      { mergeType: "2" }
    ),
    [[3, 12, "zzz"]],
    "23.06"
  );
  equal(
    rMerge(
      [
        [3, 12, "zzz"],
        [3, 4, "aaa"],
      ],
      { mergeType: 2 }
    ),
    [[3, 12, "zzz"]], // ^ order does not matter
    "23.07"
  );
});

// 3. opts.joinRangesThatTouchEdges
// -----------------------------------------------------------------------------

test("24 - third arg", () => {
  let inp1 = [
    [1, 3, "a"],
    [3, 6, "b"],
  ];
  let res1 = [[1, 6, "ab"]];
  equal(rMerge(inp1), res1, "24.01");
  equal(
    rMerge(inp1, {
      joinRangesThatTouchEdges: true,
    }),
    res1,
    "24.02"
  );
  equal(
    rMerge(inp1, {
      joinRangesThatTouchEdges: false,
    }),
    inp1,
    "24.03"
  );
});

test.run();
