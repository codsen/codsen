const t = require("tap");
const i = require("../dist/ranges-invert.cjs");
// import fs from "fs";

// ==============================
// 0. THROWS
// ==============================

t.test("00.01 - not array", (t) => {
  // throw pinning:
  t.throws(() => {
    i(null);
  }, /THROW_ID_02/);

  t.doesNotThrow(() => {
    i(null, 0);
  });

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

t.test("00.02 - not two arguments in one of ranges", (t) => {
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
  });
  // with defaults opts
  t.doesNotThrow(() => {
    i([[1, 2, 3]], 3);
  });
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      6
    );
  });
  t.doesNotThrow(() => {
    i(
      [
        [1, 2],
        [4, 5, 6],
        [7, 8],
      ],
      8
    );
  });

  t.doesNotThrow(() => {
    i([[1, 2, "zzz"]], 3);
  });
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, "zzz"],
        [4, 5, "yyyy"],
      ],
      6
    );
  });
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, null],
        [4, 5, "aaa", "bbb"],
        [7, 8, "ccc"],
      ],
      8
    );
  });
  t.doesNotThrow(() => {
    i(
      [
        [1, 2, null],
        [4, 5, "aaa", "bbb"],
        [7, 8, "ccc"],
      ],
      80
    );
  });

  t.end();
});

t.test("00.03 - some/all range indexes are not natural numbers", (t) => {
  t.doesNotThrow(() => {
    i([[0, 3]], 3);
  });
  t.doesNotThrow(() => {
    i([[0, 3]], 4);
  });

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

t.test("00.04 - second arg, strLen is wrong", (t) => {
  t.doesNotThrow(() => {
    i([[0, 0]], 0);
  });

  t.throws(() => {
    i([[0, 3]], 4.1);
  }, /THROW_ID_02/g);

  t.throws(() => {
    i([[0, 3]], "a");
  }, /THROW_ID_02/g);
  t.end();
});

t.test("00.05 - zero-length ranges array", (t) => {
  t.doesNotThrow(() => {
    i([], 0);
    i([], 1);
    i([], 2);
    i([], 99999);
  });
  t.end();
});

// ==============================
// 01. BAU - inverting
// ==============================

t.test(
  `01.01 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - reference string covers the range`,
  (t) => {
    const ref = "abcdefghij";
    const range1 = [1, 3];
    const range2p1 = [0, 1];
    const range2p2 = [3, 10];
    t.equal(ref.slice(...range1), "bc", "01.01.01 - we mean what we intended");
    t.equal(ref.slice(...range2p1), "a", "01.01.02 - chunk before is correct");
    t.equal(
      ref.slice(...range2p2),
      "defghij",
      "01.01.03 - chunk after is correct"
    );
    t.equal(
      ref.slice(...range2p1) + ref.slice(...range1) + ref.slice(...range2p2),
      ref,
      "01.01.04 - all pieces add up"
    );
    // now, real deal:
    t.same(i([range1], ref.length), [range2p1, range2p2], "01.01");

    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - is one too short`,
  (t) => {
    // good:
    t.same(i([[1, 3]], 3), [[0, 1]], "01.02.01");
    // one too short - will crop:
    t.same(i([[1, 3]], 2), [[0, 1]], "01.02.02");

    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - same element range invert`,
  (t) => {
    t.same(i([[0, 0]], 3), [[0, 3]], "01.03.01 - yields everything");
    t.same(i([[1, 1]], 3), [[0, 3]], "01.03.02");
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - reference string covers the ranges`,
  (t) => {
    const ref = "abcdefghij";
    const range1 = [1, 3];
    const range2 = [5, 6];

    const range2p1 = [0, 1];
    const range2p2 = [3, 5];
    const range2p3 = [6, 10];
    t.equal(ref.slice(...range1), "bc", "01.04.01");
    t.equal(ref.slice(...range2), "f", "01.04.02");

    t.equal(
      ref.slice(...range2p1) +
        ref.slice(...range1) +
        ref.slice(...range2p2) +
        ref.slice(...range2) +
        ref.slice(...range2p3),
      ref,
      "01.04.04 - all pieces add up"
    );
    // // now, real deal:
    t.same(
      i([range1, range2], ref.length),
      [range2p1, range2p2, range2p3],
      "01.04.05"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - ranges touch each other`,
  (t) => {
    t.same(
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
      "01.05.01 - ranges with deltas of two indexes"
    );
    t.same(
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
      "01.05.02 - ranges with deltas of one index"
    );
    t.same(
      i(
        [
          [0, 1],
          [1, 2],
        ],
        9
      ),
      [[2, 9]],
      "01.05.03 - ranges with deltas of one index"
    );
    t.same(
      i(
        [
          [0, 1],
          [1, 2],
          [5, 9],
        ],
        9
      ),
      [[2, 5]],
      "01.05.04 - ranges with deltas of one index"
    );
    t.same(
      i(
        [
          [0, 1],
          [1, 9],
        ],
        9
      ),
      [],
      "01.05.05 - ranges with deltas of one index"
    );

    // opts.skipChecks - results are the same

    t.same(
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
      "01.05.06 - ranges with deltas of two indexes"
    );
    t.same(
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
      "01.05.07 - ranges with deltas of one index"
    );
    t.same(
      i(
        [
          [0, 1],
          [1, 2],
        ],
        9,
        { skipChecks: true }
      ),
      [[2, 9]],
      "01.05.08 - ranges with deltas of one index"
    );
    t.same(
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
      "01.05.09 - ranges with deltas of one index"
    );
    t.same(
      i(
        [
          [0, 1],
          [1, 9],
        ],
        9,
        { skipChecks: true }
      ),
      [],
      "01.05.10 - ranges with deltas of one index"
    );
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - input was given not merged`,
  (t) => {
    t.same(
      i(
        [
          [0, 5],
          [3, 7],
        ],
        9
      ),
      [[7, 9]],
      "01.06.01 - starts at zero"
    );
    t.same(
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
      "01.06.01 - does not start at zero"
    );
    t.same(
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
      "01.06.02 - does not start at zero"
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

t.test(
  `01.07 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - third argument present`,
  (t) => {
    t.same(
      i(
        [
          [0, 5, "zzz"],
          [3, 7, "aaaa"],
        ],
        9
      ),
      [[7, 9]],
      "01.07"
    );
    t.end();
  }
);

t.test(
  `01.08 - ${`\u001b[${32}m${`null instead of ranges`}\u001b[${39}m`}`,
  (t) => {
    t.same(i(null, 0), [], "01.08.01");
    t.same(i(null, 3), [[0, 3]], "01.08.02");
    t.end();
  }
);

t.test(
  `01.09 - ${`\u001b[${35}m${`ad hoc`}\u001b[${39}m`} - range to invert is far outside #1`,
  (t) => {
    t.same(i([[100, 200]], 10), [[0, 10]], "01.09");
    t.end();
  }
);

t.test(
  `01.10 - ${`\u001b[${35}m${`ad hoc`}\u001b[${39}m`} - ranges to invert is far outside #2`,
  (t) => {
    t.same(
      i(
        [
          [100, 200],
          [300, 400],
        ],
        10
      ),
      [[0, 10]],
      "01.10"
    );
    t.end();
  }
);

t.test(
  `01.11 - ${`\u001b[${35}m${`ad hoc`}\u001b[${39}m`} - ranges to invert is far outside #3`,
  (t) => {
    t.same(
      i(
        [
          [300, 400],
          [100, 200],
        ],
        10
      ),
      [[0, 10]],
      "01.11"
    );
    t.end();
  }
);
