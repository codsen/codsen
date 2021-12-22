import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";
import { m, mixer } from "./util/util.js";

function strip(str) {
  if (typeof str === "string") {
    return str
      .replace(/<[^>]*>/gi, "")
      .replace(/\s+/gi, " ")
      .trim();
  }
  throw new Error(`source must be string! It was given as: ${typeof str}`);
}

// B.A.U.
// -----------------------------------------------------------------------------

test(`01 - nothing to minify, empty`, () => {
  let source = ``;
  mixer({}).forEach((opt) => {
    equal(m(equal, source, opt).result, ``, JSON.stringify(opt, null, 4));
    equal(m(equal, source, opt).ranges, null, JSON.stringify(opt, null, 4));
  });
});

test(`02 - nothing to minify, non-empty`, () => {
  let source = `zzzz`;
  mixer({}).forEach((opt) => {
    equal(m(equal, source, opt).result, `zzzz`, JSON.stringify(opt, null, 4));
    equal(m(equal, source, opt).ranges, null, JSON.stringify(opt, null, 4));
  });
});

test(`03 - minimal string of few words`, () => {
  let source = ` \t
<x>\t\t
  <y>\t
    c\t
  </y>\t
</x>\t
\t
`;
  mixer({
    removeLineBreaks: true, // <---
  }).forEach((opt) => {
    equal(
      m(equal, source, opt).result,
      `<x><y> c </y></x>\n`,
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    removeLineBreaks: false,
    removeIndentations: true, // <---
  }).forEach((opt) => {
    equal(
      m(equal, source, opt).result,
      `<x>
<y>
c
</y>
</x>
`,
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    removeLineBreaks: false,
    removeIndentations: false, // <---
  }).forEach((opt) => {
    equal(
      m(equal, source, opt).result,
      `
<x>
  <y>
    c
  </y>
</x>
`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04 - trailing linebreaks (or their absence) at the EOF are respected`, () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    equal(
      m(equal, `\n<x>\n  <y>\n    c\n  </y>\n</x>\n`, opt).result,
      `<x><y> c </y></x>\n`,
      `${JSON.stringify(opt, null, 0)} - single trailing line breaks at EOF`
    );
  });
  mixer({
    removeLineBreaks: false,
    removeIndentations: true,
  }).forEach((opt) => {
    equal(
      m(equal, `\n<x>\n  <y>\n    c\n  </y>\n</x>\n`, opt).result,
      `<x>\n<y>\nc\n</y>\n</x>\n`,
      `${JSON.stringify(opt, null, 0)} - single trailing line breaks at EOF`
    );
  });
  // with both settings off, frontal trimming won't happen, notice
  // first "\n"
  mixer({
    removeLineBreaks: false,
    removeIndentations: false,
  }).forEach((opt) => {
    equal(
      m(equal, `\n<x>\n  <y>\n    c\n  </y>\n</x>\n`, opt).result,
      `\n<x>\n  <y>\n    c\n  </y>\n</x>\n`,
      `${JSON.stringify(opt, null, 0)} - single trailing line breaks at EOF`
    );
  });
});

test(`05 - trailing linebreaks (or their absence) at the EOF are respected`, () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    equal(
      m(equal, `\n<x>\n  <y>\n    c\n  </y>\n</x>\n\n`, opt).result,
      `<x><y> c </y></x>\n`,
      `${JSON.stringify(opt, null, 4)} - double trailing line breaks at EOF`
    );
  });
});

test(`06 - trailing linebreaks (or their absence) at the EOF are respected`, () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    equal(
      m(equal, `\n<x>\n  <y>\n    c\n  </y>\n</x>`, opt).result,
      `<x><y> c </y></x>`,
      `${JSON.stringify(opt, null, 4)} - no trailing line breaks at EOF`
    );
  });
});

test(`07 - opts.lineLengthLimit`, () => {
  // the following piece of HTML will render as having spaces between C's:
  let original = `  <x>
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

  let minified = "<x><y> c </y></x><x><y> c </y></x><x><y> c </y></x>\n";

  equal(
    m(equal, original, { removeLineBreaks: true }).result,
    minified,
    "07.01 - default settings"
  );
  equal(strip(original), strip(minified), "07.02");

  let minified8 = `<x><y> c
</y></x>
<x><y> c
</y></x>
<x><y> c
</y></x>
`;
  equal(
    m(equal, original, {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    minified8,
    "07.03"
  );

  m(equal, original, {
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
      ok(line.length <= 8, `row #${i}`);
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
    ok(line.length <= 8, `row #${i}`);
  });
});

test(`08 - when chunk of characters without break points is longer than line limit - spaces`, () => {
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: false,
      lineLengthLimit: 0,
    }).result,
    "aaaaaa bbbbbb cccccc",
    "08.01-1"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    "aaaaaa bbbbbb cccccc",
    "08.02-2"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 1,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.03"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 2,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.04"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 3,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.05"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 4,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.06"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 5,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.07"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 6,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.08"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 7,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.09"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.10"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 9,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.11"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.12"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 11,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.13"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "08.14 - the very edge"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.15"
  );
  equal(
    m(equal, "aaaaaa  bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.16 - double space"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.17 - double linebreak"
  );
  equal(
    m(equal, "aaaaaa \n \n bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.18 - double linebreak with spaces"
  );
  equal(
    m(equal, "aaaaaa\t\n\t\n\tbbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 13,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.19 - double linebreak with spaces"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 14,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.20 - two chunks can stay on one line generously"
  );
  equal(
    m(equal, "aaaaaa bbbbbb cccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 15,
    }).result,
    "aaaaaa bbbbbb\ncccccc",
    "08.21 - two chunks can stay on one line generously"
  );
});

test(`09 - when chunk of characters without break points is longer than line limit - linebreaks`, () => {
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.01"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 1,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.02"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 2,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.03"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 3,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.04"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 4,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.05"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 5,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.06"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 6,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.07"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 7,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.08"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.09"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 9,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.10"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.11"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 11,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.12"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "09.13 - the very edge"
  );
  equal(
    m(equal, "aaaaaa\nbbbbbb\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "aaaaaa bbbbbb cccccc",
    "09.14"
  );
});

test(`10 - when chunk of characters without break points is longer than line limit - double linebreaks`, () => {
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    "aaaaaa bbbbbb cccccc",
    "10.01"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 1,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.02"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 2,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.03"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 3,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.04"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 4,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.05"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 5,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.06"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 6,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.07"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 7,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.08"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.09"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 9,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.10"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.11"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 11,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.12"
  );
  equal(
    m(equal, "aaaaaa\n\nbbbbbb\n\ncccccc", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "aaaaaa\nbbbbbb\ncccccc",
    "10.13 - the very edge"
  );
});

test(`11 - tags with single space between them`, () => {
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    "<aaaa><bbbb><cccc>",
    "11.01 - same but with tags"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 1,
    }).result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "11.02 - the very edge"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 2,
    }).result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "11.03"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    }).result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "11.04"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 11,
    }).result,
    "<aaaa>\n<bbbb>\n<cccc>",
    "11.05"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aaaa><bbbb>\n<cccc>",
    "11.06"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 13,
    }).result,
    "<aaaa><bbbb>\n<cccc>",
    "11.07"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 14,
    }).result,
    "<aaaa><bbbb>\n<cccc>",
    "11.08"
  );
  equal(
    m(equal, "<aaaa> <bbbb> <cccc>", {
      removeLineBreaks: true,
      lineLengthLimit: 15,
    }).result,
    "<aaaa><bbbb>\n<cccc>",
    "11.09"
  );
});

