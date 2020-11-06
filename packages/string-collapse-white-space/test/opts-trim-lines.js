import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";
import { mixer } from "./util/util";

// Line trimming
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      trimStart: 0,
      trimEnd: 0,
      trimLines: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`   a   bbb  ${eol}   c   d   `, opt).result,
        ` a bbb ${eol} c d `,
        JSON.stringify(opt, null, 0)
      );
    });

    mixer({
      trimStart: 1,
      trimEnd: 1,
      trimLines: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`   a   bbb  ${eol}   c   d   `, opt).result,
        `a bbb ${eol} c d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimLines: 1,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`   a   bbb  ${eol}   c   d   `, opt).result,
        `a bbb${eol}c d`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`02`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      trimStart: 0,
      trimEnd: 0,
      trimLines: 0,
      trimnbsp: 0,
      enforceSpacesOnly: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${eol}     \xa0     ccc   ddd   \xa0   `,
          opt
        ).result,
        ` \xa0 aaa bbb \xa0 ${eol} \xa0 ccc ddd \xa0 `,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: 0,
      trimEnd: 0,
      trimLines: 1,
      trimnbsp: 0,
      enforceSpacesOnly: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${eol}     \xa0     ccc   ddd   \xa0   `,
          opt
        ).result,
        `\xa0 aaa bbb \xa0${eol}\xa0 ccc ddd \xa0`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test("03", (t) => {
  // "     .    aaa   bbb    .    -     .     ccc   ddd   .   "
  t.strictSame(
    collapse(
      `     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   `,
      {
        removeEmptyLines: 0,
        trimStart: 0,
        trimEnd: 0,
        trimLines: 1,
        trimnbsp: 0,
        enforceSpacesOnly: 0,
        limitConsecutiveEmptyLinesTo: 0,
      }
    ),
    {
      result: `\xa0 aaa bbb \xa0\n\xa0 ccc ddd \xa0`,
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
    "03"
  );
  t.end();
});

tap.test("04", (t) => {
  // "a  .  -  .  b"
  t.strictSame(
    collapse(`a  \xa0  \n  \xa0  b`, {
      removeEmptyLines: 0,
      trimStart: 0,
      trimEnd: 0,
      trimLines: 1,
      trimnbsp: 0,
      enforceSpacesOnly: 0,
      limitConsecutiveEmptyLinesTo: 0,
    }),
    {
      result: `a \xa0\n\xa0 b`,
      ranges: [
        [1, 2],
        [4, 6],
        [7, 9],
        [10, 11],
      ],
    },
    "04"
  );
  t.end();
});

tap.test("05", (t) => {
  // "   .   aaa   .   "
  t.strictSame(
    collapse(`   \xa0   aaa   \xa0   `, {
      trimStart: 0,
      trimEnd: 0,
      trimLines: 1,
      trimnbsp: 0,
      enforceSpacesOnly: 0,
    }).result,
    `\xa0 aaa \xa0`,
    "05"
  );
  t.end();
});

tap.test(`06`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    t.strictSame(
      collapse(
        `${eol}${eol}     a    b    ${eol}    c    d      ${eol}     e     f     ${eol}${eol}${eol}     g    h    ${eol}`,
        { trimLines: true, trimnbsp: false }
      ).result,
      `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`
    );
    t.strictSame(
      collapse(
        `${eol}${eol}     a    b    ${eol}    c    d      ${eol}     e     f     ${eol}${eol}${eol}     g    h    ${eol}`,
        { trimLines: true, trimnbsp: true }
      ).result,
      `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`
    );
    t.strictSame(
      collapse(
        `\xa0${eol}${eol}  \xa0   a    b   \xa0 ${eol}  \xa0  c    d   \xa0\xa0   ${eol}  \xa0\xa0   e     f  \xa0\xa0   ${eol}${eol}${eol} \xa0\xa0    g    h    ${eol}\xa0\xa0`,
        { trimLines: true, trimnbsp: true }
      ).result,
      `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`
    );
  });
  t.end();
});

tap.test(`07`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      trimStart: 1,
      trimEnd: 1,
      trimLines: 1,
      trimnbsp: 0,
      removeEmptyLines: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(
          `${eol}${eol}     a    b    ${eol}    c    d      ${eol}     e     f     ${eol}${eol}${eol}     g    h    ${eol}`,
          opt
        ).result,
        `a b${eol}c d${eol}e f${eol}${eol}${eol}g h`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test("08", (t) => {
  // removeEmptyLines=0
  mixer({
    removeEmptyLines: 0,
    trimLines: 0,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \n \n b`, opt).result,
      `a \n \n b`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    removeEmptyLines: 0,
    trimLines: 1,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \n \n b`, opt).result,
      `a\n\nb`,
      JSON.stringify(opt, null, 0)
    );
  });
  // removeEmptyLines=1
  mixer({
    removeEmptyLines: 1,
    trimLines: 0,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \n \n b`, opt).result,
      `a \n b`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    removeEmptyLines: 1,
    trimLines: 1,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \n \n b`, opt).result,
      `a\nb`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});
