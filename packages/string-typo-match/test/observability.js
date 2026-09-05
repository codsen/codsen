import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import { createMatcher, matchTypos } from "../dist/string-typo-match.esm.js";
import { semantic } from "../test-util/oracle.js";

function validProgress(values) {
  return (
    values[0] === 0 &&
    values[values.length - 1] === 100 &&
    values.every(
      (value, index) =>
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 100 &&
        (!index || value > values[index - 1]),
    )
  );
}

test("01 - preparation lookup and one-shot callbacks cover their own work", () => {
  const candidates = Array.from(
    { length: 500 },
    (_value, index) => `name${index}`,
  );
  const preparation = [];
  const lookup = [];
  const oneShot = [];
  const matcher = createMatcher(candidates, {
    progressFn: (value) => preparation.push(value),
  });
  const preparationSnapshot = preparation.slice();
  const result = matcher.match("nme12", {
    progressFn: (value) => lookup.push(value),
  });
  const combined = matchTypos("nme12", candidates, {
    progressFn: (value) => oneShot.push(value),
  });
  equal(
    [validProgress(preparation), validProgress(lookup), validProgress(oneShot)],
    [true, true, true],
    "01.01",
  );
  equal(preparation, preparationSnapshot, "01.02");
  equal(semantic(result), semantic(combined), "01.03");
});

test("02 - empty tiny and exact operations still report both endpoints", () => {
  const outcomes = [];
  for (const candidates of [[], ["a"], ["test", "rest", "test"]]) {
    const preparation = [];
    const matcher = createMatcher(candidates, {
      progressFn: (value) => preparation.push(value),
    });
    outcomes.push(validProgress(preparation));
    for (const input of ["", "a", "test", "zzzzzz"]) {
      const prepared = [];
      const oneShot = [];
      matcher.match(input, { progressFn: (value) => prepared.push(value) });
      matchTypos(input, candidates, {
        progressFn: (value) => oneShot.push(value),
      });
      outcomes.push(validProgress(prepared), validProgress(oneShot));
    }
  }
  equal(outcomes.every(Boolean), true, "02.01");
});

test("03 - callback exceptions propagate without corrupting prepared state", () => {
  const matcher = createMatcher(["nbsp", "ensp", "nsup"]);
  const before = semantic(matcher.match("nsp"));
  const error = new Error("callback failure");
  for (const threshold of [0, 50, 100]) {
    throws(
      () =>
        matcher.match("nsp", {
          progressFn: (value) => {
            if (value >= threshold) throw error;
          },
        }),
      (thrown) => thrown === error,
      "03.01",
    );
    equal(semantic(matcher.match("nsp")), before, "03.02");
  }
  throws(
    () =>
      createMatcher(["nbsp"], {
        progressFn: () => {
          throw error;
        },
      }),
    (thrown) => thrown === error,
    "03.03",
  );
  throws(
    () =>
      matchTypos("nsp", ["nbsp"], {
        progressFn: () => {
          throw error;
        },
      }),
    (thrown) => thrown === error,
    "03.04",
  );
});

test("04 - a callback can reenter the same prepared matcher", () => {
  const matcher = createMatcher(["nbsp", "ensp", "nsup", "rsqb", "rsquo"]);
  const expected = semantic(matcher.match("nsp"));
  const nestedExpected = semantic(matcher.match("rsqo"));
  let nested;
  const result = matcher.match("nsp", {
    progressFn: (value) => {
      if (value === 0) nested = semantic(matcher.match("rsqo"));
    },
  });
  equal(semantic(result), expected, "04.01");
  equal(nested, nestedExpected, "04.02");
});

test("05 - exact bypass and deduplication do not inflate pruning statistics", () => {
  const matcher = createMatcher(["nbsp", "ensp", "nsup", "nbsp"]);
  const result = matcher.match("nbsp");
  equal(
    { ...matcher.log, timeTakenInMilliseconds: 0 },
    {
      candidateCount: 4,
      uniqueCandidateCount: 3,
      timeTakenInMilliseconds: 0,
    },
    "05.01",
  );
  equal(
    { ...result.log, timeTakenInMilliseconds: 0 },
    {
      uniqueCandidateCount: 3,
      evaluatedCandidateCount: 0,
      prunedCandidateCount: 0,
      eligibleCandidateCount: 1,
      timeTakenInMilliseconds: 0,
    },
    "05.02",
  );
  const fuzzy = matcher.match("nsp");
  equal(
    fuzzy.log.evaluatedCandidateCount + fuzzy.log.prunedCandidateCount,
    3,
    "05.03",
  );
  equal(fuzzy.log.eligibleCandidateCount, fuzzy.matches.length, "05.04");
});

test("06 - elapsed time reports preparation lookup and combined durations", () => {
  const original = Date.now;
  let now = 1000;
  Date.now = () => now;
  try {
    const matcher = createMatcher(["nbsp"], {
      progressFn: (value) => {
        if (value === 0) now += 7;
      },
    });
    equal(matcher.log.timeTakenInMilliseconds, 7, "06.01");
    const result = matcher.match("nsp", {
      progressFn: (value) => {
        if (value === 0) now += 11;
      },
    });
    equal(result.log.timeTakenInMilliseconds, 11, "06.02");
    const combined = matchTypos("nsp", ["nbsp"], {
      progressFn: (value) => {
        if (value === 0) now += 19;
      },
    });
    equal(combined.log.timeTakenInMilliseconds, 19, "06.03");
  } finally {
    Date.now = original;
  }
});

test("07 - clock adjustments do not change semantics or produce negative duration", () => {
  const expected = semantic(matchTypos("nsp", ["nbsp", "ensp"]));
  const original = Date.now;
  let now = 100;
  Date.now = () => {
    now -= 1;
    return now;
  };
  try {
    const matcher = createMatcher(["nbsp", "ensp"]);
    const result = matcher.match("nsp");
    equal(semantic(result), expected, "07.01");
    ok(matcher.log.timeTakenInMilliseconds >= 0, "07.02");
    ok(result.log.timeTakenInMilliseconds >= 0, "07.03");
  } finally {
    Date.now = original;
  }
});

test("08 - explicit null disables callbacks", () => {
  const matcher = createMatcher(["nbsp"], { progressFn: null });
  equal(
    semantic(matcher.match("nsp", { progressFn: null })),
    semantic(matchTypos("nsp", ["nbsp"], { progressFn: null })),
    "08.01",
  );
});

test("09 - invalid calls do not begin callback progress", () => {
  const progressValues = [];
  const progressFn = (value) => progressValues.push(value);
  const matcher = createMatcher(["test"]);
  throws(
    () => matchTypos(null, ["test"], { progressFn }),
    /THROW_ID_01/,
    "09.01",
  );
  throws(() => createMatcher([""], { progressFn }), /THROW_ID_03/, "09.02");
  throws(
    () => matcher.match("test", { progressFn, maxCost: 0 }),
    /THROW_ID_05/,
    "09.03",
  );
  equal(progressValues, [], "09.04");
});

test.run();
