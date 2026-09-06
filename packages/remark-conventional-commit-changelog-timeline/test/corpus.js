import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal } from "uvu/assert";

import changelogTimeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

// Expected HTML was captured from the previous renderer, using actual releases.
const fixtures = JSON.parse(
  readFileSync(
    new URL("./fixtures/historical-releases.json", import.meta.url),
    "utf8",
  ),
);

function normalize(html) {
  // Entity spellings and indentation are incidental; code text is preserved.
  return html
    .split(/(<code(?:\s[^>]*)?>[\s\S]*?<\/code>)/g)
    .map((part, index) =>
      index % 2 ? part : part.replace(/>\s+</g, "><").replace(/\s+/g, " "),
    )
    .join("")
    .trim()
    .replace(
      /&(?:#x([0-9a-f]+)|#([0-9]+)|(amp|lt|gt|quot|apos));/gi,
      (_, hex, decimal, named) =>
        named
          ? { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[
              named.toLowerCase()
            ]
          : String.fromCodePoint(
              Number.parseInt(hex || decimal, hex ? 16 : 10),
            ),
    );
}

test("01 - separate code spans and commit links", () => {
  equal(
    normalize(changelogTimeline(fixtures[0].markdown)),
    normalize(fixtures[0].html),
    "01.01",
  );
});

test("02 - nested bullets and an angle-bracket URL", () => {
  equal(
    normalize(changelogTimeline(fixtures[1].markdown)),
    normalize(fixtures[1].html),
    "02.01",
  );
});

test("03 - a fenced example and continuation inside a list", () => {
  equal(
    normalize(changelogTimeline(fixtures[2].markdown)),
    normalize(fixtures[2].html),
    "03.01",
  );
});

test("04 - a nested ordered list and indented code", () => {
  equal(
    normalize(changelogTimeline(fixtures[3].markdown)),
    normalize(fixtures[3].html),
    "04.01",
  );
});

test("05 - an HTML fence containing a false release heading", () => {
  equal(
    normalize(changelogTimeline(fixtures[4].markdown)),
    normalize(fixtures[4].html),
    "05.01",
  );
});

test("06 - strong text containing emphasis", () => {
  equal(
    normalize(changelogTimeline(fixtures[5].markdown)),
    normalize(fixtures[5].html),
    "06.01",
  );
});

test("07 - a blockquote following release bullets", () => {
  equal(
    normalize(changelogTimeline(fixtures[6].markdown)),
    normalize(fixtures[6].html),
    "07.01",
  );
});

test("08 - a horizontal rule and multiple code blocks", () => {
  equal(
    normalize(changelogTimeline(fixtures[7].markdown)),
    normalize(fixtures[7].html),
    "08.01",
  );
});

test.run();
