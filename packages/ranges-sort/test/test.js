// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { rSort as srt } from "../dist/ranges-sort.esm.js";

// ==============================
// 0. THROWS
// ==============================

test("01 - not array", () => {
  is(srt(null), null, "01.01");
  is(srt(1), 1, "01.02");
  is(srt(true), true, "01.03");
  equal(srt({ e: true }), { e: true }, "01.04");
});

test("02 - not two arguments in one of ranges", () => {
  throws(
    () => {
      srt([[1, 2, 3]], { strictlyTwoElementsInRangeArrays: true });
    },
    "02.01",
    "02.01",
  );
  throws(
    () => {
      srt(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        { strictlyTwoElementsInRangeArrays: true },
      );
    },
    "02.02",
    "02.02",
  );
  throws(
    () => {
      srt(
        [
          [1, 2],
          [4, 5, 6],
          [7, 8],
        ],
        {
          strictlyTwoElementsInRangeArrays: true,
        },
      );
    },
    "02.03",
    "02.03",
  );
  not.throws(() => {
    srt([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
  }, "02.04");
  not.throws(() => {
    srt([]);
  }, "02.05");
  // with defaults opts
  not.throws(() => {
    srt([[1, 2, 3]]);
  }, "02.06");
  not.throws(() => {
    srt([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  }, "02.07");
  not.throws(() => {
    srt([
      [1, 2],
      [4, 5, 6],
      [7, 8],
    ]);
  }, "02.08");
});

test("03 - some/all range indexes are not natural numbers", () => {
  not.throws(() => {
    srt([[0, 3]]);
  }, "03.01");
  throws(
    () => {
      srt([[0.2, 3]]);
    },
    "03.02",
    "03.01",
  );
  throws(
    () => {
      srt([[0.2, 3.3]]);
    },
    "03.03",
    "03.02",
  );
  throws(
    () => {
      srt([[2, 3.3]]);
    },
    "03.04",
    "03.03",
  );
  throws(
    () => {
      srt([[0.2, 3.3]]);
    },
    "03.05",
    "03.04",
  );
  throws(
    () => {
      srt([[0.2, 33]]);
    },
    "03.06",
    "03.05",
  );
  throws(
    () => {
      srt([[0.2, 33, 55, 66.7]]);
    },
    "03.07",
    "03.06",
  );
});

// ==============================
// 01. Sorting
// ==============================

test("04 - no ranges given", () => {
  equal(srt([]), [], "04.01");
});

test("05 - only one range given", () => {
  equal(srt([[0, 3]]), [[0, 3]], "05.01");
  equal(srt([[0, 3, "zzz"]]), [[0, 3, "zzz"]], "05.02");
});

test("06 - two ranges", () => {
  equal(
    srt([
      [0, 3],
      [5, 6],
    ]),
    [
      [0, 3],
      [5, 6],
    ],
    "06.01",
  );
  equal(
    srt([
      [5, 6],
      [0, 3],
    ]),
    [
      [0, 3],
      [5, 6],
    ],
    "06.02",
  );
  equal(
    srt([
      [0, 3, "zzz"],
      [5, 6],
    ]),
    [
      [0, 3, "zzz"],
      [5, 6],
    ],
    "06.03",
  );
  equal(
    srt([
      [5, 6],
      [0, 3, "zzz"],
    ]),
    [
      [0, 3, "zzz"],
      [5, 6],
    ],
    "06.04",
  );
});

test("07 - many ranges", () => {
  equal(
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
    "07.01",
  );
  equal(
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
    "07.02",
  );
  equal(
    srt([
      [5, 6],
      [5, 6],
    ]),
    [
      [5, 6],
      [5, 6],
    ],
    "07.03",
  );
  equal(
    srt([
      [5, 6],
      [5, 6, "zzz"],
    ]),
    [
      [5, 6],
      [5, 6, "zzz"],
    ],
    "07.04",
  );
  throws(
    () => {
      srt(
        [
          [5, 6],
          [5, 6, "zzz"],
        ],
        { strictlyTwoElementsInRangeArrays: true },
      );
    },
    "07.05",
    "07.05",
  );
  equal(
    srt([
      [9, 12],
      [9, 15],
    ]),
    [
      [9, 12],
      [9, 15],
    ],
    "07.05",
  );
});

// ==============================
// 02. Ad-Hoc
// ==============================

test("08 - does not mutate the input arg", () => {
  let original = [
    [5, 6],
    [3, 4],
    [1, 2],
  ];
  srt(original);
  equal(
    original,
    [
      [5, 6],
      [3, 4],
      [1, 2],
    ],
    "08.01",
  );
});

// ==============================
// 3. EXAMPLES FROM README
// ==============================

test("09 - readme example #1", () => {
  equal(
    srt([
      [5, 6],
      [1, 3],
    ]),
    [
      [1, 3],
      [5, 6],
    ],
    "09.01",
  );
});

test("10 - readme example #2", () => {
  equal(
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
    "10.01",
  );
});

test("11 - readme example #3", () => {
  throws(
    () => {
      srt([[1, 2], []]); // throws, because there's at least one empty range
    },
    "11.01",
    "11.01",
  );
});

test("12 - readme example #4", () => {
  throws(
    () => {
      srt([["a"]]); // throws, because range is given as string
    },
    "12.01",
    "12.01",
  );
});

test("13 - an extra for readme example #4", () => {
  throws(
    () => {
      srt([[1, "a"]]); // throws, because range is given as string
    },
    "13.01",
    "13.01",
  );
});

test("14 - readme example #5", () => {
  throws(
    () => {
      srt([[1], [2]]); // throws, because one index is not a range
    },
    "14.01",
    "14.01",
  );
});

test("15 - readme example #6", () => {
  equal(
    srt([
      [3, 4, "aaa", "bbb"],
      [1, 2, "zzz"],
    ]),
    [
      [1, 2, "zzz"],
      [3, 4, "aaa", "bbb"],
    ],
    "15.01",
  );
});

// ==============================
// 04. opts.progressFn
// ==============================

test("16 - calls progress callback correctly", () => {
  equal(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {
        progressFn: null,
      },
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.01",
  );
  equal(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {
        progressFn: false,
      },
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.02",
  );
  equal(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {},
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.03",
  );
  equal(
    srt(
      [
        [0, 3],
        [5, 8],
        [5, 6],
      ],
      {
        progressFn: (percentage) => {
          // console.log(`percentage = ${percentage}`);
          ok(`worked - ${percentage}`);
        },
      },
    ),
    [
      [0, 3],
      [5, 6],
      [5, 8],
    ],
    "16.04",
  );
});

test("17 - gaps in array", () => {
  const sparse = Array(3);
  sparse[0] = [0, 3];
  sparse[2] = [5, 8];
  throws(
    () => {
      srt(sparse);
    },
    /THROW_ID_02/,
    "17.01",
  );
  throws(
    () => {
      srt(sparse, { strictlyTwoElementsInRangeArrays: true });
    },
    /THROW_ID_01/,
    "17.02",
  );
});

test("18 - invalid range members", () => {
  for (const [index, invalidRange] of [
    undefined,
    null,
    1,
    "1,2",
    {},
    [],
    [1],
    [1, null],
  ].entries()) {
    throws(
      () => {
        srt([[0, 3], invalidRange, [5, 8]]);
      },
      /THROW_ID_02/,
      `18.${String(index * 2 + 1).padStart(2, "0")}`,
    );
    throws(
      () => {
        srt([[0, 3], invalidRange, [5, 8]], {
          strictlyTwoElementsInRangeArrays: true,
        });
      },
      Array.isArray(invalidRange) && invalidRange.length === 2
        ? /THROW_ID_02/
        : /THROW_ID_01/,
      `18.${String(index * 2 + 2).padStart(2, "0")}`,
    );
  }
});

test("19 - exact ties preserve input order above old V8 cutoff", () => {
  const input = Array.from({ length: 12 }, (_, index) => [
    1,
    2,
    String.fromCharCode(97 + index),
  ]);
  const nativeSort = Array.prototype.sort;
  Array.prototype.sort = function deliberatelyUnstableSort(compareFn) {
    nativeSort.call(this, compareFn);
    if (this.length > 10 && compareFn(this[0], this[this.length - 1]) === 0) {
      this.reverse();
    }
    return this;
  };
  try {
    equal(srt(input), input, "19.01");
  } finally {
    Array.prototype.sort = nativeSort;
  }
});

test("20 - long arrays sort by both coordinates", () => {
  equal(
    srt(
      [
        [5, 6],
        [5, 3],
        [5, 0],
        [4, 8],
        [1, 2],
        [9, 10],
        [5, 7],
        [3, 4],
        [2, 3],
        [8, 9],
        [7, 8],
        [6, 7],
      ],
      { progressFn: () => {} },
    ),
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 8],
      [5, 0],
      [5, 3],
      [5, 6],
      [5, 7],
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
    ],
    "20.01",
  );
});

test("21 - progress is monotonic and completes", () => {
  const inputs = [
    [[1, 2]],
    [
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    [
      [3, 4],
      [2, 3],
      [1, 2],
    ],
    [
      [3, 4],
      [1, 3],
      [1, 2],
      [2, 3],
    ],
    Array.from({ length: 12 }, (_, index) => [1, 2, index]),
    Array.from({ length: 100 }, (_, index) => [100 - index, 101 - index]),
  ];
  const sequences = inputs.map((ranges) => {
    const percentages = [];
    srt(ranges, {
      progressFn: (percentage) => percentages.push(percentage),
    });
    return percentages;
  });

  equal(
    sequences.map((percentages) => percentages[percentages.length - 1]),
    [100, 100, 100, 100, 100, 100],
    "21.01",
  );
  equal(
    sequences.every((percentages) =>
      percentages.every(
        (percentage) =>
          Number.isInteger(percentage) && percentage >= 0 && percentage <= 100,
      ),
    ),
    true,
    "21.02",
  );
  equal(
    sequences.every((percentages) =>
      percentages.every(
        (percentage, index) =>
          index === 0 || percentage > percentages[index - 1],
      ),
    ),
    true,
    "21.03",
  );
  const emptyPercentages = [];
  srt([], {
    progressFn: (percentage) => emptyPercentages.push(percentage),
  });
  equal(emptyPercentages, [], "21.04");

  const errorPercentages = [];
  throws(
    () =>
      srt([[1, 2], null], {
        progressFn: (percentage) => errorPercentages.push(percentage),
      }),
    /THROW_ID_02/,
    "21.05",
  );
  equal(errorPercentages, [], "21.05");
});

test.run();
