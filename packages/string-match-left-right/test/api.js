import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
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
    /THROW_ID_08/,
    "01.01",
  );

  throws(
    () => {
      matchRightIncl("zzz", 1);
    },
    /THROW_ID_08/,
    "01.02",
  );

  // third arg being wrong

  throws(
    () => {
      matchRightIncl("zzz", 1, 1);
    },
    /THROW_ID_05/,
    "01.03",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", 1);
    },
    /THROW_ID_03/,
    "01.04",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", "");
    },
    /THROW_ID_03/,
    "01.05",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", [""]);
    },
    /THROW_ID_03/,
    "01.06",
  );

  throws(
    () => {
      matchRightIncl("zzz", "aaa", ["", ""]);
    },
    /THROW_ID_03/,
    "01.07",
  );

  // no second arg

  throws(
    () => {
      matchLeftIncl("zzz", null, ["aaa"]);
    },
    /THROW_ID_03/,
    "01.08",
  );

  throws(
    () => {
      matchRightIncl("zzz", null, ["aaa"]);
    },
    /THROW_ID_03/,
    "01.09",
  );

  throws(
    () => {
      matchRightIncl("zzz", null, []);
    },
    /THROW_ID_03/,
    "01.10",
  );

  throws(
    () => {
      matchRightIncl("zzz", null, "");
    },
    /THROW_ID_03/,
    "01.11",
  );

  // second arg completely missing onwards

  throws(
    () => {
      matchLeftIncl("zzz");
    },
    /THROW_ID_03/,
    "01.12",
  );

  throws(
    () => {
      matchRightIncl("zzz");
    },
    /THROW_ID_03/,
    "01.13",
  );

  // fourth arg not a plain object
  throws(
    () => {
      matchRightIncl("zzz", 1, ["aaa"], true);
    },
    /THROW_ID_06/,
    "01.14",
  );

  // opts.trimBeforeMatching wrong type
  throws(
    () => {
      matchRightIncl("zzz", 1, ["aaa"], {
        trimBeforeMatching: "z",
      });
    },
    /THROW_ID_09/,
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

test.run();
