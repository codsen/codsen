// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

const key = ["crlf", "cr", "lf"];

// opts.limitConsecutiveEmptyLinesTo
// -----------------------------------------------------------------------------

test(`01 - opts.limitConsecutiveEmptyLinesTo - three lines, removeEmptyLines=off`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `01.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`02 - opts.limitConsecutiveEmptyLinesTo - three lines, removeEmptyLines=on`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `02.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`03 - opts.limitConsecutiveEmptyLinesTo - three lines,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(
        `a${presentEolType}${presentEolType}${presentEolType}${presentEolType}b`,
        {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 1,
        },
      ).result,
      `a${presentEolType}${presentEolType}b`,
      `03.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`04 - opts.limitConsecutiveEmptyLinesTo - four lines, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 1,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `04.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`05 - opts.limitConsecutiveEmptyLinesTo - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 2,
      }).result,
      `a${presentEolType}${presentEolType}${presentEolType}b`,
      `05.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`06 - opts.limitConsecutiveEmptyLinesTo - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 3,
      }).result,
      `a${presentEolType}${presentEolType}${presentEolType}b`,
      `06.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`07 - opts.limitConsecutiveEmptyLinesTo - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 99,
      }).result,
      `a${presentEolType}${presentEolType}${presentEolType}b`,
      `07.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`08 - opts.limitConsecutiveEmptyLinesTo - space on a blank line, LF, trimLines=off`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType} ${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 0,
        trimLines: false,
      }).result,
      `a${presentEolType}b`,
      `08.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`09 - opts.limitConsecutiveEmptyLinesTo - space on a blank line, LF, trimLines=on`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType} ${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 0,
        trimLines: true,
      }).result,
      `a${presentEolType}b`,
      `09.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test.run();
