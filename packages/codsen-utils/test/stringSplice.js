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

test.run();
