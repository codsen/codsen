import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stringSplice } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(stringSplice(""), "", "01.01");
});

test("02 - only one arg passed", () => {
  equal(stringSplice("a"), "a", "02.01");
});

test("03", () => {
  equal(
    stringSplice("the quick brown fox", 16, 3, "dog"),
    "the quick brown dog",
    "03.01"
  );
});

test("04 - index is negative number", () => {
  equal(
    stringSplice("the quick brown fox", -3, 3, "dog"),
    "the quick brown dog",
    "04.01"
  );
});

test("05 - empty string, negative index", () => {
  equal(stringSplice("", -3, 3, "dog"), "dog", "05.01");
});

test("06", () => {
  equal(stringSplice("a", 0, 0, "x"), "xa", "06.01");
});

test.run();
