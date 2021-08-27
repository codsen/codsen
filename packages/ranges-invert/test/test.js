import tap from "tap";
import { rInvert as i } from "../dist/ranges-invert.esm.js";
// import fs from "fs";

// ==============================
// 0. THROWS
// ==============================

tap.test("01 - not array", (t) => {
  // throw pinning:
  t.throws(() => {
    i(null);
  }, /THROW_ID_02/);

  t.doesNotThrow(() => {
    i(null, 0);
  }, "01.02");

  t.throws(() => {
    i(1);
  }, /THROW_ID_01/);

  t.throws(() => {
    i(true);
  }, /THROW_ID_01/);

  t.throws(() => {
    i({ e: true });
  }, /THROW_ID_01/);

  t.throws(() => {
    i([1, 3], 1); // <----- not array of arrays!
  }, /THROW_ID_07/);

  t.end();
});

tap.test("02 - not two arguments in one of ranges", (t) => {
  t.throws(() => {
    i([[1, 2, 3]], 4, { strictlyTwoElementsInRangeArrays: true });
  }, /THROW_ID_04/g);

  t.throws(() => {
    i(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      6,
      { strictlyTwoElementsInRangeArrays: true }
    );
  }, /THROW_ID_04/g);

  t.throws(() => {
    i(
      [
        [1, 2],
        [4, 5, 6],
        [7, 8],
      ],
      9,
      {
        strictlyTwoElementsInRangeArrays: true,
      }
    );
  }, /THROW_ID_04/g);

  // DOES NOT THROW:

  t.doesNotThrow(() => {
    i(
      [
        [1, 2],
        [4, 5],
        [7, 8],
      ],
      9
    );
  }, "02.04");
  // with defaults opts
  t.doesNotThrow(() => {
    i([[1, 2, 3]], 3);
  }, "02.05");
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      6
    );
  }, "02.06");
  t.doesNotThrow(() => {
    i(
      [
        [1, 2],
        [4, 5, 6],
        [7, 8],
      ],
      8
    );
  }, "02.07");

  t.doesNotThrow(() => {
    i([[1, 2, "zzz"]], 3);
  }, "02.08");
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, "zzz"],
        [4, 5, "yyyy"],
      ],
      6
    );
  }, "02.09");
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, null],
        [4, 5, "aaa", "bbb"],
        [7, 8, "ccc"],
      ],
      8
    );
  }, "02.10");
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, null],
        [4, 5, "aaa", "bbb"],
        [7, 8, "ccc"],
      ],
      80
    );
  }, "02.11");

  t.end();
});

tap.test("03 - some/all range indexes are not natural numbers", (t) => {
  t.doesNotThrow(() => {
    i([[0, 3]], 3);
  }, "03.01");
  t.doesNotThrow(() => {
    i([[0, 3]], 4);
  }, "03.02");

  t.throws(() => {
    i([[0.2, 3]], 4);
  }, /THROW_ID_05/g);

  t.throws(() => {
    i([[0.2, 3.3]], 4);
  }, /THROW_ID_05/g);

  t.throws(() => {
    i([[2, 3.3]], 4);
  }, /THROW_ID_05/g);

  t.throws(() => {
    i([[0.2, 3.3]], 5);
  }, /THROW_ID_05/g);

  t.throws(() => {
    i([[0.2, 33]], 40);
  }, /THROW_ID_05/g);

  t.throws(() => {
    i([[0.2, 33, 55, 66.7]], 100);
  }, /THROW_ID_05/g);

  t.end();
});

