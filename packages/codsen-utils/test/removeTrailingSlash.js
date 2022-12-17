import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { removeTrailingSlash } from "../dist/codsen-utils.esm.js";

test("01 - string-in, nothing to do", () => {
  equal(removeTrailingSlash("a"), "a", "01.01");
  equal(removeTrailingSlash(""), "", "01.02");
  equal(removeTrailingSlash("\n\n\naaa \n\n\n"), "\n\n\naaa \n\n\n", "01.03");
  equal(removeTrailingSlash("/a"), "/a", "01.04");
  equal(removeTrailingSlash("/"), "", "01.05");
  equal(removeTrailingSlash("\\"), "\\", "01.06");
});

test("02 - string-in, ends with slash", () => {
  equal(
    removeTrailingSlash("http://codsen.com/"),
    "http://codsen.com",
    "02.01"
  );
});

test("03 - wrong type", () => {
  equal(removeTrailingSlash(), undefined, "03.01");
  equal(removeTrailingSlash(null), null, "03.02");
  equal(removeTrailingSlash(NaN), NaN, "03.03");
  equal(removeTrailingSlash(false), false, "03.04");
  equal(removeTrailingSlash(true), true, "03.05");
  equal(removeTrailingSlash(1), 1, "03.06");
});

test.run();
