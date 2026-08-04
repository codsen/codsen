// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.ignoreIndentations
// -----------------------------------------------------------------------------

test("001 - minimal, off", () => {
  equal(
    stripHtml("  x <a> y", {
      ignoreIndentations: false,
    }).result,
    "x y",
    "001.01",
  );
});

test("002 - minimal, on, tight", () => {
  equal(
    stripHtml("  x <a> y", {
      ignoreIndentations: true,
    }).result,
    "  x y",
    "002.01",
  );
});

test("003 - minimal, on, excessive whitespace", () => {
  equal(
    stripHtml("  x   <a>   y\n      n     <b>      m", {
      ignoreIndentations: true,
    }).result,
    "  x y\n      n m",
    "003.01",
  );
});

test("004 - minimal, ignores", () => {
  equal(
    stripHtml("  x   <a>   y\n      n     <b>      m", {
      ignoreIndentations: true,
      ignoreTags: ["b"],
    }).result,
    "  x y\n      n     <b>      m",
    "004.01",
  );
});

test("005 - three lines, off", () => {
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
    "005.01",
  );
});

test("006 - three lines, on", () => {
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
    "006.01",
  );
});

test("007 - markdown, real-life, nothing to do, enabled", () => {
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
    "007.01",
  );
});

test("008 - markdown, real-life, nothing to do, disabled", () => {
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
    "008.01",
  );
});

test("009 - markdown, real-life, strips one tag, ignores indentations", () => {
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
    "009.01",
  );
});

test("010 - markdown, real-life, strips one tag, ignores indentations", () => {
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
    "010.01",
  );
});

test.run();
