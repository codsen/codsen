import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rInvert as i } from "../dist/ranges-invert.esm.js";
// import fs from "fs";

// ==============================
// 0. THROWS
// ==============================

test("01 - not array", () => {
  // throw pinning:
  throws(
    () => {
      i(null);
    },
    /THROW_ID_02/,
    "01.01"
  );

  not.throws(() => {
    i(null, 0);
  }, "01.02");

  throws(
    () => {
      i(1);
    },
    /THROW_ID_01/,
    "01.02"
  );

  throws(
    () => {
      i(true);
    },
    /THROW_ID_01/,
    "01.03"
  );

  throws(
    () => {
      i({ e: true });
    },
    /THROW_ID_01/,
    "01.04"
  );

  throws(
    () => {
      i([1, 3], 1); // <----- not array of arrays!
    },
    /THROW_ID_07/,
    "01.05"
  );
});

test("02 - not two arguments in one of ranges", () => {
  throws(
    () => {
      i([[1, 2, 3]], 4, { strictlyTwoElementsInRangeArrays: true });
    },
    /THROW_ID_04/g,
    "02.01"
  );

  throws(
    () => {
      i(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        6,
        { strictlyTwoElementsInRangeArrays: true }
      );
    },
    /THROW_ID_04/g,
    "02.02"
  );

  throws(
    () => {
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
    },
    /THROW_ID_04/g,
    "02.03"
  );

  // DOES NOT THROW:

  not.throws(() => {
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
  not.throws(() => {
    i([[1, 2, 3]], 3);
  }, "02.05");
  not.throws(() => {
    i(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      6
    );
  }, "02.06");
  not.throws(() => {
    i(
      [
        [1, 2],
        [4, 5, 6],
        [7, 8],
      ],
      8
    );
  }, "02.07");

  not.throws(() => {
    i([[1, 2, "zzz"]], 3);
  }, "02.08");
  not.throws(() => {
    i(
      [
        [1, 2, "zzz"],
        [4, 5, "yyyy"],
      ],
      6
    );
  }, "02.09");
  not.throws(() => {
    i(
      [
        [1, 2, null],
        [4, 5, "aaa", "bbb"],
        [7, 8, "ccc"],
      ],
      8
    );
  }, "02.10");
  not.throws(() => {
    i(
      [
        [1, 2, null],
        [4, 5, "aaa", "bbb"],
        [7, 8, "ccc"],
      ],
      80
    );
  }, "02.11");
});

test("03 - some/all range indexes are not natural numbers", () => {
  not.throws(() => {
    i([[0, 3]], 3);
  }, "03.01");
  not.throws(() => {
    i([[0, 3]], 4);
  }, "03.02");

  throws(
    () => {
      i([[0.2, 3]], 4);
    },
    /THROW_ID_05/g,
    "03.01"
  );

  throws(
    () => {
      i([[0.2, 3.3]], 4);
    },
    /THROW_ID_05/g,
    "03.02"
  );

  throws(
    () => {
      i([[2, 3.3]], 4);
    },
    /THROW_ID_05/g,
    "03.03"
  );

  throws(
    () => {
      i([[0.2, 3.3]], 5);
    },
    /THROW_ID_05/g,
    "03.04"
  );

  throws(
    () => {
      i([[0.2, 33]], 40);
    },
    /THROW_ID_05/g,
    "03.05"
  );

  throws(
    () => {
      i([[0.2, 33, 55, 66.7]], 100);
    },
    /THROW_ID_05/g,
    "03.06"
  );
});

test("04 - second arg, strLen is wrong", () => {
  throws(
    () => {
      i([[0, 3]], 4.1);
    },
    /THROW_ID_02/g,
    "04.01"
  );

  throws(
    () => {
      i([[0, 3]], "a");
    },
    /THROW_ID_02/g,
    "04.02"
  );
});

test("05 - zero-length ranges array", () => {
  not.throws(() => {
    i([], 1);
    i([], 2);
    i([], 99999);
  }, "05.01");
});

// ==============================
// 01. BAU - inverting
// ==============================

test(`06 - ${`\u001b[${33}m${"one range"}\u001b[${39}m`} - zero length given`, () => {
  equal(i(null, 0), null, "06.01");
  equal(i([], 0), null, "06.02");
  equal(i([null], 0), null, "06.03");
  equal(i([[0, 0]], 0), null, "06.04");
  equal(i([[1, 2]], 0), null, "06.05");
  equal(i([[1, 2], null], 0), null, "06.06");
  equal(
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
  equal(i([[1, 2], null, [2, 4]], 0), null, "06.08");
});

test(`07 - ${`\u001b[${33}m${"one range"}\u001b[${39}m`} - reference string covers the range`, () => {
  let ref = "abcdefghij";
  let range1 = [1, 3];
  let range2p1 = [0, 1];
  let range2p2 = [3, 10];
  equal(ref.slice(...range1), "bc", "07.01");
  equal(ref.slice(...range2p1), "a", "07.02");
  equal(ref.slice(...range2p2), "defghij", "07.03");
  equal(
    ref.slice(...range2p1) + ref.slice(...range1) + ref.slice(...range2p2),
    ref,
    "07.04"
  );
  // now, real deal:
  equal(i([range1], ref.length), [range2p1, range2p2], "07.05");
});

test(`08 - ${`\u001b[${33}m${"one range"}\u001b[${39}m`} - is one too short`, () => {
  // good:
  equal(i([[1, 3]], 3), [[0, 1]], "08.01");
  // one too short - will crop:
  equal(i([[1, 3]], 2), [[0, 1]], "08.02");
});

test(`09 - ${`\u001b[${33}m${"one range"}\u001b[${39}m`} - same element range invert - yields everything`, () => {
  equal(i([[0, 0]], 3), [[0, 3]], "09.01");
  equal(i([[1, 1]], 3), [[0, 3]], "09.02");
});

test(`10 - ${`\u001b[${35}m${"two ranges"}\u001b[${39}m`} - reference string covers the ranges`, () => {
  let ref = "abcdefghij";
  let range1 = [1, 3];
  let range2 = [5, 6];

  let range2p1 = [0, 1];
  let range2p2 = [3, 5];
  let range2p3 = [6, 10];
  equal(ref.slice(...range1), "bc", "10.01");
  equal(ref.slice(...range2), "f", "10.02");

  equal(
    ref.slice(...range2p1) +
      ref.slice(...range1) +
      ref.slice(...range2p2) +
      ref.slice(...range2) +
      ref.slice(...range2p3),
    ref,
    "10.03"
  );
  // // now, real deal:
  equal(
    i([range1, range2], ref.length),
    [range2p1, range2p2, range2p3],
    "10.04"
  );
});

test(`11 - ${`\u001b[${35}m${"two ranges"}\u001b[${39}m`} - ranges touch each other`, () => {
  equal(
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
    "11.01"
  );
  equal(
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
    "11.02"
  );
  equal(
    i(
      [
        [0, 1],
        [1, 2],
      ],
      9
    ),
    [[2, 9]],
    "11.03"
  );
  equal(
    i(
      [
        [0, 1],
        [1, 2],
        [5, 9],
      ],
      9
    ),
    [[2, 5]],
    "11.04"
  );
  equal(
    i(
      [
        [0, 1],
        [1, 9],
      ],
      9
    ),
    [],
    "11.05"
  );

  // opts.skipChecks - results are the same

  equal(
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
    "11.06"
  );
  equal(
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
    "11.07"
  );
  equal(
    i(
      [
        [0, 1],
        [1, 2],
      ],
      9,
      { skipChecks: true }
    ),
    [[2, 9]],
    "11.08"
  );
  equal(
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
    "11.09"
  );
  equal(
    i(
      [
        [0, 1],
        [1, 9],
      ],
      9,
      { skipChecks: true }
    ),
    [],
    "11.10"
  );
});

test(`12 - ${`\u001b[${35}m${"two ranges"}\u001b[${39}m`} - input was given not merged`, () => {
  equal(
    i(
      [
        [0, 5],
        [3, 7],
      ],
      9
    ),
    [[7, 9]],
    "12.01"
  );
  equal(
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
    "12.02"
  );
  equal(
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
    "12.03"
  );

  // PS. opts.skipChecks would give erroneous result here
  throws(
    () => {
      i(
        [
          [0, 5],
          [3, 7],
        ],
        9,
        { skipChecks: true }
      );
    },
    /THROW_ID_08/,
    "12.04"
  );
});

test(`13 - ${`\u001b[${35}m${"two ranges"}\u001b[${39}m`} - third argument present`, () => {
  equal(
    i(
      [
        [0, 5, "zzz"],
        [3, 7, "aaaa"],
      ],
      9
    ),
    [[7, 9]],
    "13.01"
  );
});

test(`14 - ${`\u001b[${32}m${"null instead of ranges"}\u001b[${39}m`}`, () => {
  equal(i(null, 0), null, "14.01");
  equal(i(null, 3), [[0, 3]], "14.02");
});

test(`15 - ${`\u001b[${35}m${"ad hoc"}\u001b[${39}m`} - range to invert is far outside #1`, () => {
  equal(i([[100, 200]], 10), [[0, 10]], "15.01");
});

test(`16 - ${`\u001b[${35}m${"ad hoc"}\u001b[${39}m`} - ranges to invert is far outside #2`, () => {
  equal(
    i(
      [
        [100, 200],
        [300, 400],
      ],
      10
    ),
    [[0, 10]],
    "16.01"
  );
});

test(`17 - ${`\u001b[${35}m${"ad hoc"}\u001b[${39}m`} - ranges to invert is far outside #3`, () => {
  equal(
    i(
      [
        [300, 400],
        [100, 200],
      ],
      10
    ),
    [[0, 10]],
    "17.01"
  );
});

test.run();
