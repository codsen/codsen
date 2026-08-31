// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  defaults,
  includesWithGlob,
} from "../dist/array-includes-with-glob.esm.js";

test("01 - empty array always yields false", () => {
  equal(includesWithGlob([], "zzz"), false, "01.01");
});

// ===
// BAU
// ===

test("02 - no wildcard, fails", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "thing"),
    false,
    "02.01",
  );
});

test("03 - no wildcard, succeeds", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "something"),
    true,
    "03.01",
  );
});

test("04 - wildcard, succeeds", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "*thing"),
    true,
    "04.01",
  );
  equal(
    includesWithGlob(["someTHING", "anyTHING", "everyTHING"], "*thing"),
    false,
    "04.02",
  );
  equal(
    includesWithGlob(["someThInG", "anytHInG", "everyThINg"], "*thing"),
    false,
    "04.03",
  );
});

test("05 - wildcard, fails", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "zzz"),
    false,
    "05.01",
  );
});

test("06 - emoji everywhere", () => {
  equal(
    includesWithGlob(["xxxaxxx", "zxxxzzzzxz", "xxz"], "*a*"),
    true,
    "06.01",
  );
  equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*a*"),
    true,
    "06.02",
  );
  equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*🦄z"),
    true,
    "06.03",
  );
  equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "%%%"),
    false,
    "06.04",
  );
});

test("07 - second arg is empty string", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], ""),
    false,
    "07.01",
  );
});

test("08 - input is not array but string", () => {
  equal(includesWithGlob(["something"], "*thing"), true, "08.01");
  equal(includesWithGlob("something", "*thing"), true, "08.02");
  equal(includesWithGlob("something", "thing"), false, "08.03");
});

// =======================================================
// various combinations of different types including globs
// =======================================================

test("09 - both arrays, no wildcards", () => {
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
    ),
    true,
    "09.01",
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "any",
      },
    ),
    true,
    "09.02",
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "all",
      },
    ),
    false,
    "09.03",
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"],
    ),
    true,
    "09.04",
  );
  equal(includesWithGlob("something", ["*thing", "zzz"]), true, "09.05");
  equal(includesWithGlob("something", ["thing", "*zzz"]), false, "09.06");
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "all",
      },
    ),
    false,
    "09.07",
  );
  equal(
    includesWithGlob("something", ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "09.08",
  );
  equal(
    includesWithGlob("something", "*thing", {
      arrayVsArrayAllMustBeFound: "all",
    }),
    true,
    "09.09",
  );
});

test("10", () => {
  equal(includesWithGlob("zzz", ["*thing", "*zz"]), true, "10.01");
  equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "any",
    }),
    true,
    "10.02",
  );
  equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "10.03",
  );
});

test("11 - opts.caseSensitive", () => {
  equal(includesWithGlob("something", ["*THING", "zzz"]), false, "11.01");
  equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: true,
    }),
    false,
    "11.02",
  );
  equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: false,
    }),
    true,
    "11.03",
  );
  equal(
    includesWithGlob("something", ["*ZING", "zzz"], {
      caseSensitive: false,
    }),
    false,
    "11.04",
  );
});

test("12 - invalid source entries are skipped lazily", () => {
  const sparseSource = new Array(3);
  sparseSource[2] = "xyz";
  const earlyHit = ["hit"];
  Object.defineProperty(earlyHit, 1, {
    get() {
      throw new Error("late source entry was read");
    },
  });

  equal(
    includesWithGlob([false, {}, 123, null, undefined, "xyz"], "x*"),
    true,
    "12.01",
  );
  equal(includesWithGlob([false, {}, 123], "*"), false, "12.02");
  equal(includesWithGlob(sparseSource, "x*"), true, "12.03");
  equal(includesWithGlob(new Array(3), "*"), false, "12.04");
  equal(includesWithGlob(earlyHit, "hit"), true, "12.05");
});

