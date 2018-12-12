import "@babel/polyfill";
import test from "ava";
import { crush as m, defaults, version } from "../dist/html-crush.esm";

function strip(str) {
  if (typeof str === "string") {
    return str
      .replace(/<[^>]*>/gi, "")
      .replace(/\s+/gi, " ")
      .trim();
  }
  throw new Error(`input must be string! It was given as: ${typeof str}`);
}

// 00. THROWS.
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when first arg is wrong`, t => {
  const err1 = t.throws(() => {
    m();
  });
  t.regex(err1.message, /THROW_ID_01/g);
  t.regex(err1.message, /completely missing/g);

  const err2 = t.throws(() => {
    m(true);
  });
  t.regex(err2.message, /THROW_ID_02/g);
  t.regex(err2.message, /boolean/g);
});

test(`00.02 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when second arg is wrong`, t => {
  const err1 = t.throws(() => {
    m("zzz", true);
  });
  t.regex(err1.message, /THROW_ID_03/g);
  t.regex(err1.message, /boolean/g);

  const err2 = t.throws(() => {
    m("zzz", "{}");
  });
  t.regex(err2.message, /THROW_ID_03/g);
  t.regex(err2.message, /string/g);
});

test(`00.03 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when opts values are wrong`, t => {
  const err1 = t.throws(() => {
    m("zzz", {
      lineLengthLimit: false
    });
  });
  t.regex(err1.message, /THROW_ID_04/gi);
  t.regex(err1.message, /opts\.lineLengthLimit/gi);
  t.regex(err1.message, /not number but boolean/gi);
});

test(`00.04 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when opts.breakToTheLeftOf contains non-string elements`, t => {
  const err1 = t.throws(() => {
    m("zzz", {
      breakToTheLeftOf: ["<a", true]
    });
  });
  t.regex(err1.message, /THROW_ID_05/gi);
  t.regex(err1.message, /opts\.breakToTheLeftOf/gi);
  t.regex(err1.message, /boolean/gi);

  // but does not throw when array is false, null or empty:
  t.notThrows(() => {
    m("zzz", {
      breakToTheLeftOf: false
    });
  });
  t.notThrows(() => {
    m("zzz", {
      breakToTheLeftOf: null
    });
  });
  t.notThrows(() => {
    m("zzz", {
      breakToTheLeftOf: []
    });
  });
});

// 01. Small tests
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - deletes trailing space`, t => {
  t.deepEqual(
    m(" <a> \n <b> ", {
      removeLineBreaks: true
    }).result,
    "<a><b>",
    "01.01.01"
  );
});

test(`01.02 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - retains trailing linebreak`, t => {
  t.deepEqual(
    m(" <a> \n <b> \n", {
      removeLineBreaks: true
    }).result,
    "<a><b>\n",
    "01.02.01"
  );
});

test(`01.03 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - trailing line break`, t => {
  t.deepEqual(
    m(" a \n b \n", {
      removeLineBreaks: true
    }).result,
    "a b\n",
    "01.03"
  );
});

test(`01.04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - multiple line breaks`, t => {
  t.deepEqual(
    m(" a \n b\n\n\nc ", {
      removeLineBreaks: true
    }).result,
    "a b c",
    "01.04"
  );
});

test(`01.05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - ends with character`, t => {
  t.deepEqual(
    m(" a \n b\n\n\nc", {
      removeLineBreaks: true
    }).result,
    "a b c",
    "01.05"
  );
});

test(`01.06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`, t => {
  t.deepEqual(
    m("<aa><bb>\t<cc><dd>", { lineLengthLimit: 12, removeLineBreaks: true })
      .result,
    "<aa><bb><cc>\n<dd>",
    "01.06 - clone of 02.11.09"
  );
});

test(`01.07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - what happens when it's impossible to break and exceeding line length limit is inevitable`, t => {
  t.deepEqual(
    m("abc ghijklmnop xyz", { lineLengthLimit: 2, removeLineBreaks: true })
      .result,
    "abc\nghijklmnop\nxyz",
    "01.07"
  );
});

test(`01.08 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks lines when limiter is on`, t => {
  t.deepEqual(
    m("aa bb cc\n", {
      lineLengthLimit: 3,
      removeLineBreaks: true
    }).result,
    "aa\nbb\ncc\n",
    "01.08"
  );
});

test(`01.09 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks along with wiping whitespace`, t => {
  t.deepEqual(
    m("aa   \n \t  bb   \n \t    cc", {
      lineLengthLimit: 3
    }).result,
    "aa\nbb\ncc",
    "01.09"
  );
});

