import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

const key = ["crlf", "cr", "lf"];

// opts.removeEmptyLines
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          trimLines: true,
          trimnbsp: true,
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
  `02 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - don't remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          trimLines: true,
          trimnbsp: true,
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
  `03 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: true,
          trimnbsp: true,
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
  `04 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - don't remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: true,
          trimnbsp: true,
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
  `05 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - empty lines removal off + per-line trimming off`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: false,
          trimnbsp: true,
          removeEmptyLines: false,
        }).result,
        `a ${presentEolType} ${presentEolType} b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off - multiple spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
          trimLines: false,
          trimnbsp: true,
          removeEmptyLines: false,
        }).result,
        `a ${presentEolType} ${presentEolType} b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - advanced`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\xa0${presentEolType}${presentEolType}  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   ${presentEolType}${presentEolType}${presentEolType} \xa0\xa0    g    h    \r\xa0\xa0`,
          { trimLines: true, trimnbsp: true, removeEmptyLines: true }
        ).result,
        `a b\r\nc d\re f${presentEolType}g h`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}a${presentEolType}${presentEolType}b${presentEolType}`,
          {
            trimLines: true,
            trimnbsp: true,
            removeEmptyLines: true,
          }
        ).result,
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);
