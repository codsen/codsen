// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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

test("03 - preserves identity and allocates primitive string results", () => {
  const array = ["value"];
  const object = { value: true };
  const boxedString = Object("boxed");

  is(a(array), array, "03.01");
  is(a(object), object, "03.02");
  is(a(boxedString), boxedString, "03.03");

  const firstNonEmpty = a("value");
  const secondNonEmpty = a("value");
  const firstEmpty = a("");
  const secondEmpty = a("");

  equal(firstNonEmpty, ["value"], "03.04");
  is(firstNonEmpty === secondNonEmpty, false, "03.05");
  equal(firstEmpty, [], "03.06");
  is(firstEmpty === secondEmpty, false, "03.07");
});

test.run();
