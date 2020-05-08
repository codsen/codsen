import tap from "tap";
import {
  convertOne as c11,
  convertAll as c12,
} from "../dist/string-apostrophes.esm";
import {
  convertOne as c21,
  convertAll as c22,
} from "../dist/string-apostrophes.umd";
import {
  convertOne as c31,
  convertAll as c32,
} from "../dist/string-apostrophes.cjs";

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
    t.same(
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

// 2. UMD
// -----------------------------------------------------------------------------

tap.test(
  `03 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - UMD buid works for convertOne`,
  (t) => {
    t.throws(() => {
      c21(`aa`, {});
    }, "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - UMD build works for convertAll`,
  (t) => {
    t.same(
      c22(`'What!' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      "04"
    );
    t.end();
  }
);

// 3. CJS
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - CJS buid works for convertOne`,
  (t) => {
    t.throws(() => {
      c31(`aa`, {});
    }, "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`API`}\u001b[${39}m`} - CJS build works for convertAll`,
  (t) => {
    t.same(
      c32(`'What!' he said`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      "06"
    );
    t.end();
  }
);
