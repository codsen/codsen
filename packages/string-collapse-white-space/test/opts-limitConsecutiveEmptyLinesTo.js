import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

const key = ["crlf", "cr", "lf"];

// opts.limitConsecutiveEmptyLinesTo
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, removeEmptyLines=off`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          removeEmptyLines: false,
        }).result,
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, removeEmptyLines=on`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
        }).result,
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `a${presentEolType}${presentEolType}${presentEolType}${presentEolType}b`,
          {
            removeEmptyLines: true,
            limitConsecutiveEmptyLinesTo: 1,
          }
        ).result,
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 1,
        }).result,
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 2,
        }).result,
        `a${presentEolType}${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 3,
        }).result,
        `a${presentEolType}${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 99,
        }).result,
        `a${presentEolType}${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=off`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType} ${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 0,
          trimLines: false,
        }).result,
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=on`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType} ${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 0,
          trimLines: true,
        }).result,
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);
