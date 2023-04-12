import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

const key = ["crlf", "cr", "lf"];

// opts.limitConsecutiveEmptyLinesTo
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - three lines, removeEmptyLines=off`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`02 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - three lines, removeEmptyLines=on`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`03 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - three lines,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(
        `a${presentEolType}${presentEolType}${presentEolType}${presentEolType}b`,
        {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 1,
        }
      ).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`04 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - four lines, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 1,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`05 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 2,
      }).result,
      `a${presentEolType}${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`06 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 3,
      }).result,
      `a${presentEolType}${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`07 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 99,
      }).result,
      `a${presentEolType}${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`08 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - space on a blank line, LF, trimLines=off`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType} ${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 0,
        trimLines: false,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`09 - ${`\u001b[${34}m${"opts.limitConsecutiveEmptyLinesTo"}\u001b[${39}m`} - space on a blank line, LF, trimLines=on`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType} ${presentEolType}b`, {
        removeEmptyLines: true,
        limitConsecutiveEmptyLinesTo: 0,
        trimLines: true,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test.run();
