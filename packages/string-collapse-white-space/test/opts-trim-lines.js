import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

// Line trimming
// -----------------------------------------------------------------------------

test("01", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`   a   bbb  ${eol}   c   d   `, opt).result,
        ` a bbb ${eol} c d `,
        JSON.stringify(opt, null, 0),
      );
    });

    mixer({
      trimStart: true,
      trimEnd: true,
      trimLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`   a   bbb  ${eol}   c   d   `, opt).result,
        `a bbb ${eol} c d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      trimLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`   a   bbb  ${eol}   c   d   `, opt).result,
        `a bbb${eol}c d`,
        JSON.stringify(opt, null, 0),
      );
    });
  });
});

test("02", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      trimnbsp: false,
      enforceSpacesOnly: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${eol}     \xa0     ccc   ddd   \xa0   `,
          opt,
        ).result,
        ` \xa0 aaa bbb \xa0 ${eol} \xa0 ccc ddd \xa0 `,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: true,
      trimnbsp: false,
      enforceSpacesOnly: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${eol}     \xa0     ccc   ddd   \xa0   `,
          opt,
        ).result,
        `\xa0 aaa bbb \xa0${eol}\xa0 ccc ddd \xa0`,
        JSON.stringify(opt, null, 0),
      );
    });
  });
});

test("03", () => {
  // "     .    aaa   bbb    .    -     .     ccc   ddd   .   "
  equal(
    collapse(
      "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
      {
        removeEmptyLines: false,
        trimStart: false,
        trimEnd: false,
        trimLines: true,
        trimnbsp: false,
        enforceSpacesOnly: false,
        limitConsecutiveEmptyLinesTo: 0,
      },
    ),
    {
      result: "\xa0 aaa bbb \xa0\n\xa0 ccc ddd \xa0",
      ranges: [
        [0, 5],
        [6, 9],
        [13, 15],
        [19, 22],
        [24, 28],
        [29, 34],
        [35, 39],
        [43, 45],
        [49, 51],
        [53, 56],
      ],
    },
    "03.01",
  );
});

test("04", () => {
  // "a  .  -  .  b"
  equal(
    collapse("a  \xa0  \n  \xa0  b", {
      removeEmptyLines: false,
      trimStart: false,
      trimEnd: false,
      trimLines: true,
      trimnbsp: false,
      enforceSpacesOnly: false,
      limitConsecutiveEmptyLinesTo: 0,
    }),
    {
      result: "a \xa0\n\xa0 b",
      ranges: [
        [1, 2],
        [4, 6],
        [7, 9],
        [10, 11],
      ],
    },
    "04.01",
  );
});

test("05", () => {
  // "   .   aaa   .   "
  equal(
    collapse("   \xa0   aaa   \xa0   ", {
      trimStart: false,
      trimEnd: false,
      trimLines: true,
      trimnbsp: false,
      enforceSpacesOnly: false,
    }).result,
    "\xa0 aaa \xa0",
    "05.01",
  );
});

test("06", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    equal(
      collapse(
        `${eol}${eol}     a    b    ${eol}    c    d      ${eol}     e     f     ${eol}${eol}${eol}     g    h    ${eol}`,
        { trimLines: true, trimnbsp: false },
      ).result,
      `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`,
    );
    equal(
      collapse(
        `${eol}${eol}     a    b    ${eol}    c    d      ${eol}     e     f     ${eol}${eol}${eol}     g    h    ${eol}`,
        { trimLines: true, trimnbsp: true },
      ).result,
      `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`,
    );
    equal(
      collapse(
        `\xa0${eol}${eol}  \xa0   a    b   \xa0 ${eol}  \xa0  c    d   \xa0\xa0   ${eol}  \xa0\xa0   e     f  \xa0\xa0   ${eol}${eol}${eol} \xa0\xa0    g    h    ${eol}\xa0\xa0`,
        { trimLines: true, trimnbsp: true },
      ).result,
      `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`,
    );
  });
});

test("07", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      trimStart: true,
      trimEnd: true,
      trimLines: true,
      trimnbsp: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `${eol}${eol}     a    b    ${eol}    c    d      ${eol}     e     f     ${eol}${eol}${eol}     g    h    ${eol}`,
          opt,
        ).result,
        `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`,
        JSON.stringify(opt, null, 0),
      );
    });
  });
});

test("08", () => {
  // removeEmptyLines=0
  mixer({
    removeEmptyLines: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("a \n \n b", opt).result,
      "a \n \n b",
      JSON.stringify(opt, null, 0),
    );
  });
  mixer({
    removeEmptyLines: false,
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("a \n \n b", opt).result,
      "a\n\nb",
      JSON.stringify(opt, null, 0),
    );
  });
  // removeEmptyLines=1
  mixer({
    removeEmptyLines: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("a \n \n b", opt).result,
      "a \n b",
      JSON.stringify(opt, null, 0),
    );
  });
  mixer({
    removeEmptyLines: true,
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("a \n \n b", opt).result,
      "a\nb",
      JSON.stringify(opt, null, 0),
    );
  });
});

test.run();
