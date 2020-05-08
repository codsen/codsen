import tap from "tap";
import { convertOne, convertAll } from "../dist/string-apostrophes.esm";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";

// 01. single apostrophes
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 0,
      }),
      [[4, 5, rightSingleQuote]],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 0,
      }),
      [],
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - exclamation mark + space`,
  (t) => {
    t.same(
      convertAll(`'What!' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - full stop + space`,
  (t) => {
    t.same(
      convertAll(`'What.' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What.${rightSingleQuote} he said`,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - semicolon + space`,
  (t) => {
    t.same(
      convertAll(`'What;' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What;${rightSingleQuote} he said`,
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - question mark + space`,
  (t) => {
    t.same(
      convertAll(`'What?' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What?${rightSingleQuote} he said`,
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - exclamation mark`,
  (t) => {
    t.same(
      convertAll(`"'What!'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - full stop`,
  (t) => {
    t.same(
      convertAll(`"'What.'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - comma`,
  (t) => {
    t.same(
      convertAll(`"'What,'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - semicolon`,
  (t) => {
    t.same(
      convertAll(`"'What;'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - question mark`,
  (t) => {
    t.same(
      convertAll(`"'What;'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - comma + space`,
  (t) => {
    t.same(
      convertAll(`'What,' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What,${rightSingleQuote} he said`,
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - HTML-escaped apostrophe`,
  (t) => {
    t.same(
      convertOne(`test&apos;s`, {
        from: 4,
        to: 10,
        value: "'",
        convertEntities: 0,
      }),
      [[4, 10, "\u2019"]],
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`'`, {
        from: 0,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [],
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]],
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]],
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 0,
      }),
      [[4, 5, rightSingleQuote]],
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [[4, 5, `'`]],
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [[4, 5, `'`]],
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 0,
      }),
      [[4, 5, `'`]],
      "24"
    );
    t.end();
  }
);
