const t = require("tap");
const { crush, defaults, version } = require("../dist/html-crush.cjs");
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

t.test(
  `00.01 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when first arg is wrong`,
  t => {
    const err1 = t.throws(() => {
      m();
    });
    t.match(err1.message, /THROW_ID_01/g);
    t.match(err1.message, /completely missing/g);

    const err2 = t.throws(() => {
      m(true);
    });
    t.match(err2.message, /THROW_ID_02/g);
    t.match(err2.message, /boolean/g);

    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when second arg is wrong`,
  t => {
    const err1 = t.throws(() => {
      m("zzz", true);
    });
    t.match(err1.message, /THROW_ID_03/g);
    t.match(err1.message, /boolean/g);

    const err2 = t.throws(() => {
      m("zzz", "{}");
    });
    t.match(err2.message, /THROW_ID_03/g);
    t.match(err2.message, /string/g);

    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${34}m${`throws`}\u001b[${39}m`} - when opts.breakToTheLeftOf contains non-string elements`,
  t => {
    const err1 = t.throws(() => {
      m("zzz", {
        breakToTheLeftOf: ["<a", true]
      });
    });
    t.match(err1.message, /THROW_ID_05/gi);
    t.match(err1.message, /opts\.breakToTheLeftOf/gi);
    t.match(err1.message, /boolean/gi);

    // but does not throw when array is false, null or empty:
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: false
      });
    });
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: null
      });
    });
    t.doesNotThrow(() => {
      m("zzz", {
        breakToTheLeftOf: []
      });
    });

    t.end();
  }
);

// 01. Small tests
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - deletes trailing space`,
  t => {
    t.same(
      m(" <a> \n <b> ", {
        removeLineBreaks: true
      }).result,
      "<a> <b>",
      "01.01.01"
    );
    t.same(
      m(" <a>\n<b> ", {
        removeLineBreaks: true
      }).result,
      "<a>\n<b>",
      "01.01.02"
    );
    t.same(
      m(" <section> \n <article> ", {
        removeLineBreaks: true
      }).result,
      "<section><article>",
      "01.01.03"
    );

    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - retains trailing linebreak`,
  t => {
    t.same(
      m(" <a> \n <b> \n", {
        removeLineBreaks: true
      }).result,
      "<a> <b>\n",
      "01.02.01"
    );

    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - trailing line break`,
  t => {
    t.same(
      m(" a \n b \n", {
        removeLineBreaks: true
      }).result,
      "a b\n",
      "01.03"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - multiple line breaks`,
  t => {
    t.same(
      m(" a \n b\n\n\nc ", {
        removeLineBreaks: true
      }).result,
      "a b c",
      "01.04"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - ends with character`,
  t => {
    t.same(
      m(" a \n b\n\n\nc", {
        removeLineBreaks: true
      }).result,
      "a b c",
      "01.05"
    );
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  t => {
    t.same(
      m("<aa><bb>\t<cc><dd>", { lineLengthLimit: 12, removeLineBreaks: true })
        .result,
      "<aa><bb><cc>\n<dd>",
      "01.06 - clone of 02.11.09"
    );
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - what happens when it's impossible to break and exceeding line length limit is inevitable`,
  t => {
    t.same(
      m("abc ghijklmnop xyz", { lineLengthLimit: 2, removeLineBreaks: true })
        .result,
      "abc\nghijklmnop\nxyz",
      "01.07"
    );
    t.end();
  }
);

t.test(
  `01.08 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks lines when limiter is on`,
  t => {
    t.same(
      m("aa bb cc\n", {
        lineLengthLimit: 3,
        removeLineBreaks: true
      }).result,
      "aa\nbb\ncc\n",
      "01.08"
    );
    t.end();
  }
);

t.test(
  `01.09 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks along with wiping whitespace`,
  t => {
    t.same(
      m("aa   \n \t  bb   \n \t    cc", {
        lineLengthLimit: 3
      }).result,
      "aa\nbb\ncc",
      "01.09"
    );
    t.end();
  }
);

t.test(
  `01.10 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks unbreakable chunks, each over limit`,
  t => {
    t.same(
      m("abcde   \n \t  fghij   \n \t    klmno", {
        lineLengthLimit: 3
      }).result,
      "abcde\nfghij\nklmno",
      "01.10"
    );
    t.end();
  }
);

t.test(
  `01.11 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace`,
  t => {
    t.same(
      m("    \n    <a>\n\n   <b>\n  <c>", {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }).result,
      "<a> <b>\n<c>",
      "01.11.01 - inline tags"
    );
    t.same(
      m("    \n    <x>\n\n   <y>\n  <z>", {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }).result,
      "<x><y>\n<z>",
      "01.11.02 - not inline tags"
    );
    t.end();
  }
);

t.test(
  `01.12 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting`,
  t => {
    t.same(
      m("  <a>\n     <b>\n   c </b>\n   </a>", {
        lineLengthLimit: 9,
        removeLineBreaks: true
      }).result,
      "<a> <b> c\n</b></a>",
      "01.12.01"
    );
    t.same(
      m("  <x>\n     <y>\n   c </y>\n   </x>", {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }).result,
      "<x><y> c\n</y></x>",
      "01.12.02 - not inline tags"
    );
    t.end();
  }
);

t.test(
  `01.13 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting`,
  t => {
    t.same(
      m(
        `  <a>
       <b>
     c </b>
     </a>
       <a>`,
        {
          lineLengthLimit: 9,
          removeLineBreaks: true
        }
      ).result,
      "<a> <b> c\n</b></a>\n<a>",
      "01.13.01 - inline tags"
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
          removeLineBreaks: true
        }
      ).result,
      "<x><y> c\n</y></x>\n<x>",
      "01.13.02 - non-inline tags"
    );
    t.end();
  }
);

t.test(
  `01.14 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 8`,
  t => {
    t.same(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "01.14"
    );
    t.end();
  }
);

t.test(
  `01.15 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 10`,
  t => {
    t.same(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 10,
        removeLineBreaks: true
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "01.15"
    );
    t.end();
  }
);

t.test(
  `01.16 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 14`,
  t => {
    t.same(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 14,
        removeLineBreaks: true
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "01.16"
    );
    t.end();
  }
);

t.test(
  `01.17 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence without whitespace is wrapped`,
  t => {
    t.same(
      m("<aa><bb><cc>", { lineLengthLimit: 8, removeLineBreaks: true }).result,
      "<aa><bb>\n<cc>",
      "01.17 - duplicates 02.10.01"
    );
    t.end();
  }
);

t.test(
  `01.18 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence completely wrapped`,
  t => {
    t.same(
      m("<aa><bb><cc>", { lineLengthLimit: 7, removeLineBreaks: true }).result,
      "<aa>\n<bb>\n<cc>",
      "01.18"
    );
    t.end();
  }
);

t.test(
  `01.19 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  t => {
    t.same(
      m("aaaaaa bbbbbb cccccc", { lineLengthLimit: 13, removeLineBreaks: true })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "clone of 02.05.14"
    );
    t.end();
  }
);

t.test(
  `01.20 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags, end with character`,
  t => {
    t.same(
      m(" <x> \n <y>\n\n\n<z>", {
        removeLineBreaks: true
      }).result,
      "<x><y><z>",
      "01.20.01"
    );
    t.same(
      m(" <a> \n <b>\n\n\n<i>\n\n\n<c>", {
        removeLineBreaks: true
      }).result,
      "<a> <b> <i><c>",
      "01.20.02"
    );
    t.end();
  }
);

t.test(
  `01.21 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - comments`,
  t => {
    const src = `<!--<![endif]-->`;
    t.same(
      m(src, {
        removeLineBreaks: true
      }).result,
      src,
      "01.21.01"
    );
    t.end();
  }
);

// 02. B.A.U.
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - nothing to minify`,
  t => {
    t.same(m("").result, "", "02.01.01");
    t.same(m("zzzz").result, "zzzz", "02.01.02");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - minimal string of few words`,
  t => {
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
      "02.02.01 - defaults: remove both indentations and linebreaks"
    );

    t.same(
      m(source, { removeLineBreaks: true, removeIndentations: false }).result,
      "<x><y> c </y></x>\n",
      "02.02.02 - disabling indentation removal while keeping linebreak removal is futile"
    );

    t.equal(
      m(source, { removeLineBreaks: false, removeIndentations: true }).result,
      `<x>
<y>
c
</y>
</x>
`,
      "02.02.03 - only remove indentations"
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
      "02.02.04 - all off so only trims leading whitespace"
    );

    t.equal(
      m(source, { removeLineBreaks: true, removeIndentations: true }).result,
      `<x><y> c </y></x>
`,
      "02.02.05 - line breaks on"
    );

    t.equal(
      m(source, { removeLineBreaks: true, removeIndentations: false }).result,
      `<x><y> c </y></x>
`,
      "02.02.06 - line breaks on"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - trailing linebreaks (or their absence) at the EOF are respected`,
  t => {
    // removeLineBreaks: true
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>\n",
      "02.03.01 - default settings, single trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>\n",
      "02.03.02 - default settings, double trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>", { removeLineBreaks: true }).result,
      "<x><y> c </y></x>",
      "02.03.03 - default settings, no trailing line breaks at EOF"
    );

    // removeLineBreaks: false
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>\n",
      "02.03.04 - default settings, single trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>\n",
      "02.03.05 - default settings, double trailing line breaks at EOF"
    );
    t.equal(
      m("\n<x>\n  <y>\n    c\n  </y>\n</x>", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>",
      "02.03.06 - default settings, no trailing line breaks at EOF"
    );
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - opts.lineLengthLimit`,
  t => {
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
      "02.04.01 - default settings"
    );
    t.equal(strip(original), strip(minified), "02.04.02");
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
        //   `0506: ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
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
      //   `0519: ${`\u001b[${33}m${`line`}\u001b[${39}m`} = ${JSON.stringify(
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

t.test(
  `02.05 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - spaces`,
  t => {
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: false, lineLengthLimit: 0 })
        .result,
      "aaaaaa bbbbbb cccccc",
      "02.05.01-1"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 0 })
        .result,
      "aaaaaa bbbbbb cccccc",
      "02.05.01-2"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 1 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.02"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 2 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.03"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 3 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.04"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 4 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.05"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 5 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.06"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 6 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.07"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 7 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.08"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.09"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 9 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.10"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 10 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.11"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 11 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.12"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.05.13 - the very edge"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 13 })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.14"
    );
    t.same(
      m("aaaaaa  bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.15 - double space"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.16 - double linebreak"
    );
    t.same(
      m("aaaaaa \n \n bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.17 - double linebreak with spaces"
    );
    t.same(
      m("aaaaaa\t\n\t\n\tbbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.18 - double linebreak with spaces"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 14 })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.19 - two chunks can stay on one line generously"
    );
    t.same(
      m("aaaaaa bbbbbb cccccc", { removeLineBreaks: true, lineLengthLimit: 15 })
        .result,
      "aaaaaa bbbbbb\ncccccc",
      "02.05.20 - two chunks can stay on one line generously"
    );
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - linebreaks`,
  t => {
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.01"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.02"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.03"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.04"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.05"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.06"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.07"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.08"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.09"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.10"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.11"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.12"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.13 - the very edge"
    );
    t.same(
      m("aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 100
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.06.14"
    );
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - double linebreaks`,
  t => {
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0
      }).result,
      "aaaaaa bbbbbb cccccc",
      "02.07.01"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.02"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.03"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.04"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.05"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.06"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.07"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.08"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.09"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.10"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.11"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.12"
    );
    t.same(
      m("aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "02.07.13 - the very edge"
    );
    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - tags with single space between them`,
  t => {
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 0 })
        .result,
      "<aaaa><bbbb><cccc>",
      "02.08.01 - same but with tags"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 1 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "02.08.02 - the very edge"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 2 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "02.08.03"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 10 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "02.08.04"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 11 })
        .result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "02.08.05"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "02.08.06"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 13 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "02.08.07"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 14 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "02.08.08"
    );
    t.same(
      m("<aaaa> <bbbb> <cccc>", { removeLineBreaks: true, lineLengthLimit: 15 })
        .result,
      "<aaaa><bbbb>\n<cccc>",
      "02.08.09"
    );
    t.end();
  }
);

t.test(
  `02.09 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking between tags`,
  t => {
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
      "<aa><bb>",
      "02.09.01"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 1 }).result,
      "<aa>\n<bb>",
      "02.09.02"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 2 }).result,
      "<aa>\n<bb>",
      "02.09.03"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
      "<aa>\n<bb>",
      "02.09.04"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 4 }).result,
      "<aa>\n<bb>",
      "02.09.05"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 5 }).result,
      "<aa>\n<bb>",
      "02.09.06"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 6 }).result,
      "<aa>\n<bb>",
      "02.09.07"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 7 }).result,
      "<aa>\n<bb>",
      "02.09.08"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
      "<aa><bb>",
      "02.09.09"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 9 }).result,
      "<aa><bb>",
      "02.09.10"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 10 }).result,
      "<aa><bb>",
      "02.09.11"
    );
    t.same(
      m("<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 999 }).result,
      "<aa><bb>",
      "02.09.12"
    );
    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 8`,
  t => {
    //
    // line limit 8
    // ============

    // at position at character index 4, the break is staged but never submitted:
    t.same(
      m("<aa><bb><cc>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
      "<aa><bb>\n<cc>",
      "02.10.01"
    );
    t.same(
      m("<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc><dd>",
      "02.10.02"
    );

    // same as above, but with whitespace
    t.same(
      m("<aa>\t<bb>\t<cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "02.10.03"
    );
    t.same(
      m("<aa>\t\t<bb>\t<cc>\t\t<dd>", {
        removeLineBreaks: true,
        lineLengthLimit: 8
      }).result,
      "<aa><bb>\n<cc><dd>",
      "02.10.04"
    );

    // same as above, except with trailing tab
    t.same(
      m("<aa>\t<bb>\t<cc>\t", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "02.10.05"
    );
    t.same(
      m("<aa>\t\t<bb>\t<cc>\t\t<dd>\t", {
        removeLineBreaks: true,
        lineLengthLimit: 8
      }).result,
      "<aa><bb>\n<cc><dd>",
      "02.10.06"
    );
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 12`,
  t => {
    //
    // line limit 12
    // =============

    t.same(
      m("<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "02.11.01"
    );
    t.same(
      m("<aa><bb><cc><dd><ee>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd><ee>",
      "02.11.02"
    );
    t.same(
      m("<aa><bb><cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "02.11.03"
    );
    t.same(
      m("<aa><bb><cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "02.11.04"
    );

    // tab after first tag:

    t.same(
      m("<aa>\t<bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "02.11.05"
    );
    t.same(
      m("<aa>\t<bb><cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "02.11.06"
    );
    t.same(
      m("<aa>\t<bb><cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "02.11.07"
    );
    t.same(
      m("<aa>\t<bb><cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "02.11.08"
    );

    // tab after second tag:

    t.same(
      m("<aa><bb>\t<cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "02.11.09"
    );
    t.same(
      m("<aa><bb>\t<cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "02.11.10"
    );
    t.same(
      m("<aa><bb>\t<cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "02.11.11"
    );
    t.same(
      m("<aa><bb>\t<cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "02.11.12"
    );

    // tab after third tag:

    t.same(
      m("<aa><bb><cc>\t<dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "02.11.13"
    );
    t.same(
      m("<aa><bb><cc>\t<dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "02.11.14"
    );
    t.same(
      m("<aa><bb><cc>\t<dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "02.11.15"
    );
    t.same(
      m("<aa><bb><cc>\t<dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "02.11.16"
    );
    t.end();
  }
);

t.test(
  `02.12 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - script tags are skipped`,
  t => {
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      "a <script>\n \t\t   na\n  \tz</script> z",
      "02.12.01"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "02.12.02 - default"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: true,
        removeIndentations: false
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "02.12.03"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: true,
        removeIndentations: true
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "02.12.04"
    );
    t.end();
  }
);

t.test(
  `02.13 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - unfinished script tags are skipped too`,
  t => {
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      "a <script>\n \t\t   na\n  \tz    z    ",
      "02.13.01"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "02.13.02 - default"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: true,
        removeIndentations: false
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "02.13.03"
    );
    t.same(
      m("a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: true,
        removeIndentations: true
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "02.13.04"
    );
    t.end();
  }
);

t.test(
  `02.14 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - code-pre blocks are not touched`,
  t => {
    const preBlock = `<pre id="lalalaa"><code class="tralalaa">    \n    \t   zz    z  \n  \t  r  r  \n \t  </code></pre>`;
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      preBlock,
      "02.14.01"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      preBlock,
      "02.14.02"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: false
      }).result,
      preBlock,
      "02.14.03"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: true
      }).result,
      preBlock,
      "02.14.04"
    );
    t.end();
  }
);

t.test(
  `02.15 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - CDATA blocks are not touched`,
  t => {
    const preBlock = `<![CDATA[          \n     \t   \n  a  a \r     \n a    \t    \t\t\t\t\t  a   \n     \t\t\t    ]]>`;
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      preBlock,
      "02.15.01"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      preBlock,
      "02.15.02"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: false
      }).result,
      preBlock,
      "02.15.03"
    );
    t.same(
      m(preBlock, {
        removeLineBreaks: true,
        removeIndentations: true
      }).result,
      preBlock,
      "02.15.04"
    );
    t.end();
  }
);

t.test(
  `02.16 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - whitespace in front of </script>`,
  t => {
    // 0. baseline - no whitespace in front of </script>
    const code1 = 'a\n<script>const a = "test";</script> b';
    t.same(
      m(code1, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      code1,
      "02.16.01"
    );
    t.same(
      m(code1, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      code1,
      "02.16.02"
    );
    t.same(
      m(code1, {
        removeLineBreaks: true,
        removeIndentations: false
      }).result,
      code1,
      "02.16.03"
    );
    t.same(
      m(code1, {
        removeLineBreaks: true,
        removeIndentations: true
      }).result,
      code1,
      "02.16.04"
    );

    // case 1 - stops at non-whitespace character, ";"
    const code2 = 'a\n<script>const a = "test";   \t   </script> b';
    const minified2 = 'a\n<script>const a = "test";</script> b';
    t.same(
      m(code2, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      code2,
      "02.16.05"
    );
    t.same(
      m(code2, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      minified2,
      "02.16.06"
    );
    t.same(
      m(code2, {
        removeLineBreaks: true
      }).result,
      minified2,
      "02.16.07"
    );

    // case 2 - stops at line break character
    const code3 = 'a\n<script>const a = "test";   \n   </script> b';
    const minified3 = 'a\n<script>const a = "test";   \n</script> b';
    t.same(
      m(code3, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      code3,
      "02.16.08"
    );
    t.same(
      m(code3, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      minified3,
      "02.16.09"
    );
    t.same(
      m(code3, {
        removeLineBreaks: true
      }).result,
      minified3,
      "02.16.10"
    );
    t.end();
  }
);

t.test(
  `02.17 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - single linebreak is not replaced with a single space`,
  t => {
    t.equal(m("a\nb", { removeLineBreaks: true }).result, "a\nb", "02.17.01");
    t.equal(
      m("a\nb", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
      "a\nb",
      "02.17.02"
    );
    t.equal(
      m("a\nb", { removeLineBreaks: true, lineLengthLimit: 100 }).result,
      "a\nb",
      "02.17.03"
    );
    t.equal(
      m("a\nb", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
      "a\nb",
      "02.17.04"
    );
    t.end();
  }
);

t.test(
  `02.18 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - single linebreak is deleted though`,
  t => {
    t.equal(
      m("<x>\n<y>", { removeLineBreaks: true }).result,
      "<x><y>",
      "02.18.01"
    );
    t.equal(
      m("<a>\n<y>", { removeLineBreaks: true }).result,
      "<a><y>",
      "02.18.02"
    );
    t.equal(
      m("<x>\n<a>", { removeLineBreaks: true }).result,
      "<x>\n<a>",
      "02.18.03"
    );
    t.equal(
      m("<a>\n<b>", { removeLineBreaks: true }).result,
      "<a>\n<b>",
      "02.18.04"
    );
    t.end();
  }
);

t.test(
  `02.19 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking to the right of style tag`,
  t => {
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

    t.equal(m(source, { removeLineBreaks: true }).result, res1, "02.19.01");
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
          "<!--<![endif"
        ]
      }).result,
      res2,
      "02.19.02"
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
          "<!--<![endif"
        ]
      }).result,
      res3,
      "02.19.03"
    );
    t.end();
  }
);

t.test(
  `02.20 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - doesn't delete whitespace with linebreaks between curlies`,
  t => {
    const source = "{% a %}\n\n\n{% a %}";
    t.equal(m(source, { removeLineBreaks: true }).result, source, "02.20.01");
    t.equal(
      m(source, { removeLineBreaks: false }).result,
      "{% a %}\n{% a %}",
      "02.20.02"
    );
    t.end();
  }
);

// 03. opts.reportProgressFunc
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - calls the progress function`,
  t => {
    function shouldveBeenCalled(val) {
      throw new Error(val);
    }

    let counter = 0;
    const countingFunction = () => {
      // const countingFunction = val => {
      // console.log(`val received: ${val}`);
      counter++;
    };

    t.same(
      m("aaaaaaaaaa").result,
      "aaaaaaaaaa",
      "03.01.01 - default behaviour"
    );
    t.same(
      m("aaaaaaaaaa", { reportProgressFunc: null }).result,
      "aaaaaaaaaa",
      "03.01.02"
    );
    t.same(
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
    t.match(error1.message, /50/);

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
    t.ok(counter > 50, "03.01.04 - counter called");
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - adjusted from-to range`,
  t => {
    const gather = [];
    const countingFunction = val => {
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
          reportProgressFuncTo: 86
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
    gather.forEach(perc =>
      t.ok(compareTo.includes(perc), `checking: ${perc}%`)
    );
    t.equal(gather.length, 86 - 21 - 1);
    // t.same(gather, compareTo, "03.02")
    t.end();
  }
);

// 04. opts.removeIndentations
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - collapses whitespace on removeIndentations`,
  t => {
    t.same(
      m("a   b\nc    d", {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      "a b\nc d",
      "04.01"
    );
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - trailing whitespace on removeIndentations`,
  t => {
    t.same(
      m("a   \nb    ", {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      "a\nb",
      "04.02"
    );
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${33}m${`opts.removeIndentations`}\u001b[${39}m`} - leading whitespace`,
  t => {
    t.same(
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
    t.end();
  }
);

// 05. OTHER API AREAS
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${32}m${`API's defaults`}\u001b[${39}m`} - plain object is exported and contains correct keys`,
  t => {
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
        "breakToTheLeftOf"
      ].sort(),
      "05.01"
    );
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${32}m${`API's defaults`}\u001b[${39}m`} - plain object is exported`,
  t => {
    t.match(version, /\d+\.\d+\.\d+/, "05.02");
    t.end();
  }
);

// 06. opts.breakToTheLeftOf
// -----------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${34}m${`opts.breakToTheLeftOf`}\u001b[${39}m`} - breaks based on breakpoints (no whitespace involved)`,
  t => {
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: false
      }).result,
      `<m><n><o>`,
      "06.01.01 - no linebreak removal"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true
      }).result,
      `<m><n><o>`,
      "06.01.02 - default line break removal"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<n"]
      }).result,
      `<m>\n<n><o>`,
      "06.01.03 - break in the middle, once"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<n", "<o"]
      }).result,
      `<m>\n<n>\n<o>`,
      "06.01.04 - break twice"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<z", "<n", "<o"]
      }).result,
      `<m>\n<n>\n<o>`,
      "06.01.05 - don't break in front"
    );
    t.same(
      m(`\n   \t   \t   <m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<m", "<n", "<o"]
      }).result,
      `<m>\n<n>\n<o>`,
      "06.01.06 - don't break in front"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "<y", "<z"]
      }).result,
      `<m><n><o>`,
      "06.01.07"
    );
    t.same(
      m(`<m><n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: []
      }).result,
      `<m><n><o>`,
      "06.01.08"
    );
    t.same(
      m(`\n<m>\n  <n>\n  <o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "<y", "<z"]
      }).result,
      `<m><n><o>`,
      "06.01.09"
    );
    t.same(
      m(`   \t\n  <m>   <n> \n\t     <o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: []
      }).result,
      `<m><n><o>`,
      "06.01.10"
    );
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${34}m${`opts.breakToTheLeftOf`}\u001b[${39}m`} - breaks based on breakpoints (whitespace involved)`,
  t => {
    t.same(
      m(`<a>\n<b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"]
      }).result,
      `<a>\n<b><c>`,
      "06.02.01"
    );
    t.same(
      m(`<a> <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"]
      }).result,
      `<a>\n<b><c>`,
      "06.02.02"
    );
    t.same(
      m(`<a>  <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"]
      }).result,
      `<a>\n<b><c>`,
      "06.02.03"
    );
    t.same(
      m(`<a> \n   \t\t\t   \n <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b"]
      }).result,
      `<a>\n<b><c>`,
      "06.02.04"
    );
    t.same(
      m(`<a>\n<b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"]
      }).result,
      `<a>\n<b>\n<c>`,
      "06.02.05"
    );
    t.same(
      m(`<a> <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"]
      }).result,
      `<a>\n<b>\n<c>`,
      "06.02.06"
    );
    t.same(
      m(`<a>  <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"]
      }).result,
      `<a>\n<b>\n<c>`,
      "06.02.07"
    );
    t.same(
      m(`<a> \n   \t\t\t   \n <b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<b", "<c"]
      }).result,
      `<a>\n<b>\n<c>`,
      "06.02.08"
    );
    t.same(
      m(`<a>\n<b><c>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "y"]
      }).result,
      `<a>\n<b><c>`,
      "06.02.09 - nothing in given breakpoints is useful"
    );
    t.same(
      m(`<m>\n<n><o>`, {
        removeLineBreaks: true,
        breakToTheLeftOf: ["<x", "y"]
      }).result,
      `<m><n><o>`,
      "06.02.10"
    );
    t.end();
  }
);

// 07. minification within style tags
// -----------------------------------------------------------------------------

t.test(
  `07.01 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - minimal`,
  t => {
    t.same(
      m(`<style>\n\ta {\ndisplay:block;\n}`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block;}`,
      "07.01.01"
    );
    t.same(
      m(`<style>\na{\ndisplay:block;\n}`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block;}`,
      "07.01.02"
    );
    t.same(
      m(`<style> \t\t\t      a    {     display:block;     }`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block;}`,
      "07.01.03"
    );
    t.same(
      m(`<style>a{display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block;}`,
      "07.01.04"
    );
    t.end();
  }
);

