import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isNum } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isNum(), false, "01.01");
  equal(isNum(undefined), false, "01.02");
  equal(isNum(null), false, "01.03");
  equal(isNum(0), true, "01.04");
  equal(isNum(1), true, "01.05");
  equal(isNum(true), false, "01.06");
  equal(isNum({}), false, "01.07");
  equal(isNum(new Set(["a"])), false, "01.08");
  equal(
    isNum(() => {}),
    false,
    "01.09",
  );
  equal(isNum(""), false, "01.10");
  equal(isNum("a"), false, "01.11");

  // special cases
  equal(isNum(NaN), false, "01.12"); // just a "typeof" would return a true
  equal(isNum(0 / 0), false, "01.13"); // here too
  equal(isNum(1 / 0), false, "01.14"); // here too
  equal(isNum(-1 / 0), false, "01.15"); // here too
});

test.run();
