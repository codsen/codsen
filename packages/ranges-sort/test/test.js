import tap from "tap";
import srt from "../dist/ranges-sort.esm";

// ==============================
// 0. THROWS
// ==============================

tap.test("00.01 - not array", (t) => {
  t.throws(() => {
    srt(null);
  });
  t.throws(() => {
    srt(1);
  });
  t.throws(() => {
    srt(true);
  });
  t.throws(() => {
    srt({ e: true });
  });
  t.end();
});

tap.test("00.02 - not two arguments in one of ranges", (t) => {
  t.throws(() => {
    srt([[1, 2, 3]], { strictlyTwoElementsInRangeArrays: true });
  });
  t.throws(() => {
    srt(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      { strictlyTwoElementsInRangeArrays: true }
    );
  });
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
  });
  t.doesNotThrow(() => {
    srt([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
  });
  t.doesNotThrow(() => {
    srt([]);
  });
  // with defaults opts
  t.doesNotThrow(() => {
    srt([[1, 2, 3]]);
  });
  t.doesNotThrow(() => {
    srt([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });
  t.doesNotThrow(() => {
    srt([
      [1, 2],
      [4, 5, 6],
      [7, 8],
    ]);
  });
  t.end();
});

tap.test("00.03 - some/all range indexes are not natural numbers", (t) => {
  t.doesNotThrow(() => {
    srt([[0, 3]]);
  });
  t.throws(() => {
    srt([[0.2, 3]]);
  });
  t.throws(() => {
    srt([[0.2, 3.3]]);
  });
  t.throws(() => {
    srt([[2, 3.3]]);
  });
  t.throws(() => {
    srt([[0.2, 3.3]]);
  });
  t.throws(() => {
    srt([[0.2, 33]]);
  });
  t.throws(() => {
    srt([[0.2, 33, 55, 66.7]]);
  });
  t.end();
});

// ==============================
// 01. Sorting
// ==============================

tap.test("01.01 - no ranges given", (t) => {
  t.same(srt([]), [], "01.01 - copes fine");
  t.end();
});

tap.test("01.02 - only one range given", (t) => {
  t.same(srt([[0, 3]]), [[0, 3]], "01.02.01");
  t.same(srt([[0, 3, "zzz"]]), [[0, 3, "zzz"]], "01.02.02");
  t.end();
});

tap.test("01.03 - two ranges", (t) => {
  t.same(
    srt([
      [0, 3],
      [5, 6],
    ]),
    [
      [0, 3],
      [5, 6],
    ],
    "01.03.01"
  );
  t.same(
    srt([
      [5, 6],
      [0, 3],
    ]),
    [
      [0, 3],
      [5, 6],
    ],
    "01.03.02"
  );
  t.same(
    srt([
      [0, 3, "zzz"],
      [5, 6],
    ]),
    [
      [0, 3, "zzz"],
      [5, 6],
    ],
    "01.03.03"
  );
  t.same(
    srt([
      [5, 6],
      [0, 3, "zzz"],
    ]),
    [
      [0, 3, "zzz"],
      [5, 6],
    ],
    "01.03.04"
  );
  t.end();
});

tap.test("01.04 - many ranges", (t) => {
  t.same(
    srt([
      [0, 3],
      [5, 8],
      [5, 6],
    ]),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "01.04.01"
  );
  t.same(
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
    "01.04.02"
  );
  t.same(
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
    "01.04.03"
  );
  t.same(
    srt([
      [5, 6],
      [5, 6],
    ]),
    [
      [5, 6],
      [5, 6],
    ],
    "01.04.04 - same ranges"
  );
  t.same(
    srt([
      [5, 6],
      [5, 6, "zzz"],
    ]),
    [
      [5, 6],
      [5, 6, "zzz"],
    ],
    "01.04.05 - same ranges"
  );
  t.throws(() => {
    srt(
      [
        [5, 6],
        [5, 6, "zzz"],
      ],
      { strictlyTwoElementsInRangeArrays: true }
    );
  });
  t.same(
    srt([
      [9, 12],
      [9, 15],
    ]),
    [
      [9, 12],
      [9, 15],
    ],
    "01.04.07"
  );
  t.end();
});

// ==============================
// 02. Ad-Hoc
// ==============================

tap.test("02.01 - does not mutate the input arg", (t) => {
  const original = [
    [5, 6],
    [3, 4],
    [1, 2],
  ];
  srt(original);
  t.same(
    original,
    [
      [5, 6],
      [3, 4],
      [1, 2],
    ],
    "02.01"
  );
  t.end();
});

// ==============================
// 3. EXAMPLES FROM README
// ==============================

tap.test("03.01 - readme example #1", (t) => {
  t.same(
    srt([
      [5, 6],
      [1, 3],
    ]),
    [
      [1, 3],
      [5, 6],
    ],
    "03.01"
  );
  t.end();
});

tap.test("03.02 - readme example #2", (t) => {
  t.same(
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
    "03.02"
  );
  t.end();
});

tap.test("03.03 - readme example #3", (t) => {
  t.throws(() => {
    srt([[1, 2], []]); // throws, because there's at least one empty range
  });
  t.end();
});

tap.test("03.04 - readme example #4", (t) => {
  t.throws(() => {
    srt([["a"]]); // throws, because range is given as string
  });
  t.end();
});

tap.test("03.05 - an extra for readme example #4", (t) => {
  t.throws(() => {
    srt([[1, "a"]]); // throws, because range is given as string
  });
  t.end();
});

tap.test("03.06 readme example #5", (t) => {
  t.throws(() => {
    srt([[1], [2]]); // throws, because one index is not a range
  });
  t.end();
});

tap.test("03.07 readme example #6", (t) => {
  t.same(
    srt([
      [3, 4, "aaa", "bbb"],
      [1, 2, "zzz"],
    ]),
    [
      [1, 2, "zzz"],
      [3, 4, "aaa", "bbb"],
    ],
    "03.07 - 3rd argument and onwards are ignored"
  );
  t.end();
});

// ==============================
// 04. opts.progressFn
// ==============================

// TODO:
tap.test("04.01 - calls progress callback correctly", (t) => {
  t.same(
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
    "04.01.01 - callback fn is null"
  );
  t.same(
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
    "04.01.02 - callback fn is false"
  );
  t.same(
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
    "04.01.03 - empty opts obj"
  );
  t.same(
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
    "04.01.04 - baseline, no fn to call"
  );
  t.end();
});
