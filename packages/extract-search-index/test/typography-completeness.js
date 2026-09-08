import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - ellipses do not leave trailing quotes in keywords", () => {
  equal(extract("…“alpha”"), "alpha", "01.01");
  equal(extract("…alpha’s"), "alpha", "01.02");
  equal(extract("…“hello” “hello”"), "hello", "01.03");
});

test("02 - apostrophe variants at the expanded tail match ASCII keywords", () => {
  [..."\u00B4\u02BB\u02BC\u02BD\u02C8\u02B9\u2018\u2019"].forEach(
    (char, index) => {
      equal(
        extract(`…alpha${char}s`),
        "alpha",
        `02.01 - case ${String(index + 1).padStart(2, "0")}`,
      );
    },
  );
});

test("03 - quote variants at the expanded tail match ASCII keywords", () => {
  [..."\u02BA\u201C\u201D"].forEach((char, index) => {
    equal(
      extract(`…alpha${char}`),
      "alpha",
      `03.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("04 - dash variants at the expanded tail match ASCII keywords", () => {
  [..."\u2012\u2013\u2014\u2212\uFE49"].forEach((char, index) => {
    equal(
      extract(`…alpha${char}`),
      "alpha",
      `04.01 - case ${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("05 - mixed typography and repeated ellipses preserve ordering and deduplication", () => {
  equal(extract("……“Alpha”…—…‘beta’… Alpha…\u00A0"), "alpha beta", "05.01");
  equal(
    extract("......\"Alpha\"...-...'beta'... Alpha... "),
    "alpha beta",
    "05.02",
  );
  equal(extract("………"), "", "05.03");
});

test("06 - literal and recursively encoded ellipses produce the same keywords", () => {
  equal(extract("&hellip;&ldquo;alpha&rdquo;"), "alpha", "06.01");
  equal(extract("&#x2026;&#8220;alpha&#8221;"), "alpha", "06.02");
  equal(
    extract("&amp;amp;hellip;&amp;amp;ldquo;alpha&amp;amp;rdquo;"),
    "alpha",
    "06.03",
  );
});

test("07 - unmapped words and ASCII controls retain their keyword treatment", () => {
  equal(extract("…café 中文❤"), "café 中文❤", "07.01");
  equal(extract('... "Alpha" -- beta\'s\nAlpha'), "alpha beta", "07.02");
  equal(extract("plain text"), "plain text", "07.03");
});

test("08 - visible typography completes after HTML attributes are discarded", () => {
  equal(
    extract('<p title="…&ldquo;private&rdquo;">…“alpha”</p>'),
    "alpha",
    "08.01",
  );
  equal(
    extract('<p title="private">…alpha’s</p><p>ALPHA</p>'),
    "alpha",
    "08.02",
  );
});

test.run();
