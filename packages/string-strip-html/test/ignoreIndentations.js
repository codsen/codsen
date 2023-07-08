import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.ignoreIndentations
// -----------------------------------------------------------------------------

test("01 - minimal, off", () => {
  equal(
    stripHtml("  x <a> y", {
      ignoreIndentations: false,
    }).result,
    "x y",
    "01.01",
  );
});

test("02 - minimal, on, tight", () => {
  equal(
    stripHtml("  x <a> y", {
      ignoreIndentations: true,
    }).result,
    "  x y",
    "02.01",
  );
});

test("03 - minimal, on, excessive whitespace", () => {
  equal(
    stripHtml("  x   <a>   y\n      n     <b>      m", {
      ignoreIndentations: true,
    }).result,
    "  x y\n      n m",
    "03.01",
  );
});

test("04 - minimal, ignores", () => {
  equal(
    stripHtml("  x   <a>   y\n      n     <b>      m", {
      ignoreIndentations: true,
      ignoreTags: ["b"],
    }).result,
    "  x y\n      n     <b>      m",
    "04.01",
  );
});

test("05 - three lines, off", () => {
  equal(
    stripHtml(
      `  a <i> b
    c <i> d
    e <i> f`,
      {
        ignoreIndentations: false,
      },
    ).result,
    `a b
c d
e f`,
    "05.01",
  );
});

test("06 - three lines, on", () => {
  equal(
    stripHtml(
      `  a <i> b
    c <i> d
    e <i> f`,
      {
        ignoreIndentations: true,
      },
    ).result,
    `  a b
    c d
    e f`,
    "06.01",
  );
});

test("07 - markdown, real-life, nothing to do, enabled", () => {
  let input = `
  1. top level 1
     - sub list 1
     - sub list 2
        1. sub sub list 1
        1. sub sub list 2
           some text content some text content some text content some text content some text content

           > blockquote

           more text
        1. sub sub list 3
      - sub list 3
  2. top level 2
     * bullet 1
     * bullet 2
  3. top level 3`;
  equal(
    stripHtml(input, {
      ignoreIndentations: true,
    }).result,
    input,
    "07.01",
  );
});

test("08 - markdown, real-life, nothing to do, disabled", () => {
  let input = `
  1. top level 1
     - sub list 1
     - sub list 2
        1. sub sub list 1
        1. sub sub list 2
           some text content some text content some text content some text content some text content

           > blockquote

           more text
        1. sub sub list 3
      - sub list 3
  2. top level 2
     * bullet 1
     * bullet 2
  3. top level 3
`;
  equal(
    stripHtml(input, {
      ignoreIndentations: false,
    }).result,
    `1. top level 1
- sub list 1
- sub list 2
1. sub sub list 1
1. sub sub list 2
some text content some text content some text content some text content some text content

> blockquote

more text
1. sub sub list 3
- sub list 3
2. top level 2
* bullet 1
* bullet 2
3. top level 3`,
    "08.01",
  );
});

test("09 - markdown, real-life, strips one tag, ignores indentations", () => {
  let input = `
  1. top level 1
     - sub list 1
     - sub list 2
        1. sub sub list 1
        1. sub sub list 2
           some text content some text content some text content some text content some text content

           > blockquote <b>x</b>

           more text
        1. sub sub list 3
      - sub list 3
  2. top level 2
     * bullet 1
     * bullet 2
  3. top level 3`;
  equal(
    stripHtml(input, {
      ignoreIndentations: true,
    }).result,
    `
  1. top level 1
     - sub list 1
     - sub list 2
        1. sub sub list 1
        1. sub sub list 2
           some text content some text content some text content some text content some text content

           > blockquote x

           more text
        1. sub sub list 3
      - sub list 3
  2. top level 2
     * bullet 1
     * bullet 2
  3. top level 3`,
    "09.01",
  );
});

test("10 - markdown, real-life, strips one tag, ignores indentations", () => {
  let input = `  1. top level 1
     - sub list 1
     - sub list 2
        1. sub sub list 1
        1. sub sub list 2
           some text content some text content some text content some text content some text content

           > blockquote <b>x</b>

           more text
        1. sub sub list 3
      - sub list 3
  2. top level 2
     * bullet 1
     * bullet 2
  3. top level 3`;
  equal(
    stripHtml(input, {
      ignoreIndentations: false,
    }).result,
    `1. top level 1
- sub list 1
- sub list 2
1. sub sub list 1
1. sub sub list 2
some text content some text content some text content some text content some text content

> blockquote x

more text
1. sub sub list 3
- sub list 3
2. top level 2
* bullet 1
* bullet 2
3. top level 3`,
    "10.01",
  );
});

test.run();
