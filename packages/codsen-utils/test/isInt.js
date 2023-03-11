import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isInt } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isInt(), false, "01.01");
  equal(isInt(undefined), false, "01.02");
  equal(isInt(null), false, "01.03");
  equal(isInt(0), true, "01.04");
  equal(isInt(1), true, "01.05");
  equal(isInt(-1), false, "01.06");
  equal(isInt(0.1), false, "01.07");
  equal(isInt(-0.1), false, "01.08");
  equal(isInt(2 ** 53), false, "01.09");
  equal(isInt(true), false, "01.10");
  equal(isInt({}), false, "01.11");
  equal(isInt(new Set(["a"])), false, "01.12");
  equal(
    isInt(() => {}),
    false,
    "01.13"
  );
  equal(isInt(""), false, "01.14");
  equal(isInt("a"), false, "01.15");

  equal(isInt(Infinity), false, "01.16");
  equal(isInt(NaN), false, "01.17");
  equal(isInt(0 / 0), false, "01.18");
  equal(isInt(1 / 0), false, "01.19");
  equal(isInt(-1 / 0), false, "01.20");
});

test.run();
