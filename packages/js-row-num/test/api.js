import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { fixRowNums, defaults, version } from "../dist/js-row-num.esm.js";

// throws
// -----------------------------------------------------------------------------

test("01 - wrong input type", () => {
  throws(
    () => {
      fixRowNums();
    },
    /THROW_ID_01/,
    "01.01",
  );
  throws(
    () => {
      fixRowNums(true);
    },
    /THROW_ID_01/,
    "01.02",
  );
  throws(
    () => {
      fixRowNums(false);
    },
    /THROW_ID_01/,
    "01.03",
  );
  throws(
    () => {
      fixRowNums({});
    },
    /THROW_ID_01/,
    "01.04",
  );
  throws(
    () => {
      fixRowNums(NaN);
    },
    /THROW_ID_01/,
    "01.05",
  );
});

test("02 - the opts.returnRangesOnly is present", () => {
  throws(
    () => {
      fixRowNums("zzz", {
        returnRangesOnly: true,
      });
    },
    /THROW_ID_02/,
    "02.01",
  );
  throws(
    () => {
      fixRowNums("zzz", {
        returnRangesOnly: false,
      });
    },
    /THROW_ID_02/,
    "02.02",
  );
});

test("03 - empty string", () => {
  let { result, ranges } = fixRowNums("");
  equal(result, "", "03.01");
  equal(ranges, null, "03.02");
});

test("04 - exports defaults", () => {
  equal(
    defaults,
    {
      padStart: 3,
      overrideRowNum: null,
      triggerKeywords: ["console.log"],
      extractedLogContentsWereGiven: false,
    },
    "04.01",
  );
});

test("05 - exports version", () => {
  match(version, /\d+\.\d+\.\d+/g, "05.01");
});

test.run();
