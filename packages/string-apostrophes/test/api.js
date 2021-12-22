import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  convertOne as c11,
  convertAll as c12,
} from "../dist/string-apostrophes.esm.js";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";

// 1. ESM
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - ESM buid works for convertOne`, () => {
  throws(() => {
    c11(`aa`, {});
  }, "01");
});

test(`02 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - ESM build works for convertAll`, () => {
  equal(
    c12(`'What!' he said`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}What!${rightSingleQuote} he said`,
    "02"
  );
});

test.run();
