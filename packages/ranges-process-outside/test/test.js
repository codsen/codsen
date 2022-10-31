import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rProcessOutside as p } from "../dist/ranges-process-outside.esm.js";

const femaleWhiteSleuthEmoji = "\uD83D\uDD75\uD83C\uDFFC\u200D\u2640\uFE0F";

// ==============================
// 0. THROWS
// ==============================

// throw pinning:
test(`01 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong #1`, () => {
  throws(() => {
    p(undefined, [[0, 1]]);
  }, /THROW_ID_01/g);
});

test(`02 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong #2`, () => {
  throws(() => {
    p(null, [[0, 1]]);
  }, /THROW_ID_02/g);
});

test(`03 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong #3`, () => {
  throws(() => {
    p(true, [[0, 1]]);
  }, /THROW_ID_02/g);
});

test(`04 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg wrong #4`, () => {
  // throw pinning:
  throws(() => {
    p("zzz", true);
  }, /THROW_ID_03/g);
});

test(`05 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg wrong #5`, () => {
  throws(() => {
    p("zzz", ["zzz"], () => {});
  }, /THROW_ID_03/g);
});

test(`06 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg null means absence of ranges`, () => {
  not.throws(() => {
    p("zzz", null, () => {});
  }, "06.01");
});

test(`07 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - third arg wrong`, () => {
  // throw pinning:
  throws(() => {
    p("zzz", [[0, 1]], null);
  }, /THROW_ID_04/g);
});

// ==============================
// 01. Normal use
// ==============================

test(`08 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - not touching zero - checks`, () => {
  let gather = [];
  p("abcdefghij", [[1, 5]], (idx) => {
    gather.push(idx);
  });
  equal(gather, [0, 5, 6, 7, 8, 9], "08.01");
});

test(`09 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - not touching zero - skip checks`, () => {
  let gather2 = [];
  p(
    "abcdefghij",
    [[1, 5]],
    (idx) => {
      gather2.push(idx);
    },
    true
  );
  equal(gather2, [0, 5, 6, 7, 8, 9], "09.01");
});

test(`10 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - touching zero - 1 range - checks`, () => {
  let gather = [];
  p("abcdefghij", [[0, 5]], (idx) => {
    gather.push(idx);
  });
  equal(gather, [5, 6, 7, 8, 9], "10.01");
});

test(`11 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - touching zero - 1 range - skip checks`, () => {
  let gathe2 = [];
  p(
    "abcdefghij",
    [[0, 5]],
    (idx) => {
      gathe2.push(idx);
    },
    true
  );
  equal(gathe2, [5, 6, 7, 8, 9], "11.01");
});

test(`12 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - 2 ranges`, () => {
  let gather = [];
  p(
    "abcdefghij",
    [
      [0, 5],
      [7, 8],
    ],
    (idx) => {
      gather.push(idx);
    }
  );
  equal(gather, [5, 6, 8, 9], "12.01");
});

test(`13 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - opposite order (testing ranges-merge)`, () => {
  let gather2 = [];
  let messy = [
    [7, 8],
    [0, 5],
  ];
  p("abcdefghij", messy, (idx) => {
    gather2.push(idx);
  });
  equal(
    messy,
    [
      [7, 8],
      [0, 5],
    ],
    "13.01 - inputs were not mutated"
  );
  equal(
    gather2,
    [5, 6, 8, 9],
    "13.02 - result is the same as in previous test"
  );
});

test(`14 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - throws`, () => {
  // skipping checking/merges/sorts will trigger safety latches and cause a throw
  let gather2 = [];
  throws(() => {
    p(
      "abcdefghij",
      [
        [7, 8],
        [0, 5],
      ],
      (idx) => {
        gather2.push(idx);
      },
      true
    );
  }, /THROW_ID_08/g);
});

// range outside the string length
test(`15 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - protrudes - with checks`, () => {
  let gather = [];
  p(
    "abcdefghij",
    [
      [0, 5],
      [7, 100],
    ],
    (idx) => {
      gather.push(idx);
    }
  );
  equal(gather, [5, 6], "15.01 - result is the same as in previous test");
});

