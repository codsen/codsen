import { test } from "uvu";
import { equal } from "uvu/assert";

import { trimChars } from "../dist/codsen-utils.esm.js";

test("01 - trims one ASCII character", () => {
  equal(trimChars("///article///", "/"), "article", "01.01");
  equal(trimChars("article", "/"), "article", "01.02");
  equal(trimChars("////", "/"), "", "01.03");
});

test("02 - trims an ASCII character set", () => {
  equal(trimChars("//article/>", "/>"), "article", "02.01");
  equal(trimChars("article", "/>"), "article", "02.02");
  equal(trimChars("/>/>", "/>"), "", "02.03");
});

test("03 - returns empty inputs unchanged", () => {
  equal(trimChars("", "/>"), "", "03.01");
  equal(trimChars("article", ""), "article", "03.02");
});

test("04 - trims Unicode code points", () => {
  equal(trimChars("😀😀article😀", "😀"), "article", "04.01");
  equal(trimChars("article", "😀"), "article", "04.02");
  equal(trimChars("😀😀", "😀"), "", "04.03");
});

test.run();
