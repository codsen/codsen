import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

const key = ["crlf", "cr", "lf"];

// opts.removeEmptyLines
// -----------------------------------------------------------------------------

test(`01`, () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer().forEach((opt) => {
      equal(
        collapse(`a${eol}b`, opt).result,
        `a${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
});

test(`02`, () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}${eol}b`, opt).result,
        `a${eol}${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}${eol}b`, opt).result,
        `a${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
});

test(`03`, () => {
  // "a.-.b"
  equal(
    collapse(`a\n\r\nb`, {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a\nb`,
    "03"
  );
});

test(`04`, () => {
  equal(
    collapse(`a \r\n \r\n b`, {
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true,
    }).result,
    `a\r\n\r\nb`,
    "04"
  );
});

test(`05`, () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    // false-0-?
    mixer({
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: false,
    }).forEach((opt) => {
      equal(
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
      equal(
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
      equal(
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
      equal(
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
      equal(
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
      equal(
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
      equal(
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
      equal(
        collapse(`a ${eol} ${eol} b`, opt).result,
        `a${eol}${eol}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
});

test(`06 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`07 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - don't remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`08 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`09 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - don't remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`10 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - empty lines removal off + per-line trimming off`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: false,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `EOL ${key[idx]}`
    );
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: false,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`11 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off - multiple spaces`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
        trimLines: false,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `EOL ${key[idx]}`
    );
    equal(
      collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
        trimLines: false,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `EOL ${key[idx]}`
    );
  });
});

test(`12 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - advanced`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(
        `\xa0${presentEolType}${presentEolType}  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   ${presentEolType}${presentEolType}${presentEolType} \xa0\xa0    g    h    \r\xa0\xa0`,
        { trimLines: true, trimnbsp: true, removeEmptyLines: true }
      ).result,
      `a b\r\nc d\re f${presentEolType}g h`,
      `EOL ${key[idx]}`
    );
  });
});

test(`13 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
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
});

test.run();
