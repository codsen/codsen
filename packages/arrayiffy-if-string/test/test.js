import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { arrayiffy as a } from "../dist/arrayiffy-if-string.esm.js";

// -----------------------------------------------------------------------------
// 02. BAU
// -----------------------------------------------------------------------------

test("01 - string input", () => {
  equal(a("aaa"), ["aaa"], "01.01");
  equal(a(""), [], "01.02");
});

test("02 - non-string input", () => {
  equal(a(1), 1, "02.01");
  equal(a(null), null, "02.02");
  equal(a(undefined), undefined, "02.03");
  equal(a(), undefined, "02.04");
  equal(a(true), true, "02.05");
});

test.run();
