import tap from "tap";
import { convertOne, convertAll } from "../dist/string-apostrophes.esm";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";

// DOUBLE APOSTROPHES
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - converts quotation marks: +entities`,
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
    t.strictSame(
      gatheredRes,
      [
        [8, 9, "&ldquo;"],
        [17, 18, "&rdquo;"],
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - converts quotation marks: -entities`,
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
    t.strictSame(
      gatheredRes,
      [
        [8, 9, `${leftDoubleQuote}`],
        [17, 18, `${rightDoubleQuote}`],
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - converts quotation marks: killswitch`,
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
    t.strictSame(gatheredRes, [], "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - exclamation mark`,
  (t) => {
    t.strictSame(
      convertAll('"What!" he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What!${rightDoubleQuote} he said`,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - full stop`,
  (t) => {
    t.strictSame(
      convertAll('"What." he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What.${rightDoubleQuote} he said`,
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - comma`,
  (t) => {
    t.strictSame(
      convertAll('"What," he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What,${rightDoubleQuote} he said`,
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - semicolon`,
  (t) => {
    t.strictSame(
      convertAll('"What;" he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What;${rightDoubleQuote} he said`,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - question mark`,
  (t) => {
    t.strictSame(
      convertAll('"What?" he said', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}What?${rightDoubleQuote} he said`,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - exclamation mark`,
  (t) => {
    t.strictSame(
      convertAll(`'"What!"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What!${rightDoubleQuote}${rightSingleQuote} he said`,
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.strictSame(
      convertAll(`'"What."' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What.${rightDoubleQuote}${rightSingleQuote} he said`,
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.strictSame(
      convertAll(`'"What,"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What,${rightDoubleQuote}${rightSingleQuote} he said`,
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.strictSame(
      convertAll(`'"What;"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What;${rightDoubleQuote}${rightSingleQuote} he said`,
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
  (t) => {
    t.strictSame(
      convertAll(`'"What?"' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}${leftDoubleQuote}What?${rightDoubleQuote}${rightSingleQuote} he said`,
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - with entities`,
  (t) => {
    t.strictSame(
      convertOne(`"`, {
        from: 0,
        convertApostrophes: 1,
        convertEntities: 1,
      }),
      [],
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - one, off`,
  (t) => {
    t.strictSame(
      convertOne(`${leftDoubleQuote}developers${rightDoubleQuote}`, {
        from: 0,
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      [[0, 1, `"`]],
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - all, off`,
  (t) => {
    t.strictSame(
      convertAll(` ${leftDoubleQuote}developers${rightDoubleQuote} `, {
        convertApostrophes: 0,
        convertEntities: 1,
      }),
      {
        result: ` "developers" `,
        ranges: [
          [1, 2, `"`],
          [12, 13, `"`],
        ],
      },
      "16"
    );
    t.end();
  }
);
