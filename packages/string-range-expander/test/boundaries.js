import { test } from "uvu";
import { equal } from "uvu/assert";

import { expander } from "../dist/string-range-expander.esm.js";

test("01 - accepts every zero-width boundary", () => {
  equal(expander({ str: "abc", from: 0, to: 0 }), [0, 0], "01.01");
  equal(expander({ str: "abc", from: 1, to: 1 }), [1, 1], "01.02");
  equal(expander({ str: "abc", from: 2, to: 2 }), [2, 2], "01.03");
  equal(expander({ str: "abc", from: 3, to: 3 }), [3, 3], "01.04");
});

test("02 - accepts the only valid empty-string range", () => {
  equal(expander({ str: "", from: 0, to: 0 }), [0, 0], "02.01");
});

test.run();
