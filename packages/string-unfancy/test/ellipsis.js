import { test } from "uvu";
import { equal } from "uvu/assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

test("01 - quotes after an expanding ellipsis are processed", () => {
  equal(unfancy("…“alpha”"), '..."alpha"', "01.01");
  equal(unfancy("…alpha’s"), "...alpha's", "01.02");
});

test("02 - every apostrophe mapping is processed at the expanded tail", () => {
  const apostrophes =
    "\u00B4\u02BB\u02BC\u02BD\u02C8\u02B9\u0312\u0313\u0314\u0315\u2018\u2019";
  [...apostrophes].forEach((char, index) => {
    equal(
      unfancy(`…alpha${char}`),
      "...alpha'",
      `02.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("03 - every double-quote mapping is processed at the expanded tail", () => {
  [..."\u02BA\u201C\u201D"].forEach((char, index) => {
    equal(
      unfancy(`…alpha${char}`),
      '...alpha"',
      `03.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("04 - every dash mapping is processed at the expanded tail", () => {
  [..."\u2012\u2013\u2014\u2212\uFE49"].forEach((char, index) => {
    equal(
      unfancy(`…alpha${char}`),
      "...alpha-",
      `04.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("05 - nonbreaking spaces after ellipses are normalized", () => {
  equal(unfancy("…alpha\u00A0"), "...alpha ", "05.01");
  equal(unfancy("…\u00A0…\u00A0"), "... ... ", "05.02");
});

test("06 - repeated and final ellipses all expand", () => {
  equal(unfancy("……“alpha”…"), '......"alpha"...', "06.01");
  equal(unfancy("alpha…"), "alpha...", "06.02");
  equal(unfancy("………"), ".........", "06.03");
});

test("07 - ellipses interleaved with typography preserve every substitution", () => {
  equal(
    unfancy("“alpha…”—…‘beta’…\u00A0−…"),
    "\"alpha...\"-...'beta'... -...",
    "07.01",
  );
});

test("08 - decoded ellipses cannot hide trailing decoded quotes", () => {
  equal(unfancy("&hellip;&ldquo;alpha&rdquo;"), '..."alpha"', "08.01");
  equal(unfancy("&#x2026;&#8220;alpha&#8221;"), '..."alpha"', "08.02");
  equal(
    unfancy("&amp;amp;hellip;&amp;amp;ldquo;alpha&amp;amp;rdquo;"),
    '..."alpha"',
    "08.03",
  );
});

test("09 - unmapped Unicode after an ellipsis remains unchanged", () => {
  equal(unfancy("…café 中文❤\u200D"), "...café 中文❤\u200D", "09.01");
  equal(unfancy("…cafe\u0301"), "...cafe\u0301", "09.02");
  equal(unfancy("…😊"), "...😊", "09.03");
});

test("10 - existing ASCII punctuation and whitespace stay unchanged", () => {
  equal(
    unfancy('... "alpha" -- beta\'s\n'),
    '... "alpha" -- beta\'s\n',
    "10.01",
  );
  equal(unfancy("plain text"), "plain text", "10.02");
});

test.run();
