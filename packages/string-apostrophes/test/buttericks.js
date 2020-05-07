import tap from "tap";
import { convertAll } from "../dist/string-apostrophes.esm";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
// const leftDoubleQuote = "\u201C";
// const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";

// Buttericks
// https://practicaltypography.com/apostrophes.html
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - 'n' - on`,
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

tap.test(
  `02 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - 'n' - off`,
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

tap.test(
  `03 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - Hawai${leftSingleQuote}i - sets okina #1`,
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

tap.test(
  `04 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - O${leftSingleQuote}ahu - sets okina #2`,
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
