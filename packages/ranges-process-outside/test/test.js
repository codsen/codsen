import test from "ava";
import p from "../dist/ranges-process-outside.esm";
const femaleWhiteSleuthEmoji = "\uD83D\uDD75\uD83C\uDFFC\u200D\u2640\uFE0F";

// ==============================
// 0. THROWS
// ==============================

// throw pinning:
test(`00.01 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong #1`, t => {
  const error1 = t.throws(() => {
    p(undefined, [[0, 1]]);
  });
  t.regex(error1.message, /THROW_ID_01/g);
});

test(`00.02 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong #2`, t => {
  const error2 = t.throws(() => {
    p(null, [[0, 1]]);
  });
  t.regex(error2.message, /THROW_ID_02/g);
});

test(`00.03 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong #3`, t => {
  const error3 = t.throws(() => {
    p(true, [[0, 1]]);
  });
  t.regex(error3.message, /THROW_ID_02/g);
});

test(`00.04 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg wrong #4`, t => {
  // throw pinning:
  const error1 = t.throws(() => {
    p("zzz", true);
  });
  t.regex(error1.message, /THROW_ID_03/g);
});

test(`00.05 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg wrong #5`, t => {
  const error2 = t.throws(() => {
    p("zzz", ["zzz"], () => {});
  });
  t.regex(error2.message, /THROW_ID_05/g);
});

test(`00.06 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg null means absence of ranges`, t => {
  t.notThrows(() => {
    p("zzz", null, () => {});
  });
});

test(`00.07 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - third arg wrong`, t => {
  // throw pinning:
  const error1 = t.throws(() => {
    p("zzz", [[0, 1]], null);
  });
  t.regex(error1.message, /THROW_ID_04/g);
  t.regex(error1.message, /ranges-process-outside/g);
});

// ==============================
// 01. Normal use
// ==============================

test(`01.01 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - not touching zero - checks`, t => {
  const gather = [];
  p("abcdefghij", [[1, 5]], idx => {
    gather.push(idx);
  });
  t.deepEqual(gather, [0, 5, 6, 7, 8, 9], "01.01");
});

test(`01.02 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - not touching zero - skip checks`, t => {
  const gather2 = [];
  p(
    "abcdefghij",
    [[1, 5]],
    idx => {
      gather2.push(idx);
    },
    true
  );
  t.deepEqual(gather2, [0, 5, 6, 7, 8, 9], "01.02");
});

test(`01.03 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - touching zero - 1 range - checks`, t => {
  const gather = [];
  p("abcdefghij", [[0, 5]], idx => {
    gather.push(idx);
  });
  t.deepEqual(gather, [5, 6, 7, 8, 9], "01.03");
});

test(`01.04 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - touching zero - 1 range - skip checks`, t => {
  const gathe2 = [];
  p(
    "abcdefghij",
    [[0, 5]],
    idx => {
      gathe2.push(idx);
    },
    true
  );
  t.deepEqual(gathe2, [5, 6, 7, 8, 9], "01.04");
});

test(`01.05 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - 2 ranges`, t => {
  const gather = [];
  p(
    "abcdefghij",
    [
      [0, 5],
      [7, 8]
    ],
    idx => {
      gather.push(idx);
    }
  );
  t.deepEqual(gather, [5, 6, 8, 9], "01.05");
});

test(`01.06 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - opposite order (testing ranges-merge)`, t => {
  const gather2 = [];
  const messy = [
    [7, 8],
    [0, 5]
  ];
  p("abcdefghij", messy, idx => {
    gather2.push(idx);
  });
  t.deepEqual(
    messy,
    [
      [7, 8],
      [0, 5]
    ],
    "01.06.01 - inputs were not mutated"
  );
  t.deepEqual(
    gather2,
    [5, 6, 8, 9],
    "01.06.02 - result is the same as in previous test"
  );
});

test(`01.07 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - throws`, t => {
  // skipping checking/merges/sorts will trigger safety latches and cause a throw
  const gather2 = [];
  const error1 = t.throws(() => {
    p(
      "abcdefghij",
      [
        [7, 8],
        [0, 5]
      ],
      idx => {
        gather2.push(idx);
      },
      true
    );
  });
  t.regex(error1.message, /THROW_ID_08/g);
  t.regex(error1.message, /ranges-invert/g);
});

