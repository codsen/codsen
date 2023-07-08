import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { existy } from "../dist/codsen-utils.esm.js";

test("01 - catches null and undefined", () => {
  equal(existy(), false, "01.01");
  equal(existy(undefined), false, "01.02");
  equal(existy(null), false, "01.03");
});

test("02 - exists", () => {
  equal(existy(0), true, "02.01");
  equal(existy(1), true, "02.02");
  equal(existy(false), true, "02.03");
  equal(existy(true), true, "02.04");
  equal(existy(""), true, "02.05");
  equal(existy("a"), true, "02.06");
  equal(existy({}), true, "02.07");
  equal(existy([]), true, "02.08");
  equal(
    existy(() => {}),
    true,
    "02.09",
  );
  equal(existy(NaN), true, "02.10");
});

test.run();