test(`01.10 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks unbreakable chunks, each over limit`, t => {
  t.deepEqual(
    m("abcde   \n \t  fghij   \n \t    klmno", {
      lineLengthLimit: 3
    }).result,
    "abcde\nfghij\nklmno",
    "01.10"
  );
});

test(`01.11 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace`, t => {
  t.deepEqual(
    m("    \n    <a>\n\n   <b>\n  <c>", {
      lineLengthLimit: 8,
      removeLineBreaks: true
    }).result,
    "<a><b>\n<c>",
    "01.11"
  );
});

test(`01.12 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting`, t => {
  t.deepEqual(
    m("  <a>\n     <b>\n   c </b>\n   </a>", {
      lineLengthLimit: 8,
      removeLineBreaks: true
    }).result,
    "<a><b> c\n</b></a>",
    "01.12"
  );
});

test(`01.13 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting`, t => {
  t.deepEqual(
    m(
      `  <a>
       <b>
     c </b>
     </a>
       <a>`,
      {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }
    ).result,
    "<a><b> c\n</b></a>\n<a>",
    "01.13"
  );
});

test(`01.14 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 8`, t => {
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", {
      lineLengthLimit: 8,
      removeLineBreaks: true
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "01.14"
  );
});

test(`01.15 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 10`, t => {
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", {
      lineLengthLimit: 10,
      removeLineBreaks: true
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "01.15"
  );
});

test(`01.16 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 14`, t => {
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", {
      lineLengthLimit: 14,
      removeLineBreaks: true
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "01.16"
  );
});

test(`01.17 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence without whitespace is wrapped`, t => {
  t.deepEqual(
    m("<aa><bb><cc>", { lineLengthLimit: 8, removeLineBreaks: true }).result,
    "<aa><bb>\n<cc>",
    "01.17 - duplicates 02.10.01"
  );
});

test(`01.18 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence completely wrapped`, t => {
  t.deepEqual(
    m("<aa><bb><cc>", { lineLengthLimit: 7, removeLineBreaks: true }).result,
    "<aa>\n<bb>\n<cc>",
    "01.18"
  );
});

test(`01.19 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`, t => {
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { lineLengthLimit: 13, removeLineBreaks: true })
      .result,
    "aaaaaa bbbbbb\ncccccc",
    "clone of 02.05.14"
  );
});

// 02. B.A.U.
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - nothing to minify`, t => {
  t.deepEqual(m("").result, "", "02.01.01");
  t.deepEqual(m("zzzz").result, "zzzz", "02.01.02");
});

test(`02.02 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - minimal string of few words`, t => {
  const source = ` \t
<a>\t\t
  <b>\t
    c\t
  </b>\t
</a>\t
\t
`;

  t.deepEqual(
    m(source, { removeLineBreaks: true }).result,
    "<a><b> c </b></a>\n",
    "02.02.01 - defaults: remove both indentations and linebreaks"
  );

  t.deepEqual(
    m(source, { removeLineBreaks: true, removeIndentations: false }).result,
    "<a><b> c </b></a>\n",
    "02.02.02 - disabling indentation removal while keeping linebreak removal is futile"
  );

  t.is(
    m(source, { removeLineBreaks: false, removeIndentations: true }).result,
    `<a>
<b>
c
</b>
</a>
`,
    "02.02.03 - only remove indentations"
  );

  t.is(
    m(source, { removeLineBreaks: false, removeIndentations: false }).result,
    `<a>
  <b>
    c
  </b>
</a>
`,
    "02.02.04 - all off so only trims leading whitespace"
  );

  t.is(
    m(source, { removeLineBreaks: true, removeIndentations: true }).result,
    `<a><b> c </b></a>
`,
    "02.02.05 - line breaks on"
  );

  t.is(
    m(source, { removeLineBreaks: true, removeIndentations: false }).result,
    `<a><b> c </b></a>
