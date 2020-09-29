import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

const key = ["crlf", "cr", "lf"];

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.strictSame(
      collapse("a b"),
      { result: "a b", ranges: null },
      "01 - nothing to collapse"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.strictSame(collapse("a  b"), { result: "a b", ranges: [[1, 2]] }, "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.strictSame(
      collapse("aaa     bbb    ccc   dddd"),
      {
        result: "aaa bbb ccc dddd",
        ranges: [
          [3, 7],
          [11, 14],
          [18, 20],
        ],
      },
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.strictSame(
      collapse("  a b  "),
      {
        result: "a b",
        ranges: [
          [0, 2],
          [5, 7],
        ],
      },
      "04 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.strictSame(collapse(" a b ").result, "a b", "05 - trims single spaces");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.strictSame(collapse("\ta b\t").result, "a b", "06 - trims single tabs");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.strictSame(collapse("  a  b  ").result, "a b", "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.strictSame(
      collapse("  aaa     bbb    ccc   dddd  ").result,
      "aaa bbb ccc dddd",
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    // opts.trimStart
    t.strictSame(
      collapse("  a b  ", { trimStart: false }).result,
      " a b",
      "09 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.strictSame(
      collapse(" a b ", { trimStart: false }).result,
      " a b",
      "10 - trims single spaces"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.strictSame(
      collapse("\ta b\t", { trimStart: false }).result,
      "\ta b",
      "11 - trims single tabs"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(`${presentEolType} \ta b\t ${presentEolType}`, {
          trimStart: false,
        }).result,
        `${presentEolType} \ta b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.strictSame(
      collapse("  a  b  ", { trimStart: false }).result,
      " a b",
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.strictSame(
      collapse("  aaa     bbb    ccc   dddd  ", { trimStart: false }).result,
      " aaa bbb ccc dddd",
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    // opts.trimEnd
    t.strictSame(
      collapse("  a b  ", { trimEnd: false }).result,
      "a b ",
      "15 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.strictSame(
      collapse(" a b ", { trimEnd: false }).result,
      "a b ",
      "16 - trims single spaces"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.strictSame(
      collapse("\ta b\t", { trimEnd: false }).result,
      "a b\t",
      "17 - trims single tabs"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(`${presentEolType} \ta b\t ${presentEolType}`, {
          trimEnd: false,
        }).result,
        `a b\t ${presentEolType}`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(`${presentEolType} \ta b\t    ${presentEolType}`, {
          trimEnd: false,
        }).result,
        `a b\t ${presentEolType}`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.strictSame(collapse(`  a  b  `, { trimEnd: false }).result, `a b `, "20");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.strictSame(
      collapse(`  aaa     bbb    ccc   dddd  `, { trimEnd: false }).result,
      `aaa bbb ccc dddd `,
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(
          `a${presentEolType}b${presentEolType}c${presentEolType}${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`
        ).result,
        `a${presentEolType}b${presentEolType}c${presentEolType}${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(
          `a${presentEolType}b${presentEolType}c${presentEolType}   ${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`
        ).result,
        `a${presentEolType}b${presentEolType}c${presentEolType} ${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(`a<br>${presentEolType}b`).result,
        `a<br>${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(`a<br>${presentEolType}b<br>${presentEolType}c`).result,
        `a<br>${presentEolType}b<br>${presentEolType}c`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.strictSame(
        collapse(
          `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`
        ).result,
        `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);
