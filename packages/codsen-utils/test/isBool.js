import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isBool } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isBool(), false, "01.01");
  equal(isBool(undefined), false, "01.02");
  equal(isBool(null), false, "01.03");
  equal(isBool(0), false, "01.04");
  equal(isBool(1), false, "01.05");
  equal(isBool(false), true, "01.06");
  equal(isBool(true), true, "01.07");
  equal(isBool({}), false, "01.08");
  equal(
    isBool(() => {}),
    false,
    "01.09",
  );
  equal(isBool(new Set(["a"])), false, "01.10");
  equal(
    isBool(() => {}),
    false,
    "01.11",
  );
  equal(isBool(""), false, "01.12");
  equal(isBool("a"), false, "01.13");
  equal(isBool(NaN), false, "01.14");
  equal(isBool(0 / 0), false, "01.15");
  equal(isBool(1 / 0), false, "01.16");
  equal(isBool(-1 / 0), false, "01.17");
});

test.run();
