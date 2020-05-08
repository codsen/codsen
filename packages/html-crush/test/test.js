import tap from "tap";
import { crush, defaults, version } from "../dist/html-crush.esm";

const m = crush;

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

tap.test(
  `01 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when first arg is wrong`,
  (t) => {
    const err1 = t.throws(() => {
      m();
    });
    t.match(err1.message, /THROW_ID_01/g, "01.01");
    t.match(err1.message, /completely missing/g, "01.02");

    const err2 = t.throws(() => {
      m(true);
    });
    t.match(err2.message, /THROW_ID_02/g, "01.03");
    t.match(err2.message, /boolean/g, "01.04");

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when second arg is wrong`,
  (t) => {
    const err1 = t.throws(() => {
      m("zzz", true);
    });
    t.match(err1.message, /THROW_ID_03/g, "02.01");
    t.match(err1.message, /boolean/g, "02.02");

    const err2 = t.throws(() => {
      m("zzz", "{}");
    });
    t.match(err2.message, /THROW_ID_03/g, "02.03");
    t.match(err2.message, /string/g, "02.04");

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when opts.breakToTheLeftOf contains non-string elements`,
  (t) => {
    const err1 = t.throws(() => {
      m("zzz", {
        breakToTheLeftOf: ["<a", true],
      });
    });
    t.match(err1.message, /THROW_ID_05/gi, "03.01");
    t.match(err1.message, /opts\.breakToTheLeftOf/gi, "03.02");
    t.match(err1.message, /boolean/gi, "03.03");

    // but does not throw when array is false, null or empty:
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: false,
      });
    }, "03.04");
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: null,
      });
    }, "03.05");
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: [],
      });
    }, "03.06");

    t.end();
  }
);

