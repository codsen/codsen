// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  leftDoubleQuote,
  leftSingleQuote,
  rightDoubleQuote,
  rightSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { convertAll, convertOne } from "../dist/string-apostrophes.esm.js";

// -----------------------------------------------------------------------------

test(`01 - single apostrophes - with entities`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "01.01",
  );
});

test(`02 - single apostrophes - with entities`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "02.01",
  );
});

test(`03 - single apostrophes - with entities`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 0,
    }),
    [[4, 5, rightSingleQuote]],
    "03.01",
  );
});

test(`04 - single apostrophes - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [],
    "04.01",
  );
});

test(`05 - single apostrophes - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [],
    "05.01",
  );
});

test(`06 - single apostrophes - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne("test's", {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 0,
    }),
    [],
    "06.01",
  );
});

test(`07 - single apostrophes - exclamation mark + space`, () => {
  equal(
    convertAll("'What!' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What!${rightSingleQuote} he said`,
    "07.01",
  );
});

test(`08 - single apostrophes - full stop + space`, () => {
  equal(
    convertAll("'What.' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What.${rightSingleQuote} he said`,
    "08.01",
  );
});

test(`09 - single apostrophes - semicolon + space`, () => {
  equal(
    convertAll("'What;' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What;${rightSingleQuote} he said`,
    "09.01",
  );
});

test(`10 - single apostrophes - question mark + space`, () => {
  equal(
    convertAll("'What?' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What?${rightSingleQuote} he said`,
    "10.01",
  );
});

test(`11 - single apostrophes - exclamation mark`, () => {
  equal(
    convertAll("\"'What!'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
    "11.01",
  );
});

test(`12 - single apostrophes - full stop`, () => {
  equal(
    convertAll("\"'What.'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
    "12.01",
  );
});

test(`13 - single apostrophes - comma`, () => {
  equal(
    convertAll("\"'What,'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
    "13.01",
  );
});

test(`14 - single apostrophes - semicolon`, () => {
  equal(
    convertAll("\"'What;'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
    "14.01",
  );
});

test(`15 - single apostrophes - question mark`, () => {
  equal(
    convertAll("\"'What;'\" he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
    "15.01",
  );
});

test(`16 - single apostrophes - comma + space`, () => {
  equal(
    convertAll("'What,' he said", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What,${rightSingleQuote} he said`,
    "16.01",
  );
});

test(`17 - single apostrophes - HTML-escaped apostrophe`, () => {
  equal(
    convertOne("test&apos;s", {
      from: 4,
      to: 10,
      value: "'",
      convertEntities: 0,
    }),
    [[4, 10, "\u2019"]],
    "17.01",
  );
});

test(`18 - single apostrophes - with entities`, () => {
  equal(
    convertOne("'", {
      from: 0,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [],
    "18.01",
  );
});

test(`19 - single apostrophes - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "19.01",
  );
});

test(`20 - single apostrophes - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "20.01",
  );
});

test(`21 - single apostrophes - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 0,
    }),
    [[4, 5, rightSingleQuote]],
    "21.01",
  );
});

test(`22 - single apostrophes - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [[4, 5, "'"]],
    "22.01",
  );
});

test(`23 - single apostrophes - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [[4, 5, "'"]],
    "23.01",
  );
});

test(`24 - single apostrophes - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 0,
    }),
    [[4, 5, "'"]],
    "24.01",
  );
});

test.run();
