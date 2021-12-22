import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

test(`01 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - inline tags are not separated`, () => {
  compare(
    ok,
    m(equal, "<a><a>", {
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
  compare(
    ok,
    m(equal, "<a><a>", {
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
  compare(
    ok,
    m(equal, "<a><a>", {
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
});

test(`02 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - inline tags are not separated`, () => {
  compare(
    ok,
    m(equal, `let me tell you <a><span>something</span></a> new`, {
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
  compare(
    ok,
    m(equal, `let me tell you <a><span>something</span></a> new`, {
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
  compare(
    ok,
    m(equal, `let me tell you <a><span>something</span></a> new`, {
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
});

test(`03 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - non-inline tags are separated`, () => {
  compare(
    ok,
    m(equal, "<div><div>", {
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
  compare(
    ok,
    m(equal, "<div><div>", {
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
  compare(
    ok,
    m(equal, "<div><div>", {
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
});

test(`04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`, () => {
  compare(
    ok,
    m(equal, "<aa><bb>\t<cc><dd>", {
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
  compare(
    ok,
    m(equal, "<aa><bb>\t<cc><dd>", {
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
  compare(
    ok,
    m(equal, "<aa><bb>\t<cc><dd>", {
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
});

test(`05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - what happens when it's impossible to break and exceeding line length limit is inevitable`, () => {
  compare(
    ok,
    m(equal, "abc ghijklmnop xyz", {
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
  compare(
    ok,
    m(equal, "abc ghijklmnop xyz", {
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
  compare(
    ok,
    m(equal, "abc ghijklmnop xyz", {
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
});

test(`06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks lines when limiter is on`, () => {
  compare(
    ok,
    m(equal, "aa bb cc\n", {
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
  compare(
    ok,
    m(equal, "aa bb cc\n", {
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
  compare(
    ok,
    m(equal, "aa bb cc\n", {
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
});

test(`07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks along with wiping whitespace`, () => {
  compare(
    ok,
    m(equal, "aa   \n \t  bb   \n \t    cc", {
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
  compare(
    ok,
    m(equal, "aa   \n \t  bb   \n \t    cc", {
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
  compare(
    ok,
    m(equal, "aa   \n \t  bb   \n \t    cc", {
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
});

test(`08 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks unbreakable chunks, each over limit`, () => {
  compare(
    ok,
    m(equal, "abcde   \n \t  fghij   \n \t    klmno", {
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
  compare(
    ok,
    m(equal, "abcde   \n \t  fghij   \n \t    klmno", {
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
  compare(
    ok,
    m(equal, "abcde   \n \t  fghij   \n \t    klmno", {
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
});

test(`09 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace - inline tags`, () => {
  compare(
    ok,
    m(equal, "    \n    <a>\n\n   <b>\n  <c>", {
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
  compare(
    ok,
    m(equal, "    \n    <a>\n\n   <b>\n  <c>", {
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
  compare(
    ok,
    m(equal, "    \n    <a>\n\n   <b>\n  <c>", {
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
});

test(`10 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - stacks tags, wipes whitespace - not inline tags`, () => {
  compare(
    ok,
    m(equal, "    \n    <x>\n\n   <y>\n  <z>", {
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
  compare(
    ok,
    m(equal, "    \n    <x>\n\n   <y>\n  <z>", {
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
  compare(
    ok,
    m(equal, "    \n    <x>\n\n   <y>\n  <z>", {
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
});

test(`11 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting - inline tags`, () => {
  compare(
    ok,
    m(equal, "  <a>\n     <b>\n   c </b>\n   </a>", {
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
  compare(
    ok,
    m(equal, "  <a>\n     <b>\n   c </b>\n   </a>", {
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
  compare(
    ok,
    m(equal, "  <a>\n     <b>\n   c </b>\n   </a>", {
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
});

test(`12 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting - not inline tags`, () => {
  compare(
    ok,
    m(equal, "  <x>\n     <y>\n   c </y>\n   </x>", {
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
  compare(
    ok,
    m(equal, "  <x>\n     <y>\n   c </y>\n   </x>", {
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
  compare(
    ok,
    m(equal, "  <x>\n     <y>\n   c </y>\n   </x>", {
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
});

test(`13 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting - inline tags`, () => {
  compare(
    ok,
    m(
      equal,
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
  compare(
    ok,
    m(
      equal,
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
  compare(
    ok,
    m(
      equal,
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
});

test(`14 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - more tags and limiting - non-inline tags`, () => {
  compare(
    ok,
    m(
      equal,
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
  compare(
    ok,
    m(
      equal,
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
  compare(
    ok,
    m(
      equal,
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
});

test(`15 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 8`, () => {
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
});

test(`16 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 10`, () => {
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
});

test(`17 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags and limiting = 14`, () => {
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
});

test(`18 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence without whitespace is wrapped`, () => {
  compare(
    ok,
    m(equal, "<aa><bb><cc>", {
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
  compare(
    ok,
    m(equal, "<aa><bb><cc>", {
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
  compare(
    ok,
    m(equal, "<aa><bb><cc>", {
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
});

test(`19 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tag sequence completely wrapped`, () => {
  compare(
    ok,
    m(equal, "<aa><bb><cc>", {
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
  compare(
    ok,
    m(equal, "<aa><bb><cc>", {
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
  compare(
    ok,
    m(equal, "<aa><bb><cc>", {
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
});

test(`20 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - string sequence breaks in front of space`, () => {
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
  compare(
    ok,
    m(equal, "aaaaaa bbbbbb cccccc", {
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
});

test.run();
