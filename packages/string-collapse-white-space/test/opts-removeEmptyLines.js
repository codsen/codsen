import tap from "tap";
import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

const key = ["crlf", "cr", "lf"];

// opts.removeEmptyLines
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer().forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b`, opt).result,
        `a${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`02`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}${eol}b`, opt).result,
        `a${eol}${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}${eol}b`, opt).result,
        `a${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`03`, (t) => {
  // "a.-.b"
  t.strictSame(
    collapse(`a\n\r\nb`, {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a\nb`,
    "03"
  );
  t.end();
});

tap.test(`04`, (t) => {
  t.strictSame(
    collapse(`a \r\n \r\n b`, {
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true,
    }).result,
    `a\r\n\r\nb`,
    "04"
  );
  t.end();
});

tap.test(`05`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    // false-0-?
    mixer({
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a ${eol} ${eol} b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a${eol}${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });

    // true-0-?
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a ${eol} b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });

    // false-1-?
    mixer({
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 1,
      trimLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a ${eol} ${eol} b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 1,
      trimLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a${eol}${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });

    // true-1-?
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1,
      trimLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a ${eol} ${eol} b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1,
      trimLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a${eol}${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(
  `06 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - remove`,
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
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          trimLines: true,
          trimnbsp: false,
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
  `07 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - don't remove`,
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
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          trimLines: true,
          trimnbsp: false,
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
  `08 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - remove`,
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
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: true,
          trimnbsp: false,
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
  `09 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - don't remove`,
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
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: true,
          trimnbsp: false,
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
  `10 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - empty lines removal off + per-line trimming off`,
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
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: false,
          trimnbsp: false,
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
  `11 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off - multiple spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
          trimLines: false,
          trimnbsp: false,
          removeEmptyLines: false,
        }).result,
        `a ${presentEolType} ${presentEolType} b`,
        `EOL ${key[idx]}`
      );
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
  `12 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - advanced`,
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
  `13 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines`,
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
