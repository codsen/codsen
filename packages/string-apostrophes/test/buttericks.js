import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { leftSingleQuote, rightSingleQuote } from "codsen-utils";

import { convertAll } from "../dist/string-apostrophes.esm.js";

// Buttericks
// https://practicaltypography.com/apostrophes.html
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - 'n' - on`, () => {
  equal(
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
    },
    `01.01`
  );
});

test(`02 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - 'n' - off`, () => {
  equal(
    convertAll(`In the '60s, rock 'n' roll`, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    `In the '60s, rock 'n' roll`,
    `02.01`
  );
});

test(`03 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - Hawai${leftSingleQuote}i - sets okina #1`, () => {
  equal(
    convertAll(`Hawai'i`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Hawai${leftSingleQuote}i`,
    `03.01`
  );
});

test(`04 - ${`\u001b[${34}m${`Buttericks Practical Typography`}\u001b[${39}m`} - O${leftSingleQuote}ahu - sets okina #2`, () => {
  equal(
    convertAll(`O'ahu`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `O${leftSingleQuote}ahu`,
    `04.01`
  );
});

test.run();
