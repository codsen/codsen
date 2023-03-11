import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isStr } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isStr(), false, "01.01");
  equal(isStr(undefined), false, "01.02");
  equal(isStr(null), false, "01.03");
  equal(isStr(0), false, "01.04");
  equal(isStr(1), false, "01.05");
  equal(isStr(true), false, "01.06");
  equal(
    isStr(() => {}),
    false,
    "01.07"
  );
  equal(isStr({}), false, "01.08");
  equal(isStr(NaN), false, "01.09");
  equal(isStr(new Set(["a"])), false, "01.10");
  equal(
    isStr(() => {}),
    false,
    "01.11"
  );
  equal(isStr(""), true, "01.12");
  equal(isStr("a"), true, "01.13");
  equal(isStr(NaN), false, "01.14");
  equal(isStr(0 / 0), false, "01.15");
  equal(isStr(1 / 0), false, "01.16");
  equal(isStr(-1 / 0), false, "01.17");
});

test.run();
