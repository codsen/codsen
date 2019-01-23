import test from "ava";
import p from "../dist/ranges-process-outside.esm";

// ==============================
// 0. THROWS
// ==============================

test(`00.01 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - first arg wrong`, t => {
  // throw pinning:
  const error1 = t.throws(() => {
    p(undefined, [[0, 1]]);
  });
  t.regex(error1.message, /THROW_ID_01/g);

  const error2 = t.throws(() => {
    p(null, [[0, 1]]);
  });
  t.regex(error2.message, /THROW_ID_02/g);

  const error3 = t.throws(() => {
    p(true, [[0, 1]]);
  });
  t.regex(error3.message, /THROW_ID_02/g);
});

test(`00.02 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - second arg wrong`, t => {
  // throw pinning:
  const error1 = t.throws(() => {
    p("zzz", true);
  });
  t.regex(error1.message, /THROW_ID_03/g);

  const error2 = t.throws(() => {
    p("zzz", ["zzz"], () => {});
  });
  t.regex(error2.message, /THROW_ID_04/g);
  t.regex(error2.message, /ranges-sort/g);

  // null means absence of ranges
  t.notThrows(() => {
    p("zzz", null, () => {});
  });
});

test(`00.03 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - third arg wrong`, t => {
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

test(`01.01 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - not touching zero`, t => {
  const gather = [];
  p("abcdefghij", [[1, 5]], ({ value }) => {
    gather.push(value);
  });
  t.deepEqual(gather, ["a", "fghij"]);

  // skip checks
  const gathe2 = [];
  p(
    "abcdefghij",
    [[1, 5]],
    ({ value }) => {
      gathe2.push(value);
    },
    true
  );
  t.deepEqual(gathe2, ["a", "fghij"]);
});

test(`01.02 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - string covers ranges - touching zero - 1 range`, t => {
  const gather = [];
  p("abcdefghij", [[0, 5]], ({ value }) => {
    gather.push(value);
  });
  t.deepEqual(gather, ["fghij"]);

  // skip checks
  const gathe2 = [];
  p(
    "abcdefghij",
    [[0, 5]],
    ({ value }) => {
      gathe2.push(value);
    },
    true
  );
  t.deepEqual(gathe2, ["fghij"]);
});

test(`01.03 - ${`\u001b[${33}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - 2 ranges`, t => {
  const gather = [];
  p("abcdefghij", [[0, 5], [7, 8]], ({ value }) => {
    gather.push(value);
  });
  t.deepEqual(gather, ["fg", "ij"], "01.03.01");

  // opposite order (testing ranges-merge)
  const gather2 = [];
  const messy = [[7, 8], [0, 5]];
  p("abcdefghij", messy, ({ value }) => {
    gather2.push(value);
  });
  t.deepEqual(messy, [[7, 8], [0, 5]], "01.03.02 - inputs were not mutated");
  t.deepEqual(
    gather2,
    ["fg", "ij"],
    "01.03.03 - result is the same as 01.03.01"
  );

  // skipping checking/merges/sorts will trigger safety latches and cause a throw
  const error1 = t.throws(() => {
    p(
      "abcdefghij",
      messy,
      ({ value }) => {
        gather2.push(value);
      },
      true
    );
  });
  t.regex(error1.message, /THROW_ID_05/g);
  t.regex(error1.message, /ranges-process-outside/g);
});

// range outside the string length
test(`01.04 - ${`\u001b[${33}m${`few ranges`}\u001b[${39}m`} - string covers ranges - touching zero - protrudes`, t => {
  const gather = [];
  p("abcdefghij", [[0, 5], [7, 100]], ({ value }) => {
    gather.push(value);
  });
  t.deepEqual(gather, ["fg"]);

  const gather2 = [];
  p(
    "abcdefghij",
    [[0, 5], [7, 100]],
    ({ value }) => {
      gather2.push(value);
    },
    true
  );
  t.deepEqual(gather2, ["fg"]);
});

// absent ranges
test(`01.05 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - absent ranges`, t => {
  // empty array given:
  const gather1 = [];
  p("abcdefghij", [], ({ value }) => {
    gather1.push(value);
  });
  t.deepEqual(gather1, ["abcdefghij"]);

  // null given
  const gather2 = [];
  p("abcdefghij", null, ({ value }) => {
    gather2.push(value);
  });
  t.deepEqual(gather2, ["abcdefghij"]);

  // null given + true (skip checks)
  const gather3 = [];
  p(
    "abcdefghij",
    null,
    ({ value }) => {
      gather3.push(value);
    },
    true
  );
  t.deepEqual(gather3, ["abcdefghij"]);
});

test(`01.06 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - ranges completely cover str`, t => {
  const gather1 = [];
  p("abcdefghij", [[0, 100]], ({ value }) => {
    gather1.push(value);
  });
  t.deepEqual(gather1, [], "01.06");
});

test(`01.07 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - ranges not cover str at all`, t => {
  const gather = [];
  p("abcdefghij", [[100, 200]], ({ value }) => {
    gather.push(value);
  });
  t.deepEqual(gather, ["abcdefghij"], "01.07");
});
