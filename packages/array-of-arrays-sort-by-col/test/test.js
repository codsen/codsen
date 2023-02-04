import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import shuffle from "array-shuffle";

import { sortByCol } from "../dist/array-of-arrays-sort-by-col.esm.js";

function mixer(tested, reference, idx) {
  // backwards loop for perf:
  for (let i = tested.length; i--; ) {
    tested.unshift(tested.pop());
    // console.log(
    //   `${`\u001b[${33}m${`specimen #${
    //     String(tested.length - i).length === 1
    //       ? `0${tested.length - i}`
    //       : tested.length - i
    //   }`}\u001b[${39}m`} = ${JSON.stringify(tested, null, 0)}`
    // );
    equal(sortByCol(tested, idx), reference);
  }
  for (let i = tested.length * tested.length; i--; ) {
    let specimen = shuffle(tested);

    // const rowNumber = tested.length + (tested.length * tested.length - i);
    // console.log(
    //   `${`\u001b[${35}m${`specimen #${
    //     String(rowNumber).length === 1 ? `0${rowNumber}` : rowNumber
    //   }`}\u001b[${39}m`} = ${JSON.stringify(specimen, null, 0)}`
    // );

    equal(sortByCol(specimen, idx), reference);
  }
}

// -----------------------------------------------------------------------------

test("01 - multiple elements, #1", () => {
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]] // first el., 1-1-1-1
  );
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // first el., hardcoded, same as above
    0
  );
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // first el., hardcoded, same as above
    "0"
  );
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // second el., 2-4-4-undefined
    1
  );
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // second el., 2-4-4-undefined
    "1"
  );
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // third el., 3-3-4-undefined
    2
  );
  mixer(
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // third el., 3-3-4-undefined
    "2"
  );

  throws(
    () => {
      sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], 3);
    },
    /THROW_ID_03/,
    "01.01"
  );

  throws(
    () => {
      sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], "3");
    },
    /THROW_ID_03/,
    "01.02"
  );

  throws(
    () => {
      sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], 99);
    },
    /THROW_ID_03/,
    "01.03"
  );

  throws(
    () => {
      sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], "999");
    },
    /THROW_ID_03/,
    "01.04"
  );
});

test("02 - multiple elements, #2", () => {
  mixer(
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]]
  );
});

test("03 - multiple elements, #2", () => {
  mixer(
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    0
  );
});

test("04 - multiple elements, #2", () => {
  mixer(
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    1
  );
});

test("05 - multiple elements, #2", () => {
  mixer(
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 9, 0], [1, 8, 2], [1, 7, 5], [1]],
    2
  );
});

test("06 - multiple elements, #2 - axis outside of the range", () => {
  throws(
    () => {
      sortByCol([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 3);
    },
    /THROW_ID_03/,
    "06.01"
  );
});

test("07 - multiple elements, #2 - axis outside of the range", () => {
  throws(
    () => {
      sortByCol([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 99);
    },
    /THROW_ID_03/,
    "07.01"
  );
});

test("08 - multiple elements, #3 - opposite order", () => {
  mixer(
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]]
  );
  mixer(
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    0
  );
  mixer(
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    1
  );
  mixer(
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    2
  );
});

test("09 - multiple elements, #4 - single elements", () => {
  mixer([[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]]);
  mixer([[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], 0);
  mixer([[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], "0");

  throws(
    () => {
      sortByCol([[0], [0], [3], [2], [1]], 1); // second element doesn't exist
    },
    /THROW_ID_03/,
    "09.01"
  );

  throws(
    () => {
      sortByCol([[0], [0], [3], [2], [1]], 99); // 100-th element doesn't exist
    },
    /THROW_ID_03/,
    "09.02"
  );
});

test("10 - first column indexes contain opposite order values", () => {
  mixer(
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]]
  ); // defaulting to first elements, that's indexes "0" and they contain values: 1-2-3-undefined
});

test("11 - first column indexes contain opposite order values", () => {
  mixer(
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    0 // first elements, indexes "0" contain values: 1-2-3-undefined
  );
});

test("12 - first column indexes contain opposite order values", () => {
  mixer(
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[3, 7, 0], [2, 8, 0], [1, 9, 0], [1]],
    1 // second elements, indexes "1" contain values: 7-8-9-undefined
  );
});

test("13 - first column indexes contain opposite order values", () => {
  // zero's were done firs so [1] goes last. Since all second indexes are the same
  // across rows, matching containued by comparing using a ripple
  // algorithm, which will start on index column on the left
  // of axis (#2), and that's column index #1, which is
  // 7-8-9.
  mixer(
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[3, 7, 0], [2, 8, 0], [1, 9, 0], [1]],
    2 // Third elements, indexes "2" contain values: 0-0-0-undefined across rows
  );
});

test("14 - null over number", () => {
  mixer(
    [
      [1, null],
      [1, 1],
    ],
    [
      [1, 1],
      [1, null],
    ]
  );
  mixer(
    [
      [1, null],
      [1, 1],
    ],
    [
      [1, 1],
      [1, null],
    ],
    1
  );
});