`,
    "02.02.06 - line breaks on"
  );
});

test(`02.03 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - trailing linebreaks (or their absence) at the EOF are respected`, t => {
  // removeLineBreaks: true
  t.is(
    m("\n<a>\n  <b>\n    c\n  </b>\n</a>\n", { removeLineBreaks: true }).result,
    "<a><b> c </b></a>\n",
    "02.03.01 - default settings, single trailing line breaks at EOF"
  );
  t.is(
    m("\n<a>\n  <b>\n    c\n  </b>\n</a>\n\n", { removeLineBreaks: true })
      .result,
    "<a><b> c </b></a>\n",
    "02.03.02 - default settings, double trailing line breaks at EOF"
  );
  t.is(
    m("\n<a>\n  <b>\n    c\n  </b>\n</a>", { removeLineBreaks: true }).result,
    "<a><b> c </b></a>",
    "02.03.03 - default settings, no trailing line breaks at EOF"
  );

  // removeLineBreaks: false
  t.is(
    m("\n<a>\n  <b>\n    c\n  </b>\n</a>\n", { removeLineBreaks: false })
      .result,
    "<a>\n<b>\nc\n</b>\n</a>\n",
    "02.03.04 - default settings, single trailing line breaks at EOF"
  );
  t.is(
    m("\n<a>\n  <b>\n    c\n  </b>\n</a>\n\n", { removeLineBreaks: false })
      .result,
    "<a>\n<b>\nc\n</b>\n</a>\n",
    "02.03.05 - default settings, double trailing line breaks at EOF"
  );
  t.is(
    m("\n<a>\n  <b>\n    c\n  </b>\n</a>", { removeLineBreaks: false }).result,
    "<a>\n<b>\nc\n</b>\n</a>",
    "02.03.06 - default settings, no trailing line breaks at EOF"
  );
});

test(`02.04 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - opts.lineLengthLimit`, t => {
  // the following piece of HTML will render as having spaces between C's:
  const original = `  <a>
     <b>
   c </b>
   </a>
     <a>
     <b>
   c </b>
   </a>
     <a>
     <b>
   c </b>
   </a>\n`;

  // the following piece of HTML will render without spaces between C's:
  const wrong = "<a><b>c</b></a><a><b>c</b></a><a><b>c</b></a>\n";

  const minified = "<a><b> c </b></a><a><b> c </b></a><a><b> c </b></a>\n";

  t.is(
    m(original, { removeLineBreaks: true }).result,
    minified,
    "02.04.01 - default settings"
  );
  t.is(strip(original), strip(minified), "02.04.02");
  t.not(strip(original), strip(wrong), "02.04.03");

  const minified8 = `<a><b> c
</b></a>
<a><b> c
</b></a>
<a><b> c
</b></a>
`;
  t.is(
    m(original, {
      removeLineBreaks: true,
      lineLengthLimit: 8
    }).result,
    minified8,
    "02.04.04"
  );

  m(original, {
    lineLengthLimit: 8
  })
    .result.split("\n")
    .forEach((line, i) => {
      // console.log(
      //   `156: ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
      //     line,
      //     null,
      //     4
      //   )} => ${line.length}`
      // );
      t.true(line.length <= 8, `row #${i}`);
    });

  // console.log("=====");

  minified8.split("\n").forEach((line, i) => {
    // console.log(
    //   `167: ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
    //     line,
    //     null,
    //     4
    //   )} => ${line.length}`
    // );
    t.true(line.length <= 8, `row #${i}`);
  });
});

test(`02.05 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - spaces`, t => {
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: false, lineLengthLimit: 0 })
      .result,
    "aaaaaa bbbbbb cccccc",
    "02.05.01-1"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 0 })
      .result,
    "aaaaaa bbbbbb cccccc",
    "02.05.01-2"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 1 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.02"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 2 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.03"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 3 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.04"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 4 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.05"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 5 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.06"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 6 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.07"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 7 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.08"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.09"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 9 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.10"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 10 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.11"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 11 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.12"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.05.13 - the very edge"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 13 })
      .result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.14"
  );
  t.deepEqual(
    m("aaaaaa  bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 13 })
      .result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.15 - double space"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.16 - double linebreak"
  );
  t.deepEqual(
    m("aaaaaa \n \n bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.17 - double linebreak with spaces"
  );
  t.deepEqual(
    m("aaaaaa\t\n\t\n\tbbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.18 - double linebreak with spaces"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 14 })
      .result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.19 - two chunks can stay on one line generously"
  );
  t.deepEqual(
    m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 15 })
      .result,
    "aaaaaa bbbbbb\ncccccc",
    "02.05.20 - two chunks can stay on one line generously"
  );
});

test(`02.06 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - linebreaks`, t => {
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 0 })
      .result,
    "aaaaaa bbbbbb cccccc",
    "02.06.01"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 1 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.02"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 2 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.03"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 3 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.04"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 4 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.05"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 5 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.06"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 6 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.07"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 7 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.08"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.09"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 9 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.10"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 10 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.11"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 11 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.12"
  );
  t.deepEqual(
    m("aaaaaa\nbbbbbb\ncccccc", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.06.13 - the very edge"
  );
});

