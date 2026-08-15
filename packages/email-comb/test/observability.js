import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "../dist/email-comb.esm.js";

test("01 - reports best-effort elapsed time", () => {
  const originalNow = Date.now;
  // email-comb composes html-crush, which records its own elapsed time.
  const readings = [1_000, 1_005, 1_006, 1_037];
  Date.now = () => readings.shift();
  try {
    equal(
      comb("<style>.unused { color: red; }</style><p>text</p>").log
        .timeTakenInMilliseconds,
      37,
      "01.01",
    );
  } finally {
    Date.now = originalNow;
  }
});

test.run();
