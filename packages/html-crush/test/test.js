import tap from "tap";
import { m } from "./util/util";

function strip(str) {
  if (typeof str === "string") {
    return str
      .replace(/<[^>]*>/gi, "")
      .replace(/\s+/gi, " ")
      .trim();
  }
  throw new Error(`input must be string! It was given as: ${typeof str}`);
}

// B.A.U.
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - nothing to minify, empty`,
  (t) => {
    const input = "";
    t.strictSame(m(t, input).result, input, "01.01");
    t.strictSame(m(t, input).ranges, null, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - nothing to minify, non-empty`,
  (t) => {
    const input = "zzzz";
    t.strictSame(m(t, input).result, input, "02.01");
    t.strictSame(m(t, input).ranges, null, "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - minimal string of few words`,
  (t) => {
    const source = ` \t
<x>\t\t
  <y>\t
    c\t
  </y>\t
</x>\t
\t
`;

    t.strictSame(
      m(t, source, { removeLineBreaks: true }).result,
      "<x><y> c </y></x>\n",
      "03.01 - defaults: remove both indentations and linebreaks"
    );

    t.strictSame(
      m(t, source, { removeLineBreaks: true, removeIndentations: false })
        .result,
      "<x><y> c </y></x>\n",
      "03.02 - disabling indentation removal while keeping linebreak removal is futile"
    );

    t.equal(
      m(t, source, { removeLineBreaks: false, removeIndentations: true })
        .result,
      `<x>
<y>
c
</y>
</x>
`,
      "03.03 - only remove indentations"
    );

    t.equal(
      m(t, source, { removeLineBreaks: false, removeIndentations: false })
        .result,
      `
<x>
  <y>
    c
  </y>
</x>
`,
      "03.04 - all off so only trims leading whitespace"
    );

    t.equal(
      m(t, source, { removeLineBreaks: true, removeIndentations: true }).result,
      `<x><y> c </y></x>
`,
      "03.05 - line breaks on"
    );

    t.equal(
      m(t, source, { removeLineBreaks: true, removeIndentations: false })
        .result,
      `<x><y> c </y></x>
`,
      "03.06 - line breaks on"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - trailing linebreaks (or their absence) at the EOF are respected`,
  (t) => {
    // removeLineBreaks: true
    t.equal(
      m(t, "\n<x>\n  <y>\n    c\n  </y>\n</x>\n", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>\n",
      "04.01 - default settings, single trailing line breaks at EOF"
    );
    t.equal(
      m(t, "\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>\n",
      "04.02 - default settings, double trailing line breaks at EOF"
    );
    t.equal(
      m(t, "\n<x>\n  <y>\n    c\n  </y>\n</x>", { removeLineBreaks: true })
        .result,
      "<x><y> c </y></x>",
      "04.03 - default settings, no trailing line breaks at EOF"
    );

    // removeLineBreaks: false
    t.equal(
      m(t, "\n<x>\n  <y>\n    c\n  </y>\n</x>\n", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>\n",
      "04.04 - default settings, single trailing line breaks at EOF"
    );
    t.equal(
      m(t, "\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>\n",
      "04.05 - default settings, double trailing line breaks at EOF"
    );
    t.equal(
      m(t, "\n<x>\n  <y>\n    c\n  </y>\n</x>", { removeLineBreaks: false })
        .result,
      "<x>\n<y>\nc\n</y>\n</x>",
      "04.06 - default settings, no trailing line breaks at EOF"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - opts.lineLengthLimit`,
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
      m(t, original, { removeLineBreaks: true }).result,
      minified,
      "05.01 - default settings"
    );
    t.equal(strip(original), strip(minified), "05.02");
    t.not(strip(original), strip(wrong), "02.04.03");

    const minified8 = `<x><y> c
</y></x>
<x><y> c
</y></x>
<x><y> c
</y></x>
`;
    t.equal(
      m(t, original, {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      minified8,
      "05.03"
    );

    m(t, original, {
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
  `06 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - spaces`,
  (t) => {
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: false,
        lineLengthLimit: 0,
      }).result,
      "aaaaaa bbbbbb cccccc",
      "06.01-1"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      "aaaaaa bbbbbb cccccc",
      "06.02-2"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.03"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.04"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.05"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.06"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.07"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.08"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.09"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.10"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.11"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.12"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.13"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "06.14 - the very edge"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.15"
    );
    t.strictSame(
      m(t, "aaaaaa  bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.16 - double space"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.17 - double linebreak"
    );
    t.strictSame(
      m(t, "aaaaaa \n \n bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.18 - double linebreak with spaces"
    );
    t.strictSame(
      m(t, "aaaaaa\t\n\t\n\tbbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.19 - double linebreak with spaces"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 14,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.20 - two chunks can stay on one line generously"
    );
    t.strictSame(
      m(t, "aaaaaa bbbbbb cccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 15,
      }).result,
      "aaaaaa bbbbbb\ncccccc",
      "06.21 - two chunks can stay on one line generously"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - linebreaks`,
  (t) => {
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.01"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.02"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.03"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.04"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.05"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.06"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.07"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.08"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.09"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.10"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.11"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.12"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "07.13 - the very edge"
    );
    t.strictSame(
      m(t, "aaaaaa\nbbbbbb\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 100,
      }).result,
      "aaaaaa bbbbbb cccccc",
      "07.14"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - when chunk of characters without break points is longer than line limit - double linebreaks`,
  (t) => {
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      "aaaaaa bbbbbb cccccc",
      "08.01"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 1,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.02"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 2,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.03"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 3,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.04"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 4,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.05"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 5,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.06"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 6,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.07"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 7,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.08"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.09"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 9,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.10"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.11"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 11,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.12"
    );
    t.strictSame(
      m(t, "aaaaaa\n\nbbbbbb\n\ncccccc", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "aaaaaa\nbbbbbb\ncccccc",
      "08.13 - the very edge"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - tags with single space between them`,
  (t) => {
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }).result,
      "<aaaa><bbbb><cccc>",
      "09.01 - same but with tags"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 1,
      }).result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "09.02 - the very edge"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 2,
      }).result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "09.03"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 10,
      }).result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "09.04"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 11,
      }).result,
      "<aaaa>\n<bbbb>\n<cccc>",
      "09.05"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aaaa><bbbb>\n<cccc>",
      "09.06"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 13,
      }).result,
      "<aaaa><bbbb>\n<cccc>",
      "09.07"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 14,
      }).result,
      "<aaaa><bbbb>\n<cccc>",
      "09.08"
    );
    t.strictSame(
      m(t, "<aaaa> <bbbb> <cccc>", {
        removeLineBreaks: true,
        lineLengthLimit: 15,
      }).result,
      "<aaaa><bbbb>\n<cccc>",
      "09.09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking between tags`,
  (t) => {
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
      "<aa><bb>",
      "10.01"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 1 }).result,
      "<aa>\n<bb>",
      "10.02"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 2 }).result,
      "<aa>\n<bb>",
      "10.03"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
      "<aa>\n<bb>",
      "10.04"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 4 }).result,
      "<aa>\n<bb>",
      "10.05"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 5 }).result,
      "<aa>\n<bb>",
      "10.06"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 6 }).result,
      "<aa>\n<bb>",
      "10.07"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 7 }).result,
      "<aa>\n<bb>",
      "10.08"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
      "<aa><bb>",
      "10.09"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 9 }).result,
      "<aa><bb>",
      "10.10"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 10 }).result,
      "<aa><bb>",
      "10.11"
    );
    t.strictSame(
      m(t, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 999 }).result,
      "<aa><bb>",
      "10.12"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 8`,
  (t) => {
    //
    // line limit 8
    // ============

    // at position at character index 4, the break is staged but never submitted:
    t.strictSame(
      m(t, "<aa><bb><cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "11.01"
    );
    t.strictSame(
      m(t, "<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc><dd>",
      "11.02"
    );

    // same as above, but with whitespace
    t.strictSame(
      m(t, "<aa>\t<bb>\t<cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "11.03"
    );
    t.strictSame(
      m(t, "<aa>\t\t<bb>\t<cc>\t\t<dd>", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "<aa><bb>\n<cc><dd>",
      "11.04"
    );

    // same as above, except with trailing tab
    t.strictSame(
      m(t, "<aa>\t<bb>\t<cc>\t", { removeLineBreaks: true, lineLengthLimit: 8 })
        .result,
      "<aa><bb>\n<cc>",
      "11.05"
    );
    t.strictSame(
      m(t, "<aa>\t\t<bb>\t<cc>\t\t<dd>\t", {
        removeLineBreaks: true,
        lineLengthLimit: 8,
      }).result,
      "<aa><bb>\n<cc><dd>",
      "11.06"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - break-position-friendly characters, not suitable for break yet - line limit 12`,
  (t) => {
    //
    // line limit 12
    // =============

    t.strictSame(
      m(t, "<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 12 })
        .result,
      "<aa><bb><cc>\n<dd>",
      "12.01"
    );
    t.strictSame(
      m(t, "<aa><bb><cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "12.02"
    );
    t.strictSame(
      m(t, "<aa><bb><cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "12.03"
    );
    t.strictSame(
      m(t, "<aa><bb><cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "12.04"
    );

    // tab after first tag:

    t.strictSame(
      m(t, "<aa>\t<bb><cc><dd>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd>",
      "12.05"
    );
    t.strictSame(
      m(t, "<aa>\t<bb><cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "12.06"
    );
    t.strictSame(
      m(t, "<aa>\t<bb><cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "12.07"
    );
    t.strictSame(
      m(t, "<aa>\t<bb><cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "12.08"
    );

    // tab after second tag:

    t.strictSame(
      m(t, "<aa><bb>\t<cc><dd>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd>",
      "12.09"
    );
    t.strictSame(
      m(t, "<aa><bb>\t<cc><dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "12.10"
    );
    t.strictSame(
      m(t, "<aa><bb>\t<cc><dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "12.11"
    );
    t.strictSame(
      m(t, "<aa><bb>\t<cc><dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "12.12"
    );

    // tab after third tag:

    t.strictSame(
      m(t, "<aa><bb><cc>\t<dd>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd>",
      "12.13"
    );
    t.strictSame(
      m(t, "<aa><bb><cc>\t<dd><ee>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee>",
      "12.14"
    );
    t.strictSame(
      m(t, "<aa><bb><cc>\t<dd><ee><ff>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>",
      "12.15"
    );
    t.strictSame(
      m(t, "<aa><bb><cc>\t<dd><ee><ff><gg>", {
        removeLineBreaks: true,
        lineLengthLimit: 12,
      }).result,
      "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
      "12.16"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - script tags are skipped`,
  (t) => {
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      "a <script>\n \t\t   na\n  \tz</script> z",
      "13.01"
    );
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "13.02 - default"
    );
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "13.03"
    );
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz</script> z    ", {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz</script> z",
      "13.04"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - unfinished script tags are skipped too`,
  (t) => {
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      "a <script>\n \t\t   na\n  \tz    z    ",
      "14.01"
    );
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "14.02 - default"
    );
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "14.03"
    );
    t.strictSame(
      m(t, "a <script>\n \t\t   na\n  \tz    z    ", {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      "a\n<script>\n \t\t   na\n  \tz    z    ",
      "14.04"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - code-pre blocks are not touched`,
  (t) => {
    const preBlock = `<pre id="lalalaa"><code class="tralalaa">    \n    \t   zz    z  \n  \t  r  r  \n \t  </code></pre>`;
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      preBlock,
      "15.01"
    );
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      preBlock,
      "15.02"
    );
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      preBlock,
      "15.03"
    );
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      preBlock,
      "15.04"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - CDATA blocks are not touched`,
  (t) => {
    const preBlock = `<![CDATA[          \n     \t   \n  a  a \r     \n a    \t    \t\t\t\t\t  a   \n     \t\t\t    ]]>`;
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      preBlock,
      "16.01"
    );
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      preBlock,
      "16.02"
    );
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      preBlock,
      "16.03"
    );
    t.strictSame(
      m(t, preBlock, {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      preBlock,
      "16.04"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - whitespace in front of </script>`,
  (t) => {
    // 0. baseline - no whitespace in front of </script>
    const code1 = 'a\n<script>const a = "test";</script> b';
    t.strictSame(
      m(t, code1, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      code1,
      "17.01"
    );
    t.strictSame(
      m(t, code1, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      code1,
      "17.02"
    );
    t.strictSame(
      m(t, code1, {
        removeLineBreaks: true,
        removeIndentations: false,
      }).result,
      code1,
      "17.03"
    );
    t.strictSame(
      m(t, code1, {
        removeLineBreaks: true,
        removeIndentations: true,
      }).result,
      code1,
      "17.04"
    );

    // case 1 - stops at non-whitespace character, ";"
    const code2 = 'a\n<script>const a = "test";   \t   </script> b';
    const minified2 = 'a\n<script>const a = "test";</script> b';
    t.strictSame(
      m(t, code2, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      code2,
      "17.05"
    );
    t.strictSame(
      m(t, code2, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      minified2,
      "17.06"
    );
    t.strictSame(
      m(t, code2, {
        removeLineBreaks: true,
      }).result,
      minified2,
      "17.07"
    );

    // case 2 - stops at line break character
    const code3 = 'a\n<script>const a = "test";   \n   </script> b';
    const minified3 = 'a\n<script>const a = "test";   \n</script> b';
    t.strictSame(
      m(t, code3, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      code3,
      "17.08"
    );
    t.strictSame(
      m(t, code3, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      minified3,
      "17.09"
    );
    t.strictSame(
      m(t, code3, {
        removeLineBreaks: true,
      }).result,
      minified3,
      "17.10"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - single linebreak is not replaced with a single space`,
  (t) => {
    t.equal(m(t, "a\nb", { removeLineBreaks: true }).result, "a\nb", "18.01");
    t.equal(
      m(t, "a\nb", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
      "a\nb",
      "18.02"
    );
    t.equal(
      m(t, "a\nb", { removeLineBreaks: true, lineLengthLimit: 100 }).result,
      "a\nb",
      "18.03"
    );
    t.equal(
      m(t, "a\nb", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
      "a\nb",
      "18.04"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - single linebreak is deleted though`,
  (t) => {
    t.equal(
      m(t, "<x>\n<y>", { removeLineBreaks: true }).result,
      "<x><y>",
      "19.01"
    );
    t.equal(
      m(t, "<a>\n<y>", { removeLineBreaks: true }).result,
      "<a><y>",
      "19.02"
    );
    t.equal(
      m(t, "<x>\n<a>", { removeLineBreaks: true }).result,
      "<x> <a>",
      "19.03"
    );
    t.equal(
      m(t, "<a>\n<b>", { removeLineBreaks: true }).result,
      "<a> <b>",
      "19.04"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - breaking to the right of style tag`,
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

    t.equal(m(t, source, { removeLineBreaks: true }).result, res1, "20.01");
    t.equal(
      m(t, source, {
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
      "20.02"
    );
    t.equal(
      m(t, source, {
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
      "20.03"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - doesn't delete whitespace with linebreaks between curlies`,
  (t) => {
    const source = "{% a %}\n\n\n{% a %}";
    t.equal(m(t, source, { removeLineBreaks: true }).result, source, "21.01");
    t.equal(
      m(t, source, { removeLineBreaks: false }).result,
      "{% a %}\n{% a %}",
      "21.02"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - does not mangle different-type line endings, LF`,
  (t) => {
    const source = "a\n";
    t.equal(m(t, source).result, source, "22");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - does not mangle different-type line endings, CR`,
  (t) => {
    const source = "a\r";
    t.equal(m(t, source).result, source, "23");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${35}m${`BAU`}\u001b[${39}m`} - does not mangle different-type line endings, CRLF`,
  (t) => {
    const source = "a\r\n";
    t.equal(m(t, source).result, source, "24");
    t.end();
  }
);

tap.test(`line break into space`, (t) => {
  t.strictSame(
    m(t, "abc\ndef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "25.01"
  );
  t.strictSame(
    m(t, "abc\n\ndef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "25.02"
  );
  t.strictSame(
    m(t, "abc\rdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "25.03"
  );
  t.strictSame(
    m(t, "abc\r\rdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "25.04"
  );
  t.end();
});

tap.test(`tab into space`, (t) => {
  t.strictSame(
    m(t, "abc\tdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "26.01"
  );
  t.strictSame(
    m(t, "abc\t\tdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "26.02"
  );
  t.end();
});