test(`02.07 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - double linebreaks`, t => {
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 0
    }).result,
    "aaaaaa bbbbbb cccccc",
    "02.07.01"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 1
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.02"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 2
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.03"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 3
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.04"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 4
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.05"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 5
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.06"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 6
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.07"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 7
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.08"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 8
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.09"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 9
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.10"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 10
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.11"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 11
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.12"
  );
  t.deepEqual(
    m("aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "02.07.13 - the very edge"
  );
});

test(`02.08 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - tags with single space between them`, t => {
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 0 })
      .result,
    "<aaaa><bbbb><cccc>",
    "02.08.01 - same but with tags"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 1 })
      .result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "02.08.02 - the very edge"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 2 })
      .result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "02.08.03"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 10 })
      .result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "02.08.04"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 11 })
      .result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "02.08.05"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aaaa><bbbb>\n<cccc>",
    "02.08.06"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 13 })
      .result,
    "<aaaa><bbbb>\n<cccc>",
    "02.08.07"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 14 })
      .result,
    "<aaaa><bbbb>\n<cccc>",
    "02.08.08"
  );
  t.deepEqual(
    m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 15 })
      .result,
    "<aaaa><bbbb>\n<cccc>",
    "02.08.09"
  );
});

test(`02.09 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking between tags`, t => {
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
    "<aa><bb>",
    "02.09.01"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 1 }).result,
    "<aa>\n<bb>",
    "02.09.02"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 2 }).result,
    "<aa>\n<bb>",
    "02.09.03"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
    "<aa>\n<bb>",
    "02.09.04"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 4 }).result,
    "<aa>\n<bb>",
    "02.09.05"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 5 }).result,
    "<aa>\n<bb>",
    "02.09.06"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 6 }).result,
    "<aa>\n<bb>",
    "02.09.07"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 7 }).result,
    "<aa>\n<bb>",
    "02.09.08"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
    "<aa><bb>",
    "02.09.09"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 9 }).result,
    "<aa><bb>",
    "02.09.10"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 10 }).result,
    "<aa><bb>",
    "02.09.11"
  );
  t.deepEqual(
    m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 999 }).result,
    "<aa><bb>",
    "02.09.12"
  );
});