test("15 - just nulls over numbers", () => {
  mixer(
    [
      [null, null, null],
      [1, 1, 1],
    ],
    [
      [1, 1, 1],
      [null, null, null],
    ]
  );
});

test("16 - just nulls over numbers", () => {
  mixer([[1, 4], [1]], [[1, 4], [1]]);
  mixer([[1, 4], [1]], [[1, 4], [1]], 0);
  mixer([[1, 4], [1]], [[1, 4], [1]], 1);

  mixer(
    [
      [1, 4],
      [1, 3],
    ],
    [
      [1, 3],
      [1, 4],
    ]
  );
  mixer(
    [
      [1, 4],
      [1, 3],
    ],
    [
      [1, 3],
      [1, 4],
    ],
    0
  );
  mixer(
    [
      [1, 4],
      [1, 3],
    ],
    [
      [1, 3],
      [1, 4],
    ],
    1
  );
});

test("17 - just nulls over numbers", () => {
  mixer(
    [
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, null],
      [null, null, null, null, null, 9],
    ],
    [
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    0
  );
  mixer(
    [
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    [
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    1
  );
  mixer(
    [
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    [
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    2
  );
  mixer(
    [
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    [
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    3
  );
  mixer(
    [
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, null],
      [null, null, null, null, null, 9],
    ],
    [
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    4
  );
  mixer(
    [
      [null, null, null, null, null, 2],
      [null, null, null, null, null, null],
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 9],
    ],
    [
      [null, null, null, null, null, 1],
      [null, null, null, null, null, 2],
      [null, null, null, null, null, 9],
      [null, null, null, null, null, null],
    ],
    5
  );
});

test("18 - value of first ripple-left is null", () => {
  mixer(
    [
      [null, 9],
      [1, 9],
    ],
    [
      [1, 9],
      [null, 9],
    ]
  );
  mixer(
    [
      [null, 9],
      [1, 9],
    ],
    [
      [1, 9],
      [null, 9],
    ],
    0
  );
  mixer(
    [
      [null, 9],
      [1, 9],
    ],
    [
      [1, 9],
      [null, 9],
    ],
    1
  );
});

test("19 - same values", () => {
  mixer(
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]
  );
});

// -----------------------------------------------------------------------------
// 2. edge-cases

test("20 - various empty arrays", () => {
  mixer([], []);
  mixer([[]], [[]]);
  mixer([[], []], [[], []]);
  mixer([[], [], []], [[], [], []]);
  mixer([[], [1], []], [[1], [], []]);
  // hardcoded default column
  mixer([], [], 0);
  mixer([[]], [[]], 0);
  mixer([[], []], [[], []], 0);
  mixer([[], [], []], [[], [], []], 0);
  mixer([[], [1], []], [[1], [], []], 0);
});

test("21 - throws", () => {
  // pinning throws by throw ID:
  throws(
    () => {
      sortByCol(1);
    },
    /THROW_ID_01/,
    "21.01"
  );

  throws(
    () => {
      sortByCol(true);
    },
    /THROW_ID_01/,
    "21.02"
  );

  throws(
    () => {
      sortByCol("z");
    },
    /THROW_ID_01/,
    "21.03"
  );

  throws(
    () => {
      sortByCol([], "a");
    },
    /THROW_ID_02/,
    "21.04"
  );
});

test("22 - throws when sort-by value is outside of any sub-arrays", () => {
  // pinning throws by throw ID:
  throws(
    () => {
      sortByCol(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        3 // all sub-arrays' max-length=2 since it's zero-indexed
      );
    },
    /THROW_ID_03/,
    "22.01"
  );
});

// -----------------------------------------------------------------------------
// 3. sorting by column and clumping of values around the column sorted

test("23 - clumping - simple case with values as undefined", () => {
  mixer(
    [
      [null, null, 2, 1, null],
      [null, 1, 2, 1, 0],
    ],
    [
      [null, 1, 2, 1, 0],
      [null, null, 2, 1, null],
    ],
    2
  );
});

test("24 - clumping - left side takes priority over right - case #1 - values on both sides", () => {
  mixer(
    [
      [null, null, null, 7, 2],
      [null, null, null, 7, 1],
      [null, null, 1, 7, null],
    ],
    [
      [null, null, 1, 7, null],
      [null, null, null, 7, 1],
      [null, null, null, 7, 2],
    ],
    3
  );
});

test("25 - clumping - left side takes priority over right - case #2 - axis is 0th col", () => {
  mixer(
    [
      [7, 2],
      [7, 1],
      [7, null],
    ],
    [
      [7, 1],
      [7, 2],
      [7, null],
    ],
    0
  );
});

test("26 - clumping - left side takes priority over right - case #3 - sort axis is last value (equal length subarrays)", () => {
  mixer(
    [
      [null, null, 2, 7],
      [null, null, null, 7],
      [null, null, 1, 7],
    ],
    [
      [null, null, 1, 7],
      [null, null, 2, 7],
      [null, null, null, 7],
    ],
    3
  );
});

test.run();
