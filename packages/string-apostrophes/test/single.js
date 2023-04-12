import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import {
  leftSingleQuote,
  rightSingleQuote,
  leftDoubleQuote,
  rightDoubleQuote,
} from "codsen-utils";

import { convertOne, convertAll } from "../dist/string-apostrophes.esm.js";

// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "01.01"
  );
});

test(`02 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "02.01"
  );
});

test(`03 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 0,
    }),
    [[4, 5, rightSingleQuote]],
    "03.01"
  );
});

test(`04 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [],
    "04.01"
  );
});

test(`05 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [],
    "05.01"
  );
});

test(`06 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 0,
    }),
    [],
    "06.01"
  );
});

test(`07 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - exclamation mark + space`, () => {
  equal(
    convertAll("'What!' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What!${rightSingleQuote} he said`,
    "07.01"
  );
});

test(`08 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - full stop + space`, () => {
  equal(
    convertAll("'What.' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What.${rightSingleQuote} he said`,
    "08.01"
  );
});

test(`09 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - semicolon + space`, () => {
  equal(
    convertAll("'What;' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What;${rightSingleQuote} he said`,
    "09.01"
  );
});

test(`10 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - question mark + space`, () => {
  equal(
    convertAll("'What?' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What?${rightSingleQuote} he said`,
    "10.01"
  );
});

test(`11 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - exclamation mark`, () => {
  equal(
    convertAll("\"'What!'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
    "11.01"
  );
});

test(`12 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - full stop`, () => {
  equal(
    convertAll("\"'What.'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
    "12.01"
  );
});

test(`13 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - comma`, () => {
  equal(
    convertAll("\"'What,'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
    "13.01"
  );
});

test(`14 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - semicolon`, () => {
  equal(
    convertAll("\"'What;'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
    "14.01"
  );
});

test(`15 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - question mark`, () => {
  equal(
    convertAll("\"'What;'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
    "15.01"
  );
});

test(`16 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - comma + space`, () => {
  equal(
    convertAll("'What,' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What,${rightSingleQuote} he said`,
    "16.01"
  );
});

test(`17 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - HTML-escaped apostrophe`, () => {
  equal(
    convertOne("test&apos;s", {
      from: 4,
      to: 10,
      value: "'",
      convertEntities: 0,
    }),
    [[4, 10, "\u2019"]],
    "17.01"
  );
});

test(`18 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne("'", {
      from: 0,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [],
    "18.01"
  );
});

test(`19 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "19.01"
  );
});

test(`20 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "20.01"
  );
});

test(`21 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 0,
    }),
    [[4, 5, rightSingleQuote]],
    "21.01"
  );
});

test(`22 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [[4, 5, "'"]],
    "22.01"
  );
});

test(`23 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [[4, 5, "'"]],
    "23.01"
  );
});

test(`24 - ${`\u001b[${33}m${"single apostrophes"}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 0,
    }),
    [[4, 5, "'"]],
    "24.01"
  );
});

test.run();
