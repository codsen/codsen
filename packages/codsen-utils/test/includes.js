import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { includes } from "../dist/codsen-utils.esm.js";

test("01 - edge cases", () => {
  equal(includes(), false, "01.01");
  equal(includes(undefined), false, "01.02");
  equal(includes(false), false, "01.03");
  equal(includes(null), false, "01.04");
  equal(includes(NaN), false, "01.05");
  equal(includes(0), false, "01.06");
  equal(includes(1), false, "01.07");
  equal(includes(""), false, "01.08");
  equal(includes("a"), false, "01.09");
  equal(includes([]), false, "01.10");
});

test("02 - matching string", () => {
  equal(includes([], "z"), false, "02.01");
  equal(includes(["a"], "z"), false, "02.02");
  equal(includes(["z"], "z"), true, "02.03");
  equal(includes(["a", "z"], "z"), true, "02.04");
  equal(includes(["a", "b"], "z"), false, "02.05");
});

test("03 - matching regexp", () => {
  equal(includes(["apricot", /app/, "lemon"], "apple"), true, "03.01");
  equal(includes(["apricot", /foo/, "lemon"], "apple"), false, "03.02");
  equal(includes(["apricot", /foo/, "apple"], "apple"), true, "03.03");
  equal(includes([/apple/], "apple"), true, "03.04");
  equal(includes([/foo/], "apple"), false, "03.05");
  equal(includes([/\n/], "apple"), false, "03.06");
});

test.run();
