import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isNull } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isNull(), false, "01.01");
  equal(isNull(undefined), false, "01.02");
  equal(isNull(null), true, "01.03");
  equal(isNull(0), false, "01.04");
  equal(isNull(1), false, "01.05");
  equal(isNull(false), false, "01.06");
  equal(isNull(true), false, "01.07");
  equal(isNull({}), false, "01.08");
  equal(
    isNull(() => {}),
    false,
    "01.09"
  );
  equal(isNull(new Set(["a"])), false, "01.10");
  equal(
    isNull(() => {}),
    false,
    "01.11"
  );
  equal(isNull(""), false, "01.12");
  equal(isNull("a"), false, "01.13");

  equal(isNull(NaN), false, "01.14");
  equal(isNull(0 / 0), false, "01.15");
  equal(isNull(1 / 0), false, "01.16");
  equal(isNull(-1 / 0), false, "01.17");
});

test.run();
