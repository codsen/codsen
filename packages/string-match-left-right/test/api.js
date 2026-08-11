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

test.run();
