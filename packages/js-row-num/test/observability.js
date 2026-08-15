import { test } from "uvu";
import { equal } from "uvu/assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

test("01 - reports elapsed time from both completion paths", () => {
  const originalNow = Date.now;
  const readings = [1_000, 1_011, 2_000, 2_017];
  Date.now = () => readings.shift();
  try {
    equal(fixRowNums("").log.timeTakenInMilliseconds, 11, "01.01");
    equal(
      fixRowNums("console.log('999 text');").log.timeTakenInMilliseconds,
      17,
      "01.02",
    );
  } finally {
    Date.now = originalNow;
  }
});

test.run();
