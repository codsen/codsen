import tap from "tap";
import {
  convertOne as c11,
  convertAll as c12,
} from "../dist/string-apostrophes.esm.js";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";

// 1. ESM
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - ESM buid works for convertOne`,
  (t) => {
    t.throws(() => {
      c11(`aa`, {});
    }, "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - ESM build works for convertAll`,
  (t) => {
    t.strictSame(
      c12(`'What!' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      "02"
    );
    t.end();
  }
);
