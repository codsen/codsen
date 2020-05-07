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
    t.same(gatheredRes, [
      [8, 9, "&ldquo;"],
      [17, 18, "&rdquo;"],
    ]);
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
    t.same(gatheredRes, [
      [8, 9, `${leftDoubleQuote}`],
      [17, 18, `${rightDoubleQuote}`],
    ]);
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
    t.same(gatheredRes, []);
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - exclamation mark`,
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

tap.test(
  `05 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - full stop`,
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

tap.test(
  `06 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - comma`,
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

tap.test(
  `07 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - semicolon`,
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

tap.test(
  `08 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - question mark`,
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

tap.test(
  `09 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - exclamation mark`,
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

tap.test(
  `10 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
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

tap.test(
  `11 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
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

tap.test(
  `12 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
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

tap.test(
  `13 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - mix of quotes, full stop`,
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

tap.test(
  `14 - ${`\u001b[${36}m${`double apostrophes`}\u001b[${39}m`} - with entities`,
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
