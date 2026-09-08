import { test } from "uvu";
import { equal } from "uvu/assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

test("01 - repeated mixed typography preserves every replacement", () => {
  equal(
    unfancy("“alpha”…‘beta’\u00A0—− ".repeat(1_000)),
    "\"alpha\"...'beta' -- ".repeat(1_000),
    "01.01",
  );
});

test("02 - repeated recursive entities normalize after decoding", () => {
  equal(
    unfancy(
      "&amp;ldquo;alpha&amp;rdquo;&amp;hellip;&amp;nbsp;&amp;ndash; ".repeat(
        500,
      ),
    ),
    '"alpha"... - '.repeat(500),
    "02.01",
  );
});

test("03 - repeated calls cannot share replacement state", () => {
  for (let i = 0; i < 20; i += 1) {
    equal(unfancy("…“alpha”"), '..."alpha"', `03.01 - call ${i + 1}`);
    equal(unfancy("ordinary ASCII"), "ordinary ASCII", `03.02 - call ${i + 1}`);
    equal(unfancy(""), "", `03.03 - call ${i + 1}`);
    equal(unfancy("‘beta’…"), "'beta'...", `03.04 - call ${i + 1}`);
  }
});

test.run();