test(`02.10 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 8`, t => {
  //
  // line limit 8
  // ============

  // at position at character index 4, the break is staged but never submitted:
  t.deepEqual(
    m("<aa><bb><cc>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
    "<aa><bb>\n<cc>",
    "02.10.01"
  );
  t.deepEqual(
    m("<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "<aa><bb>\n<cc><dd>",
    "02.10.02"
  );

  // same as above, but with whitespace
  t.deepEqual(
    m("<aa>\t<bb>\t<cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "<aa><bb>\n<cc>",
    "02.10.03"
  );
  t.deepEqual(
    m("<aa>\t\t<bb>\t<cc>\t\t<dd>", {
      removeLineBreaks: true,
      lineLengthLimit: 8
    }).result,
    "<aa><bb>\n<cc><dd>",
    "02.10.04"
  );

  // same as above, except with trailing tab
  t.deepEqual(
    m("<aa>\t<bb>\t<cc>\t", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "<aa><bb>\n<cc>",
    "02.10.05"
  );
  t.deepEqual(
    m("<aa>\t\t<bb>\t<cc>\t\t<dd>\t", {
      removeLineBreaks: true,
      lineLengthLimit: 8
    }).result,
    "<aa><bb>\n<cc><dd>",
    "02.10.06"
  );
});

test(`02.11 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 12`, t => {
  //
  // line limit 12
  // =============

  t.deepEqual(
    m("<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd>",
    "02.11.01"
  );
  t.deepEqual(
    m("<aa><bb><cc><dd><ee>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd><ee>",
    "02.11.02"
  );
  t.deepEqual(
    m("<aa><bb><cc><dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "02.11.03"
  );
  t.deepEqual(
    m("<aa><bb><cc><dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "02.11.04"
  );

  // tab after first tag:

  t.deepEqual(
    m("<aa>\t<bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd>",
    "02.11.05"
  );
  t.deepEqual(
    m("<aa>\t<bb><cc><dd><ee>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd><ee>",
    "02.11.06"
  );
  t.deepEqual(
    m("<aa>\t<bb><cc><dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "02.11.07"
  );
  t.deepEqual(
    m("<aa>\t<bb><cc><dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "02.11.08"
  );

  // tab after second tag:

  t.deepEqual(
    m("<aa><bb>\t<cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd>",
    "02.11.09"
  );
  t.deepEqual(
    m("<aa><bb>\t<cc><dd><ee>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd><ee>",
    "02.11.10"
  );
  t.deepEqual(
    m("<aa><bb>\t<cc><dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "02.11.11"
  );
  t.deepEqual(
    m("<aa><bb>\t<cc><dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "02.11.12"
  );

  // tab after third tag:

  t.deepEqual(
    m("<aa><bb><cc>\t<dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd>",
    "02.11.13"
  );
  t.deepEqual(
    m("<aa><bb><cc>\t<dd><ee>", { removeLineBreaks: true, lineLengthLimit: 12 })
      .result,
    "<aa><bb><cc>\n<dd><ee>",
    "02.11.14"
  );
  t.deepEqual(
    m("<aa><bb><cc>\t<dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "02.11.15"
  );
  t.deepEqual(
    m("<aa><bb><cc>\t<dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "02.11.16"
  );
});

test(`02.12 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - script tags are skipped`, t => {
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: false,
      removeIndentations: false
    }).result,
    "a <script>\n \t\t   na\n  \tz</script> z",
    "02.12.01"
  );
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    "a <script>\n \t\t   na\n  \tz</script> z",
    "02.12.02 - default"
  );
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: true,
      removeIndentations: false
    }).result,
    "a <script>\n \t\t   na\n  \tz</script> z",
    "02.12.03"
  );
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: true,
      removeIndentations: true
    }).result,
    "a <script>\n \t\t   na\n  \tz</script> z",
    "02.12.04"
  );
});

test(`02.13 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - unfinished script tags are skipped too`, t => {
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: false,
      removeIndentations: false
    }).result,
    "a <script>\n \t\t   na\n  \tz    z    ",
    "02.13.01"
  );
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    "a <script>\n \t\t   na\n  \tz    z    ",
    "02.13.02 - default"
  );
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: true,
      removeIndentations: false
    }).result,
    "a <script>\n \t\t   na\n  \tz    z    ",
    "02.13.03"
  );
  t.deepEqual(
    m("a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: true,
      removeIndentations: true
    }).result,
    "a <script>\n \t\t   na\n  \tz    z    ",
    "02.13.04"
  );
});

test(`02.14 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - code-pre blocks are not touched`, t => {
  const preBlock = `<pre id="lalalaa"><code class="tralalaa">    \n    \t   zz    z  \n  \t  r  r  \n \t  </code></pre>`;
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: false,
      removeIndentations: false
    }).result,
    preBlock,
    "02.14.01"
  );
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    preBlock,
    "02.14.02"
  );
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: true,
      removeIndentations: false
    }).result,
    preBlock,
    "02.14.03"
  );
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: true,
      removeIndentations: true
    }).result,
    preBlock,
    "02.14.04"
  );
});

test(`02.15 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - CDATA blocks are not touched`, t => {
  const preBlock = `<![CDATA[          \n     \t   \n  a  a \r     \n a    \t    \t\t\t\t\t  a   \n     \t\t\t    ]]>`;
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: false,
      removeIndentations: false
    }).result,
    preBlock,
    "02.15.01"
  );
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    preBlock,
    "02.15.02"
  );
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: true,
      removeIndentations: false
    }).result,
    preBlock,
    "02.15.03"
  );
  t.deepEqual(
    m(preBlock, {
      removeLineBreaks: true,
      removeIndentations: true
    }).result,
    preBlock,
    "02.15.04"
  );
});

