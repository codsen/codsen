const t = require("tap");
const { convertOne, convertAll } = require("../dist/string-apostrophes.cjs");

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
const singlePrime = "\u2032";
const doublePrime = "\u2033";

// 0. API
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - both opts.from and opts.to missing`,
  (t) => {
    t.throws(() => {
      convertOne(`aa`, {});
    });
    t.end();
  }
);

// 01. single apostrophes
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]]
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]]
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 0,
      }),
      [[4, 5, rightSingleQuote]]
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      []
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      []
    );
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test's`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 0,
      }),
      []
    );
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - exclamation mark + space`,
  (t) => {
    t.same(
      convertAll(`'What!' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What!${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.08 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - full stop + space`,
  (t) => {
    t.same(
      convertAll(`'What.' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What.${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.09 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - semicolon + space`,
  (t) => {
    t.same(
      convertAll(`'What;' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What;${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.10 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - question mark + space`,
  (t) => {
    t.same(
      convertAll(`'What?' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What?${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.11 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - exclamation mark`,
  (t) => {
    t.same(
      convertAll(`"'What!'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.12 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - full stop`,
  (t) => {
    t.same(
      convertAll(`"'What.'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.13 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - comma`,
  (t) => {
    t.same(
      convertAll(`"'What,'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.14 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - semicolon`,
  (t) => {
    t.same(
      convertAll(`"'What;'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.15 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - question mark`,
  (t) => {
    t.same(
      convertAll(`"'What;'" he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.16 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - comma + space`,
  (t) => {
    t.same(
      convertAll(`'What,' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What,${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `01.17 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - HTML-escaped apostrophe`,
  (t) => {
    t.same(
      convertOne(`test&apos;s`, {
        from: 4,
        to: 10,
        value: "'",
        convertEntities: 0,
      }),
      [[4, 10, "\u2019"]]
    );
    t.end();
  }
);

t.test(
  `01.18 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`'`, {
        from: 0,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      []
    );
    t.end();
  }
);

t.test(
  `01.19 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]]
    );
    t.end();
  }
);

t.test(
  `01.20 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [[4, 5, "&rsquo;"]]
    );
    t.end();
  }
);

t.test(
  `01.21 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=on`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 1,
        convertEntities: 0,
      }),
      [[4, 5, rightSingleQuote]]
    );
    t.end();
  }
);

t.test(
  `01.22 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [[4, 5, `'`]]
    );
    t.end();
  }
);

t.test(
  `01.23 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [[4, 5, `'`]]
    );
    t.end();
  }
);

t.test(
  `01.24 - ${`\u001b[${33}m${`single apostrophes`}\u001b[${39}m`} - left instead of right single quote - convertApostrophes=off`,
  (t) => {
    t.same(
      convertOne(`test${leftSingleQuote}s`, {
        from: 4,
        to: 5,
        convertApostrophes: 0,
        convertEntities: 0,
      }),
      [[4, 5, `'`]]
    );
    t.end();
  }
);

// 02. DOUBLE APOSTROPHES
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - converts quotation marks: +entities`,
  (t) => {
    const str = 'this is "citation"';
    const gatheredRes = []
      .concat(
        convertOne(str, {
          from: 8,
        })
      )
      .concat(
        convertOne(str, {
          from: 17,
        })
      );
    t.same(gatheredRes, [
      [8, 9, "&ldquo;"],
      [17, 18, "&rdquo;"],
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - converts quotation marks: -entities`,
  (t) => {
    const str = 'this is "citation"';
    const gatheredRes = []
      .concat(
        convertOne(str, {
          from: 8,
          convertEntities: 0,
        })
      )
      .concat(
        convertOne(str, {
          from: 17,
          convertEntities: 0,
        })
      );
    t.same(gatheredRes, [
      [8, 9, `${leftDoubleQuote}`],
      [17, 18, `${rightDoubleQuote}`],
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - converts quotation marks: killswitch`,
  (t) => {
    const str = 'this is "citation"';
    const gatheredRes = []
      .concat(
        convertOne(str, {
          from: 8,
          convertApostrophes: 0,
        })
      )
      .concat(
        convertOne(str, {
          from: 17,
          convertApostrophes: 0,
        })
      );
    t.same(gatheredRes, []);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - exclamation mark`,
  (t) => {
    t.same(
      convertAll('"What!" he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What!${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - full stop`,
  (t) => {
    t.same(
      convertAll('"What." he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What.${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - comma`,
  (t) => {
    t.same(
      convertAll('"What," he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What,${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - semicolon`,
  (t) => {
    t.same(
      convertAll('"What;" he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What;${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - question mark`,
  (t) => {
    t.same(
      convertAll('"What?" he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What?${rightDoubleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.09 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - exclamation mark`,
  (t) => {
    t.same(
      convertAll(`'"What!"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What!${rightDoubleQuote}${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.same(
      convertAll(`'"What."' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What.${rightDoubleQuote}${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.same(
      convertAll(`'"What,"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What,${rightDoubleQuote}${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.12 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.same(
      convertAll(`'"What;"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What;${rightDoubleQuote}${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.13 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.same(
      convertAll(`'"What?"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What?${rightDoubleQuote}${rightSingleQuote} he said`
    );
    t.end();
  }
);

t.test(
  `02.14 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.same(
      convertOne(`"`, {
        from: 0,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      []
    );
    t.end();
  }
);

// 03. Borrowed tests
// -----------------------------------------------------------------------------

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.json/
// License CC0-1.0

t.test(
  `03.01 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - one word wrapped with double quotes`,
  (t) => {
    t.same(
      convertAll('"Hello!"', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}Hello!${rightDoubleQuote}`
    );
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote surrounded by letters`,
  (t) => {
    t.same(
      convertAll(`ain't`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `ain${rightSingleQuote}t`
    );
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote surrounded by letters 2`,
  (t) => {
    t.same(
      convertAll(`ma'am`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `ma${rightSingleQuote}am`
    );
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - leading single quote`,
  (t) => {
    t.same(
      convertAll(`'Twas the night`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twas the night`
    );
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - mixed quotes within a single sentence`,
  (t) => {
    t.same(
      convertAll(`"Hello," said the spider. "'Shelob' is my name."`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote} is my name.${rightDoubleQuote}`
    );
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single letters wrapped with single quotes`,
  (t) => {
    t.same(
      convertAll(`'A', 'B', and 'C' are letters.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}A${rightSingleQuote}, ${leftSingleQuote}B${rightSingleQuote}, and ${leftSingleQuote}C${rightSingleQuote} are letters.`
    );
    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - words wrapped with single quotes`,
  (t) => {
    t.same(
      convertAll(
        `'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `${leftSingleQuote}Oak,${rightSingleQuote} ${leftSingleQuote}elm,${rightSingleQuote} and ${leftSingleQuote}beech${rightSingleQuote} are names of trees. So is ${leftSingleQuote}pine.${rightSingleQuote}`
    );
    t.end();
  }
);

t.test(
  `03.08 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within single quotes`,
  (t) => {
    t.same(
      convertAll(`'He said, "I want to go."' Were you alive in the 70's?`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}He said, ${leftDoubleQuote}I want to go.${rightDoubleQuote}${rightSingleQuote} Were you alive in the 70${rightSingleQuote}s?`
    );
    t.end();
  }
);

t.test(
  `03.09 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within single quotes`,
  (t) => {
    t.same(
      convertAll(`"That's a 'magic' sock."`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}That${rightSingleQuote}s a ${leftSingleQuote}magic${rightSingleQuote} sock.${rightDoubleQuote}`
    );
    t.end();
  }
);

t.test(
  `03.10 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within double quotes`,
  (t) => {
    t.same(
      convertAll(
        `Welcome to Website Name! Company Name, Inc. ("Company Name" or "Company") recommends that you read the following terms and conditions carefully.`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `Welcome to Website Name! Company Name, Inc. (${leftDoubleQuote}Company Name${rightDoubleQuote} or ${leftDoubleQuote}Company${rightDoubleQuote}) recommends that you read the following terms and conditions carefully.`
    );
    t.end();
  }
);

t.test(
  `03.11 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes within double quotes`,
  (t) => {
    t.same(
      convertAll(
        `Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `Welcome to Website Name! Company Name, Inc. (${leftSingleQuote}Company Name${rightSingleQuote} or ${leftSingleQuote}Company${rightSingleQuote}) recommends that you read the following terms and conditions carefully.`
    );
    t.end();
  }
);

t.test(
  `03.12 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`,
  (t) => {
    t.same(
      convertAll(`'85 was a good year. (The entire '80s were.)`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}85 was a good year. (The entire ${rightSingleQuote}80s were.)`
    );
    t.end();
  }
);

t.test(
  `03.13 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the end of a word`,
  (t) => {
    t.same(
      convertAll(`Workin' hard`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Workin${rightSingleQuote} hard`
    );
    t.end();
  }
);

t.test(
  `03.14 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word`,
  (t) => {
    t.same(
      convertAll(`'Twas the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twas the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.15 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`,
  (t) => {
    t.same(
      convertAll(`'Twasn't the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twasn${rightSingleQuote}t the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.16 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`,
  (t) => {
    t.same(
      convertAll(`'Tis the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Tis the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.17 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`,
  (t) => {
    t.same(
      convertAll(`'Tisn't the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Tisn${rightSingleQuote}t the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.18 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Twill be the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twill be the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.19 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Twould be the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twould be the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.20 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Twere the night before Christmas, I would be happy.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twere the night before Christmas, I would be happy.`
    );
    t.end();
  }
);

t.test(
  `03.21 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Tweren't the night before Christmas, I would be happy.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Tweren${rightSingleQuote}t the night before Christmas, I would be happy.`
    );
    t.end();
  }
);

t.test(
  `03.22 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes wrapping word, ending in the middle`,
  (t) => {
    t.same(
      convertAll(`'Twon't be the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twon${rightSingleQuote}t be the night before Christmas.`
    );
    t.end();
  }
);

t.test(
  `03.23 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes wrapping a word, ending in between words`,
  (t) => {
    t.same(
      convertAll(`'70s are my favorite numbers,' she said.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`
    );
    t.end();
  }
);

t.test(
  `03.24 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote on years`,
  (t) => {
    t.same(
      convertAll(`'70s fashion was weird.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}70s fashion was weird.`
    );
    t.end();
  }
);

t.test(
  `03.25 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - inches`,
  (t) => {
    t.same(
      convertAll('12" record, 5\'10" height', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`
    );
    t.end();
  }
);

t.test(
  `03.26 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - left type quote used`,
  (t) => {
    t.same(
      convertAll(`12" record, 5${leftSingleQuote}10${leftDoubleQuote} height`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`
    );
    t.end();
  }
);

t.test(
  `03.27 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - right type quote used`,
  (t) => {
    t.same(
      convertAll(
        `12" record, 5${rightSingleQuote}10${rightDoubleQuote} height`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`
    );
    t.end();
  }
);

t.test(
  `03.28 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - word wrapped with double quotes in the end of a string`,
  (t) => {
    t.same(
      convertAll('Model "T2000"', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`
    );
    t.end();
  }
);

t.test(
  `03.29 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`,
  (t) => {
    t.same(
      convertAll(`iPad 3's battery life is not great.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `iPad 3${rightSingleQuote}s battery life is not great.`
    );
    t.end();
  }
);

t.test(
  `03.30 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`,
  (t) => {
    t.same(
      convertAll(`Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`
    );
    t.end();
  }
);

t.test(
  `03.31 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - left type used`,
  (t) => {
    t.same(
      convertAll(
        `Book ${leftSingleQuote}em, Danno. Rock ${leftSingleQuote}n${leftSingleQuote} roll. ${leftSingleQuote}Cause ${leftSingleQuote}twas the season.`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`
    );
    t.end();
  }
);

t.test(
  `03.32 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - right type used`,
  (t) => {
    t.same(
      convertAll(
        `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`
    );
    t.end();
  }
);

t.test(
  `03.33 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - left type used`,
  (t) => {
    t.same(
      convertAll(
        `Book ${leftSingleQuote}em, Danno. Rock ${leftSingleQuote}n${leftSingleQuote} roll. ${leftSingleQuote}Cause ${leftSingleQuote}twas the season.`,
        {
          convertApostrophes: 1,
          convertEntities: 1,
        }
      ).result,
      `Book &rsquo;em, Danno. Rock &rsquo;n&rsquo; roll. &rsquo;Cause &rsquo;twas the season.`
    );
    t.end();
  }
);

t.test(
  `03.34 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - right type used`,
  (t) => {
    t.same(
      convertAll(
        `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
        {
          convertApostrophes: 1,
          convertEntities: 1,
        }
      ).result,
      `Book &rsquo;em, Danno. Rock &rsquo;n&rsquo; roll. &rsquo;Cause &rsquo;twas the season.`
    );
    t.end();
  }
);

// 04. Buttericks
// https://practicaltypography.com/apostrophes.html
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - 'n' - on`,
  (t) => {
    t.same(
      convertAll(`In the '60s, rock 'n' roll`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }),
      {
        result: `In the ${rightSingleQuote}60s, rock ${rightSingleQuote}n${rightSingleQuote} roll`,
        ranges: [
          [7, 8, `${rightSingleQuote}`],
          [18, 21, `${rightSingleQuote}n${rightSingleQuote}`],
        ],
      }
    );
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - 'n' - off`,
  (t) => {
    t.same(
      convertAll(`In the '60s, rock 'n' roll`, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      `In the '60s, rock 'n' roll`
    );
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - Hawai${leftSingleQuote}i - sets okina #1`,
  (t) => {
    t.same(
      convertAll(`Hawai'i`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Hawai${leftSingleQuote}i`
    );
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - O${leftSingleQuote}ahu - sets okina #2`,
  (t) => {
    t.same(
      convertAll(`O'ahu`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `O${leftSingleQuote}ahu`
    );
    t.end();
  }
);
