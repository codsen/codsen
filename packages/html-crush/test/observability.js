import { test } from "uvu";
import { equal } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

test("01 - reports elapsed time from both completion paths", () => {
  const originalNow = Date.now;
  const readings = [1_000, 1_019, 2_000, 2_023];
  Date.now = () => readings.shift();
  try {
    equal(crush("<p>  text  </p>").log.timeTakenInMilliseconds, 19, "01.01");
    equal(crush("").log.timeTakenInMilliseconds, 23, "01.02");
  } finally {
    Date.now = originalNow;
  }
});

test.run();
