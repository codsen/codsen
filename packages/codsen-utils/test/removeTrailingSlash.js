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
    "02.01",
  );
});

test("03 - removes only one last slash", () => {
  equal(
    removeTrailingSlash("http://codsen.com//"),
    "http://codsen.com/",
    "03.01",
  );
});

test("04 - wrong type - returns same thing", () => {
  equal(removeTrailingSlash(), undefined, "04.01");
  equal(removeTrailingSlash(null), null, "04.02");
  equal(removeTrailingSlash(NaN), NaN, "04.03");
  equal(removeTrailingSlash(false), false, "04.04");
  equal(removeTrailingSlash(true), true, "04.05");
  equal(removeTrailingSlash(1), 1, "04.06");
  equal(removeTrailingSlash(-0), -0, "04.07");
  equal(removeTrailingSlash({}), {}, "04.08");
});

test.run();
