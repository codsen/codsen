// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  defaultGetNextIdx,
  matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// input arg validation
// -----------------------------------------------------------------------------

test("01 - throws", () => {
  // no third arg
  throws(
    () => {
      matchLeftIncl("zzz", 1);
    },
    /THROW_ID_06/,
    "01.01",
  );

  throws(
    () => {
      matchRightIncl("zzz", 1);
    },
    /THROW_ID_06/,
    "01.02",
  );

  // third arg being wrong

  throws(
    () => {
      matchRightIncl("zzz", 1, 1);
    },
    /THROW_ID_03/,
    "01.03",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", 1);
    },
    /THROW_ID_02/,
    "01.04",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", "");
    },
    /THROW_ID_02/,
    "01.05",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", [""]);
    },
    /THROW_ID_02/,
    "01.06",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", ["", ""]);
    },
    /THROW_ID_02/,
    "01.07",
  );

  // no second arg

  throws(
    () => {
      matchLeftIncl("zzz", null, ["aaa"]);
    },
    /THROW_ID_02/,
    "01.08",
  );

  throws(
    () => {
      matchRightIncl("zzz", null, ["aaa"]);
    },
    /THROW_ID_02/,
    "01.09",
  );

  throws(
    () => {
      matchRightIncl("zzz", null, []);
    },
    /THROW_ID_02/,
    "01.10",
  );

  throws(
    () => {
      matchRightIncl("zzz", null, "");
    },
    /THROW_ID_02/,
    "01.11",
  );

  // second arg completely missing onwards

  throws(
    () => {
      matchLeftIncl("zzz");
    },
    /THROW_ID_02/,
    "01.12",
  );

  throws(
    () => {
      matchRightIncl("zzz");
    },
    /THROW_ID_02/,
    "01.13",
  );

  // fourth arg not a plain object
  throws(
    () => {
      matchRightIncl("zzz", 1, ["aaa"], true);
    },
    /THROW_ID_04/,
    "01.14",
  );

  // opts.trimBeforeMatching wrong type
  throws(
    () => {
      matchRightIncl("zzz", 1, ["aaa"], {
        trimBeforeMatching: "z",
      });
    },
    /THROW_ID_01/,
    "01.15",
  );

  throws(
    () => {
      matchRightIncl("zzz", 1, ["aaa"], {
        trimBeforeMatching: [],
      });
    },
    /trimCharsBeforeMatching/,
    "01.16",
  );
});

test("02 - default index stepper", () => {
  equal(defaultGetNextIdx(4), 5, "02.01");
});

test("03 - validates and bounds maxMismatches", () => {
  for (const invalidValue of [
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NaN,
    -1,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    throws(
      () =>
        matchRightIncl("ab", 1, "z", {
          maxMismatches: invalidValue,
        }),
      /THROW_ID_07/,
      "03.01",
    );
  }
  equal(matchRightIncl("ab", 1, "z", { maxMismatches: 0 }), false, "03.01");
  equal(
    matchRightIncl("ab", 1, "z", {
      maxMismatches: Number.MAX_SAFE_INTEGER,
    }),
    false,
    "03.02",
  );
  equal(
    matchRightIncl("ab", 1, "z", { maxMismatches: undefined }),
    false,
    "03.03",
  );
});

test("04 - validates every matcher alternative", () => {
  for (const invalidMatchers of [
    [1, "a", "b"],
    ["a", null, "b"],
    ["a", "b", {}],
  ]) {
    throws(
      () => matchRightIncl("abc", 0, invalidMatchers),
      /THROW_ID_08/,
      "04.01",
    );
  }
  equal(matchRightIncl("abc", 0, ["x", () => "EOL"]), false, "04.01");
});

test.run();
