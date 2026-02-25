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

test.run();