// 03. opts.reportProgressFunc
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - calls the progress function`, t => {
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  let counter = 0;
  const countingFunction = () => {
    // const countingFunction = val => {
    // console.log(`val received: ${val}`);
    counter++;
  };

  t.deepEqual(
    m("aaaaaaaaaa").result,
    "aaaaaaaaaa",
    "03.01.01 - default behaviour"
  );
  t.deepEqual(
    m("aaaaaaaaaa", { reportProgressFunc: null }).result,
    "aaaaaaaaaa",
    "03.01.02"
  );
  t.deepEqual(
    m("aaaaaaaaaa", { reportProgressFunc: false }).result,
    "aaaaaaaaaa",
    "03.01.03"
  );

  // short input string should report only when passing at 50%:
  const error1 = t.throws(() => {
    m(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      { removeLineBreaks: true, reportProgressFunc: shouldveBeenCalled }
    );
  });
  t.regex(error1.message, /50/);

  // long input (>1000 chars long) should report at each natural number percentage passed:

  // 1. our function will mutate the counter variable:
  t.pass(
    m(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      { removeLineBreaks: true, reportProgressFunc: countingFunction }
    )
  );

  // 2. check the counter variable:
  t.is(
    counter,
    99,
    "03.01.04 - counter called 99 times, reporting from 1% to 99%, inclusive"
  );
});

// 04. opts.removeIndentations
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - collapses whitespace on removeIndentations`, t => {
  t.deepEqual(
    m("a   b\nc    d", {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    "a b\nc d",
    "04.01"
  );
});

test(`04.02 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - trailing whitespace on removeIndentations`, t => {
  t.deepEqual(
    m("a   \nb    ", {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    "a\nb",
    "04.02"
  );
});

test(`04.03 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - leading whitespace`, t => {
  t.deepEqual(
    m(
      `



<!DOCTYPE HTML>
<html>
<head>
`,
      {
        removeLineBreaks: false,
        removeIndentations: true
      }
    ).result,
    `<!DOCTYPE HTML>
<html>
<head>
`,
    "04.03"
  );
});

// 05. OTHER API PIECES
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${32}m${`API's defaults`}\u001b[${39}m`} - plain object is exported and contains correct keys`, t => {
  t.deepEqual(
    Object.keys(defaults).sort(),
    [
      "lineLengthLimit",
      "removeIndentations",
      "removeLineBreaks",
      "reportProgressFunc",
      "breakToTheLeftOf"
    ].sort(),
    "05.01"
  );
});

test(`05.02 - ${`\u001b[${32}m${`API's defaults`}\u001b[${39}m`} - plain object is exported`, t => {
  t.regex(version, /\d+\.\d+\.\d+/, "05.02");
});

// 06. opts.breakToTheLeftOf
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${34}m${`opts.breakToTheLeftOf`}\u001b[${39}m`} - breaks based on breakpoints (no whitespace involved)`, t => {
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: false
    }).result,
    `<a><b><c>`,
    "06.01.01 - no linebreak removal"
  );
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: true
    }).result,
    `<a><b><c>`,
    "06.01.02 - default line break removal"
  );
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"]
    }).result,
    `<a>\n<b><c>`,
    "06.01.03 - break in the middle, once"
  );
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.01.04 - break twice"
  );
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<a", "<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.01.05 - don't break in front"
  );
  t.deepEqual(
    m(`\n   \t   \t   <a><b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<a", "<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.01.06 - don't break in front"
  );
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "<y", "<z"]
    }).result,
    `<a><b><c>`,
    "06.01.07"
  );
  t.deepEqual(
    m(`<a><b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: []
    }).result,
    `<a><b><c>`,
    "06.01.08"
  );
  t.deepEqual(
    m(`\n<a>\n  <b>\n  <c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "<y", "<z"]
    }).result,
    `<a><b><c>`,
    "06.01.09"
  );
  t.deepEqual(
    m(`   \t\n  <a>   <b> \n\t     <c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: []
    }).result,
    `<a><b><c>`,
    "06.01.10"
  );
});

test(`06.02 - ${`\u001b[${34}m${`opts.breakToTheLeftOf`}\u001b[${39}m`} - breaks based on breakpoints (whitespace involved)`, t => {
  t.deepEqual(
    m(`<a>\n<b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"]
    }).result,
    `<a>\n<b><c>`,
    "06.02.01"
  );
  t.deepEqual(
    m(`<a> <b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"]
    }).result,
    `<a>\n<b><c>`,
    "06.02.02"
  );
  t.deepEqual(
    m(`<a>  <b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"]
    }).result,
    `<a>\n<b><c>`,
    "06.02.03"
  );
  t.deepEqual(
    m(`<a> \n   \t\t\t   \n <b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"]
    }).result,
    `<a>\n<b><c>`,
    "06.02.04"
  );
  t.deepEqual(
    m(`<a>\n<b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.02.05"
  );
  t.deepEqual(
    m(`<a> <b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.02.06"
  );
  t.deepEqual(
    m(`<a>  <b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.02.07"
  );
  t.deepEqual(
    m(`<a> \n   \t\t\t   \n <b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"]
    }).result,
    `<a>\n<b>\n<c>`,
    "06.02.08"
  );
  t.deepEqual(
    m(`<a>\n<b><c>`, {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "y"]
    }).result,
    `<a><b><c>`,
    "06.02.09 - nothing in given breakpoints is useful"
  );
});