test(`16 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - protrudes - with checks skip`, () => {
  let gather = [];
  // The problem is, reference string is 10 chars/indexes long and ranges span
  // up to index 100. In practice, on a clean input this should never happen so
  // it is safe and worthy to cut corners and skip checks. For example, this
  // index 100 would not come at the first place if we processed the same string
  // even on many different iterations and different functions. That index 100
  // can't appear from anywhere if reference string's indexes don't span that far.
  throws(() => {
    p(
      "abcdefghij",
      [
        [0, 5],
        [7, 100],
      ],
      (idx) => {
        gather.push(idx);
      },
      true
    );
  }, /THROW_ID_08/g);
});

test(`17 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges - empty array given`, () => {
  let gather = [];
  p("abcdefghij", [], (idx) => {
    gather.push(idx);
  });
  equal(gather, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "17.01");
});

test(`18 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges - null given`, () => {
  let gather2 = [];
  p("abcdefghij", null, (idx) => {
    gather2.push(idx);
  });
  equal(gather2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "18.01");
});

test(`19 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges - null given + true (skip checks)`, () => {
  let gather = [];
  p(
    "abcdefghij",
    null,
    (idx) => {
      gather.push(idx);
    },
    true
  );
  equal(gather, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "19.01");
});

test(`20 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - ranges completely cover str`, () => {
  let gather1 = [];
  p("abcdefghij", [[0, 100]], (idx) => {
    gather1.push(idx);
  });
  equal(gather1, [], "20.01");
});

test(`21 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - ranges not cover str at all`, () => {
  let gather = [];
  p("abcdefghij", [[100, 200]], (idx) => {
    gather.push(idx);
  });
  equal(gather, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "21.01");
});

test(`22 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - emoji - checks on`, () => {
  let gather = [];
  p(
    `abcdef\uD834\uDF06ij`,
    [[0, 5]],
    (idxFrom, idxTo) => {
      gather.push([idxFrom, idxTo]);
    },
    false // skip=false so checks are on
  );
  equal(
    gather,
    [
      [5, 6],
      [6, 8],
      [8, 9],
      [9, 10],
    ],
    "22.01"
  );
});

test(`23 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - emoji - checks on`, () => {
  equal(femaleWhiteSleuthEmoji.length, 7, "23.01 - sanity check");
  let gather = [];
  p(
    `abcdef${femaleWhiteSleuthEmoji}ij`,
    [[0, 5]],
    (idxFrom, idxTo) => {
      gather.push([idxFrom, idxTo]);
    },
    false // skip=false so checks are on
  );
  equal(
    gather,
    [
      [5, 6],
      [6, 13],
      [13, 14],
      [14, 15],
    ],
    "23.02"
  );
});

// ==============================
// 02. Index offsets
// ==============================

test(`24 - ${`\u001b[${35}m${`offsets`}\u001b[${39}m`} - offset once at index 5`, () => {
  let gather = [];
  p("abcdefghij", [[1, 5]], (idxFrom, idxTo, offsetBy) => {
    gather.push(idxFrom);
    if (idxFrom === 5) {
      offsetBy(1);
    }
  });
  equal(gather, [0, 5, 7, 8, 9], "24.01");
});

test(`25 - ${`\u001b[${35}m${`offsets`}\u001b[${39}m`} - offset once at index 6`, () => {
  let gather = [];
  p("abcdefghij", [[1, 5]], (idxFrom, idxTo, offsetBy) => {
    gather.push(idxFrom);
    if (idxFrom === 6) {
      offsetBy(1);
    }
  });
  equal(gather, [0, 5, 6, 8, 9], "25.01");
});

test(`26 - ${`\u001b[${35}m${`offsets`}\u001b[${39}m`} - sequential offsets`, () => {
  let gather = [];
  p("abcdefghij", [[1, 5]], (idxFrom, idxTo, offsetBy) => {
    if (idxFrom === 5 || idxFrom === 6) {
      offsetBy(1);
    } else {
      gather.push(idxFrom);
    }
  });
  equal(gather, [0, 7, 8, 9], "26.01");
});

test.run();
