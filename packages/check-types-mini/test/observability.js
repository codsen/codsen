import { test } from "uvu";
import { equal, not, ok } from "uvu/assert";

import { checkTypesMini, defaults } from "../dist/check-types-mini.esm.js";

test("01 - defaults expose inert frozen observability controls", () => {
  ok(Object.isFrozen(defaults), "01.01");
  equal(defaults.reportCompletionFunc, null, "01.02");
  equal(defaults.reportProgressFunc, null, "01.03");
  equal(defaults.reportProgressFuncFrom, 0, "01.04");
  equal(defaults.reportProgressFuncTo, 100, "01.05");
});

test("02 - callbacks report deterministic work and stubbed elapsed time", () => {
  const progress = [];
  let completion;
  const originalNow = Date.now;
  let clockReads = 0;
  Date.now = () => {
    clockReads++;
    return clockReads === 1 ? 100 : 117;
  };
  try {
    checkTypesMini(
      { enabled: true, output: "dist", retries: 2 },
      { enabled: false, output: "", retries: 0 },
      {
        reportCompletionFunc: (stats) => {
          completion = stats;
        },
        reportProgressFunc: (percentageDone) => {
          progress.push(percentageDone);
        },
        reportProgressFuncFrom: 20,
        reportProgressFuncTo: 40,
      },
    );
  } finally {
    Date.now = originalNow;
  }
  equal(progress, [20, 40], "02.01");
  equal(
    {
      arrayElementsVisited: completion.arrayElementsVisited,
      maxDepth: completion.maxDepth,
      objectPropertiesVisited: completion.objectPropertiesVisited,
      schemaEntries: completion.schemaEntries,
      timeTakenInMilliseconds: completion.timeTakenInMilliseconds,
      valuesIgnored: completion.valuesIgnored,
      valuesValidated: completion.valuesValidated,
    },
    {
      arrayElementsVisited: 0,
      maxDepth: 1,
      objectPropertiesVisited: 3,
      schemaEntries: 0,
      timeTakenInMilliseconds: 17,
      valuesIgnored: 0,
      valuesValidated: 3,
    },
    "02.02",
  );
  ok(Object.isFrozen(completion), "02.03");
});

test("03 - callback failures cannot change validation semantics", () => {
  not.throws(() => {
    checkTypesMini(
      { enabled: true },
      { enabled: false },
      {
        reportCompletionFunc() {
          throw new TypeError("completion callback failed");
        },
        reportProgressFunc() {
          throw new TypeError("progress callback failed");
        },
      },
    );
  }, "03.01");
});

test("04 - long validations emit finite monotonic intermediate progress", () => {
  const input = {};
  const reference = {};
  for (let index = 0; index < 1200; index++) {
    input[`key${index}`] = index;
    reference[`key${index}`] = 0;
  }
  const progress = [];
  checkTypesMini(input, reference, {
    reportProgressFunc(percentageDone) {
      progress.push(percentageDone);
    },
  });
  equal(progress[0], 0, "04.01");
  equal(progress.at(-1), 100, "04.02");
  ok(progress.length > 2, "04.03");
  ok(progress.every(Number.isFinite), "04.04");
  ok(
    progress.every(
      (value, index) => index === 0 || value >= progress[index - 1],
    ),
    "04.05",
  );
});

test.run();
