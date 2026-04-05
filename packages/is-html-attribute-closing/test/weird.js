// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";

// const BACKSLASH = "\u005C";

// Weird cases
// -----------------------------------------------------------------------------

test(`01 - weird cases - no input`, () => {
  not.ok(isCl(), "01.01");
});

test(`02 - weird cases - input is not a string`, () => {
  not.ok(isCl(2), "02.01");
});

test(`03 - weird cases - input is empty string`, () => {
  not.ok(isCl(""), "03.01");
});

test(`04 - weird cases - 2nd arg is missing`, () => {
  not.ok(isCl("a"), "04.01");
});

test(`05 - weird cases - 2nd arg is not integer`, () => {
  not.ok(isCl("a", "a"), "05.01");
});

test(`06 - weird cases - 3rd arg is missing`, () => {
  not.ok(isCl("a", 0), "06.01");
});

test(`07 - weird cases - 3rd arg is not integer`, () => {
  not.ok(isCl("a", 0, "a"), "07.01");
});

test(`08 - weird cases - no character in string at what's given by 2nd arg`, () => {
  not.ok(isCl("a", 99, 100), "08.01");
});

test(`09 - weird cases - no character in string at what's given by 3rd arg`, () => {
  not.ok(isCl("a", 0, 100), "09.01");
});

test(`10 - weird cases - indexes equal`, () => {
  not.ok(isCl("abcde", 2, 2), "10.01");
});

test(`11 - weird cases - 3rd > 2nd`, () => {
  not.ok(isCl("abcde", 2, 1), "11.01");
});

test.run();
