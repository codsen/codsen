import tap from "tap";
import { rSort as srt } from "../dist/ranges-sort.esm";

// ==============================
// 0. THROWS
// ==============================

tap.test("01 - not array", (t) => {
  t.is(srt(null), null, "01.01");
  t.is(srt(1), 1, "01.02");
  t.is(srt(true), true, "01.03");
  t.strictSame(srt({ e: true }), { e: true }, "01.04");
  t.end();
});

tap.test("02 - not two arguments in one of ranges", (t) => {
  t.throws(() => {
    srt([[1, 2, 3]], { strictlyTwoElementsInRangeArrays: true });
  }, "02.01");
  t.throws(() => {
    srt(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      { strictlyTwoElementsInRangeArrays: true }
    );
  }, "02.02");
  t.throws(() => {
    srt(
      [
        [1, 2],
        [4, 5, 6],
        [7, 8],
      ],
      {
        strictlyTwoElementsInRangeArrays: true,
      }
    );
  }, "02.03");
  t.doesNotThrow(() => {
    srt([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
  }, "02.04");
  t.doesNotThrow(() => {
    srt([]);
  }, "02.05");
  // with defaults opts
  t.doesNotThrow(() => {
    srt([[1, 2, 3]]);
  }, "02.06");
  t.doesNotThrow(() => {
    srt([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  }, "02.07");
  t.doesNotThrow(() => {
    srt([
      [1, 2],
      [4, 5, 6],
      [7, 8],
    ]);
  }, "02.08");
  t.end();
});

tap.test("03 - some/all range indexes are not natural numbers", (t) => {
  t.doesNotThrow(() => {
    srt([[0, 3]]);
  }, "03.01");
  t.throws(() => {
    srt([[0.2, 3]]);
  }, "03.02");
  t.throws(() => {
    srt([[0.2, 3.3]]);
  }, "03.03");
  t.throws(() => {
    srt([[2, 3.3]]);
  }, "03.04");
  t.throws(() => {
    srt([[0.2, 3.3]]);
  }, "03.05");
  t.throws(() => {
    srt([[0.2, 33]]);
  }, "03.06");
  t.throws(() => {
    srt([[0.2, 33, 55, 66.7]]);
  }, "03.07");
  t.end();
});

// ==============================
// 01. Sorting
// ==============================

tap.test("04 - no ranges given", (t) => {
  t.strictSame(srt([]), [], "04 - copes fine");
  t.end();
});

tap.test("05 - only one range given", (t) => {
  t.strictSame(srt([[0, 3]]), [[0, 3]], "05.01");
  t.strictSame(srt([[0, 3, "zzz"]]), [[0, 3, "zzz"]], "05.02");
  t.end();
});

tap.test("06 - two ranges", (t) => {
  t.strictSame(
    srt([
      [0, 3],
      [5, 6],
    ]),
    [
      [0, 3],
      [5, 6],
    ],
    "06.01"
  );
  t.strictSame(
    srt([
      [5, 6],
      [0, 3],
    ]),
    [
      [0, 3],
      [5, 6],
    ],
    "06.02"
  );
  t.strictSame(
    srt([
      [0, 3, "zzz"],
      [5, 6],
    ]),
    [
      [0, 3, "zzz"],
      [5, 6],
    ],
    "06.03"
  );
  t.strictSame(
    srt([
      [5, 6],
      [0, 3, "zzz"],
    ]),
    [
      [0, 3, "zzz"],
      [5, 6],
    ],
    "06.04"
  );
  t.end();
});

tap.test("07 - many ranges", (t) => {
  t.strictSame(
    srt([[0, 3], null, [5, 8], [5, 6]]),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "07.01"
  );
  t.strictSame(
    srt([
      [5, 8],
      [5, 6],
      [0, 3],
    ]),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "07.02"
  );
  t.strictSame(
    srt([
      [0, 8],
      [5, 6],
      [0, 3],
    ]),
    [
      [0, 3],
      [0, 8],
      [5, 6],
    ],
    "07.03"
  );
  t.strictSame(
    srt([
      [5, 6],
      [5, 6],
    ]),
    [
      [5, 6],
      [5, 6],
    ],
    "07.04 - same ranges"
  );
  t.strictSame(
    srt([
      [5, 6],
      [5, 6, "zzz"],
    ]),
    [
      [5, 6],
      [5, 6, "zzz"],
    ],
    "07.05 - same ranges"
  );
  t.throws(() => {
    srt(
      [
        [5, 6],
        [5, 6, "zzz"],
      ],
      { strictlyTwoElementsInRangeArrays: true }
    );
  }, "07.06");
  t.strictSame(
    srt([
      [9, 12],
      [9, 15],
    ]),
    [
      [9, 12],
      [9, 15],
    ],
    "07.07"
  );
  t.end();
});

// ==============================
// 02. Ad-Hoc
// ==============================

tap.test("08 - does not mutate the input arg", (t) => {
  const original = [
    [5, 6],
    [3, 4],
    [1, 2],
  ];
  srt(original);
  t.strictSame(
    original,
    [
      [5, 6],
      [3, 4],
      [1, 2],
    ],
    "08"
  );
  t.end();
});

// ==============================
// 3. EXAMPLES FROM README
// ==============================

tap.test("09 - readme example #1", (t) => {
  t.strictSame(
    srt([
      [5, 6],
      [1, 3],
    ]),
    [
      [1, 3],
      [5, 6],
    ],
    "09"
  );
  t.end();
});

tap.test("10 - readme example #2", (t) => {
  t.strictSame(
    srt([
      [5, 6],
      [5, 3],
      [5, 0],
    ]),
    [
      [5, 0],
      [5, 3],
      [5, 6],
    ],
    "10"
  );
  t.end();
});

tap.test("11 - readme example #3", (t) => {
  t.throws(() => {
    srt([[1, 2], []]); // throws, because there's at least one empty range
  }, "11");
  t.end();
});

tap.test("12 - readme example #4", (t) => {
  t.throws(() => {
    srt([["a"]]); // throws, because range is given as string
  }, "12");
  t.end();
});

tap.test("13 - an extra for readme example #4", (t) => {
  t.throws(() => {
    srt([[1, "a"]]); // throws, because range is given as string
  }, "13");
  t.end();
});

tap.test("14 readme example #5", (t) => {
  t.throws(() => {
    srt([[1], [2]]); // throws, because one index is not a range
  }, "14");
  t.end();
});

tap.test("15 readme example #6", (t) => {
  t.strictSame(
    srt([
      [3, 4, "aaa", "bbb"],
      [1, 2, "zzz"],
    ]),
    [
      [1, 2, "zzz"],
      [3, 4, "aaa", "bbb"],
    ],
    "15 - 3rd argument and onwards are ignored"
  );
  t.end();
});

// ==============================
// 04. opts.progressFn
// ==============================

// TODO:
tap.test("16 - calls progress callback correctly", (t) => {
  t.strictSame(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {
        progressFn: null,
      }
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.01 - callback fn is null"
  );
  t.strictSame(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {
        progressFn: false,
      }
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.02 - callback fn is false"
  );
  t.strictSame(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {}
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.03 - empty opts obj"
  );
  t.strictSame(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {
        progressFn: (percentage) => {
          // console.log(`percentage = ${percentage}`);
          t.pass(`worked - ${percentage}`);
        },
      }
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.04 - baseline, no fn to call"
  );
  t.end();
});