t.test(
  `07.02 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - spaces`,
  t => {
    t.same(
      m(`<style>\na something here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a something here{display:block;}`,
      "07.02.01"
    );
    t.same(
      m(`<style>\na.something.here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a.something.here{display:block;}`,
      "07.02.02"
    );
    t.same(
      m(`<style>\na something#here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a something#here{display:block;}`,
      "07.02.03"
    );
    t.same(
      m(`<style>\na  something#here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a something#here{display:block;}`,
      "07.02.04"
    );
    t.end();
  }
);

t.test(
  `07.03 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element > element`,
  t => {
    t.same(
      m(`<style>\na>something#here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a>something#here{display:block;}`,
      "07.03.01"
    );
    t.same(
      m(`<style>\na > something#here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a>something#here{display:block;}`,
      "07.03.02"
    );
    t.same(
      m(`<style>\na> something#here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a>something#here{display:block;}`,
      "07.03.03"
    );
    t.same(
      m(`<style>\na> something #here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a>something #here{display:block;}`,
      "07.03.04"
    );
    t.same(
      m(`<style>\na> something  #here {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a>something #here{display:block;}`,
      "07.03.05"
    );
    t.end();
  }
);

t.test(
  `07.04 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element + element`,
  t => {
    t.same(
      m(`<style>\na+something#here+there {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "07.04.01"
    );
    t.same(
      m(`<style>\na + something#here + there {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "07.04.02"
    );
    t.same(
      m(`<style>\na + something #here + there {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a+something #here+there{display:block;}`,
      "07.04.03"
    );
    t.same(
      m(`<style>\na  +  something#here  +  there  {\ndisplay:block;\n}`, {
        removeLineBreaks: true
      }).result,
      `<style>a+something#here+there{display:block;}`,
      "07.04.04"
    );
    t.same(
      m(
        `<style>\n   a   +    something  #here   +   there   {\n   display: block;   \n}`,
        {
          removeLineBreaks: true
        }
      ).result,
      `<style>a+something #here+there{display:block;}`,
      "07.04.05"
    );
    t.end();
  }
);

t.test(
  `07.05 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element ~ element`,
  t => {
    t.same(
      m(`<style>\na~something#here~there {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "07.05.01"
    );
    t.same(
      m(`<style>\na ~ something#here ~ there {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "07.05.02"
    );
    t.same(
      m(`<style>\na ~ something #here ~ there {display:block;}`, {
        removeLineBreaks: true
      }).result,
      `<style>a~something #here~there{display:block;}`,
      "07.05.03"
    );
    t.same(
      m(`<style>\na  ~  something#here  ~  there  {\ndisplay:block;\n}`, {
        removeLineBreaks: true
      }).result,
      `<style>a~something#here~there{display:block;}`,
      "07.05.04"
    );
    t.same(
      m(
        `<style>\n   a   ~    something  #here   ~   there   {\n   display: block;   \n}`,
        {
          removeLineBreaks: true
        }
      ).result,
      `<style>a~something #here~there{display:block;}`,
      "07.05.05"
    );
    t.end();
  }
);

t.test(
  `07.06 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes CSS comments`,
  t => {
    t.same(
      m(`<style> a { display:block; } /* TAB STYLES */`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block;}`,
      "07.06.01"
    );
    t.same(
      m(`<style> a { display:block; } /* TAB STYLES */`, {
        removeLineBreaks: false
      }).result,
      `<style> a { display:block; }`,
      "07.06.02"
    );
    t.end();
  }
);

t.test(
  `07.07 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of !important`,
  t => {
    t.same(
      m(`<style>\n  a { display:block!important; }`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block!important;}`,
      "07.07.01 - no space"
    );
    t.same(
      m(`<style>\n  a { display:block !important; }`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block!important;}`,
      "07.07.02 - one space"
    );
    t.same(
      m(`<style>\n  a { display:block  !important; }`, {
        removeLineBreaks: true
      }).result,
      `<style>a{display:block!important;}`,
      "07.07.03 - two spaces"
    );
    t.same(
      m(`<style>/*  `, {
        removeLineBreaks: true
      }).result,
      `<style>`,
      "07.07.04 - resembling real life"
    );
    t.end();
  }
);

t.test(
  `07.08 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of <script>`,
  t => {
    const source =
      'a\n    <script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\n    b';

    t.same(
      m(source, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      source,
      "07.08.01"
    );
    t.same(
      m(source, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script>\nb',
      "07.08.02"
    );
    t.same(
      m(source, {
        removeLineBreaks: true
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
      "07.08.03"
    );
    t.same(
      m(source, {
        removeLineBreaks: true,
        lineLengthLimit: 10
      }).result,
      'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
      "07.08.04"
    );
    t.end();
  }
);

t.test(
  `07.09 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals`,
  t => {
    t.same(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
        {
          removeLineBreaks: true
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`
    );
    t.end();
  }
);

t.test(
  `07.10 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, lineLengthLimit=off`,
  t => {
    t.same(
      m(
        `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0
        }
      ).result,
      `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`
    );
    t.end();
  }
);

t.test(
  `07.11 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix`,
  t => {
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
          removeLineBreaks: true
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
</style>`
    );
    t.end();
  }
);

t.test(
  `07.12 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix, lineLengthLimit=off`,
  t => {
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
          lineLengthLimit: 0
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
</style>`
    );
    t.end();
  }
);

// 08. inline CSS minification
// -----------------------------------------------------------------------------

t.test(
  `08.01 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - one tag, minimal - double quotes`,
  t => {
    const input1 = `  <a style="a: 100%; b: c-d; ">`;
    const indentationsOnly = `<a style="a: 100%; b: c-d; ">`;
    t.same(
      m(input1, {
        removeLineBreaks: true
      }).result,
      `<a style="a:100%;b:c-d;">`,
      "08.01.01"
    );
    t.same(
      m(input1, {
        removeLineBreaks: true,
        lineLengthLimit: 0
      }).result,
      `<a style="a:100%;b:c-d;">`,
      "08.01.02"
    );
    t.same(
      m(input1, {
        removeLineBreaks: false
      }).result,
      indentationsOnly,
      "08.01.03 - indentations are removed on default settings"
    );
    t.same(
      m(input1, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      input1,
      "08.01.04 - indentations off"
    );
    t.end();
  }
);

t.test(
  `08.02 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - inline CSS comments`,
  t => {
    t.same(
      m(`<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true
      }).result,
      `<a style="a:100%;e:f;">`,
      "08.02"
    );
    t.end();
  }
);

t.test(
  `08.03 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - line length limit falls in the middle of inline CSS comment`,
  t => {
    t.same(
      m(`<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
        lineLengthLimit: 18
      }).result,
      `<a style="a:100%;\ne:f;">`,
      "08.03"
    );
    t.end();
  }
);

t.test(
  `08.04 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - line length becomes all right because of truncation`,
  t => {
    t.same(
      m(`<a style="a: 100%;/*b: c-d;*/e: f;">`, {
        removeLineBreaks: true,
        lineLengthLimit: 30
      }).result,
      `<a style="a:100%;e:f;">`,
      "08.04 - deletion makes it to be within a limit"
    );
    t.end();
  }
);

t.test(
  `08.05 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - leading whitespace inside double quotes`,
  t => {
    t.same(
      m(`<a href="zzz" style=" font-size: 1px; ">`, {
        removeLineBreaks: true
      }).result,
      `<a href="zzz" style="font-size:1px;">`,
      "08.05"
    );
    t.end();
  }
);

t.test(
  `08.06 - ${`\u001b[${34}m${`inline CSS minification`}\u001b[${39}m`} - leading whitespace inside single quotes`,
  t => {
    t.same(
      m(`<a href='zzz' style=' font-size: 1px; '>`, {
        removeLineBreaks: true
      }).result,
      `<a href='zzz' style='font-size:1px;'>`,
      "08.06"
    );
    t.end();
  }
);

// 09. Inline tags
// -----------------------------------------------------------------------------

t.test(
  `09.01 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style on sup #1`,
  t => {
    t.same(
      m(`<sup style="">word, here`, {
        removeLineBreaks: true
      }).result,
      `<sup style="">word, here`,
      "09.01"
    );
    t.end();
  }
);

t.test(
  `09.02 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style on sup #2`,
  t => {
    t.same(
      m(`<sup style=" ">word, here`, {
        removeLineBreaks: true
      }).result,
      `<sup style="">word, here`,
      "09.02"
    );
    t.end();
  }
);

t.test(
  `09.03 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans with space - space retained`,
  t => {
    t.same(
      m(`<span>a</span> <span>b</span>`, {
        removeLineBreaks: true
      }).result,
      `<span>a</span> <span>b</span>`,
      "09.03"
    );
    t.end();
  }
);

t.test(
  `09.04 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans without space - fine`,
  t => {
    t.same(
      m(`<span>a</span><span>b</span>`, {
        removeLineBreaks: true
      }).result,
      `<span>a</span><span>b</span>`,
      "09.04"
    );
    t.end();
  }
);

t.test(
  `09.06 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - inside tag`,
  t => {
    t.same(
      m(`</b >`, {
        removeLineBreaks: true
      }).result,
      `</b>`,
      "09.06"
    );
    t.end();
  }
);

t.test(
  `09.07 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - nameless attr`,
  t => {
    t.same(
      m(`x<a b="c" >y`, {
        removeLineBreaks: true
      }).result,
      `x<a b="c">y`,
      "09.07.01"
    );
    t.same(
      m(`x<a b="c" />y`, {
        removeLineBreaks: true
      }).result,
      `x<a b="c"/>y`,
      "09.07.02"
    );
    t.end();
  }
);

t.test(
  `09.08 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style attr`,
  t => {
    t.same(
      m(`x<span style="a: b;" >y`, {
        removeLineBreaks: true
      }).result,
      `x<span style="a:b;">y`,
      "09.08.01"
    );
    t.same(
      m(`x<span style="a: b;" >y`, {
        removeLineBreaks: true,
        lineLengthLimit: 0
      }).result,
      `x<span style="a:b;">y`,
      "09.08.02"
    );
    t.end();
  }
);

t.test(
  `09.09 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans`,
  t => {
    t.same(
      m(`<span style="abc: def;" >a</span> <span style="abc: def;" >b</span>`, {
        removeLineBreaks: true
      }).result,
      `<span style="abc:def;">a</span> <span style="abc:def;">b</span>`,
      "09.09.01"
    );
    t.same(
      m(
        `<span style="abc: def;" />a</span> <span style="abc: def;" />b</span>`,
        {
          removeLineBreaks: true
        }
      ).result,
      `<span style="abc:def;"/>a</span> <span style="abc:def;"/>b</span>`,
      "09.09.02"
    );
    t.same(
      m(
        `<span style="abc: def;" />a</span> <span style="abc: def;" />b</span>`,
        {
          removeLineBreaks: true,
          lineLengthLimit: 0
        }
      ).result,
      `<span style="abc:def;"/>a</span> <span style="abc:def;"/>b</span>`,
      "09.09.03"
    );
    t.end();
  }
);

t.test(
  `09.10 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - span + sup`,
  t => {
    t.same(
      m(`<span style="abc: def;">a</span> <sup>1</sup>`, {
        removeLineBreaks: true
      }).result,
      `<span style="abc:def;">a</span> <sup>1</sup>`,
      "09.10.01"
    );
    t.same(
      m(`<span style="abc: def;">a</span> <sup>1</sup>`, {
        removeLineBreaks: true,
        lineLengthLimit: 0
      }).result,
      `<span style="abc:def;">a</span> <sup>1</sup>`,
      "09.10.02"
    );
    t.end();
  }
);

t.test(
  `09.11 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - won't line break between two inline tags`,
  t => {
    for (let i = 1; i < 37; i++) {
      t.same(
        m(`<span>a</span><span style="z">b</span>`, {
          lineLengthLimit: i,
          removeLineBreaks: true
        }).result,
        `<span>a</span><span\nstyle="z">b</span>`,
        `09.11.0${i} - limit = ${i}`
      );
    }
    t.end();
  }
);

t.test(
  `09.12 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - 012 pt.2`,
  t => {
    t.same(
      m(`<i><span>a</span><span style="z">b</span></i>`, {
        lineLengthLimit: 22,
        removeLineBreaks: true
      }).result,
      `<i><span>a</span><span\nstyle="z">b</span></i>`,
      "09.12"
    );
    t.end();
  }
);

t.test(
  `09.13 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed #1`,
  t => {
    t.same(
      m(`<i>a</i><span>b</span>`, {
        lineLengthLimit: 9, // <--- asking to break after /i
        removeLineBreaks: true
      }).result,
      `<i>a</i><span>b</span>`,
      "09.13.01"
    );
    t.same(
      m(`<i>a</i><y>b</y>`, {
        lineLengthLimit: 9, // <--- asking to break after /i
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<y>b</y>`,
      "09.13.02"
    );
    t.end();
  }
);

t.test(
  `09.14 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, #2`,
  t => {
    t.same(
      m(`<span>a</span><div>b</div>`, {
        lineLengthLimit: 15, // <--- asking to break after div
        removeLineBreaks: true
      }).result,
      `<span>a</span>\n<div>b</div>`,
      "09.14"
    );
    t.end();
  }
);

t.test(
  `09.15 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, space, #1`,
  t => {
    t.same(
      m(`<span>a</span> <div>b</div>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true
      }).result,
      `<span>a</span>\n<div>b</div>`,
      "09.15.01"
    );
    t.same(
      m(`<span>a</span> <div>b</div>`, {
        lineLengthLimit: 0,
        removeLineBreaks: true
      }).result,
      `<span>a</span><div>b</div>`,
      "09.15.02"
    );
    t.end();
  }
);

t.test(
  `09.16 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, space, #2`,
  t => {
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 12,
        removeLineBreaks: true
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "09.16.01"
    );
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 13,
        removeLineBreaks: true
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "09.16.02"
    );
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 14,
        removeLineBreaks: true
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "09.16.03"
    );
    t.same(
      m(`<div>a</div> <span>b</span>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true
      }).result,
      `<div>a</div>\n<span>b</span>`,
      "09.16.04"
    );
    t.same(
      m(`123456789012 <span>b</span>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true
      }).result,
      `123456789012\n<span>b</span>`,
      "09.16.05"
    );
    t.end();
  }
);

t.test(
  `09.17 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - space between inline tags`,
  t => {
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 6,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.01"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 7,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.02"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.03"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 9,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.04"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 10,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.05"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 11,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.06"
    );
    t.same(
      m(`<b>x</b> <i>y</i>`, {
        lineLengthLimit: 12,
        removeLineBreaks: true
      }).result,
      `<b>x</b>\n<i>y</i>`,
      "09.17.07"
    );
    t.end();
  }
);

t.test(
  `09.18 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - excessive whitespace between inline tags #1`,
  t => {
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        removeLineBreaks: true
      }).result,
      `<i>a</i> <sup>b</sup>`,
      "09.18.01"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 6,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.02"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 7,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.03"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 8,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.04"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 9,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.05"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 10,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.06"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 12,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.07"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 13,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.08"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 14,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.09"
    );
    t.same(
      m(`<i>a</i>     <sup>b</sup>`, {
        lineLengthLimit: 15,
        removeLineBreaks: true
      }).result,
      `<i>a</i>\n<sup>b</sup>`,
      "09.18.10"
    );
    t.end();
  }
);

t.test(
  `09.19 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup`,
  t => {
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        removeLineBreaks: true
      }).result,
      `<div>a</div> <sup>b</sup>`,
      "09.19.01"
    );
    t.same(
      m(`<div>a</div><sup>b</sup>`, {
        removeLineBreaks: true
      }).result,
      `<div>a</div><sup>b</sup>`,
      "09.19.02"
    );
    t.end();
  }
);

t.test(
  `09.20 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup, escessive whitespace`,
  t => {
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: 10,
        removeLineBreaks: true
      }).result,
      `<div>a</div>\n<sup>b</sup>`,
      "09.20"
    );
    t.end();
  }
);

t.test(
  `09.21 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup, escessive whitespace`,
  t => {
    for (let i = 10; i < 25; i++) {
      t.same(
        m(`<div>a</div>     <sup>b</sup>`, {
          lineLengthLimit: i,
          removeLineBreaks: true
        }).result,
        `<div>a</div>\n<sup>b</sup>`,
        `09.21.01 - limit = ${i}`
      );
    }
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: 99,
        removeLineBreaks: true
      }).result,
      `<div>a</div> <sup>b</sup>`,
      "09.21.02"
    );
    t.same(
      m(`<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: 0,
        removeLineBreaks: true
      }).result,
      `<div>a</div> <sup>b</sup>`,
      "09.21.03"
    );
    t.end();
  }
);

t.test(
  `09.22 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - multiple wrapped inline tags`,
  t => {
    const source = `<span><a href="z"><b>a</b><i>b</i><a><span>`;
    const res = `<span><a\nhref="z"><b>a</b><i>b</i><a><span>`;
    t.same(
      m(source, {
        removeLineBreaks: false
      }).result,
      source,
      "09.22.01"
    );
    t.same(
      m(source, {
        removeLineBreaks: true
      }).result,
      source,
      "09.22.02"
    );
    for (let i = 1; i < 42; i++) {
      t.same(
        m(source, {
          lineLengthLimit: i,
          removeLineBreaks: true
        }).result,
        res,
        `09.22.03* - lineLengthLimit: i = ${i}`
      );
    }
    t.end();
  }
);

t.test(
  `09.23 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - first tag name letters resemble legit inline tags`,
  t => {
    t.same(
      m(`<az>123</az> <by>456</by> <see>789</see> <in></in>`, {
        removeLineBreaks: true
      }).result,
      `<az>123</az><by>456</by><see>789</see><in></in>`,
      "09.23.01"
    );
    t.same(
      m(`<az>123</az> <by>456</by> <see>789</see> <in></in>`, {
        removeLineBreaks: true,
        lineLengthLimit: 0
      }).result,
      `<az>123</az><by>456</by><see>789</see><in></in>`,
      "09.23.02"
    );
    t.end();
  }
);

t.test(
  `09.24 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - spanner is not span`,
  t => {
    t.same(
      m(`<span>1</span> <span>2</span> <span>3</span>`, {
        removeLineBreaks: true
      }).result,
      `<span>1</span> <span>2</span> <span>3</span>`,
      "09.24.01"
    );
    t.same(
      m(`<spanner>1</spanner> <spanner>2</spanner> <spanner>3</spanner>`, {
        removeLineBreaks: true
      }).result,
      `<spanner>1</spanner><spanner>2</spanner><spanner>3</spanner>`,
      "09.24.02"
    );
    t.same(
      m(`<spa n="m">1</spa> <spa n="m">2</spa> <spa n="m">3</spa>`, {
        removeLineBreaks: true
      }).result,
      `<spa n="m">1</spa><spa n="m">2</spa><spa n="m">3</spa>`,
      "09.24.03 - insurance against whitespace-hungry matching components"
    );
    t.end();
  }
);

// 10. whitespace around tag brackets, inside tag
// -----------------------------------------------------------------------------

t.test(
  `10.01 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - whitespace before closing bracket on opening tag`,
  t => {
    t.same(
      m(`x<a >y`, {
        removeLineBreaks: true
      }).result,
      `x<a>y`,
      "10.01.01"
    );
    t.same(
      m(`x<a > y`, {
        removeLineBreaks: true
      }).result,
      `x<a> y`,
      "10.01.02"
    );
    t.same(
      m(`x<a>y`, {
        removeLineBreaks: true
      }).result,
      `x<a>y`,
      "10.01.03"
    );
    t.end();
  }
);

t.test(
  `10.02 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - div - block level`,
  t => {
    t.same(
      m(`x<div >y`, {
        removeLineBreaks: true
      }).result,
      `x<div>y`,
      "10.02"
    );
    t.end();
  }
);

t.test(
  `10.03 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - a - inline tag`,
  t => {
    t.same(
      m(`x<a >y`, {
        removeLineBreaks: false
      }).result,
      `x<a>y`,
      "10.03"
    );
    t.end();
  }
);

t.test(
  `10.04 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - removeLineBreaks = off`,
  t => {
    t.same(
      m(`x<div >y`, {
        removeLineBreaks: false
      }).result,
      `x<div>y`,
      "10.04"
    );
    t.end();
  }
);

t.test(
  `10.05 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - all opts off, inline tag`,
  t => {
    t.same(
      m(`x<a >y`, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      `x<a>y`,
      "10.05"
    );
    t.end();
  }
);

t.test(
  `10.06 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - all opts off, block level tag`,
  t => {
    t.same(
      m(`x<div >y`, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      `x<div>y`,
      "10.06"
    );
    t.end();
  }
);

t.test(
  `10.07 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - before closing slash`,
  t => {
    t.same(
      m(`x<a />y`, {
        removeLineBreaks: true
      }).result,
      `x<a/>y`,
      "10.07"
    );
    t.end();
  }
);

t.test(
  `10.08 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - after closing slash`,
  t => {
    t.same(
      m(`x<a/ >y`, {
        removeLineBreaks: true
      }).result,
      `x<a/>y`,
      "10.08"
    );
    t.end();
  }
);

t.test(
  `10.09 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - around closing slash`,
  t => {
    t.same(
      m(`x<a / >y`, {
        removeLineBreaks: true
      }).result,
      `x<a/>y`,
      "10.09"
    );
    t.end();
  }
);

t.test(
  `10.10 - ${`\u001b[${33}m${`tag inner whitespace`}\u001b[${39}m`} - around closing slash - non inline tag`,
  t => {
    t.same(
      m(`x<div / >y`, {
        removeLineBreaks: true
      }).result,
      `x<div/>y`,
      "10.10"
    );
    t.end();
  }
);

// 99. AD-HOC
// -----------------------------------------------------------------------------

t.test(
  `99.01 - ${`\u001b[${90}m${`adhoc 1`}\u001b[${39}m`} - a peculiar set of characters`,
  t => {
    t.same(
      m("<a>\n<<>", { removeLineBreaks: true }).result,
      "<a><<>",
      "99.01 - a peculiar set of characters"
    );
    t.end();
  }
);

t.test(
  `99.02 - ${`\u001b[${90}m${`adhoc 2`}\u001b[${39}m`} - another peculiar set of characters`,
  t => {
    t.same(
      m("You&rsquo;ve").result,
      "You&rsquo;ve",
      "99.02 - another peculiar set of characters"
    );
    t.end();
  }
);

t.test(
  `99.03 - ${`\u001b[${90}m${`adhoc 3`}\u001b[${39}m`} - yet another peculiar set of chars`,
  t => {
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
        breakToTheLeftOf: []
      }).result,
      output,
      "99.03 - another peculiar set of characters"
    );
    t.end();
  }
);

t.test(
  `99.04 - ${`\u001b[${90}m${`adhoc 4`}\u001b[${39}m`} - result's keyset is consistent`,
  t => {
    t.equal(Object.keys(m("")).length, Object.keys(m("zzz")).length, "99.04");
    t.end();
  }
);

t.test(
  `99.05 - ${`\u001b[${90}m${`adhoc 5`}\u001b[${39}m`} - raw non-breaking spaces`,
  t => {
    t.same(
      m("\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: true }).result,
      "<x><y>",
      "99.05.01"
    );
    t.same(
      m("\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: false }).result,
      "<x>\n<y>",
      "99.05.02"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: true })
        .result,
      "<x/><y/>",
      "99.05.03"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: false })
        .result,
      "<x/>\n<y/>",
      "99.05.04"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
        .result,
      "<x/></y>",
      "99.05.05"
    );
    t.same(
      m("\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
        .result,
      "<x/>\n</y>",
      "99.05.06"
    );
    t.same(
      m("\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
        .result,
      "</x></y>",
      "99.05.07"
    );
    t.same(
      m("\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
        .result,
      "</x>\n</y>",
      "99.05.08"
    );
    t.end();
  }
);

t.test(
  `99.06 - ${`\u001b[${90}m${`adhoc 6`}\u001b[${39}m`} - raw non-breaking spaces`,
  t => {
    const chunk = "    <script >   >]] > < div>";
    const res = "<script >   >]] > < div>";
    t.same(m(chunk, { removeLineBreaks: true }).result, res, "99.06.01");
    t.same(
      m(chunk, {
        removeLineBreaks: false,
        removeIndentations: true
      }).result,
      res,
      "99.06.02"
    );
    t.same(
      m(chunk, {
        removeLineBreaks: false,
        removeIndentations: false
      }).result,
      chunk,
      "99.06.03"
    );
    t.end();
  }
);

t.test(
  `99.07 - ${`\u001b[${90}m${`adhoc 7`}\u001b[${39}m`} - line length control`,
  t => {
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
        breakToTheLeftOf: []
      }).result,
      output,
      "99.07"
    );
    t.end();
  }
);

t.test(`99.08 - ${`\u001b[${90}m${`adhoc 8`}\u001b[${39}m`} - nunjucks`, t => {
  t.same(
    m("{%- length > 1 or length > 2 -%}", {
      removeLineBreaks: true
    }).result,
    "{%- length > 1 or length > 2 -%}",
    "99.08"
  );
  t.end();
});

t.test(`99.09 - ${`\u001b[${90}m${`adhoc 9`}\u001b[${39}m`} - nunjucks`, t => {
  const source =
    '{%- if (((not a.b) and (a.b | c("d") | e > 1)) or ((a.b) and (a.f | c("d") | e > 2))) -%}';
  t.same(
    m(source, {
      removeLineBreaks: true
    }).result,
    source,
    "99.09"
  );
  t.end();
});

// -----------------------------------------------------------------------------
//
//             ▄▄ ▄████▄▐▄▄▄▌
//            ▐  ████▀███▄█▄▌
//          ▐ ▌  █▀▌  ▐▀▌▀█▀ me eatz bugz
//           ▀   ▌ ▌  ▐ ▌
//               ▌ ▌  ▐ ▌
//               █ █  ▐▌█
//               BUGS LISTEN! STAY AWAY!
