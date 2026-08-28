// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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

test("04 - global regexps start and finish at index zero", () => {
  let global = /app/g;
  global.lastIndex = 1;

  equal(includes([global], "apple"), true, "04.01");
  equal(global.lastIndex, 0, "04.02");

  let globalSticky = /app/gy;
  globalSticky.lastIndex = 1;

  equal(includes([globalSticky], "apple"), true, "04.03");
  equal(globalSticky.lastIndex, 0, "04.04");

  let globalStickyMiss = /pp/gy;
  globalStickyMiss.lastIndex = 1;

  equal(includes([globalStickyMiss], "apple"), false, "04.05");
  equal(globalStickyMiss.lastIndex, 0, "04.06");
});

test("05 - non-global sticky regexps use and update their last index", () => {
  let sticky = /app/y;
  sticky.lastIndex = 1;

  equal(includes([sticky], "apple"), false, "05.01");
  equal(sticky.lastIndex, 0, "05.02");
  equal(includes([sticky], "apple"), true, "05.03");
  equal(sticky.lastIndex, 3, "05.04");
});

test("06 - ordinary non-global regexps leave their last index alone", () => {
  let regexp = /app/;
  regexp.lastIndex = 2;

  equal(includes([regexp], "apple"), true, "06.01");
  equal(regexp.lastIndex, 2, "06.02");
});

test("07 - unusable and overridden regex-like values do not throw", () => {
  class ThrowingAccessors extends RegExp {
    get global() {
      throw new Error("must not run");
    }

    test() {
      throw new Error("must not run");
    }
  }

  let overridden = new ThrowingAccessors("app", "g");
  overridden.lastIndex = 2;

  equal(includes([RegExp.prototype], "apple"), false, "07.01");
  equal(includes([new Proxy(/app/, {})], "apple"), false, "07.02");
  equal(
    includes([{ [Symbol.toStringTag]: "RegExp" }], "apple"),
    false,
    "07.03",
  );
  equal(includes([overridden], "apple"), true, "07.04");
  equal(overridden.lastIndex, 0, "07.05");
});

test.run();