test(`12 - breaking between tags`, () => {
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
    "<aa><bb>",
    "12.01"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 1 }).result,
    "<aa>\n<bb>",
    "12.02"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 2 }).result,
    "<aa>\n<bb>",
    "12.03"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
    "<aa>\n<bb>",
    "12.04"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 4 }).result,
    "<aa>\n<bb>",
    "12.05"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 5 }).result,
    "<aa>\n<bb>",
    "12.06"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 6 }).result,
    "<aa>\n<bb>",
    "12.07"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 7 }).result,
    "<aa>\n<bb>",
    "12.08"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 8 }).result,
    "<aa><bb>",
    "12.09"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 9 }).result,
    "<aa><bb>",
    "12.10"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 10 })
      .result,
    "<aa><bb>",
    "12.11"
  );
  equal(
    m(equal, "<aa><bb>", { removeLineBreaks: true, lineLengthLimit: 999 })
      .result,
    "<aa><bb>",
    "12.12"
  );
});

test(`13 - break-position-friendly characters, not suitable for break yet - line limit 8`, () => {
  //
  // line limit 8
  // ============

  // at position at character index 4, the break is staged but never submitted:
  equal(
    m(equal, "<aa><bb><cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "<aa><bb>\n<cc>",
    "13.01"
  );
  equal(
    m(equal, "<aa><bb><cc><dd>", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "<aa><bb>\n<cc><dd>",
    "13.02"
  );

  // same as above, but with whitespace
  equal(
    m(equal, "<aa>\t<bb>\t<cc>", { removeLineBreaks: true, lineLengthLimit: 8 })
      .result,
    "<aa><bb>\n<cc>",
    "13.03"
  );
  equal(
    m(equal, "<aa>\t\t<bb>\t<cc>\t\t<dd>", {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    "<aa><bb>\n<cc><dd>",
    "13.04"
  );

  // same as above, except with trailing tab
  equal(
    m(equal, "<aa>\t<bb>\t<cc>\t", {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    "<aa><bb>\n<cc>",
    "13.05"
  );
  equal(
    m(equal, "<aa>\t\t<bb>\t<cc>\t\t<dd>\t", {
      removeLineBreaks: true,
      lineLengthLimit: 8,
    }).result,
    "<aa><bb>\n<cc><dd>",
    "13.06"
  );
});

test(`14 - break-position-friendly characters, not suitable for break yet - line limit 12`, () => {
  //
  // line limit 12
  // =============

  equal(
    m(equal, "<aa><bb><cc><dd>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd>",
    "14.01"
  );
  equal(
    m(equal, "<aa><bb><cc><dd><ee>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee>",
    "14.02"
  );
  equal(
    m(equal, "<aa><bb><cc><dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "14.03"
  );
  equal(
    m(equal, "<aa><bb><cc><dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "14.04"
  );

  // tab after first tag:

  equal(
    m(equal, "<aa>\t<bb><cc><dd>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd>",
    "14.05"
  );
  equal(
    m(equal, "<aa>\t<bb><cc><dd><ee>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee>",
    "14.06"
  );
  equal(
    m(equal, "<aa>\t<bb><cc><dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "14.07"
  );
  equal(
    m(equal, "<aa>\t<bb><cc><dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "14.08"
  );

  // tab after second tag:

  equal(
    m(equal, "<aa><bb>\t<cc><dd>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd>",
    "14.09"
  );
  equal(
    m(equal, "<aa><bb>\t<cc><dd><ee>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee>",
    "14.10"
  );
  equal(
    m(equal, "<aa><bb>\t<cc><dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "14.11"
  );
  equal(
    m(equal, "<aa><bb>\t<cc><dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "14.12"
  );

  // tab after third tag:

  equal(
    m(equal, "<aa><bb><cc>\t<dd>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd>",
    "14.13"
  );
  equal(
    m(equal, "<aa><bb><cc>\t<dd><ee>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee>",
    "14.14"
  );
  equal(
    m(equal, "<aa><bb><cc>\t<dd><ee><ff>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>",
    "14.15"
  );
  equal(
    m(equal, "<aa><bb><cc>\t<dd><ee><ff><gg>", {
      removeLineBreaks: true,
      lineLengthLimit: 12,
    }).result,
    "<aa><bb><cc>\n<dd><ee><ff>\n<gg>",
    "14.16"
  );
});

test(`15 - script tags are skipped`, () => {
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    "a <script>\n \t\t   na\n  \tz</script> z",
    "15.01"
  );
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    "a\n<script>\n \t\t   na\n  \tz</script> z",
    "15.02 - default"
  );
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: true,
      removeIndentations: false,
    }).result,
    "a\n<script>\n \t\t   na\n  \tz</script> z",
    "15.03"
  );
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz</script> z    ", {
      removeLineBreaks: true,
      removeIndentations: true,
    }).result,
    "a\n<script>\n \t\t   na\n  \tz</script> z",
    "15.04"
  );
});

test(`16 - unfinished script tags are skipped too`, () => {
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    "a <script>\n \t\t   na\n  \tz    z    ",
    "16.01"
  );
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    "a\n<script>\n \t\t   na\n  \tz    z    ",
    "16.02 - default"
  );
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: true,
      removeIndentations: false,
    }).result,
    "a\n<script>\n \t\t   na\n  \tz    z    ",
    "16.03"
  );
  equal(
    m(equal, "a <script>\n \t\t   na\n  \tz    z    ", {
      removeLineBreaks: true,
      removeIndentations: true,
    }).result,
    "a\n<script>\n \t\t   na\n  \tz    z    ",
    "16.04"
  );
});

test(`17 - code-pre blocks are not touched`, () => {
  let preBlock = `<pre id="lalalaa"><code class="tralalaa">    \n    \t   zz    z  \n  \t  r  r  \n \t  </code></pre>`;
  equal(
    m(equal, preBlock, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    preBlock,
    "17.01"
  );
  equal(
    m(equal, preBlock, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    preBlock,
    "17.02"
  );
  equal(
    m(equal, preBlock, {
      removeLineBreaks: true,
      removeIndentations: false,
    }).result,
    preBlock,
    "17.03"
  );
  equal(
    m(equal, preBlock, {
      removeLineBreaks: true,
      removeIndentations: true,
    }).result,
    preBlock,
    "17.04"
  );
});

test(`18 - CDATA blocks are not touched`, () => {
  let preBlock = `<![CDATA[          \n     \t   \n  a  a \r     \n a    \t    \t\t\t\t\t  a   \n     \t\t\t    ]]>`;
  equal(
    m(equal, preBlock, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    preBlock,
    "18.01"
  );
  equal(
    m(equal, preBlock, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    preBlock,
    "18.02"
  );
  equal(
    m(equal, preBlock, {
      removeLineBreaks: true,
      removeIndentations: false,
    }).result,
    preBlock,
    "18.03"
  );
  equal(
    m(equal, preBlock, {
      removeLineBreaks: true,
      removeIndentations: true,
    }).result,
    preBlock,
    "18.04"
  );
});

test(`19 - whitespace in front of </script>`, () => {
  // 0. baseline - no whitespace in front of </script>
  let code1 = 'a\n<script>const a = "test";</script> b';
  equal(
    m(equal, code1, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    code1,
    "19.01"
  );
  equal(
    m(equal, code1, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    code1,
    "19.02"
  );
  equal(
    m(equal, code1, {
      removeLineBreaks: true,
      removeIndentations: false,
    }).result,
    code1,
    "19.03"
  );
  equal(
    m(equal, code1, {
      removeLineBreaks: true,
      removeIndentations: true,
    }).result,
    code1,
    "19.04"
  );

  // case 1 - stops at non-whitespace character, ";"
  let code2 = 'a\n<script>const a = "test";   \t   </script> b';
  let minified2 = 'a\n<script>const a = "test";</script> b';
  equal(
    m(equal, code2, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    code2,
    "19.05"
  );
  equal(
    m(equal, code2, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    minified2,
    "19.06"
  );
  equal(
    m(equal, code2, {
      removeLineBreaks: true,
    }).result,
    minified2,
    "19.07"
  );

  // case 2 - stops at line break character
  let code3 = 'a\n<script>const a = "test";   \n   </script> b';
  let minified3 = 'a\n<script>const a = "test";   \n</script> b';
  equal(
    m(equal, code3, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    code3,
    "19.08"
  );
  equal(
    m(equal, code3, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    minified3,
    "19.09"
  );
  equal(
    m(equal, code3, {
      removeLineBreaks: true,
    }).result,
    minified3,
    "19.10"
  );
});

test(`20 - single linebreak is not replaced with a single space`, () => {
  equal(m(equal, "a\nb", { removeLineBreaks: true }).result, "a\nb", "20.01");
  equal(
    m(equal, "a\nb", { removeLineBreaks: true, lineLengthLimit: 0 }).result,
    "a\nb",
    "20.02"
  );
  equal(
    m(equal, "a\nb", { removeLineBreaks: true, lineLengthLimit: 100 }).result,
    "a\nb",
    "20.03"
  );
  equal(
    m(equal, "a\nb", { removeLineBreaks: true, lineLengthLimit: 3 }).result,
    "a\nb",
    "20.04"
  );
});

test(`21 - single linebreak is deleted though`, () => {
  equal(
    m(equal, "<x>\n<y>", { removeLineBreaks: true }).result,
    "<x><y>",
    "21.01"
  );
  equal(
    m(equal, "<a>\n<y>", { removeLineBreaks: true }).result,
    "<a><y>",
    "21.02"
  );
  equal(
    m(equal, "<x>\n<a>", { removeLineBreaks: true }).result,
    "<x> <a>",
    "21.03"
  );
  equal(
    m(equal, "<a>\n<b>", { removeLineBreaks: true }).result,
    "<a> <b>",
    "21.04"
  );
});

test(`22 - breaking to the right of style tag`, () => {
  let source = `<html>
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

  let res1 = `<html>
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

  let res2 = `<html>
<head><style type="text/css">.used-1{display:block;}
</style>
</head>
<body>
<table class="used-1"><tr><td> text
</td></tr></table>
</body>
</html>
`;

  let res3 = `<html>
<head><style type="text/css">.used-1{display:block;}</style>
</head>
<body>
<table class="used-1"><tr><td> text
</td></tr></table>
</body>
</html>
`;

  equal(m(equal, source, { removeLineBreaks: true }).result, res1, "22.01");
  equal(
    m(equal, source, {
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
    "22.02"
  );
  equal(
    m(equal, source, {
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
    "22.03"
  );
});

test(`23 - doesn't delete whitespace with linebreaks between curlies`, () => {
  let source = "{% a %}\n\n\n{% a %}";
  equal(m(equal, source, { removeLineBreaks: true }).result, source, "23.01");
  equal(
    m(equal, source, { removeLineBreaks: false }).result,
    "{% a %}\n{% a %}",
    "23.02"
  );
});

test(`24 - does not mangle different-type line endings, LF`, () => {
  let source = "a\n";
  equal(m(equal, source).result, source, "24");
});

test(`25 - does not mangle different-type line endings, CR`, () => {
  let source = "a\r";
  equal(m(equal, source).result, source, "25");
});

test(`26 - does not mangle different-type line endings, CRLF`, () => {
  let source = "a\r\n";
  equal(m(equal, source).result, source, "26");
});

test(`line break into space`, () => {
  equal(
    m(equal, "abc\ndef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "27.01"
  );
  equal(
    m(equal, "abc\n\ndef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "27.02"
  );
  equal(
    m(equal, "abc\rdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "27.03"
  );
  equal(
    m(equal, "abc\r\rdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "27.04"
  );
});

test(`tab into space`, () => {
  equal(
    m(equal, "abc\tdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "28.01"
  );
  equal(
    m(equal, "abc\t\tdef", {
      removeLineBreaks: true,
      lineLengthLimit: 100,
    }).result,
    "abc def",
    "28.02"
  );
});

test(`29 - issue #5, minimal`, () => {
  equal(
    crush(`<!DOCTYPE html>\r\n<html lang="en">\r\n`, {
      removeLineBreaks: true,
      removeIndentations: true,
    }).result,
    `<!DOCTYPE html>\r\n<html lang="en">\r\n`,
    "29"
  );
});

test(`30 - issue #5, minimal`, () => {
  let input = `<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n  <meta charset="UTF-8">`;
  equal(
    crush(input, {
      removeLineBreaks: true,
      removeHTMLComments: false,
      removeCSSComments: false,
    }).result,
    `<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">`,
    "30"
  );
});

test(`31 - issue #5, minimal`, () => {
  let eols = [`\r\n`, `\n`, `\r`];
  let sources = eols.map(
    (eol) => `<!DOCTYPE html>${eol}<html lang="en">${eol}`
  );
  sources.forEach((source, i) => {
    mixer({
      removeLineBreaks: true,
    }).forEach((opt) => {
      equal(
        m(equal, source, opt).result,
        `<!DOCTYPE html>${eols[i]}<html lang="en">${eols[i]}`,
        `${JSON.stringify(opt, null, 0)} - single trailing line breaks at EOF`
      );
    });
  });
});

test(`32 - issue #5`, () => {
  let eols = [`\r\n`, `\n`, `\r`];
  let sources = eols.map(
    (eol) =>
      `<!DOCTYPE html>${eol}<html lang="en">${eol}<head>${eol}<meta charset="UTF-8">${eol}<meta http-equiv="X-UA-Compatible" content="IE=edge">${eol}<meta name="viewport" content="width=device-width, initial-scale=1.0">${eol}  <title>Document</title>${eol}</head>${eol}<body>${eol}<div>Hello</div>${eol}</body>${eol}</html>${eol}`
  );

  sources.forEach((source, i) => {
    mixer({
      removeLineBreaks: true,
    }).forEach((opt) => {
      equal(
        m(equal, source, opt).result,
        `<!DOCTYPE html>${eols[i]}<html lang="en">${eols[i]}<head>${eols[i]}<meta charset="UTF-8">${eols[i]}<meta http-equiv="X-UA-Compatible" content="IE=edge">${eols[i]}<meta name="viewport" content="width=device-width, initial-scale=1.0">${eols[i]}<title>Document</title>${eols[i]}</head>${eols[i]}<body><div>Hello</div>${eols[i]}</body>${eols[i]}</html>${eols[i]}`,
        `${JSON.stringify(
          opt,
          null,
          0
        )} - single trailing line breaks at EOF (${JSON.stringify(
          eols[i],
          null,
          0
        )})`
      );
    });
  });
});

test.run();
