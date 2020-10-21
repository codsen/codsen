import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

const key = ["crlf", "cr", "lf"];

// Line trimming
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - does not trim each lines because it's default setting`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`   a   bbb  ${presentEolType}   c   d   `).result,
        `a bbb ${presentEolType} c d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - trim setting on, trims every line`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`   aaa   bbb  ${presentEolType}    ccc   ddd   `, {
          trimLines: false,
        }).result,
        `aaa bbb ${presentEolType} ccc ddd`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(`   aaa   bbb  ${presentEolType}    ccc   ddd   `, {
          trimLines: true,
        }).result,
        `aaa bbb${presentEolType}ccc ddd`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and non-breaking spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          {
            trimLines: false,
          }
        ).result,
        `\xa0 aaa bbb \xa0 ${presentEolType} \xa0 ccc ddd \xa0`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          {
            trimLines: true,
            trimnbsp: false,
          }
        ).result,
        `\xa0 aaa bbb \xa0${presentEolType}\xa0 ccc ddd \xa0`,
        `04.03.02 - trimLines = 1, trimnbsp = 0`
      );
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          {
            trimLines: true,
            trimnbsp: true,
          }
        ).result,
        `aaa bbb${presentEolType}ccc ddd`,
        `04.03.03 - trimLines = 1, trimnbsp = 1`
      );
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and \\r`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}${presentEolType}     a    b    ${presentEolType}    c    d      ${presentEolType}     e     f     ${presentEolType}${presentEolType}${presentEolType}     g    h    ${presentEolType}`,
          { trimLines: true, trimnbsp: false }
        ).result,
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]} - 1`
      );
      t.equal(
        collapse(
          `${presentEolType}${presentEolType}     a    b    ${presentEolType}    c    d      ${presentEolType}     e     f     ${presentEolType}${presentEolType}${presentEolType}     g    h    ${presentEolType}`,
          { trimLines: true, trimnbsp: true }
        ).result,
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]} - 2`
      );
      t.equal(
        collapse(
          `\xa0${presentEolType}${presentEolType}  \xa0   a    b   \xa0 ${presentEolType}  \xa0  c    d   \xa0\xa0   ${presentEolType}  \xa0\xa0   e     f  \xa0\xa0   ${presentEolType}${presentEolType}${presentEolType} \xa0\xa0    g    h    ${presentEolType}\xa0\xa0`,
          { trimLines: true, trimnbsp: true }
        ).result,
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]} - 3`
      );
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}${presentEolType}     a    b    ${presentEolType}    c    d      ${presentEolType}     e     f     ${presentEolType}${presentEolType}${presentEolType}     g    h    ${presentEolType}`,
          { trimLines: true, trimnbsp: false }
        ).result,
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);