// 01. Small tests
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - deletes trailing space`,
  (t) => {
    t.same(
      m(" <a> \n <b> ", {
        removeLineBreaks: true,
      }).result,
      "<a> <b>",
      "04.01"
    );
    t.same(
      m(" <a>\n<b> ", {
        removeLineBreaks: true,
      }).result,
      "<a>\n<b>",
      "04.02"
    );
    t.same(
      m(" <section> \n <article> ", {
        removeLineBreaks: true,
      }).result,
      "<section><article>",
      "04.03"
    );

    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - retains trailing linebreak`,
  (t) => {
    t.same(
      m(" <a> \n <b> \n", {
        removeLineBreaks: true,
      }).result,
      "<a> <b>\n",
      "05"
    );

    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - trailing line break`,
  (t) => {
    t.same(
      m(" a \n b \n", {
        removeLineBreaks: true,
      }).result,
      "a b\n",
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - multiple line breaks`,
  (t) => {
    t.same(
      m(" a \n b\n\n\nc ", {
        removeLineBreaks: true,
      }).result,
      "a b c",
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - ends with character`,
  (t) => {
    t.same(
      m(" a \n b\n\n\nc", {
        removeLineBreaks: true,
      }).result,
      "a b c",
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  (t) => {
    t.same(
      m("<aa><bb>\t<cc><dd>", { lineLengthLimit: 12, removeLineBreaks: true })
        .result,
      "<aa><bb><cc>\n<dd>",
      "09 - clone of 02.11.09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - what happens when it's impossible to break and exceeding line length limit is inevitable`,
  (t) => {
    t.same(
      m("abc ghijklmnop xyz", { lineLengthLimit: 2, removeLineBreaks: true })
        .result,
      "abc\nghijklmnop\nxyz",
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks lines when limiter is on`,
  (t) => {
    t.same(
      m("aa bb cc\n", {
        lineLengthLimit: 3,
        removeLineBreaks: true,
      }).result,
      "aa\nbb\ncc\n",
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks along with wiping whitespace`,
  (t) => {
    t.same(
      m("aa   \n \t  bb   \n \t    cc", {
        lineLengthLimit: 3,
      }).result,
      "aa\nbb\ncc",
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks unbreakable chunks, each over limit`,
  (t) => {
    t.same(
      m("abcde   \n \t  fghij   \n \t    klmno", {
        lineLengthLimit: 3,
      }).result,
      "abcde\nfghij\nklmno",
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace`,
  (t) => {
    t.same(
      m("    \n    <a>\n\n   <b>\n  <c>", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }).result,
      "<a> <b>\n<c>",
      "14.01 - inline tags"
    );
    t.same(
      m("    \n    <x>\n\n   <y>\n  <z>", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }).result,
      "<x><y>\n<z>",
      "14.02 - not inline tags"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting`,
  (t) => {
    t.same(
      m("  <a>\n     <b>\n   c </b>\n   </a>", {
        lineLengthLimit: 9,
        removeLineBreaks: true,
      }).result,
      "<a> <b> c\n</b></a>",
      "15.01"
    );
    t.same(
      m("  <x>\n     <y>\n   c </y>\n   </x>", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }).result,
      "<x><y> c\n</y></x>",
      "15.02 - not inline tags"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting`,
  (t) => {
    t.same(
      m(
        `  <a>
       <b>
     c </b>
     </a>
       <a>`,
        {
          lineLengthLimit: 9,
          removeLineBreaks: true,
        }
      ).result,
      "<a> <b> c\n</b></a>\n<a>",
      "16.01 - inline tags"
    );
    t.same(
      m(
        `  <x>
       <y>
     c </y>
   </x>
       <x>`,
        {
          lineLengthLimit: 8,
          removeLineBreaks: true,
        }
      ).result,
      "<x><y> c\n</y></x>\n<x>",
      "16.02 - non-inline tags"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 8`,
  (t) => {
    t.same(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 10`,
  (t) => {
    t.same(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 10,
        removeLineBreaks: true,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 14`,
  (t) => {
    t.same(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 14,
        removeLineBreaks: true,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence without whitespace is wrapped`,
  (t) => {
    t.same(
      m("<aa><bb><cc>", { lineLengthLimit: 8, removeLineBreaks: true }).result,
      "<aa><bb>\n<cc>",
      "20 - duplicates 02.10.01"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence completely wrapped`,
  (t) => {
    t.same(
      m("<aa><bb><cc>", { lineLengthLimit: 7, removeLineBreaks: true }).result,
      "<aa>\n<bb>\n<cc>",
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  (t) => {
    t.same(
      m("aaaaaa bbbbbb cccccc", { lineLengthLimit: 13, removeLineBreaks: true })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "clone of 02.05.14"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags, end with character`,
  (t) => {
    t.same(
      m(" <x> \n <y>\n\n\n<z>", {
        removeLineBreaks: true,
      }).result,
      "<x><y><z>",
      "23.01"
    );
    t.same(
      m(" <a> \n <b>\n\n\n<i>\n\n\n<c>", {
        removeLineBreaks: true,
      }).result,
      "<a> <b> <i><c>",
      "23.02"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - comments`,
  (t) => {
    const src = `<!--<![endif]-->`;
    t.same(
      m(src, {
        removeLineBreaks: true,
      }).result,
      src,
      "24"
    );
    t.end();
  }
);

// 02. B.A.U.
// -----------------------------------------------------------------------------

tap.test(
  `25 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - nothing to minify`,
  (t) => {
    t.same(m("").result, "", "25.01");
    t.same(m("zzzz").result, "zzzz", "25.02");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - minimal string of few words`,
  (t) => {
    const source = ` \t
<x>\t\t
  <y>\t
    c\t
  </y>\t
</x>\t
\t
`;

    t.same(
      m(source, { removeLineBreaks: true }).result,
      "<x><y> c </y></x>\n",
      "26.01 - defaults: remove both indentations and linebreaks"
    );

    t.same(
      m(source, { removeLineBreaks: true, removeIndentations: false }).result,
      "<x><y> c </y></x>\n",
      "26.02 - disabling indentation removal while keeping linebreak removal is futile"
    );

    t.equal(
      m(source, { removeLineBreaks: false, removeIndentations: true }).result,
      `<x>
<y>
c
</y>
</x>
`,
      "26.03 - only remove indentations"
    );

    t.equal(
      m(source, { removeLineBreaks: false, removeIndentations: false }).result,
      `
<x>
  <y>
    c
  </y>
</x>
`,
      "26.04 - all off so only trims leading whitespace"
    );

    t.equal(
      m(source, { removeLineBreaks: true, removeIndentations: true }).result,
      `<x><y> c </y></x>
`,
      "26.05 - line breaks on"
    );

    t.equal(
      m(source, { removeLineBreaks: true, removeIndentations: false }).result,
      `<x><y> c </y></x>
`,
      "26.06 - line breaks on"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - trailing linebreaks (or their absence) at the EOF are respected`,
  (t) => {
    // removeLineBreaks: true
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>\n",
      "27.01 - default settings, single trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>\n",
      "27.02 - default settings, double trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>", { removeLineBreaks: true }).result,
      "<x><y> c </y></x>",
      "27.03 - default settings, no trailing line breaks at EOF"
    );

    // removeLineBreaks: false
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>\n",
      "27.04 - default settings, single trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>\n",
      "27.05 - default settings, double trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>",
      "27.06 - default settings, no trailing line breaks at EOF"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - opts.lineLengthLimit`,
  (t) => {
    // the following piece of HTML will render as having spaces between C's:
    const original = `  <x>
     <y>
   c </y>
 </x>
     <x>
     <y>
   c </y>
 </x>
     <x>
     <y>
   c </y>
 </x>\n`;

    // the following piece of HTML will render without spaces between C's:
    const wrong = "<x><y>c</y></x><x><y>c</y></x><x><y>c</y></x>\n";

    const minified = "<x><y> c </y></x><x><y> c </y></x><x><y> c </y></x>\n";

    t.equal(
      m(original, { removeLineBreaks: true }).result,
      minified,
      "28.01 - default settings"
    );
    t.equal(strip(original), strip(minified), "28.02");
    t.not(strip(original), strip(wrong), "02.04.03");

    const minified8 = `<x><y> c
</y></x>
<x><y> c
</y></x>
<x><y> c
</y></x>
`;
    t.equal(
      m(original, {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      minified8,
      "28.03"
    );

    m(original, {
      lineLengthLimit: 8,
    })
      .result.split("\n")
      .forEach((line, i) => {
        // console.log(
        //   `0621: ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
        //     line,
        //     null,
        //     4
        //   )} => ${line.length}`
        // );
        t.ok(line.length <= 8, `row #${i}`);
      });

    // console.log("=====");

    minified8.split("\n").forEach((line, i) => {
      // console.log(
      //   `0634: ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
      //     line,
      //     null,
      //     4
      //   )} => ${line.length}`
      // );
      t.ok(line.length <= 8, `row #${i}`);
    });
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - spaces`,
  (t) => {
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: false, lineLengthLimit: 0 })
        .result,
      "aaaaaa bbbbbb cccccc",
      "29.01-1"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 0 })
        .result,
      "aaaaaa bbbbbb cccccc",
      "29.02-2"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 1 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.03"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 2 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.04"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 3 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.05"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 4 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.06"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 5 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.07"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 6 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.08"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 7 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.09"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.10"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 9 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.11"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 10 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.12"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 11 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.13"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "29.14 - the very edge"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 13 })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "29.15"
    );
    t.same(
      m("aaaaaa  bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "29.16 - double space"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "29.17 - double linebreak"
    );
    t.same(
      m("aaaaaa \n \n bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "29.18 - double linebreak with spaces"
    );
    t.same(
      m("aaaaaa\t\n\t\n\tbbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "29.19 - double linebreak with spaces"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 14 })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "29.20 - two chunks can stay on one line generously"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 15 })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "29.21 - two chunks can stay on one line generously"
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - linebreaks`,
  (t) => {
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.01"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.02"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.03"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.04"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.05"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.06"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.07"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.08"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.09"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.10"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.11"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.12"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.13 - the very edge"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 100,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "30.14"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - double linebreaks`,
  (t) => {
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      "aaaaaa bbbbbb cccccc",
      "31.01"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.02"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.03"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.04"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.05"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.06"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.07"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.08"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.09"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.10"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.11"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.12"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "31.13 - the very edge"
    );
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - tags with single space between them`,
  (t) => {
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 0 })
        .result,
      "<aaaa><bbbb><cccc>",
      "32.01 - same but with tags"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 1 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "32.02 - the very edge"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 2 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "32.03"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 10 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "32.04"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 11 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "32.05"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "32.06"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 13 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "32.07"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 14 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "32.08"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 15 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "32.09"
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking between tags`,
  (t) => {
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
      "<aa><bb>",
      "33.01"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 1 }).result,
      "<aa>\n<bb>",
      "33.02"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 2 }).result,
      "<aa>\n<bb>",
      "33.03"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
      "<aa>\n<bb>",
      "33.04"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 4 }).result,
      "<aa>\n<bb>",
      "33.05"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 5 }).result,
      "<aa>\n<bb>",
      "33.06"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 6 }).result,
      "<aa>\n<bb>",
      "33.07"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 7 }).result,
      "<aa>\n<bb>",
      "33.08"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
      "<aa><bb>",
      "33.09"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 9 }).result,
      "<aa><bb>",
      "33.10"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 10 }).result,
      "<aa><bb>",
      "33.11"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 999 }).result,
      "<aa><bb>",
      "33.12"
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 8`,
  (t) => {
    //
    // line limit 8
    // ============

    // at position at character index 4, the break is staged but never submitted:
    t.same(
      m("<aa><bb><cc>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
      "<aa><bb>\n<cc>",
      "34.01"
    );
    t.same(
      m("<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc><dd>",
      "34.02"
    );

    // same as above, but with whitespace
    t.same(
      m("<aa>\t<bb>\t<cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "34.03"
    );
    t.same(
      m("<aa>\t\t<bb>\t<cc>\t\t<dd>", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "<aa><bb>\n<cc><dd>",
      "34.04"
    );

    // same as above, except with trailing tab
    t.same(
      m("<aa>\t<bb>\t<cc>\t", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "34.05"
    );
    t.same(
      m("<aa>\t\t<bb>\t<cc>\t\t<dd>\t", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "<aa><bb>\n<cc><dd>",
      "34.06"
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 12`,
  (t) => {
    //
    // line limit 12
    // =============

    t.same(
      m("<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "35.01"
    );
    t.same(
      m("<aa><bb><cc><dd><ee>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd><ee>",
      "35.02"
    );
    t.same(
      m("<aa><bb><cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "35.03"
    );
    t.same(
      m("<aa><bb><cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "35.04"
    );

    // tab after first tag:

    t.same(
      m("<aa>\t<bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "35.05"
    );
    t.same(
      m("<aa>\t<bb><cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "35.06"
    );
    t.same(
      m("<aa>\t<bb><cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "35.07"
    );
    t.same(
      m("<aa>\t<bb><cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "35.08"
    );

    // tab after second tag:

    t.same(
      m("<aa><bb>\t<cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "35.09"
    );
    t.same(
      m("<aa><bb>\t<cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "35.10"
    );
    t.same(
      m("<aa><bb>\t<cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "35.11"
    );
    t.same(
      m("<aa><bb>\t<cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "35.12"
    );

    // tab after third tag:

    t.same(
      m("<aa><bb><cc>\t<dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "35.13"
    );
    t.same(
      m("<aa><bb><cc>\t<dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "35.14"
    );
    t.same(
      m("<aa><bb><cc>\t<dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "35.15"
    );
    t.same(
      m("<aa><bb><cc>\t<dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "35.16"
    );
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - script tags are skipped`,
  (t) => {
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      "a <script>\n \t\t   na\n  \tz</script> z",
      "36.01"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "36.02 - default"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "36.03"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "36.04"
    );
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - unfinished script tags are skipped too`,
  (t) => {
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      "a <script>\n \t\t   na\n  \tz    z    ",
      "37.01"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "37.02 - default"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "37.03"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "37.04"
    );
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - code-pre blocks are not touched`,
  (t) => {
    const preBlock = `<pre id="lalalaa"><code class="tralalaa">    \n    \t   zz    z  \n  \t  r  r  \n \t  </code></pre>`;
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      preBlock,
      "38.01"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      preBlock,
      "38.02"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      preBlock,
      "38.03"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      preBlock,
      "38.04"
    );
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - CDATA blocks are not touched`,
  (t) => {
    const preBlock = `<![CDATA[          \n     \t   \n  a  a \r     \n a    \t    \t\t\t\t\t  a   \n     \t\t\t    ]]>`;
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      preBlock,
      "39.01"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      preBlock,
      "39.02"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      preBlock,
      "39.03"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      preBlock,
      "39.04"
    );
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - whitespace in front of </script>`,
  (t) => {
    // 0. baseline - no whitespace in front of </script>
    const code1 = 'a\n<script>const a = "test";</script> b';
    t.same(
      m(code1, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      code1,
      "40.01"
    );
    t.same(
      m(code1, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      code1,
      "40.02"
    );
    t.same(
      m(code1, {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      code1,
      "40.03"
    );
    t.same(
      m(code1, {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      code1,
      "40.04"
    );

    // case 1 - stops at non-whitespace character, ";"
    const code2 = 'a\n<script>const a = "test";   \t   </script> b';
    const minified2 = 'a\n<script>const a = "test";</script> b';
    t.same(
      m(code2, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      code2,
      "40.05"
    );
    t.same(
      m(code2, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      minified2,
      "40.06"
    );
    t.same(
      m(code2, {
        removeLineBreaks: true,
      }).result,
      minified2,
      "40.07"
    );

    // case 2 - stops at line break character
    const code3 = 'a\n<script>const a = "test";   \n   </script> b';
    const minified3 = 'a\n<script>const a = "test";   \n</script> b';
    t.same(
      m(code3, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      code3,
      "40.08"
    );
    t.same(
      m(code3, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      minified3,
      "40.09"
    );
    t.same(
      m(code3, {
        removeLineBreaks: true,
      }).result,
      minified3,
      "40.10"
    );
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - single linebreak is not replaced with a single space`,
  (t) => {
    t.equal(m("a\nb", { removeLineBreaks: true }).result, "a\nb", "41.01");
    t.equal(
      m("a\nb", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
      "a\nb",
      "41.02"
    );
    t.equal(
      m("a\nb", { removeLineBreaks: true, lineLengthLimit: 100 }).result,
      "a\nb",
      "41.03"
    );
    t.equal(
      m("a\nb", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
      "a\nb",
      "41.04"
    );
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - single linebreak is deleted though`,
  (t) => {
    t.equal(
      m("<x>\n<y>", { removeLineBreaks: true }).result,
      "<x><y>",
      "42.01"
    );
    t.equal(
      m("<a>\n<y>", { removeLineBreaks: true }).result,
      "<a><y>",
      "42.02"
    );
    t.equal(
      m("<x>\n<a>", { removeLineBreaks: true }).result,
      "<x>\n<a>",
      "42.03"
    );
    t.equal(
      m("<a>\n<b>", { removeLineBreaks: true }).result,
      "<a>\n<b>",
      "42.04"
    );
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking to the right of style tag`,
  (t) => {
    const source = `<html>
  <head>
    <style type="text/css">
      .used-1 {
        display: block;
      }
    </style>
  </head>
  <body>
    <table class="used-1">
      <tr>
        <td>
          text
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    const res1 = `<html>
<head>
<style type="text/css">
.used-1{display:block;}
</style>
</head>
<body>
<table class="used-1"><tr><td> text
</td></tr></table>
</body>
</html>
`;

    const res2 = `<html>
<head><style type="text/css">.used-1{display:block;}
</style>
</head>
<body>
<table class="used-1"><tr><td> text
</td></tr></table>
</body>
</html>
`;

    const res3 = `<html>
<head><style type="text/css">.used-1{display:block;}</style>
</head>
<body>
<table class="used-1"><tr><td> text
</td></tr></table>
</body>
</html>
`;

    t.equal(m(source, { removeLineBreaks: true }).result, res1, "43.01");
    t.equal(
      m(source, {
        removeLineBreaks: true,
        breakToTheLeftOf: [
          "</td",
          "<html",
          "</html",
          "<head",
          "</head",
          "<meta",
          "<link",
          "<table",
          "<script",
          "</script",
          "<!DOCTYPE",
          "</style", // <---- no opening <style ! only closing !
          "<title",
          "<body",
          "@media",
          "</body",
          "<!--[if",
          "<!--<![endif",
        ],
      }).result,
      res2,
      "43.02"
    );
    t.equal(
      m(source, {
        removeLineBreaks: true,
        breakToTheLeftOf: [
          "</td",
          "<html",
          "</html",
          "<head",
          "</head",
          "<meta",
          "<link",
          "<table",
          "<script",
          "</script",
          "<!DOCTYPE",
          "<title", // <---- no opening/closing style tag!
          "<body",
          "@media",
          "</body",
          "<!--[if",
          "<!--<![endif",
        ],
      }).result,
      res3,
      "43.03"
    );
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - doesn't delete whitespace with linebreaks between curlies`,
  (t) => {
    const source = "{% a %}\n\n\n{% a %}";
    t.equal(m(source, { removeLineBreaks: true }).result, source, "44.01");
    t.equal(
      m(source, { removeLineBreaks: false }).result,
      "{% a %}\n{% a %}",
      "44.02"
    );
    t.end();
  }
);

// 03. opts.reportProgressFunc
// -----------------------------------------------------------------------------

tap.test(
  `45 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - calls the progress function`,
  (t) => {
    function shouldveBeenCalled(val) {
      throw new Error(val);
    }

    let counter = 0;
    const countingFunction = () => {
      // const countingFunction = val => {
      // console.log(`val received: ${val}`);
      counter += 1;
    };

    t.same(m("aaaaaaaaaa").result, "aaaaaaaaaa", "45.01 - default behaviour");
    t.same(
      m("aaaaaaaaaa", { reportProgressFunc: null }).result,
      "aaaaaaaaaa",
      "45.02"
    );
    t.same(
      m("aaaaaaaaaa", { reportProgressFunc: false }).result,
      "aaaaaaaaaa",
      "45.03"
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
    t.match(error1.message, /50/, "45.04");

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
    t.ok(counter > 50, "45.05 - counter called");
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - adjusted from-to range`,
  (t) => {
    const gather = [];
    const countingFunction = (val) => {
      gather.push(val);
    };

    // long input (>1000 chars long) should report at each natural number percentage passed:
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
        {
          removeLineBreaks: true,
          reportProgressFunc: countingFunction,
          reportProgressFuncFrom: 21,
          reportProgressFuncTo: 86,
        }
      )
    );

    // 2. check the counter variable:
    const compareTo = [];
    for (let i = 21; i < 87; i++) {
      compareTo.push(i);
    }
    // since we use Math.floor, some percentages can be skipped, so let's just
    // confirm that no numbers outside of permitted values are reported
    gather.forEach((perc) =>
      t.ok(compareTo.includes(perc), `checking: ${perc}%`)
    );
    t.equal(gather.length, 86 - 21 - 1, "46.01");
    // t.same(gather, compareTo, "03.02")
    t.end();
  }
);

// 04. opts.removeIndentations
// -----------------------------------------------------------------------------

tap.test(
  `47 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - collapses whitespace on removeIndentations`,
  (t) => {
    t.same(
      m("a   b\nc    d", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a b\nc d",
      "47"
    );
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - trailing whitespace on removeIndentations`,
  (t) => {
    t.same(
      m("a   \nb    ", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a\nb",
      "48"
    );
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - leading whitespace`,
  (t) => {
    t.same(
      m(
        `



<!DOCTYPE HTML>
<html>
<head>
`,
        {
          removeLineBreaks: false,
          removeIndentations: true,
        }
      ).result,
      `<!DOCTYPE HTML>
<html>
<head>
`,
      "49"
    );
    t.end();
  }
);

// 05. OTHER API AREAS
// -----------------------------------------------------------------------------

tap.test(
  `50 - ${`\u001b[${32}m${`API's defaults`}\u001b[${39}m`} - plain object is exported and contains correct keys`,
  (t) => {
    t.same(
      Object.keys(defaults).sort(),
      [
        "mindTheInlineTags",
        "lineLengthLimit",
        "removeIndentations",
        "removeLineBreaks",
        "reportProgressFunc",
        "reportProgressFuncFrom",
        "reportProgressFuncTo",
        "breakToTheLeftOf",
      ].sort(),
      "50"
    );
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${32}m${`API's defaults`}\u001b[${39}m`} - plain object is exported`,
  (t) => {
    t.match(version, /\d+\.\d+\.\d+/, "51");
    t.end();
  }
);

// 06. opts.breakToTheLeftOf
// -----------------------------------------------------------------------------

tap.test(
  `52 - ${`\u001b[${34}m${`opts.breakToTheLeftOf`}\u001b[${39}m`} - breaks based on breakpoints (no whitespace involved)`,
  (t) => {
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: false,
      }).result,
      `<m><n><o>`,
      "52.01 - no linebreak removal"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
      }).result,
      `<m><n><o>`,
      "52.02 - default line break removal"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<n"],
      }).result,
      `<m>\n<n><o>`,
      "52.03 - break in the middle, once"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<n", "<o"],
      }).result,
      `<m>\n<n>\n<o>`,
      "52.04 - break twice"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<z", "<n", "<o"],
      }).result,
      `<m>\n<n>\n<o>`,
      "52.05 - don't break in front"
    );
    t.same(
      m(`\n   \t   \t   <m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<m", "<n", "<o"],
      }).result,
      `<m>\n<n>\n<o>`,
      "52.06 - don't break in front"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "<y", "<z"],
      }).result,
      `<m><n><o>`,
      "52.07"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: [],
      }).result,
      `<m><n><o>`,
      "52.08"
    );
    t.same(
      m(`\n<m>\n  <n>\n  <o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "<y", "<z"],
      }).result,
      `<m><n><o>`,
      "52.09"
    );
    t.same(
      m(`   \t\n  <m>   <n> \n\t     <o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: [],
      }).result,
      `<m><n><o>`,
      "52.10"
    );
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${34}m${`opts.breakToTheLeftOf`}\u001b[${39}m`} - breaks based on breakpoints (whitespace involved)`,
  (t) => {
    t.same(
      m(`<a>\n<b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"],
      }).result,
      `<a>\n<b><c>`,
      "53.01"
    );
    t.same(
      m(`<a> <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"],
      }).result,
      `<a>\n<b><c>`,
      "53.02"
    );
    t.same(
      m(`<a>  <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"],
      }).result,
      `<a>\n<b><c>`,
      "53.03"
    );
    t.same(
      m(`<a> \n   \t\t\t   \n <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"],
      }).result,
      `<a>\n<b><c>`,
      "53.04"
    );
    t.same(
      m(`<a>\n<b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"],
      }).result,
      `<a>\n<b>\n<c>`,
      "53.05"
    );
    t.same(
      m(`<a> <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"],
      }).result,
      `<a>\n<b>\n<c>`,
      "53.06"
    );
    t.same(
      m(`<a>  <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"],
      }).result,
      `<a>\n<b>\n<c>`,
      "53.07"
    );
    t.same(
      m(`<a> \n   \t\t\t   \n <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"],
      }).result,
      `<a>\n<b>\n<c>`,
      "53.08"
    );
    t.same(
      m(`<a>\n<b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "y"],
      }).result,
      `<a>\n<b><c>`,
      "53.09 - nothing in given breakpoints is useful"
    );
    t.same(
      m(`<m>\n<n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "y"],
      }).result,
      `<m><n><o>`,
      "53.10"
    );
    t.end();
  }
);

// 07. minification within style tags
// -----------------------------------------------------------------------------

tap.test(
  `54 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - minimal`,
  (t) => {
    t.same(
      m(`<style>\n\ta {\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "54.01"
    );
    t.same(
      m(`<style>\na{\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "54.02"
    );
    t.same(
      m(`<style> \t\t\t      a    {     display:block;     }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "54.03"
    );
    t.same(
      m(`<style>a{display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "54.04"
    );
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - spaces`,
  (t) => {
    t.same(
      m(`<style>\na something here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a something here{display:block;}`,
      "55.01"
    );
    t.same(
      m(`<style>\na.something.here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a.something.here{display:block;}`,
      "55.02"
    );
    t.same(
      m(`<style>\na something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a something#here{display:block;}`,
      "55.03"
    );
    t.same(
      m(`<style>\na  something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a something#here{display:block;}`,
      "55.04"
    );
    t.end();
  }
);

tap.test(
  `56 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element > element`,
  (t) => {
    t.same(
      m(`<style>\na>something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something#here{display:block;}`,
      "56.01"
    );
    t.same(
      m(`<style>\na > something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something#here{display:block;}`,
      "56.02"
    );
    t.same(
      m(`<style>\na> something#here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something#here{display:block;}`,
      "56.03"
    );
    t.same(
      m(`<style>\na> something #here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something #here{display:block;}`,
      "56.04"
    );
    t.same(
      m(`<style>\na> something  #here {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a>something #here{display:block;}`,
      "56.05"
    );
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element + element`,
  (t) => {
    t.same(
      m(`<style>\na+something#here+there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "57.01"
    );
    t.same(
      m(`<style>\na + something#here + there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "57.02"
    );
    t.same(
      m(`<style>\na + something #here + there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something #here+there{display:block;}`,
      "57.03"
    );
    t.same(
      m(`<style>\na  +  something#here  +  there  {\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "57.04"
    );
    t.same(
      m(
        `<style>\n   a   +    something  #here   +   there   {\n   display: block;   \n}`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<style>a+something #here+there{display:block;}`,
      "57.05"
    );
    t.end();
  }
);

tap.test(
  `58 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element ~ element`,
  (t) => {
    t.same(
      m(`<style>\na~something#here~there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "58.01"
    );
    t.same(
      m(`<style>\na ~ something#here ~ there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "58.02"
    );
    t.same(
      m(`<style>\na ~ something #here ~ there {display:block;}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something #here~there{display:block;}`,
      "58.03"
    );
    t.same(
      m(`<style>\na  ~  something#here  ~  there  {\ndisplay:block;\n}`, {
        removeLineBreaks: true,
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "58.04"
    );
    t.same(
      m(
        `<style>\n   a   ~    something  #here   ~   there   {\n   display: block;   \n}`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<style>a~something #here~there{display:block;}`,
      "58.05"
    );
    t.end();
  }
);

tap.test(
  `59 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes CSS comments`,
  (t) => {
    t.same(
      m(`<style> a { display:block; } /* TAB STYLES */`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block;}`,
      "59.01"
    );
    t.same(
      m(`<style> a { display:block; } /* TAB STYLES */`, {
        removeLineBreaks: false,
      }).result,
      `<style> a { display:block; }`,
      "59.02"
    );
    t.end();
  }
);

tap.test(
  `60 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of !important`,
  (t) => {
    t.same(
      m(`<style>\n  a { display:block!important; }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block!important;}`,
      "60.01 - no space"
    );
    t.same(
      m(`<style>\n  a { display:block !important; }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block!important;}`,
      "60.02 - one space"
    );
    t.same(
      m(`<style>\n  a { display:block  !important; }`, {
        removeLineBreaks: true,
      }).result,
      `<style>a{display:block!important;}`,
      "60.03 - two spaces"
    );
    t.same(
      m(`<style>/*  `, {
        removeLineBreaks: true,
      }).result,
      `<style>`,
      "60.04 - resembling real life"
    );
    t.end();
  }
);

tap.test(
  `61 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of <script>`,
  (t) => {
    const source =
      'a\n    <script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\n    b';

    t.same(
      m(source, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      source,
      "61.01"
    );
    t.same(
      m(source, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script>\nb',
      "61.02"
    );
    t.same(
      m(source, {
        removeLineBreaks: true,
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
      "61.03"
    );
    t.same(
      m(source, {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
      "61.04"
    );
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals`,
  (t) => {
    t.same(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`,
      "62"
    );
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, lineLengthLimit=off`,
  (t) => {
    t.same(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`,
      "63"
    );
    t.end();
  }
);

tap.test(
  `64 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix`,
  (t) => {
    t.same(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>`,
      "64"
    );
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix, lineLengthLimit=off`,
  (t) => {
    t.same(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0,
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>`,
      "65"
    );
    t.end();
  }
);

// 08. inline CSS minification
// -----------------------------------------------------------------------------

tap.test(
  `66 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - one tag, minimal - double quotes`,
  (t) => {
    const input1 = `  <a style="a: 100%; b: c-d; ">`;
    const indentationsOnly = `<a style="a: 100%; b: c-d; ">`;
    t.same(
      m(input1, {
        removeLineBreaks: true,
      }).result,
      `<a style="a:100%;b:c-d;">`,
      "66.01"
    );
    t.same(
      m(input1, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      `<a style="a:100%;b:c-d;">`,
      "66.02"
    );
    t.same(
      m(input1, {
        removeLineBreaks: false,
      }).result,
      indentationsOnly,
      "66.03 - indentations are removed on default settings"
    );
    t.same(
      m(input1, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      input1,
      "66.04 - indentations off"
    );
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - inline CSS comments`,
  (t) => {
    t.same(
      m(`<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
      }).result,
      `<a style="a:100%;e:f;">`,
      "67"
    );
    t.end();
  }
);

tap.test(
  `68 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - line length limit falls in the middle of inline CSS comment`,
  (t) => {
    t.same(
      m(`<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
        lineLengthLimit: 18,
      }).result,
      `<a style="a:100%;\ne:f;">`,
      "68"
    );
    t.end();
  }
);

tap.test(
  `69 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - line length becomes all right because of truncation`,
  (t) => {
    t.same(
      m(`<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
        lineLengthLimit: 30,
      }).result,
      `<a style="a:100%;e:f;">`,
      "69 - deletion makes it to be within a limit"
    );
    t.end();
  }
);

tap.test(
  `70 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - leading whitespace inside double quotes`,
  (t) => {
    t.same(
      m(`<a href="zzz" style=" font-size: 1px; ">`, {
        removeLineBreaks: true,
      }).result,
      `<a href="zzz" style="font-size:1px;">`,
      "70"
    );
    t.end();
  }
);

tap.test(
  `71 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - leading whitespace inside single quotes`,
  (t) => {
    t.same(
      m(`<a href='zzz' style=' font-size: 1px; '>`, {
        removeLineBreaks: true,
      }).result,
      `<a href='zzz' style='font-size:1px;'>`,
      "71"
    );
    t.end();
  }
);

// 09. Inline tags
// -----------------------------------------------------------------------------

tap.test(
  `72 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style on sup #1`,
  (t) => {
    t.same(
      m(`<sup style="">word, here`, {
        removeLineBreaks: true,
      }).result,
      `<sup style="">word, here`,
      "72"
    );
    t.end();
  }
);

tap.test(
  `73 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style on sup #2`,
  (t) => {
    t.same(
      m(`<sup style=" ">word, here`, {
        removeLineBreaks: true,
      }).result,
      `<sup style="">word, here`,
      "73"
    );
    t.end();
  }
);

tap.test(
  `74 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans with space - space retained`,
  (t) => {
    t.same(
      m(`<span>a</span> <span>b</span>`, {
        removeLineBreaks: true,
      }).result,
      `<span>a</span> <span>b</span>`,
      "74"
    );
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans without space - fine`,
  (t) => {
    t.same(
      m(`<span>a</span><span>b</span>`, {
        removeLineBreaks: true,
      }).result,
      `<span>a</span><span>b</span>`,
      "75"
    );
    t.end();
  }
);

tap.test(
  `76 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - inside tag`,
  (t) => {
    t.same(
      m(`</b >`, {
        removeLineBreaks: true,
      }).result,
      `</b>`,
      "76"
    );
    t.end();
  }
);

tap.test(
  `77 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - nameless attr`,
  (t) => {
    t.same(
      m(`x<a b="c" >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a b="c">y`,
      "77.01"
    );
    t.same(
      m(`x<a b="c" />y`, {
        removeLineBreaks: true,
      }).result,
      `x<a b="c"/>y`,
      "77.02"
    );
    t.end();
  }
);

tap.test(
  `78 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style attr`,
  (t) => {
    t.same(
      m(`x<span style="a: b;" >y`, {
        removeLineBreaks: true,
      }).result,
      `x<span style="a:b;">y`,
      "78.01"
    );
    t.same(
      m(`x<span style="a: b;" >y`, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      `x<span style="a:b;">y`,
      "78.02"
    );
    t.end();
  }
);

tap.test(
  `79 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans`,
  (t) => {
    t.same(
      m(`<span style="abc: def;" >a</span> <span style="abc: def;" >b</span>`, {
        removeLineBreaks: true,
      }).result,
      `<span style="abc:def;">a</span> <span style="abc:def;">b</span>`,
      "79.01"
    );
    t.same(
      m(
        `<span style="abc: def;" />a</span> <span style="abc: def;" />b</span>`,
        {
          removeLineBreaks: true,
        }
      ).result,
      `<span style="abc:def;"/>a</span> <span style="abc:def;"/>b</span>`,
      "79.02"
    );
    t.same(
      m(
        `<span style="abc: def;" />a</span> <span style="abc: def;" />b</span>`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0,
        }
      ).result,
      `<span style="abc:def;"/>a</span> <span style="abc:def;"/>b</span>`,
      "79.03"
    );
    t.end();
  }
);

tap.test(
  `80 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - span + sup`,
  (t) => {
    t.same(
      m(`<span style="abc: def;">a</span> <sup>1</sup>`, {
        removeLineBreaks: true,
      }).result,
      `<span style="abc:def;">a</span> <sup>1</sup>`,
      "80.01"
    );
    t.same(
      m(`<span style="abc: def;">a</span> <sup>1</sup>`, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      `<span style="abc:def;">a</span> <sup>1</sup>`,
      "80.02"
    );
    t.end();
  }
);

tap.test(
  `81 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - won't line break between two inline tags`,
  (t) => {
    for (let i = 1; i < 37; i++) {
      t.same(
        m(`<span>a</span><span style="z">b</span>`, {
          lineLengthLimit: i,
          removeLineBreaks: true,
        }).result,
        `<span>a</span><span\nstyle="z">b</span>`,
        `09.11.0${i} - limit = ${i}`
      );
    }
    t.end();
  }
);

tap.test(
  `82 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - 012 pt.2`,
  (t) => {
    t.same(
      m(`<i><span>a</span><span style="z">b</span></i>`, {
        lineLengthLimit: 22,
        removeLineBreaks: true,
      }).result,
      `<i><span>a</span><span\nstyle="z">b</span></i>`,
      "82"
    );
    t.end();
  }
);

tap.test(
  `83 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed #1`,
  (t) => {
    t.same(
      m(`<i>a</i><span>b</span>`, {
        lineLengthLimit: 9, // <--- asking to break after /i
        removeLineBreaks: true,
      }).result,
      `<i>a</i><span>b</span>`,
      "83.01"
    );
    t.same(
      m(`<i>a</i><y>b</y>`, {
        lineLengthLimit: 9, // <--- asking to break after /i
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<y>b</y>`,
      "83.02"
    );
    t.end();
  }
);

tap.test(
  `84 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, #2`,
  (t) => {
    t.same(
      m(`<span>a</span><div>b</div>`, {
        lineLengthLimit: 15, // <--- asking to break after div
        removeLineBreaks: true,
      }).result,
      `<span>a</span>\n<div>b</div>`,
      "84"
    );
    t.end();
  }
);

tap.test(
  `85 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, space, #1`,
  (t) => {
    t.same(
      m(`<span>a</span> <div>b</div>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true,
      }).result,
      `<span>a</span>\n<div>b</div>`,
      "85.01"
    );
    t.same(
      m(`<span>a</span> <div>b</div>`, {
        lineLengthLimit: 0,
        removeLineBreaks: true,
      }).result,
      `<span>a</span><div>b</div>`,
      "85.02"
    );
    t.end();
  }
);

tap.test(
  `86 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, space, #2`,
  (t) => {
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 12,
        removeLineBreaks: true,
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "86.01"
    );
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 13,
        removeLineBreaks: true,
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "86.02"
    );
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 14,
        removeLineBreaks: true,
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "86.03"
    );
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true,
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "86.04"
    );
    t.same(
      m(`123456789012 <span>b</span>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true,
      }).result,
      `123456789012\n<span>b</span>`,
      "86.05"
    );
    t.end();
  }
);

tap.test(
  `87 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - space between inline tags`,
  (t) => {
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 6,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.01"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 7,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.02"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.03"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 9,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.04"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 10,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.05"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 11,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.06"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 12,
        removeLineBreaks: true,
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "87.07"
    );
    t.end();
  }
);

tap.test(
  `88 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - excessive whitespace between inline tags #1`,
  (t) => {
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        removeLineBreaks: true,
      }).result,
      `<i>a</i> <sup>b</sup>`,
      "88.01"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 6,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.02"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 7,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.03"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.04"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 9,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.05"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 10,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.06"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 12,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.07"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 13,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.08"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 14,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.09"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true,
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "88.10"
    );
    t.end();
  }
);

tap.test(
  `89 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup`,
  (t) => {
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        removeLineBreaks: true,
      }).result,
      `<div>a</div> <sup>b</sup>`,
      "89.01"
    );
    t.same(
      m(`<div>a</div><sup>b</sup>`, {
        removeLineBreaks: true,
      }).result,
      `<div>a</div><sup>b</sup>`,
      "89.02"
    );
    t.end();
  }
);

tap.test(
  `90 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup, escessive whitespace`,
  (t) => {
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: 10,
        removeLineBreaks: true,
      }).result,
      `<div>a</div>\n<sup>b</sup>`,
      "90"
    );
    t.end();
  }
);

tap.test(
  `91 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup, escessive whitespace`,
  (t) => {
    for (let i = 10; i < 25; i++) {
      t.same(
        m(`<div>a</div>     <sup>b</sup>`, {
          lineLengthLimit: i,
          removeLineBreaks: true,
        }).result,
        `<div>a</div>\n<sup>b</sup>`,
        `09.21.01 - limit = ${i}`
      );
    }
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: 99,
        removeLineBreaks: true,
      }).result,
      `<div>a</div> <sup>b</sup>`,
      "91.01"
    );
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: 0,
        removeLineBreaks: true,
      }).result,
      `<div>a</div> <sup>b</sup>`,
      "91.02"
    );
    t.end();
  }
);

tap.test(
  `92 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - multiple wrapped inline tags`,
  (t) => {
    const source = `<span><a href="z"><b>a</b><i>b</i><a><span>`;
    const res = `<span><a\nhref="z"><b>a</b><i>b</i><a><span>`;
    t.same(
      m(source, {
        removeLineBreaks: false,
      }).result,
      source,
      "92.01"
    );
    t.same(
      m(source, {
        removeLineBreaks: true,
      }).result,
      source,
      "92.02"
    );
    for (let i = 1; i < 42; i++) {
      t.same(
        m(source, {
          lineLengthLimit: i,
          removeLineBreaks: true,
        }).result,
        res,
        `09.22.03* - lineLengthLimit: i = ${i}`
      );
    }
    t.end();
  }
);

tap.test(
  `93 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - first tag name letters resemble legit inline tags`,
  (t) => {
    t.same(
      m(`<az>123</az> <by>456</by> <see>789</see> <in></in>`, {
        removeLineBreaks: true,
      }).result,
      `<az>123</az><by>456</by><see>789</see><in></in>`,
      "93.01"
    );
    t.same(
      m(`<az>123</az> <by>456</by> <see>789</see> <in></in>`, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      `<az>123</az><by>456</by><see>789</see><in></in>`,
      "93.02"
    );
    t.end();
  }
);

tap.test(
  `94 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - spanner is not span`,
  (t) => {
    t.same(
      m(`<span>1</span> <span>2</span> <span>3</span>`, {
        removeLineBreaks: true,
      }).result,
      `<span>1</span> <span>2</span> <span>3</span>`,
      "94.01"
    );
    t.same(
      m(`<spanner>1</spanner> <spanner>2</spanner> <spanner>3</spanner>`, {
        removeLineBreaks: true,
      }).result,
      `<spanner>1</spanner><spanner>2</spanner><spanner>3</spanner>`,
      "94.02"
    );
    t.same(
      m(`<spa n="m">1</spa> <spa n="m">2</spa> <spa n="m">3</spa>`, {
        removeLineBreaks: true,
      }).result,
      `<spa n="m">1</spa><spa n="m">2</spa><spa n="m">3</spa>`,
      "94.03 - insurance against whitespace-hungry matching components"
    );
    t.end();
  }
);

// 10. whitespace around tag brackets, inside tag
// -----------------------------------------------------------------------------

tap.test(
  `95 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - whitespace before closing bracket on opening tag`,
  (t) => {
    t.same(
      m(`x<a >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a>y`,
      "95.01"
    );
    t.same(
      m(`x<a > y`, {
        removeLineBreaks: true,
      }).result,
      `x<a> y`,
      "95.02"
    );
    t.same(
      m(`x<a>y`, {
        removeLineBreaks: true,
      }).result,
      `x<a>y`,
      "95.03"
    );
    t.end();
  }
);

tap.test(
  `96 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - div - block level`,
  (t) => {
    t.same(
      m(`x<div >y`, {
        removeLineBreaks: true,
      }).result,
      `x<div>y`,
      "96"
    );
    t.end();
  }
);

tap.test(
  `97 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - a - inline tag`,
  (t) => {
    t.same(
      m(`x<a >y`, {
        removeLineBreaks: false,
      }).result,
      `x<a>y`,
      "97"
    );
    t.end();
  }
);

tap.test(
  `98 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - removeLineBreaks = off`,
  (t) => {
    t.same(
      m(`x<div >y`, {
        removeLineBreaks: false,
      }).result,
      `x<div>y`,
      "98"
    );
    t.end();
  }
);

tap.test(
  `99 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - all opts off, inline tag`,
  (t) => {
    t.same(
      m(`x<a >y`, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      `x<a>y`,
      "99"
    );
    t.end();
  }
);

tap.test(
  `100 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - all opts off, block level tag`,
  (t) => {
    t.same(
      m(`x<div >y`, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      `x<div>y`,
      "100"
    );
    t.end();
  }
);

tap.test(
  `101 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - before closing slash`,
  (t) => {
    t.same(
      m(`x<a />y`, {
        removeLineBreaks: true,
      }).result,
      `x<a/>y`,
      "101"
    );
    t.end();
  }
);

tap.test(
  `102 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - after closing slash`,
  (t) => {
    t.same(
      m(`x<a/ >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a/>y`,
      "102"
    );
    t.end();
  }
);

tap.test(
  `103 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - around closing slash`,
  (t) => {
    t.same(
      m(`x<a / >y`, {
        removeLineBreaks: true,
      }).result,
      `x<a/>y`,
      "103"
    );
    t.end();
  }
);

tap.test(
  `104 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - around closing slash - non inline tag`,
  (t) => {
    t.same(
      m(`x<div / >y`, {
        removeLineBreaks: true,
      }).result,
      `x<div/>y`,
      "104"
    );
    t.end();
  }
);

// 99. AD-HOC
// -----------------------------------------------------------------------------

tap.test(
  `105 - ${`\u001b[${90}m${`adhoc 1`}\u001b[${39}m`} - a peculiar set of characters`,
  (t) => {
    t.same(
      m("<a>\n<<>", { removeLineBreaks: true }).result,
      "<a><<>",
      "105 - a peculiar set of characters"
    );
    t.end();
  }
);

tap.test(
  `106 - ${`\u001b[${90}m${`adhoc 2`}\u001b[${39}m`} - another peculiar set of characters`,
  (t) => {
    t.same(
      m("You&rsquo;ve").result,
      "You&rsquo;ve",
      "106 - another peculiar set of characters"
    );
    t.end();
  }
);

tap.test(
  `107 - ${`\u001b[${90}m${`adhoc 3`}\u001b[${39}m`} - yet another peculiar set of chars`,
  (t) => {
    const input = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="format-detection" content="telephone=no" />
<meta name="viewport" zzz`;
    const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en" xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"/><!--<![endif]--><meta name="format-detection" content="telephone=no"/><meta name="viewport" zzz`;
    t.same(
      m(input, {
        removeLineBreaks: true,
        breakToTheLeftOf: [],
      }).result,
      output,
      "107 - another peculiar set of characters"
    );
    t.end();
  }
);

tap.test(
  `108 - ${`\u001b[${90}m${`adhoc 4`}\u001b[${39}m`} - result's keyset is consistent`,
  (t) => {
    t.equal(Object.keys(m("")).length, Object.keys(m("zzz")).length, "108");
    t.end();
  }
);

tap.test(
  `109 - ${`\u001b[${90}m${`adhoc 5`}\u001b[${39}m`} - raw non-breaking spaces`,
  (t) => {
    t.same(
      m("\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: true }).result,
      "<x><y>",
      "109.01"
    );
    t.same(
      m("\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: false }).result,
      "<x>\n<y>",
      "109.02"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: true })
        .result,
      "<x/><y/>",
      "109.03"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: false })
        .result,
      "<x/>\n<y/>",
      "109.04"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
        .result,
      "<x/></y>",
      "109.05"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
        .result,
      "<x/>\n</y>",
      "109.06"
    );
    t.same(
      m("\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
        .result,
      "</x></y>",
      "109.07"
    );
    t.same(
      m("\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
        .result,
      "</x>\n</y>",
      "109.08"
    );
    t.end();
  }
);

tap.test(
  `110 - ${`\u001b[${90}m${`adhoc 6`}\u001b[${39}m`} - raw non-breaking spaces`,
  (t) => {
    const chunk = "    <script >   >]] > < div>";
    const res = "<script >   >]] > < div>";
    t.same(m(chunk, { removeLineBreaks: true }).result, res, "110.01");
    t.same(
      m(chunk, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      res,
      "110.02"
    );
    t.same(
      m(chunk, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      chunk,
      "110.03"
    );
    t.end();
  }
);

tap.test(
  `111 - ${`\u001b[${90}m${`adhoc 7`}\u001b[${39}m`} - line length control`,
  (t) => {
    const input = `<m>
<n>
<o>
<p>
<x
y
z>
<t>
<x>
<y>
<z klm`;
    const output = `<m><n><o><p><x
y
z><t><x><y><z klm`;
    t.same(
      m(input, {
        lineLengthLimit: 20,
        removeLineBreaks: true,
        breakToTheLeftOf: [],
      }).result,
      output,
      "111"
    );
    t.end();
  }
);

tap.test(
  `112 - ${`\u001b[${90}m${`adhoc 8`}\u001b[${39}m`} - nunjucks`,
  (t) => {
    t.same(
      m("{%- length > 1 or length > 2 -%}", {
        removeLineBreaks: true,
      }).result,
      "{%- length > 1 or length > 2 -%}",
      "112"
    );
    t.end();
  }
);

tap.test(
  `113 - ${`\u001b[${90}m${`adhoc 9`}\u001b[${39}m`} - nunjucks`,
  (t) => {
    const source =
      '{%- if (((not a.b) and (a.b | c("d") | e > 1)) or ((a.b) and (a.f | c("d") | e > 2))) -%}';
    t.same(
      m(source, {
        removeLineBreaks: true,
      }).result,
      source,
      "113"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
//
//             ▄▄ ▄████▄▐▄▄▄▌
//            ▐  ████▀███▄█▄▌
//          ▐ ▌  █▀▌  ▐▀▌▀█▀ me eatz bugz
//           ▀   ▌ ▌  ▐ ▌
//               ▌ ▌  ▐ ▌
//               █ █  ▐▌█
//               BUGS LISTEN! STAY AWAY!
