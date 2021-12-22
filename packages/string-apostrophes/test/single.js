import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { convertOne, convertAll } from "../dist/string-apostrophes.esm.js";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";

// 01. single apostrophes
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne(`test's`, {
      from: 4,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "01"
  );
});

test(`02 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne(`test's`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "02"
  );
});

test(`03 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne(`test's`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 0,
    }),
    [[4, 5, rightSingleQuote]],
    "03"
  );
});

test(`04 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne(`test's`, {
      from: 4,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [],
    "04"
  );
});

test(`05 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne(`test's`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [],
    "05"
  );
});

test(`06 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`, () => {
  equal(
    convertOne(`test's`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 0,
    }),
    [],
    "06"
  );
});

test(`07 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - exclamation mark + space`, () => {
  equal(
    convertAll(`'What!' he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What!${rightSingleQuote} he said`,
    "07"
  );
});

test(`08 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - full stop + space`, () => {
  equal(
    convertAll(`'What.' he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What.${rightSingleQuote} he said`,
    "08"
  );
});

test(`09 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - semicolon + space`, () => {
  equal(
    convertAll(`'What;' he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What;${rightSingleQuote} he said`,
    "09"
  );
});

test(`10 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - question mark + space`, () => {
  equal(
    convertAll(`'What?' he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What?${rightSingleQuote} he said`,
    "10"
  );
});

test(`11 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - exclamation mark`, () => {
  equal(
    convertAll(`"'What!'" he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
    "11"
  );
});

test(`12 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - full stop`, () => {
  equal(
    convertAll(`"'What.'" he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
    "12"
  );
});

test(`13 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - comma`, () => {
  equal(
    convertAll(`"'What,'" he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
    "13"
  );
});

test(`14 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - semicolon`, () => {
  equal(
    convertAll(`"'What;'" he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
    "14"
  );
});

test(`15 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - question mark`, () => {
  equal(
    convertAll(`"'What;'" he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
    "15"
  );
});

test(`16 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - comma + space`, () => {
  equal(
    convertAll(`'What,' he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What,${rightSingleQuote} he said`,
    "16"
  );
});

test(`17 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - HTML-escaped apostrophe`, () => {
  equal(
    convertOne(`test&apos;s`, {
      from: 4,
      to: 10,
      value: "'",
      convertEntities: 0,
    }),
    [[4, 10, "\u2019"]],
    "17"
  );
});

test(`18 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`, () => {
  equal(
    convertOne(`'`, {
      from: 0,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [],
    "18"
  );
});

test(`19 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "19"
  );
});

test(`20 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 1,
    }),
    [[4, 5, "&rsquo;"]],
    "20"
  );
});

test(`21 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 1,
      convertEntities: 0,
    }),
    [[4, 5, rightSingleQuote]],
    "21"
  );
});

test(`22 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [[4, 5, `'`]],
    "22"
  );
});

test(`23 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 1,
    }),
    [[4, 5, `'`]],
    "23"
  );
});

test(`24 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`, () => {
  equal(
    convertOne(`test${leftSingleQuote}s`, {
      from: 4,
      to: 5,
      convertApostrophes: 0,
      convertEntities: 0,
    }),
    [[4, 5, `'`]],
    "24"
  );
});

test.run();
