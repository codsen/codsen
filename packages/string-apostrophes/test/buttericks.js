// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { leftSingleQuote, rightSingleQuote } from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

// Buttericks
// https://practicaltypography.com/apostrophes.html
// -----------------------------------------------------------------------------

test(`01 - Buttericks Practical Typography - 'n' - on`, () => {
  equal(
    convertAll("In the '60s, rock 'n' roll", {
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
    "01.01",
  );
});

test(`02 - Buttericks Practical Typography - 'n' - off`, () => {
  equal(
    convertAll("In the '60s, rock 'n' roll", {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    "In the '60s, rock 'n' roll",
    "02.01",
  );
});

test(`03 - Buttericks Practical Typography - Hawai${leftSingleQuote}i - sets okina #1`, () => {
  equal(
    convertAll("Hawai'i", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Hawai${leftSingleQuote}i`,
    "03.01",
  );
});

test(`04 - Buttericks Practical Typography - O${leftSingleQuote}ahu - sets okina #2`, () => {
  equal(
    convertAll("O'ahu", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `O${leftSingleQuote}ahu`,
    "04.01",
  );
});

test.run();