// 07. minification within style tags
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - minimal`, t => {
  t.deepEqual(
    m(`<style>\n\ta {\ndisplay:block;\n}`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block;}`,
    "07.01.01"
  );
  t.deepEqual(
    m(`<style>\na{\ndisplay:block;\n}`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block;}`,
    "07.01.02"
  );
  t.deepEqual(
    m(`<style> \t\t\t      a    {     display:block;     }`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block;}`,
    "07.01.03"
  );
  t.deepEqual(
    m(`<style>a{display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block;}`,
    "07.01.04"
  );
});

test(`07.02 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - spaces`, t => {
  t.deepEqual(
    m(`<style>\na something here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a something here{display:block;}`,
    "07.02.01"
  );
  t.deepEqual(
    m(`<style>\na.something.here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a.something.here{display:block;}`,
    "07.02.02"
  );
  t.deepEqual(
    m(`<style>\na something#here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a something#here{display:block;}`,
    "07.02.03"
  );
  t.deepEqual(
    m(`<style>\na  something#here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a something#here{display:block;}`,
    "07.02.04"
  );
});

test(`07.03 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element > element`, t => {
  t.deepEqual(
    m(`<style>\na>something#here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a>something#here{display:block;}`,
    "07.03.01"
  );
  t.deepEqual(
    m(`<style>\na > something#here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a>something#here{display:block;}`,
    "07.03.02"
  );
  t.deepEqual(
    m(`<style>\na> something#here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a>something#here{display:block;}`,
    "07.03.03"
  );
  t.deepEqual(
    m(`<style>\na> something #here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a>something #here{display:block;}`,
    "07.03.04"
  );
  t.deepEqual(
    m(`<style>\na> something  #here {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a>something #here{display:block;}`,
    "07.03.05"
  );
});

test(`07.04 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element + element`, t => {
  t.deepEqual(
    m(`<style>\na+something#here+there {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a+something#here+there{display:block;}`,
    "07.04.01"
  );
  t.deepEqual(
    m(`<style>\na + something#here + there {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a+something#here+there{display:block;}`,
    "07.04.02"
  );
  t.deepEqual(
    m(`<style>\na + something #here + there {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a+something #here+there{display:block;}`,
    "07.04.03"
  );
  t.deepEqual(
    m(`<style>\na  +  something#here  +  there  {\ndisplay:block;\n}`, {
      removeLineBreaks: true
    }).result,
    `<style>a+something#here+there{display:block;}`,
    "07.04.04"
  );
  t.deepEqual(
    m(
      `<style>\n   a   +    something  #here   +   there   {\n   display: block;   \n}`,
      {
        removeLineBreaks: true
      }
    ).result,
    `<style>a+something #here+there{display:block;}`,
    "07.04.05"
  );
});

test(`07.05 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element ~ element`, t => {
  t.deepEqual(
    m(`<style>\na~something#here~there {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a~something#here~there{display:block;}`,
    "07.05.01"
  );
  t.deepEqual(
    m(`<style>\na ~ something#here ~ there {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a~something#here~there{display:block;}`,
    "07.05.02"
  );
  t.deepEqual(
    m(`<style>\na ~ something #here ~ there {display:block;}`, {
      removeLineBreaks: true
    }).result,
    `<style>a~something #here~there{display:block;}`,
    "07.05.03"
  );
  t.deepEqual(
    m(`<style>\na  ~  something#here  ~  there  {\ndisplay:block;\n}`, {
      removeLineBreaks: true
    }).result,
    `<style>a~something#here~there{display:block;}`,
    "07.05.04"
  );
  t.deepEqual(
    m(
      `<style>\n   a   ~    something  #here   ~   there   {\n   display: block;   \n}`,
      {
        removeLineBreaks: true
      }
    ).result,
    `<style>a~something #here~there{display:block;}`,
    "07.05.05"
  );
});

test(`07.06 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes CSS comments`, t => {
  t.deepEqual(
    m(`<style> a { display:block; } /* TAB STYLES */`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block;}`,
    "07.06.01"
  );
  t.deepEqual(
    m(`<style> a { display:block; } /* TAB STYLES */`, {
      removeLineBreaks: false
    }).result,
    `<style> a { display:block; }`,
    "07.06.02"
  );
});

test(`07.07 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of !important`, t => {
  t.deepEqual(
    m(`<style>\n  a { display:block!important; }`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block!important;}`,
    "07.07.01 - no space"
  );
  t.deepEqual(
    m(`<style>\n  a { display:block !important; }`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block!important;}`,
    "07.07.02 - one space"
  );
  t.deepEqual(
    m(`<style>\n  a { display:block  !important; }`, {
      removeLineBreaks: true
    }).result,
    `<style>a{display:block!important;}`,
    "07.07.03 - two spaces"
  );
  t.deepEqual(
    m(`<style>/*  `, {
      removeLineBreaks: true
    }).result,
    `<style>`,
    "07.07.04 - resembling real life"
  );
});

// test(`07.08 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of <script>`, t => {
//   t.deepEqual(
//     m(
//       `a\n    <script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\n    b`,
//       {
//         removeLineBreaks: false,
//         removeIndentations: false
//       }
//     ).result,
//     `a\n    <script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\n    b`,
//     "07.08.01"
//   );
//   t.deepEqual(
//     m(
//       `a\n<script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\nb`,
//       {
//         removeLineBreaks: false,
//         removeIndentations: true
//       }
//     ).result,
//     `a\n<script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\nb`,
//     "07.08.02"
//   );
//   t.deepEqual(
//     m(
//       `a\n<script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\nb`,
//       {
//         removeLineBreaks: true
//       }
//     ).result,
//     `a <script src="tralala.js">    \n    \t    a  a   \n  \t   </script> b`,
//     "07.08.03"
//   );
// });

// 99. AD-HOC
// -----------------------------------------------------------------------------

test(`99.01 - ${`\u001b[${90}m${`adhoc 1`}\u001b[${39}m`} - a peculiar set of characters`, t => {
  t.deepEqual(
    m("<a>\n<<>", { removeLineBreaks: true }).result,
    "<a><<>",
    "99.01 - a peculiar set of characters"
  );
});

test(`99.02 - ${`\u001b[${90}m${`adhoc 2`}\u001b[${39}m`} - another peculiar set of characters`, t => {
  t.deepEqual(
    m("You&rsquo;ve").result,
    "You&rsquo;ve",
    "99.02 - another peculiar set of characters"
  );
});

test(`99.03 - ${`\u001b[${90}m${`adhoc 3`}\u001b[${39}m`} - yet another peculiar set of chars`, t => {
  t.deepEqual(
    m(
      `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="format-detection" content="telephone=no" />
<meta name="viewport" zzz`,
      {
        removeLineBreaks: true,
        breakToTheLeftOf: []
      }
    ).result,
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]--><meta name="format-detection" content="telephone=no" /><meta
name="viewport" zzz`,
    "99.03 - another peculiar set of characters"
  );
});

test(`99.04 - ${`\u001b[${90}m${`adhoc 4`}\u001b[${39}m`} - result's keyset is consistent`, t => {
  t.is(Object.keys(m("")).length, Object.keys(m("zzz")).length, "99.04");
});

test(`99.05 - ${`\u001b[${90}m${`adhoc 5`}\u001b[${39}m`} - raw non-breaking spaces`, t => {
  t.deepEqual(
    m("\u00A0<a>\n\u00A0\u00A0<b>\u00A0", { removeLineBreaks: true }).result,
    "<a><b>",
    "99.05.01"
  );
  t.deepEqual(
    m("\u00A0<a>\n\u00A0\u00A0<b>\u00A0", { removeLineBreaks: false }).result,
    "<a>\n<b>",
    "99.05.02"
  );
});

test(`99.06 - ${`\u001b[${90}m${`adhoc 5`}\u001b[${39}m`} - raw non-breaking spaces`, t => {
  const chunk = "    <script >   >]] > < div>";
  t.deepEqual(m(chunk, { removeLineBreaks: true }).result, chunk, "99.06.01");
  t.deepEqual(
    m(chunk, {
      removeLineBreaks: false,
      removeIndentations: true
    }).result,
    chunk,
    "99.06.02"
  );
  t.deepEqual(
    m(chunk, {
      removeLineBreaks: false,
      removeIndentations: false
    }).result,
    chunk,
    "99.06.03"
  );
});

// -----------------------------------------------------------------------------
//
//             ▄▄ ▄████▄▐▄▄▄▌
//            ▐  ████▀███▄█▄▌
//          ▐ ▌  █▀▌  ▐▀▌▀█▀ me eatz bugz
//           ▀   ▌ ▌  ▐ ▌
//               ▌ ▌  ▐ ▌
//               █ █  ▐▌█
//        BUGS LISTEN! STAY AWAY!
//           O              O