test("13 - options use immutable canonical defaults", () => {
  equal(includesWithGlob(["ABC"], "abc"), false, "13.01");
  equal(
    includesWithGlob(["ABC"], "abc", { caseSensitive: undefined }),
    false,
    "13.02",
  );
  equal(
    includesWithGlob(["ABC"], "abc", { caseSensitive: null }),
    false,
    "13.03",
  );
  equal(includesWithGlob(["ABC"], "abc", null), false, "13.04");
  equal(
    includesWithGlob(["abc"], ["a*", "z*"], {
      arrayVsArrayAllMustBeFound: undefined,
    }),
    true,
    "13.05",
  );
  equal(
    includesWithGlob(["abc"], ["a*", "z*"], {
      arrayVsArrayAllMustBeFound: null,
    }),
    true,
    "13.06",
  );
  equal(Object.isFrozen(defaults), true, "13.07");
  try {
    defaults.caseSensitive = false;
  } catch {}
  equal(defaults.caseSensitive, true, "13.08");
  equal(includesWithGlob(["ABC"], "abc"), false, "13.09");
  equal(
    includesWithGlob(["abc"], "abc", { unusedRuntimeOption: true }),
    true,
    "13.10",
  );
});

test("14 - scalar and singleton-array empty values are equivalent", () => {
  equal(includesWithGlob("", ""), true, "14.01");
  equal(includesWithGlob([""], ""), true, "14.02");
  equal(includesWithGlob("", [""]), true, "14.03");
  equal(includesWithGlob([""], [""]), true, "14.04");
  equal(includesWithGlob("", "*"), true, "14.05");
  equal(includesWithGlob([""], "*"), true, "14.06");
  equal(includesWithGlob([], ""), false, "14.07");
  equal(includesWithGlob("", []), false, "14.08");
  equal(includesWithGlob(["x"], ["", "x"]), true, "14.09");
  equal(
    includesWithGlob(["", "x"], ["", "x"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    true,
    "14.10",
  );
});

test("15 - negative patterns exclude values from one cohesive list", () => {
  equal(
    includesWithGlob(["only.txt"], ["*.js", "!*.test.js"]),
    false,
    "15.01",
  );
  equal(
    includesWithGlob(["only.test.js"], ["*.js", "!*.test.js"]),
    false,
    "15.02",
  );
  equal(
    includesWithGlob(["main.js", "main.test.js"], ["*.js", "!*.test.js"]),
    true,
    "15.03",
  );
  equal(includesWithGlob(["other"], "!important"), true, "15.04");
  equal(includesWithGlob(["important"], ["!important"]), false, "15.05");
  equal(includesWithGlob(["!important"], String.raw`\!important`), true, "15.06");
  equal(
    includesWithGlob(
      ["main.js", "theme.css", "main.test.js"],
      ["*.js", "*.css", "!*.test.js"],
      { arrayVsArrayAllMustBeFound: "all" },
    ),
    true,
    "15.07",
  );
  equal(
    includesWithGlob(
      ["main.test.js", "theme.css"],
      ["*.js", "*.css", "!*.test.js"],
      { arrayVsArrayAllMustBeFound: "all" },
    ),
    false,
    "15.08",
  );
});

test("16 - validation errors are package-owned and stable", () => {
  function errorMessage(callback) {
    try {
      callback();
    } catch (error) {
      return error.message;
    }
    return undefined;
  }

  equal(
    errorMessage(() => includesWithGlob()),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_01] The first argument must be a string or an array; received undefined.",
    "16.01",
  );
  equal(
    errorMessage(() => includesWithGlob(1, "x")),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_01] The first argument must be a string or an array; received 1.",
    "16.02",
  );
  equal(
    errorMessage(() => includesWithGlob(["x"], 1)),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_02] The second argument must be a string or an array of strings; received 1.",
    "16.03",
  );
  equal(
    errorMessage(() => includesWithGlob(["x"], "x", false)),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_03] The third argument must be an options object, null, or undefined; received false.",
    "16.04",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", {
        arrayVsArrayAllMustBeFound: "ALL",
      }),
    ),
    'array-includes-with-glob/includesWithGlob(): [THROW_ID_04] opts.arrayVsArrayAllMustBeFound must be "any", "all", null, or undefined; received "ALL".',
    "16.05",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", { caseSensitive: "false" }),
    ),
    'array-includes-with-glob/includesWithGlob(): [THROW_ID_05] opts.caseSensitive must be a Boolean, null, or undefined; received "false".',
    "16.06",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", { reportProgressFunc: 1 }),
    ),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_06] opts.reportProgressFunc must be a function, null, or undefined; received 1.",
    "16.07",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", { reportProgressFuncFrom: Infinity }),
    ),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_07] opts.reportProgressFuncFrom must be a finite number, null, or undefined; received Infinity.",
    "16.08",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", { reportProgressFuncTo: Number.NaN }),
    ),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_08] opts.reportProgressFuncTo must be a finite number, null, or undefined; received NaN.",
    "16.09",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", {
        reportProgressFuncFrom: 10,
        reportProgressFuncTo: 0,
      }),
    ),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_09] opts.reportProgressFuncFrom cannot exceed opts.reportProgressFuncTo; received 10 and 0.",
    "16.10",
  );
  equal(
    errorMessage(() =>
      includesWithGlob(["x"], "x", { reportCompletionFunc: 1 }),
    ),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_10] opts.reportCompletionFunc must be a function, null, or undefined; received 1.",
    "16.11",
  );
  equal(
    errorMessage(() => includesWithGlob(["x"], new Array(1))),
    "array-includes-with-glob/includesWithGlob(): [THROW_ID_11] The second argument's array must contain only strings and no holes; received undefined.",
    "16.12",
  );
});

