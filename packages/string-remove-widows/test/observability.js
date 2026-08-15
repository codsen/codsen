import { test } from "uvu";
import { equal } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

test("01 - reports best-effort elapsed time", () => {
  const originalNow = Date.now;
  const readings = [1_000, 1_029];
  Date.now = () => readings.shift();
  try {
    equal(
      removeWidows("A short sentence").log.timeTakenInMilliseconds,
      29,
      "01.01",
    );
  } finally {
    Date.now = originalNow;
  }
});

test.run();
