import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  isWhitespaceChar,
  rawNbsp,
  rawHairspace,
  thinSpace,
} from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(isWhitespaceChar(""), false, "01.01");
});

test("02", () => {
  equal(isWhitespaceChar("\t"), true, "02.01");
});

test("03", () => {
  equal(isWhitespaceChar("\r"), true, "03.01");
});

test("04", () => {
  equal(isWhitespaceChar("\n"), true, "04.01");
});

test("05", () => {
  equal(isWhitespaceChar(" "), true, "05.01");
});

test("06 - raw non-breaking space", () => {
  equal(isWhitespaceChar(rawNbsp), true, "06.01");
});

test("07 - raw hairspace", () => {
  equal(isWhitespaceChar(rawHairspace), true, "07.01");
});

test("08 - thin space", () => {
  equal(isWhitespaceChar(thinSpace), true, "08.01");
});