tap.test("04 - second arg, strLen is wrong", (t) => {
  t.throws(() => {
    i([[0, 3]], 4.1);
  }, /THROW_ID_02/g);

  t.throws(() => {
    i([[0, 3]], "a");
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("05 - zero-length ranges array", (t) => {
  t.doesNotThrow(() => {
    i([], 1);
    i([], 2);
    i([], 99999);
  }, "05");
  t.end();
});

// ==============================
// 01. BAU - inverting
// ==============================

tap.test(
  `06 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - zero length given`,
  (t) => {
    t.strictSame(i(null, 0), null, "06.01");
    t.strictSame(i([], 0), null, "06.02");
    t.strictSame(i([null], 0), null, "06.03");
    t.strictSame(i([[0, 0]], 0), null, "06.04");
    t.strictSame(i([[1, 2]], 0), null, "06.05");
    t.strictSame(i([[1, 2], null], 0), null, "06.06");
    t.strictSame(
      i(
        [
          [1, 2],
          [2, 4],
        ],
        0
      ),
      null,
      "06.07"
    );
    t.strictSame(i([[1, 2], null, [2, 4]], 0), null, "06.08");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - reference string covers the range`,
  (t) => {
    const ref = "abcdefghij";
    const range1 = [1, 3];
    const range2p1 = [0, 1];
    const range2p2 = [3, 10];
    t.equal(ref.slice(...range1), "bc", "07.01 - we mean what we intended");
    t.equal(ref.slice(...range2p1), "a", "07.02 - chunk before is correct");
    t.equal(
      ref.slice(...range2p2),
      "defghij",
      "07.03 - chunk after is correct"
    );
    t.equal(
      ref.slice(...range2p1) + ref.slice(...range1) + ref.slice(...range2p2),
      ref,
      "07.04 - all pieces add up"
    );
    // now, real deal:
    t.strictSame(i([range1], ref.length), [range2p1, range2p2], "07.05");

    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - is one too short`,
  (t) => {
    // good:
    t.strictSame(i([[1, 3]], 3), [[0, 1]], "08.01");
    // one too short - will crop:
    t.strictSame(i([[1, 3]], 2), [[0, 1]], "08.02");

    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - same element range invert - yields everything`,
  (t) => {
    t.strictSame(i([[0, 0]], 3), [[0, 3]], "09.01");
    t.strictSame(i([[1, 1]], 3), [[0, 3]], "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - reference string covers the ranges`,
  (t) => {
    const ref = "abcdefghij";
    const range1 = [1, 3];
    const range2 = [5, 6];

    const range2p1 = [0, 1];
    const range2p2 = [3, 5];
    const range2p3 = [6, 10];
    t.equal(ref.slice(...range1), "bc", "10.01");
    t.equal(ref.slice(...range2), "f", "10.02");

    t.equal(
      ref.slice(...range2p1) +
        ref.slice(...range1) +
        ref.slice(...range2p2) +
        ref.slice(...range2) +
        ref.slice(...range2p3),
      ref,
      "10.03 - all pieces add up"
    );
    // // now, real deal:
    t.strictSame(
      i([range1, range2], ref.length),
      [range2p1, range2p2, range2p3],
      "10.04"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - ranges touch each other`,
  (t) => {
    t.strictSame(
      i(
        [
          [3, 5],
          [5, 7],
        ],
        9
      ),
      [
        [0, 3],
        [7, 9],
      ],
      "11.01 - ranges with deltas of two indexes"
    );
    t.strictSame(
      i(
        [
          [3, 4],
          [4, 7],
        ],
        9
      ),
      [
        [0, 3],
        [7, 9],
      ],
      "11.02 - ranges with deltas of one index"
    );
    t.strictSame(
      i(
        [
          [0, 1],
          [1, 2],
        ],
        9
      ),
      [[2, 9]],
      "11.03 - ranges with deltas of one index"
    );
    t.strictSame(
      i(
        [
          [0, 1],
          [1, 2],
          [5, 9],
        ],
        9
      ),
      [[2, 5]],
      "11.04 - ranges with deltas of one index"
    );
    t.strictSame(
      i(
        [
          [0, 1],
          [1, 9],
        ],
        9
      ),
      [],
      "11.05 - ranges with deltas of one index"
    );

    // opts.skipChecks - results are the same

    t.strictSame(
      i(
        [
          [3, 5],
          [5, 7],
        ],
        9,
        { skipChecks: true }
      ),
      [
        [0, 3],
        [7, 9],
      ],
      "11.06 - ranges with deltas of two indexes"
    );
    t.strictSame(
      i(
        [
          [3, 4],
          [4, 7],
        ],
        9,
        { skipChecks: true }
      ),
      [
        [0, 3],
        [7, 9],
      ],
      "11.07 - ranges with deltas of one index"
    );
    t.strictSame(
      i(
        [
          [0, 1],
          [1, 2],
        ],
        9,
        { skipChecks: true }
      ),
      [[2, 9]],
      "11.08 - ranges with deltas of one index"
    );
    t.strictSame(
      i(
        [
          [0, 1],
          [1, 2],
          [5, 9],
        ],
        9,
        { skipChecks: true }
      ),
      [[2, 5]],
      "11.09 - ranges with deltas of one index"
    );
    t.strictSame(
      i(
        [
          [0, 1],
          [1, 9],
        ],
        9,
        { skipChecks: true }
      ),
      [],
      "11.10 - ranges with deltas of one index"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - input was given not merged`,
  (t) => {
    t.strictSame(
      i(
        [
          [0, 5],
          [3, 7],
        ],
        9
      ),
      [[7, 9]],
      "12.01 - starts at zero"
    );
    t.strictSame(
      i(
        [
          [2, 5],
          [3, 7],
        ],
        9
      ),
      [
        [0, 2],
        [7, 9],
      ],
      "12.02 - does not start at zero"
    );
    t.strictSame(
      i(
        [
          [3, 5],
          [2, 7],
        ],
        9
      ),
      [
        [0, 2],
        [7, 9],
      ],
      "12.03 - does not start at zero"
    );

    // PS. opts.skipChecks would give erroneous result here
    t.throws(() => {
      i(
        [
          [0, 5],
          [3, 7],
        ],
        9,
        { skipChecks: true }
      );
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - third argument present`,
  (t) => {
    t.strictSame(
      i(
        [
          [0, 5, "zzz"],
          [3, 7, "aaaa"],
        ],
        9
      ),
      [[7, 9]],
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`null instead of ranges`}\u001b[${39}m`}`,
  (t) => {
    t.strictSame(i(null, 0), null, "14.01");
    t.strictSame(i(null, 3), [[0, 3]], "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`ad hoc`}\u001b[${39}m`} - range to invert is far outside #1`,
  (t) => {
    t.strictSame(i([[100, 200]], 10), [[0, 10]], "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`ad hoc`}\u001b[${39}m`} - ranges to invert is far outside #2`,
  (t) => {
    t.strictSame(
      i(
        [
          [100, 200],
          [300, 400],
        ],
        10
      ),
      [[0, 10]],
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`ad hoc`}\u001b[${39}m`} - ranges to invert is far outside #3`,
  (t) => {
    t.strictSame(
      i(
        [
          [300, 400],
          [100, 200],
        ],
        10
      ),
      [[0, 10]],
      "17"
    );
    t.end();
  }
);