test("17 - progress and completion are observational", () => {
  const progress = [];
  let completion;
  const originalNow = Date.now;
  const clock = [100, 112];
  Date.now = () => clock.shift();
  let result;

  try {
    result = includesWithGlob(["miss", "hit", "late"], ["hit", "hit"], {
      reportCompletionFunc: (stats) => {
        completion = stats;
      },
      reportProgressFunc: (percentageDone) => {
        progress.push(percentageDone);
      },
      reportProgressFuncFrom: 20,
      reportProgressFuncTo: 40,
    });
  } finally {
    Date.now = originalNow;
  }

  equal(result, true, "17.01");
  equal(progress, [20, 26, 40], "17.02");
  equal(
    completion,
    {
      patternComparisons: 2,
      sourceItemsVisited: 2,
      timeTakenInMilliseconds: 12,
    },
    "17.03",
  );

  const emptyProgress = [];
  let emptyCompletion;
  equal(
    includesWithGlob([], "x", {
      reportCompletionFunc: (stats) => {
        emptyCompletion = stats;
      },
      reportProgressFunc: (percentageDone) => {
        emptyProgress.push(percentageDone);
      },
    }),
    false,
    "17.04",
  );
  equal(emptyProgress, [0, 100], "17.05");
  equal(emptyCompletion.patternComparisons, 0, "17.06");
  equal(emptyCompletion.sourceItemsVisited, 0, "17.07");
  equal(
    errorMessageFromCallback(() => {
      throw new Error("stop reporting");
    }),
    "stop reporting",
    "17.08",
  );

  function errorMessageFromCallback(reportProgressFunc) {
    try {
      includesWithGlob(["x"], "x", { reportProgressFunc });
    } catch (error) {
      return error.message;
    }
    return undefined;
  }
});

test("18 - duplicate and long patterns reuse prepared work", () => {
  const source = Array.from({ length: 2000 }, (_value, index) =>
    index === 1999 ? "target" : `miss-${index}`,
  );
  const duplicatePatterns = Array.from({ length: 2000 }, () => "target");
  let completion;
  const longPattern = `${"a*".repeat(600)}tail`;

  equal(
    includesWithGlob(source, duplicatePatterns, {
      arrayVsArrayAllMustBeFound: "all",
      reportCompletionFunc: (stats) => {
        completion = stats;
      },
    }),
    true,
    "18.01",
  );
  equal(completion.patternComparisons, source.length, "18.02");
  equal(completion.sourceItemsVisited, source.length, "18.03");
  equal(includesWithGlob(source, longPattern), false, "18.04");
  equal(includesWithGlob(["aXbYc"], "a*b*c"), true, "18.05");
  equal(includesWithGlob(["a\nb"], "a*b"), true, "18.06");
});

test("19 - read-only inputs and options are not mutated", () => {
  const input = Object.freeze(["main.js", "main.test.js"]);
  const patterns = Object.freeze(["*.js", "!*.test.js"]);
  const options = Object.freeze({
    arrayVsArrayAllMustBeFound: "all",
    caseSensitive: true,
  });

  equal(includesWithGlob(input, patterns, options), true, "19.01");
  equal(input, ["main.js", "main.test.js"], "19.02");
  equal(patterns, ["*.js", "!*.test.js"], "19.03");
  equal(
    options,
    { arrayVsArrayAllMustBeFound: "all", caseSensitive: true },
    "19.04",
  );
});

test.run();
