import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

tap.test(
  `01 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - inline tags are not separated`,
  (t) => {
    t.match(
      m("<a><a>", {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<a><a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.01"
    );
    t.match(
      m("<a><a>", {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<a><a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.02"
    );
    t.match(
      m("<a><a>", {
        lineLengthLimit: 2,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "<a><a>",
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
  `02 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - inline tags are not separated`,
  (t) => {
    t.match(
      m(`let me tell you <a><span>something</span></a> new`, {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: `let
me
tell
you
<a><span>something</span></a>
new`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "02.01"
    );
    t.match(
      m(`let me tell you <a><span>something</span></a> new`, {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: `let me tell you <a><span>something</span></a> new`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "02.02"
    );
    t.match(
      m(`let me tell you <a><span>something</span></a> new`, {
        lineLengthLimit: 2,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: `let me tell you <a><span>something</span></a> new`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "02.03"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - non-inline tags are separated`,
  (t) => {
    t.match(
      m("<div><div>", {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<div>\n<div>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "03.01"
    );
    t.match(
      m("<div><div>", {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<div><div>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "03.02"
    );
    t.match(
      m("<div><div>", {
        lineLengthLimit: 2,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "<div><div>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "03.03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  (t) => {
    t.match(
      m("<aa><bb>\t<cc><dd>", {
        lineLengthLimit: 12,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<aa><bb><cc>\n<dd>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "04.01"
    );
    t.match(
      m("<aa><bb>\t<cc><dd>", {
        lineLengthLimit: 12,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<aa><bb>\t<cc><dd>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "04.02"
    );
    t.match(
      m("<aa><bb>\t<cc><dd>", {
        lineLengthLimit: 12,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "<aa><bb>\t<cc><dd>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "04.03"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - what happens when it's impossible to break and exceeding line length limit is inevitable`,
  (t) => {
    t.match(
      m("abc ghijklmnop xyz", {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "abc\nghijklmnop\nxyz",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "05.01"
    );
    t.match(
      m("abc ghijklmnop xyz", {
        lineLengthLimit: 2,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "abc ghijklmnop xyz",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "05.02"
    );
    t.match(
      m("abc ghijklmnop xyz", {
        lineLengthLimit: 2,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "abc ghijklmnop xyz",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "05.03"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks lines when limiter is on`,
  (t) => {
    t.match(
      m("aa bb cc\n", {
        lineLengthLimit: 3,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "aa\nbb\ncc\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "06.01"
    );
    t.match(
      m("aa bb cc\n", {
        lineLengthLimit: 3,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "aa bb cc\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "06.02"
    );
    t.match(
      m("aa bb cc\n", {
        lineLengthLimit: 3,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "aa bb cc\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "06.03"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks along with wiping whitespace`,
  (t) => {
    t.match(
      m("aa   \n \t  bb   \n \t    cc", {
        lineLengthLimit: 3,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "aa\nbb\ncc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "07.01"
    );
    t.match(
      m("aa   \n \t  bb   \n \t    cc", {
        lineLengthLimit: 3,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "aa\nbb\ncc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "07.02"
    );
    t.match(
      m("aa   \n \t  bb   \n \t    cc", {
        lineLengthLimit: 3,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "aa\n \t  bb\n \t    cc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "07.03"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks unbreakable chunks, each over limit`,
  (t) => {
    t.match(
      m("abcde   \n \t  fghij   \n \t    klmno", {
        removeIndentations: true,
        removeLineBreaks: true,
        lineLengthLimit: 3,
      }),
      {
        result: "abcde\nfghij\nklmno",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "08.01"
    );
    t.match(
      m("abcde   \n \t  fghij   \n \t    klmno", {
        removeIndentations: true,
        removeLineBreaks: false,
        lineLengthLimit: 3,
      }),
      {
        result: "abcde\nfghij\nklmno",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "08.02"
    );
    t.match(
      m("abcde   \n \t  fghij   \n \t    klmno", {
        removeIndentations: false,
        removeLineBreaks: false,
        lineLengthLimit: 3,
      }),
      {
        result: "abcde\n \t  fghij\n \t    klmno",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "08.03"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace - inline tags`,
  (t) => {
    t.match(
      m("    \n    <a>\n\n   <b>\n  <c>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b>\n<c>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "09.01"
    );
    t.match(
      m("    \n    <a>\n\n   <b>\n  <c>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<a>\n<b>\n<c>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "09.02"
    );
    t.match(
      m("    \n    <a>\n\n   <b>\n  <c>", {
        lineLengthLimit: 8,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "\n    <a>\n   <b>\n  <c>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "09.03"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace - not inline tags`,
  (t) => {
    t.match(
      m("    \n    <x>\n\n   <y>\n  <z>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<x><y>\n<z>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "10.01"
    );
    t.match(
      m("    \n    <x>\n\n   <y>\n  <z>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<x>\n<y>\n<z>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "10.02"
    );
    t.match(
      m("    \n    <x>\n\n   <y>\n  <z>", {
        lineLengthLimit: 8,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "\n    <x>\n   <y>\n  <z>", // only trimmed whitespace lines and removed empty-ones
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "10.03"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting - inline tags`,
  (t) => {
    t.match(
      m("  <a>\n     <b>\n   c </b>\n   </a>", {
        lineLengthLimit: 9,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b> c\n</b></a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "11.01"
    );
    t.match(
      m("  <a>\n     <b>\n   c </b>\n   </a>", {
        lineLengthLimit: 9,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<a>\n<b>\nc </b>\n</a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "11.02"
    );
    t.match(
      m("  <a>\n     <b>\n   c </b>\n   </a>", {
        lineLengthLimit: 9,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "  <a>\n     <b>\n   c </b>\n   </a>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "11.03"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting - not inline tags`,
  (t) => {
    t.match(
      m("  <x>\n     <y>\n   c </y>\n   </x>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<x><y> c\n</y></x>",
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
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<x>\n<y>\nc </y>\n</x>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "12.02"
    );
    t.match(
      m("  <x>\n     <y>\n   c </y>\n   </x>", {
        lineLengthLimit: 8,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "  <x>\n     <y>\n   c </y>\n   </x>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "12.03"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting - inline tags`,
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
          removeIndentations: true,
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
      "13.01"
    );
    t.match(
      m(
        `  <a>
       <b>
     c </b>
     </a>
       <a>`,
        {
          lineLengthLimit: 9,
          removeIndentations: true,
          removeLineBreaks: false,
        }
      ),
      {
        result: `<a>
<b>
c </b>
</a>
<a>`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "13.02"
    );
    t.match(
      m(
        `  <a>
       <b>
     c </b>
     </a>
       <a>`,
        {
          lineLengthLimit: 9,
          removeIndentations: false,
          removeLineBreaks: false,
        }
      ),
      {
        result: `  <a>
       <b>
     c </b>
     </a>
       <a>`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "13.03"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting - non-inline tags`,
  (t) => {
    t.match(
      m(
        `  <x>
       <y>
     c </y>
   </x>
       <x>`,
        {
          lineLengthLimit: 8,
          removeIndentations: true,
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
      "14.01"
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
          removeIndentations: true,
          removeLineBreaks: false,
        }
      ),
      {
        result: `<x>
<y>
c </y>
</x>
<x>`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "14.02"
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
          removeIndentations: false,
          removeLineBreaks: false,
        }
      ),
      {
        result: `  <x>
       <y>
     c </y>
   </x>
       <x>`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "14.03"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 8`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa\nbbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "15.01"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "15.02"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 8,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "15.03"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 10`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 10,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa\nbbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "16.01"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 10,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "16.02"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 10,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "16.03"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 14`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 14,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa bbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "17.01"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 14,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "17.02"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 14,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "17.03"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence without whitespace is wrapped`,
  (t) => {
    t.match(
      m("<aa><bb><cc>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<aa><bb>\n<cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "18.01"
    );
    t.match(
      m("<aa><bb><cc>", {
        lineLengthLimit: 8,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<aa><bb><cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "18.02"
    );
    t.match(
      m("<aa><bb><cc>", {
        lineLengthLimit: 8,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "<aa><bb><cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "18.03"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence completely wrapped`,
  (t) => {
    t.match(
      m("<aa><bb><cc>", {
        lineLengthLimit: 7,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "<aa>\n<bb>\n<cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "19.01"
    );
    t.match(
      m("<aa><bb><cc>", {
        lineLengthLimit: 7,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "<aa><bb><cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "19.02"
    );
    t.match(
      m("<aa><bb><cc>", {
        lineLengthLimit: 7,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "<aa><bb><cc>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "19.03"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`,
  (t) => {
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 13,
        removeIndentations: true,
        removeLineBreaks: true,
      }),
      {
        result: "aaaaaa bbbbbb\ncccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "20.01"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 13,
        removeIndentations: true,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "20.02"
    );
    t.match(
      m("aaaaaa bbbbbb cccccc", {
        lineLengthLimit: 13,
        removeIndentations: false,
        removeLineBreaks: false,
      }),
      {
        result: "aaaaaa bbbbbb cccccc",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "20.03"
    );
    t.end();
  }
);
