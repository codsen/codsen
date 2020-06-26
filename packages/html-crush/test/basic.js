import tap from "tap";
import { crush } from "../dist/html-crush.esm";

const m = crush;

// Small tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - deletes trailing space`,
  (t) => {
    t.match(
      m(" <a> \n <b> ", {
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.01"
    );
    t.match(
      m(" <a>\n<b> ", {
        removeLineBreaks: true,
      }),
      {
        result: "<a>\n<b>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.02"
    );
    t.match(
      m(" <section> \n <article> ", {
        removeLineBreaks: true,
      }),
      {
        result: "<section><article>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.03"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - retains trailing linebreak`,
  (t) => {
    t.match(
      m(" <a> \n <b> \n", {
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b>\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "02"
    );

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - trailing line break`,
  (t) => {
    t.match(
      m(" a \n b \n", {
        removeLineBreaks: true,
      }),
      {
        result: "a b\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - multiple line breaks`,
  (t) => {
    t.match(
      m(" a \n b\n\n\nc ", {
        removeLineBreaks: true,
      }),
      {
        result: "a b c",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - ends with character`,
  (t) => {
    t.match(
      m(" a \n b\n\n\nc", {
        removeLineBreaks: true,
      }),
      {
        result: "a b c",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  (t) => {
    t.match(
      m("<aa><bb>\t<cc><dd>", { lineLengthLimit: 12, removeLineBreaks: true }),
      {
        result: "<aa><bb><cc>\n<dd>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "06 - clone of 02.11.09"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - what happens when it's impossible to break and exceeding line length limit is inevitable`,
  (t) => {
    t.match(
      m("abc ghijklmnop xyz", { lineLengthLimit: 2, removeLineBreaks: true }),
      {
        result: "abc\nghijklmnop\nxyz",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks lines when limiter is on`,
  (t) => {
    t.match(
      m("aa bb cc\n", {
        lineLengthLimit: 3,
        removeLineBreaks: true,
      }),
      {
        result: "aa\nbb\ncc\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks along with wiping whitespace`,
  (t) => {
    t.match(
      m("aa   \n \t  bb   \n \t    cc", {
        lineLengthLimit: 3,
      }),
      {
        result: "aa\nbb\ncc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks unbreakable chunks, each over limit`,
  (t) => {
    t.match(
      m("abcde   \n \t  fghij   \n \t    klmno", {
        lineLengthLimit: 3,
      }),
      {
        result: "abcde\nfghij\nklmno",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace`,
  (t) => {
    t.match(
      m("    \n    <a>\n\n   <b>\n  <c>", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b>\n<c>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "11.01 - inline tags"
    );
    t.match(
      m("    \n    <x>\n\n   <y>\n  <z>", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }),
      {
        result: "<x><y>\n<z>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "11.02 - not inline tags"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting`,
  (t) => {
    t.match(
      m("  <a>\n     <b>\n   c </b>\n   </a>", {
        lineLengthLimit: 9,
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b> c\n</b></a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "12.01"
    );
    t.match(
      m("  <x>\n     <y>\n   c </y>\n   </x>", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }),
      {
        result: "<x><y> c\n</y></x>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "12.02 - not inline tags"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting`,
  (t) => {
    t.match(
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
      ),
      {
        result: "<a> <b> c\n</b></a>\n<a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "13.01 - inline tags"
    );
    t.match(
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
      ),
      {
        result: "<x><y> c\n</y></x>\n<x>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "13.02 - non-inline tags"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 8`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 8,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa\nbbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 10`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 10,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa\nbbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 14`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 14,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa bbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence without whitespace is wrapped`,
  (t) => {
    t.match(
      m("<aa><bb><cc>", { lineLengthLimit: 8, removeLineBreaks: true }),
      {
        result: "<aa><bb>\n<cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "17 - duplicates 02.10.01"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence completely wrapped`,
  (t) => {
    t.match(
      m("<aa><bb><cc>", { lineLengthLimit: 7, removeLineBreaks: true }),
      {
        result: "<aa>\n<bb>\n<cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 13,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa bbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "clone of 02.05.14"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags, end with character`,
  (t) => {
    t.match(
      m(" <x> \n <y>\n\n\n<z>", {
        removeLineBreaks: true,
      }),
      {
        result: "<x><y><z>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "20.01"
    );
    t.match(
      m(" <a> \n <b>\n\n\n<i>\n\n\n<c>", {
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b> <i><c>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - comments`,
  (t) => {
    const src = `<!--<![endif]-->`;
    t.match(
      m(src, {
        removeLineBreaks: true,
      }),
      {
        result: src,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "21"
    );
    t.end();
  }
);
