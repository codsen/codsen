import { test } from "uvu";
import { equal } from "uvu/assert";
import { stripHtml } from "../dist/string-strip-html.esm.js";

test("001 - requires semicolons even on legacy prefixes", () => {
  const actual = stripHtml("&notit; &copy=1 &amp;amp;");
  equal(actual.result, "&notit; &copy=1 &", "001.01");
  equal(actual.ranges, [[16, 25, "&"]], "001.02");
});

test("002 - composes decoded tag ranges in original UTF-16 coordinates", () => {
  const source = "&amp;lt;b&amp;gt;Hi&amp;lt;/b&amp;gt; &copy";
  const { log, ...actual } = stripHtml(source);
  equal(
    actual,
    {
      result: "Hi &copy",
      ranges: [
        [0, 17],
        [19, 38, " "],
      ],
      allTagLocations: [
        [0, 17],
        [19, 37],
      ],
      filteredTagLocations: [
        [0, 17],
        [19, 37],
      ],
    },
    "002.01",
  );
  equal(typeof log.timeTakenInMilliseconds, "number", "002.02");
  equal(stripHtml(source, { skipHtmlDecoding: true }).result, source, "002.03");
});

test("003 - corrects surrogate and maximum noncharacter references", () => {
  const actual = stripHtml("x &#xD800; &#x10FFFF; y");
  equal(actual.result, "x � \u{10ffff} y", "003.01");
  equal(
    actual.ranges,
    [
      [2, 10, "�"],
      [11, 21, "\u{10ffff}"],
    ],
    "003.02",
  );
  equal(
    stripHtml("&#xD800;", { skipHtmlDecoding: true }).result,
    "&#xD800;",
    "003.03",
  );
});

test.run();
