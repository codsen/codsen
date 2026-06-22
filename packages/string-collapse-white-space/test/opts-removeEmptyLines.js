// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

const key = ["crlf", "cr", "lf"];

// opts.removeEmptyLines
// -----------------------------------------------------------------------------

test("01", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer().forEach((opt) => {
      equal(
        collapse(`a${eol}b`, opt).result,
        `a${eol}b`,
        `01.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("02", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}${eol}b`, opt).result,
        `a${eol}${eol}b`,
        `02.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}${eol}b`, opt).result,
        `a${eol}b`,
        `02.02 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("03", () => {
  // "a.-.b"
  equal(
    collapse("a\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a\nb",
    "03.01",
  );
});

test("04", () => {
  equal(
    collapse("a \r\n \r\n b", {
      removeEmptyLines: false,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true,
    }).result,
    "a\r\n\r\nb",
    "04.01",
  );
});

test("05", () => {
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
        `05.01 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.02 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.03 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.04 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.05 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.06 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.07 - ${JSON.stringify(opt, null, 0)}`,
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
        `05.08 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test(`06 - opts.removeEmptyLines - one - remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `06.01 - ${`EOL ${key[idx]}`}`,
    );
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `06.02 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`07 - opts.removeEmptyLines - one - don't remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `07.01 - ${`EOL ${key[idx]}`}`,
    );
    equal(
      collapse(`a${presentEolType}${presentEolType}b`, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `07.02 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`08 - opts.removeEmptyLines - two, spaced - remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `08.01 - ${`EOL ${key[idx]}`}`,
    );
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: true,
      }).result,
      `a${presentEolType}b`,
      `08.02 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`09 - opts.removeEmptyLines - two, spaced - don't remove`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `09.01 - ${`EOL ${key[idx]}`}`,
    );
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: true,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a${presentEolType}${presentEolType}b`,
      `09.02 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`10 - opts.removeEmptyLines - empty lines removal off + per-line trimming off`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: false,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `10.01 - ${`EOL ${key[idx]}`}`,
    );
    equal(
      collapse(` a ${presentEolType} ${presentEolType} b `, {
        trimLines: false,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `10.02 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`11 - opts.removeEmptyLines - \\n - empty lines removal off + per-line trimming off - multiple spaces`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
        trimLines: false,
        trimnbsp: false,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `11.01 - ${`EOL ${key[idx]}`}`,
    );
    equal(
      collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
        trimLines: false,
        trimnbsp: true,
        removeEmptyLines: false,
      }).result,
      `a ${presentEolType} ${presentEolType} b`,
      `11.02 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`12 - opts.removeEmptyLines - advanced`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(
        `\xa0${presentEolType}${presentEolType}  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   ${presentEolType}${presentEolType}${presentEolType} \xa0\xa0    g    h    \r\xa0\xa0`,
        { trimLines: true, trimnbsp: true, removeEmptyLines: true },
      ).result,
      `a b\r\nc d\re f${presentEolType}g h`,
      `12.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test(`13 - opts.removeEmptyLines - leading/trailing empty lines`, () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    equal(
      collapse(
        `${presentEolType}a${presentEolType}${presentEolType}b${presentEolType}`,
        {
          trimLines: true,
          trimnbsp: true,
          removeEmptyLines: true,
        },
      ).result,
      `a${presentEolType}b`,
      `13.01 - ${`EOL ${key[idx]}`}`,
    );
  });
});

test.run();
