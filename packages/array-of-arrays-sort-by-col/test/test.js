import tap from "tap";
import shuffle from "array-shuffle";
import sortByCol from "../dist/array-of-arrays-sort-by-col.esm";

function mixer(t, tested, reference, idx) {
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
    t.same(sortByCol(tested, idx), reference);
  }
  for (let i = tested.length * tested.length; i--; ) {
    const specimen = shuffle(tested);

    // const rowNumber = tested.length + (tested.length * tested.length - i);
    // console.log(
    //   `${`\u001b[${35}m${`specimen #${
    //     String(rowNumber).length === 1 ? `0${rowNumber}` : rowNumber
    //   }`}\u001b[${39}m`} = ${JSON.stringify(specimen, null, 0)}`
    // );

    t.same(sortByCol(specimen, idx), reference);
  }
}

// -----------------------------------------------------------------------------

tap.test("01 - multiple elements, #1", (t) => {
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]] // first el., 1-1-1-1
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // first el., hardcoded, same as above
    0
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // first el., hardcoded, same as above
    "0"
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // second el., 2-4-4-undefined
    1
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // second el., 2-4-4-undefined
    "1"
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // third el., 3-3-4-undefined
    2
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // third el., 3-3-4-undefined
    "2"
  );

  t.throws(() => {
    sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], 3);
  }, /THROW_ID_03/);

  t.throws(() => {
    sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], "3");
  }, /THROW_ID_03/);

  t.throws(() => {
    sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], 99);
  }, /THROW_ID_03/);

  t.throws(() => {
    sortByCol([[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]], "999");
  }, /THROW_ID_03/);

  t.end();
});

tap.test("02 - multiple elements, #2", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]]
  );
  t.end();
});

tap.test("03 - multiple elements, #2", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    0
  );
  t.end();
});

tap.test("04 - multiple elements, #2", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    1
  );
  t.end();
});

tap.test("05 - multiple elements, #2", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 9, 0], [1, 8, 2], [1, 7, 5], [1]],
    2
  );
  t.end();
});

tap.test("06 - multiple elements, #2 - axis outside of the range", (t) => {
  t.throws(() => {
    sortByCol([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 3);
  }, /THROW_ID_03/);
  t.end();
});

tap.test("07 - multiple elements, #2 - axis outside of the range", (t) => {
  t.throws(() => {
    sortByCol([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 99);
  }, /THROW_ID_03/);
  t.end();
});

tap.test("08 - multiple elements, #3 - opposite order", (t) => {
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]]
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    0
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    1
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    2
  );
  t.end();
});

tap.test("09 - multiple elements, #4 - single elements", (t) => {
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]]);
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], 0);
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], "0");

  t.throws(() => {
    sortByCol([[0], [0], [3], [2], [1]], 1); // second element doesn't exist
  }, /THROW_ID_03/);

  t.throws(() => {
    sortByCol([[0], [0], [3], [2], [1]], 99); // 100-th element doesn't exist
  }, /THROW_ID_03/);
  t.end();
});

tap.test("10 - first column indexes contain opposite order values", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]]
  ); // defaulting to first elements, that's indexes "0" and they contain values: 1-2-3-undefined
  t.end();
});

tap.test("11 - first column indexes contain opposite order values", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    0 // first elements, indexes "0" contain values: 1-2-3-undefined
  );
  t.end();
});

tap.test("12 - first column indexes contain opposite order values", (t) => {
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[3, 7, 0], [2, 8, 0], [1, 9, 0], [1]],
    1 // second elements, indexes "1" contain values: 7-8-9-undefined
  );
  t.end();
});

tap.test("13 - first column indexes contain opposite order values", (t) => {
  // zero's were done first, so [1] goes last. Since all second indexes are the same
  // across rows, matching containued by comparing using a ripple
  // algorithm, which will start on index column on the left
  // of axis (#2), and that's column index #1, which is
  // 7-8-9.
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[3, 7, 0], [2, 8, 0], [1, 9, 0], [1]],
    2 // Third elements, indexes "2" contain values: 0-0-0-undefined across rows
  );
  t.end();
});

tap.test("14 - null over number", (t) => {
  mixer(
    t,
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
    t,
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
  t.end();
});

tap.test("15 - just nulls over numbers", (t) => {
  mixer(
    t,
    [
      [null, null, null],
      [1, 1, 1],
    ],
    [
      [1, 1, 1],
      [null, null, null],
    ]
  );
  t.end();
});

tap.test("16 - just nulls over numbers", (t) => {
  mixer(t, [[1, 4], [1]], [[1, 4], [1]]);
  mixer(t, [[1, 4], [1]], [[1, 4], [1]], 0);
  mixer(t, [[1, 4], [1]], [[1, 4], [1]], 1);

  mixer(
    t,
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
    t,
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
    t,
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
  t.end();
});

tap.test("17 - just nulls over numbers", (t) => {
  mixer(
    t,
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
    t,
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
    t,
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
    t,
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
    t,
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
    t,
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
  t.end();
});

tap.test("18 - value of first ripple-left is null", (t) => {
  mixer(
    t,
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
    t,
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
    t,
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
  t.end();
});

tap.test("19 - same values", (t) => {
  mixer(
    t,
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
  t.end();
});

// -----------------------------------------------------------------------------
// 2. edge-cases

tap.test("20 - various empty arrays", (t) => {
  mixer(t, [], []);
  mixer(t, [[]], [[]]);
  mixer(t, [[], []], [[], []]);
  mixer(t, [[], [], []], [[], [], []]);
  mixer(t, [[], [1], []], [[1], [], []]);
  // hardcoded default column
  mixer(t, [], [], 0);
  mixer(t, [[]], [[]], 0);
  mixer(t, [[], []], [[], []], 0);
  mixer(t, [[], [], []], [[], [], []], 0);
  mixer(t, [[], [1], []], [[1], [], []], 0);

  t.end();
});

tap.test("21 - throws", (t) => {
  // pinning throws by throw ID:
  t.throws(() => {
    sortByCol(1);
  }, /THROW_ID_01/);

  t.throws(() => {
    sortByCol(true);
  }, /THROW_ID_01/);

  t.throws(() => {
    sortByCol("z");
  }, /THROW_ID_01/);

  t.throws(() => {
    sortByCol([], "a");
  }, /THROW_ID_02/);

  t.end();
});

tap.test("22 - throws when sort-by value is outside of any sub-arrays", (t) => {
  // pinning throws by throw ID:
  t.throws(() => {
    sortByCol(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      3 // all sub-arrays' max-length=2 since it's zero-indexed
    );
  }, /THROW_ID_03/);

  t.end();
});

// -----------------------------------------------------------------------------
// 3. sorting by column and clumping of values around the column sorted

tap.test("23 - clumping - simple case with values as undefined", (t) => {
  mixer(
    t,
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

  t.end();
});

tap.test(
  "24 - clumping - left side takes priority over right - case #1 - values on both sides",
  (t) => {
    mixer(
      t,
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
    t.end();
  }
);

tap.test(
  "25 - clumping - left side takes priority over right - case #2 - axis is 0th col",
  (t) => {
    mixer(
      t,
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
    t.end();
  }
);

tap.test(
  "26 - clumping - left side takes priority over right - case #3 - sort axis is last value (equal length subarrays)",
  (t) => {
    mixer(
      t,
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
    t.end();
  }
);
