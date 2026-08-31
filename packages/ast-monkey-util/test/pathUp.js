// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { pathUp } from "../dist/ast-monkey-util.esm.js";

test(`01 - pathUp - empty str`, () => {
  equal(pathUp(""), "0", "01.01");
});

test(`02 - pathUp - upon first element`, () => {
  equal(pathUp("0"), "0", "02.01");
});

test(`03 - pathUp - upon second element`, () => {
  equal(pathUp("1"), "0", "03.01");
});

test(`04 - pathUp - non-numeric`, () => {
  equal(pathUp("1.z"), "0", "04.01");
});

test(`05 - pathUp - usual`, () => {
  equal(pathUp("9.children.3"), "9", "05.01");
});

test(`06 - pathUp - usual, two levels`, () => {
  equal(pathUp("9.children.1.children.2"), "9.children.1", "06.01");
});

test("07 - non-string input", () => {
  throws(
    () => {
      pathUp();
    },
    /ast-monkey-util\/pathUp\(\): \[THROW_ID_04]/,
    "07.01",
  );
});

test("08 - leading empty key", () => {
  equal(pathUp(".0"), "0", "08.01");
  equal(pathUp(".a"), "0", "08.02");
  equal(pathUp("."), "0", "08.03");
  equal(pathUp(".a.b"), "", "08.04");
  equal(pathUp(".a.b.c"), ".a", "08.05");
  equal(pathUp("a.b"), "0", "08.06");
  equal(pathUp("a.b.c"), "a", "08.07");
});

test.run();
