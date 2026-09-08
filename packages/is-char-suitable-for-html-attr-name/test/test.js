// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, match, not, ok, throws, type } from "uvu/assert";

import { isAttrNameChar as is } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

const BACKSLASH = "\u005C";

// 00. Weird cases
// -----------------------------------------------------------------------------

test(`01 - weird cases - no input`, () => {
  equal(is(), false, "01.01");
});

test(`02 - weird cases - input is not a string`, () => {
  equal(is(2), false, "02.01");
});

test(`03 - weird cases - empty string`, () => {
  equal(is(""), false, "03.01");
});

test(`04 - weird cases - more than 1 long - first char is picked`, () => {
  equal(is("aa"), true, "04.01");
});

test(`05 - weird cases - more than 1 long - first char is picked`, () => {
  equal(is(" a"), false, "05.01");
});

// 01. B.A.U.
// -----------------------------------------------------------------------------

test("06 - true", () => {
  equal(is("a"), true, "06.01");
  equal(is("A"), true, "06.02");
  equal(is("1"), true, "06.03");
  equal(is("-"), true, "06.04");
  equal(is(":"), true, "06.05");
});

test("07 - permitted punctuation and Unicode", () => {
  for (const char of [
    "_",
    ".",
    "!",
    "@",
    "£",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "[",
    "]",
    "`",
    BACKSLASH,
    "é",
    "中",
    "😀",
    "\u00a0",
    "\ufdcf",
    "\ufdf0",
    "\ufffd",
    "\u{1fffd}",
  ]) {
    equal(is(char), true, "07.01");
    equal(is(`${char} rest`), true, "07.02");
  }
});

test("08 - suffixes do not change the first-character result", () => {
  equal(is("-rest"), true, "08.01");
  equal(is("--"), true, "08.02");
  equal(is(":rest"), true, "08.03");
  equal(is("a rest"), true, "08.04");
  equal(is(" -rest"), false, "08.05");
});

test("09 - forbidden boundaries and lone surrogates", () => {
  for (const char of [
    "\0",
    "\u001f",
    "\t",
    "\n",
    "\r",
    "\f",
    " ",
    '"',
    "'",
    "/",
    "<",
    "=",
    ">",
    "\u007f",
    "\u009f",
    "\ud800",
    "\udfff",
    "\ufdd0",
    "\ufdef",
    "\ufffe",
    "\uffff",
    "\u{1fffe}",
    "\u{10ffff}",
  ]) {
    equal(is(char), false, "09.01");
    equal(is(`${char}rest`), false, "09.02");
  }
});

test.run();