// range outside the string length
test(`01.08 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - protrudes - with checks`, t => {
  const gather = [];
  p(
    "abcdefghij",
    [
      [0, 5],
      [7, 100]
    ],
    idx => {
      gather.push(idx);
    }
  );
  t.deepEqual(gather, [5, 6], "01.08 - result is the same as in previous test");
});

test(`01.09 - ${`\u001b[${31}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - protrudes - with checks skip`, t => {
  const gather = [];
  // The problem is, reference string is 10 chars/indexes long and ranges span
  // up to index 100. In practice, on a clean input this should never happen so
  // it is safe and worthy to cut corners and skip checks. For example, this
  // index 100 would not come at the first place if we processed the same string
  // even on many different iterations and different functions. That index 100
  // can't appear from anywhere if reference string's indexes don't span that far.
  const error = t.throws(() => {
    p(
      "abcdefghij",
      [
        [0, 5],
        [7, 100]
      ],
      idx => {
        gather.push(idx);
      },
      true
    );
  });
  t.regex(error.message, /THROW_ID_08/);
});

test(`01.10 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges - empty array given`, t => {
  const gather = [];
  p("abcdefghij", [], idx => {
    gather.push(idx);
  });
  t.deepEqual(gather, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "01.10");
});

test(`01.11 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges - null given`, t => {
  const gather2 = [];
  p("abcdefghij", null, idx => {
    gather2.push(idx);
  });
  t.deepEqual(gather2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "01.11");
});

test(`01.12 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges - null given + true (skip checks)`, t => {
  const gather = [];
  p(
    "abcdefghij",
    null,
    idx => {
      gather.push(idx);
    },
    true
  );
  t.deepEqual(gather, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "01.12");
});

test(`01.13 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - ranges completely cover str`, t => {
  const gather1 = [];
  p("abcdefghij", [[0, 100]], idx => {
    gather1.push(idx);
  });
  t.deepEqual(gather1, [], "01.13");
});

test(`01.14 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - ranges not cover str at all`, t => {
  const gather = [];
  p("abcdefghij", [[100, 200]], idx => {
    gather.push(idx);
  });
  t.deepEqual(gather, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "01.14");
});

test(`01.15 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - emoji - checks on`, t => {
  const gather = [];
  p(
    `abcdef\uD834\uDF06ij`,
    [[0, 5]],
    (idxFrom, idxTo) => {
      gather.push([idxFrom, idxTo]);
    },
    false // skip=false so checks are on
  );
  t.deepEqual(
    gather,
    [
      [5, 6],
      [6, 8],
      [8, 9],
      [9, 10]
    ],
    "01.15"
  );
});

test(`01.16 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - emoji - checks on`, t => {
  t.is(femaleWhiteSleuthEmoji.length, 7, "01.16 - sanity check");
  const gather = [];
  p(
    `abcdef${femaleWhiteSleuthEmoji}ij`,
    [[0, 5]],
    (idxFrom, idxTo) => {
      gather.push([idxFrom, idxTo]);
    },
    false // skip=false so checks are on
  );
  t.deepEqual(
    gather,
    [
      [5, 6],
      [6, 13],
      [13, 14],
      [14, 15]
    ],
    "01.16.02"
  );
});

// ==============================
// 02. Index offsets
// ==============================

test(`02.01 - ${`\u001b[${35}m${`offsets`}\u001b[${39}m`} - offset once at index 5`, t => {
  const gather = [];
  p("abcdefghij", [[1, 5]], (idxFrom, idxTo, offsetBy) => {
    gather.push(idxFrom);
    if (idxFrom === 5) {
      offsetBy(1);
    }
  });
  t.deepEqual(gather, [0, 5, 7, 8, 9], "02.01");
});

test(`02.02 - ${`\u001b[${35}m${`offsets`}\u001b[${39}m`} - offset once at index 6`, t => {
  const gather = [];
  p("abcdefghij", [[1, 5]], (idxFrom, idxTo, offsetBy) => {
    gather.push(idxFrom);
    if (idxFrom === 6) {
      offsetBy(1);
    }
  });
  t.deepEqual(gather, [0, 5, 6, 8, 9], "02.02");
});

test(`02.03 - ${`\u001b[${35}m${`offsets`}\u001b[${39}m`} - sequential offsets`, t => {
  const gather = [];
  p("abcdefghij", [[1, 5]], (idxFrom, idxTo, offsetBy) => {
    if (idxFrom === 5 || idxFrom === 6) {
      offsetBy(1);
    } else {
      gather.push(idxFrom);
    }
  });
  t.deepEqual(gather, [0, 7, 8, 9], "02.03");
});
