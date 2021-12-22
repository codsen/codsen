import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { util } from "../../dist/emlint.esm.js";

const { splitByWhitespace } = util;

// 01. no config
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - no whitespace`, () => {
  let gatheredChunks = [];
  let gatheredWhitespace = [];
  splitByWhitespace(
    "abc",
    (valuesArr) => {
      gatheredChunks.push(valuesArr);
    },
    (whitespaceArr) => {
      gatheredWhitespace.push(whitespaceArr);
    }
  );
  match(gatheredChunks, [[0, 3]], "01.01");
  match(gatheredWhitespace, [], "01.02");
});

test(`02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`, () => {
  let gatheredChunks = [];
  let gatheredWhitespace = [];
  splitByWhitespace(
    "   ",
    (valuesArr) => {
      gatheredChunks.push(valuesArr);
    },
    (whitespaceArr) => {
      gatheredWhitespace.push(whitespaceArr);
    }
  );
  match(gatheredChunks, [], "02.01");
  match(gatheredWhitespace, [[0, 3]], "02.02");
});

test(`03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`, () => {
  let gatheredChunks = [];
  let gatheredWhitespace = [];
  splitByWhitespace(
    "   abc   def  ",
    (valuesArr) => {
      gatheredChunks.push(valuesArr);
    },
    (whitespaceArr) => {
      gatheredWhitespace.push(whitespaceArr);
    }
  );
  match(
    gatheredChunks,
    [
      [3, 6],
      [9, 12],
    ],
    "03.01"
  );
  match(
    gatheredWhitespace,
    [
      [0, 3],
      [6, 9],
      [12, 14],
    ],
    "03.02"
  );
});

test(`04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - only whitespace`, () => {
  let gatheredChunks = [];
  let gatheredWhitespace = [];
  splitByWhitespace(
    "abc \t  def",
    (valuesArr) => {
      gatheredChunks.push(valuesArr);
    },
    (whitespaceArr) => {
      gatheredWhitespace.push(whitespaceArr);
    }
  );
  match(
    gatheredChunks,
    [
      [0, 3],
      [7, 10],
    ],
    "04.01"
  );
  match(gatheredWhitespace, [[3, 7]], "04.02");
});

test(`05 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - extracts classes`, () => {
  let gatheredChunks = [];
  let gatheredWhitespace = [];
  splitByWhitespace(
    " kk  \t ll ",
    (valuesArr) => {
      gatheredChunks.push(valuesArr);
    },
    (whitespaceArr) => {
      gatheredWhitespace.push(whitespaceArr);
    }
  );
  match(
    gatheredChunks,
    [
      [1, 3],
      [7, 9],
    ],
    "05.01"
  );
  match(
    gatheredWhitespace,
    [
      [0, 1],
      [3, 7],
      [9, 10],
    ],
    "05.02"
  );
});

// 02. with custom range
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${`custom`}\u001b[${39}m`} - crops inside`, () => {
  let gatheredChunks = [];
  let gatheredWhitespace = [];
  splitByWhitespace(
    "  abc \t  def   ",
    (valuesArr) => {
      gatheredChunks.push(valuesArr);
    },
    (whitespaceArr) => {
      gatheredWhitespace.push(whitespaceArr);
    },
    {
      from: 3,
      to: 11,
    }
  );
  match(
    gatheredChunks,
    [
      [3, 5],
      [9, 11],
    ],
    "06.01"
  );
  match(gatheredWhitespace, [[5, 9]], "06.02");
});
