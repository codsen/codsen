import { test } from "uvu";
import { equal } from "uvu/assert";

import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";
import { combinations } from "./util/util.js";

function quoteDecisions(name, separator = " ") {
  return combinations(`<div foo="text"${separator}${name}="next">`).map(
    (str) => {
      const quotes = [...str.matchAll(/['"]/g)].map((match) => match.index);
      return [
        isAttrClosing(str, quotes[0], quotes[1]),
        isAttrClosing(str, quotes[0], quotes[2]),
        isAttrClosing(str, quotes[0], quotes[3]),
        isAttrClosing(str, quotes[2], quotes[3]),
      ];
    },
  );
}

test("01 - punctuation in following attribute names preserves quote boundaries", () => {
  for (const name of [
    "foo_",
    "foo.",
    "@click",
    "!",
    "[name]",
    "foo`",
    "foo\\",
  ]) {
    equal(
      quoteDecisions(name),
      Array.from({ length: 16 }, () => [true, false, false, true]),
      "01.01",
    );
  }
});

test("02 - Unicode names keep UTF-16 quote indices", () => {
  for (const name of [
    "fooé",
    "foo中",
    "foo😀",
    "😀",
    "foo\u00a0",
    "\u00a0",
    "foo\u{1fffd}",
  ]) {
    equal(
      quoteDecisions(name),
      Array.from({ length: 16 }, () => [true, false, false, true]),
      "02.01",
    );
  }
});

test("03 - recover missing whitespace before a following attribute", () => {
  for (const name of [
    "foo_",
    "foo.",
    "@click",
    "!",
    "é",
    "中",
    "😀",
    "\u00a0",
  ]) {
    equal(
      quoteDecisions(name, ""),
      Array.from({ length: 16 }, () => [true, false, false, true]),
      "03.01",
    );
  }
});

test("04 - punctuation in broken values does not replace known name evidence", () => {
  const str = `<img class="so-called "alt !' border 10'/>`;
  equal(
    [22, 28, 39].map((index) => isAttrClosing(str, 11, index)),
    [true, false, false],
    "04.01",
  );
});

test("05 - invalid surrogate spellings are not evidence of a new attribute", () => {
  for (const suffix of [
    "\ud800",
    "\udfff",
    "\udc00\ud800",
    "\u{1fffe}",
    "\u{10ffff}",
  ]) {
    const str = `<div foo="text" foo${suffix}="next">`;
    equal(isAttrClosing(str, 9, str.lastIndexOf('"')), true, "05.01");
  }
});

test.run();
