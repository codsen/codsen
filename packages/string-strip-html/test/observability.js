import { test } from "uvu";
import { equal } from "uvu/assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

test("001 - reports best-effort elapsed time", () => {
  const originalNow = Date.now;
  const readings = [1_000, 1_041];
  Date.now = () => readings.shift();
  try {
    equal(
      stripHtml("<article><p>text</p></article>").log.timeTakenInMilliseconds,
      41,
      "001.01",
    );
  } finally {
    Date.now = originalNow;
  }
});

test.run();
