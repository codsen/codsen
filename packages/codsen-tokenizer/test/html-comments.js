import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// 01. simple-kind comments
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - simple case`, () => {
  let gathered = [];
  ct("a<!--b-->c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 5,
        kind: "simple",
        closing: false,
      },
      {
        type: "text",
        start: 5,
        end: 6,
      },
      {
        type: "comment",
        start: 6,
        end: 9,
        kind: "simple",
        closing: true,
      },
      {
        type: "text",
        start: 9,
        end: 10,
      },
    ],
    "01",
  );
});

test(`02 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - broken simple case, with space`, () => {
  let gathered = [];
  ct("a<! --b-- >c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 6,
        kind: "simple",
        closing: false,
      },
      {
        type: "text",
        start: 6,
        end: 7,
      },
      {
        type: "comment",
        start: 7,
        end: 11,
        kind: "simple",
        closing: true,
      },
      {
        type: "text",
        start: 11,
        end: 12,
      },
    ],
    "02",
  );
});

test(`03 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - dash missing`, () => {
  let gathered = [];
  ct("a<!--b->c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "comment",
        start: 1,
        end: 5,
        value: "<!--",
        kind: "simple",
        closing: false,
      },
      {
        type: "text",
        start: 5,
        end: 9,
        value: "b->c",
      },
    ],
    "03",
  );
});

test(`04 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - dash missing`, () => {
  let gathered = [];
  ct("a<!-b-->c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "comment",
        start: 1,
        end: 4,
        value: "<!-",
        kind: "simple",
        closing: false,
      },
      {
        type: "text",
        start: 4,
        end: 5,
        value: "b",
      },
      {
        type: "comment",
        start: 5,
        end: 8,
        value: "-->",
        kind: "simple",
        closing: true,
      },
      {
        type: "text",
        start: 8,
        end: 9,
        value: "c",
      },
    ],
    "04",
  );
});

test(`05 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - dash missing`, () => {
  let gathered = [];
  ct("a<--b-->c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 5,
        value: "a<--b",
      },
      {
        type: "comment",
        start: 5,
        end: 8,
        value: "-->",
        kind: "simple",
        closing: true,
      },
      {
        type: "text",
        start: 8,
        end: 9,
        value: "c",
      },
    ],
    "05",
  );
});

test(`06 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - dash missing`, () => {
  let gathered = [];
  ct("a<!--b--!>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "comment",
        start: 1,
        end: 5,
        value: "<!--",
        kind: "simple",
        closing: false,
      },
      {
        type: "text",
        start: 5,
        end: 11,
        value: "b--!>c",
      },
    ],
    "06",
  );
});

test(`07 - ${`\u001b[${36}m${"simple"}\u001b[${39}m`} - dash missing`, () => {
  let gathered = [];
  ct("<!- -z-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        kind: "simple",
        start: 0,
        end: 5,
        value: "<!- -",
        closing: false,
      },
      {
        type: "text",
        start: 5,
        end: 6,
        value: "z",
      },
      {
        type: "comment",
        start: 6,
        end: 9,
        value: "-->",
        kind: "simple",
        closing: true,
      },
    ],
    "07",
  );
});

// 02. outlook conditionals: only
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - outlook conditionals, minimal`, () => {
  let gathered = [];
  ct("a<!--[if gte mso 9]>x<![endif]-->z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 20,
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 20,
        end: 21,
      },
      {
        type: "comment",
        start: 21,
        end: 33,
        kind: "only",
        closing: true,
      },
      {
        type: "text",
        start: 33,
        end: 34,
      },
    ],
    "08",
  );
});

test(`09 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - outlook conditionals, complex, with xml`, () => {
  let gathered = [];
  ct(
    `abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    },
  );

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3,
      },
      {
        type: "comment",
        start: 3,
        end: 22,
        kind: "only",
        closing: false,
      },
      {
        type: "tag",
        start: 22,
        end: 27,
        kind: "xml",
        closing: false,
      },
      {
        type: "text",
        start: 27,
        end: 135,
      },
      {
        type: "tag",
        start: 135,
        end: 141,
        kind: "xml",
        closing: true,
      },
      {
        type: "comment",
        start: 141,
        end: 153,
        kind: "only",
        closing: true,
      },
      {
        type: "text",
        start: 153,
        end: 156,
      },
    ],
    "09",
  );
});

test(`10 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - outlook conditionals, minimal, tag inside`, () => {
  let gathered = [];
  ct("<a><!--[if gte mso 9]><b><![endif]--><i>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 3,
      },
      {
        type: "comment",
        start: 3,
        end: 22,
        kind: "only",
        closing: false,
      },
      {
        type: "tag",
        start: 22,
        end: 25,
      },
      {
        type: "comment",
        start: 25,
        end: 37,
        kind: "only",
        closing: true,
      },
      {
        type: "tag",
        start: 37,
        end: 40,
      },
    ],
    "10",
  );
});

test(`11 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - missing excl. mark`, () => {
  let gathered = [];
  ct("<!--[if gte mso 9]>x<[endif]-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        value: "<!--[if gte mso 9]>",
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 19,
        end: 20,
        value: "x",
      },
      {
        type: "comment",
        start: 20,
        end: 31,
        value: "<[endif]-->",
        kind: "only",
        closing: true,
      },
    ],
    "11",
  );
});

test(`12 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - empty conditional`, () => {
  let gathered = [];
  ct("<!--[if gte mso 9]><![endif]-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        kind: "only",
        closing: false,
      },
      {
        type: "comment",
        start: 19,
        end: 31,
        kind: "only",
        closing: true,
      },
    ],
    "12",
  );
});

test(`13 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - swapped excl. mark`, () => {
  let gathered = [];
  ct("<!--[if gte mso 9]>x<[!endif]-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 19,
        end: 20,
      },
      {
        type: "comment",
        start: 20,
        end: 32,
        kind: "only",
        closing: true,
      },
    ],
    "13",
  );
});

test(`14 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - 1 instead of !`, () => {
  let gathered = [];
  ct("<!--[if gte mso 9]>x<1[endif]-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 19,
        end: 20,
      },
      {
        type: "comment",
        start: 20,
        end: 32,
        value: "<1[endif]-->",
        kind: "only",
        closing: true,
      },
    ],
    "14",
  );
});

test(`15 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - missing closing bracket`, () => {
  let gathered = [];
  ct("<!--[if !mso><!-->a", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 18,
        value: "<!--[if !mso><!-->",
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 18,
        end: 19,
        value: "a",
      },
    ],
    "15",
  );
});

test(`16 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - opening square bracket missing`, () => {
  let gathered = [];
  ct("<!--if mso]>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 12,
        kind: "only",
        closing: false,
      },
    ],
    "16",
  );
});

test(`17 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - opening square bracket missing`, () => {
  let gathered = [];
  ct("zzz<<![endif]-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 4,
        value: "zzz<",
      },
      {
        type: "comment",
        start: 4,
        end: 16,
        value: "<![endif]-->",
        kind: "only",
        closing: true,
        language: "html",
      },
    ],
    "17.01",
  );
});

test(`18 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - curly brackets`, () => {
  let gathered = [];
  ct("<!--{if gte mso 9}>x<!{endif}-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        value: "<!--{if gte mso 9}>",
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 19,
        end: 20,
      },
      {
        type: "comment",
        start: 20,
        end: 32,
        value: "<!{endif}-->",
        kind: "only",
        closing: true,
      },
    ],
    "18",
  );
});

test(`19 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - parentheses`, () => {
  let gathered = [];
  ct("<!--(if gte mso 9)>x<!(endif)-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        value: "<!--(if gte mso 9)>",
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 19,
        end: 20,
      },
      {
        type: "comment",
        start: 20,
        end: 32,
        value: "<!(endif)-->",
        kind: "only",
        closing: true,
      },
    ],
    "19",
  );
});

test(`20 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - comment nested`, () => {
  let gathered = [];
  ct("<!--[if mso]><!--tralala--><![endif]-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 13,
        value: "<!--[if mso]>",
        kind: "only",
        closing: false,
      },
      {
        type: "comment",
        start: 13,
        end: 17,
        value: "<!--",
        kind: "simple",
        closing: false,
      },
      {
        type: "text",
        start: 17,
        end: 24,
        value: "tralala",
      },
      {
        type: "comment",
        start: 24,
        end: 27,
        value: "-->",
        kind: "simple",
        closing: true,
      },
      {
        type: "comment",
        start: 27,
        end: 39,
        value: "<![endif]-->",
        kind: "only",
        closing: true,
      },
    ],
    "20",
  );
});

test(`21 - ${`\u001b[${35}m${"kind: only"}\u001b[${39}m`} - no brackets`, () => {
  let gathered = [];
  ct("<!--if mso>_<!endif-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 11,
        value: "<!--if mso>",
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 11,
        end: 12,
        value: "_",
      },
      {
        type: "comment",
        start: 12,
        end: 22,
        value: "<!endif-->",
        kind: "only",
        closing: true,
      },
    ],
    "21",
  );
});

test(`22 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - simplet following "not"-kind opening, minimal`, () => {
  let gathered = [];
  ct("x<!--[if !mso]>abc<!-->y", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "x",
      },
      {
        type: "comment",
        start: 1,
        end: 15,
        value: "<!--[if !mso]>",
        kind: "only",
        closing: false,
      },
      {
        type: "text",
        start: 15,
        end: 18,
        value: "abc",
      },
      {
        type: "comment",
        start: 18,
        end: 23,
        value: "<!-->",
        kind: "simplet",
        closing: null,
      },
      {
        type: "text",
        start: 23,
        end: 24,
        value: "y",
      },
    ],
    "22",
  );
});

// 03. outlook conditionals: only-not
// -----------------------------------------------------------------------------

test(`23 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - outlook conditionals with xml, minimal`, () => {
  let gathered = [];
  ct("a<!--[if !mso]><!-->x<!--<![endif]-->z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 20,
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 20,
        end: 21,
      },
      {
        type: "comment",
        start: 21,
        end: 37,
        kind: "not",
        closing: true,
      },
      {
        type: "text",
        start: 37,
        end: 38,
      },
    ],
    "23",
  );
});

test(`24 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - missing dash in the opening's end`, () => {
  let gathered = [];
  ct("a<!--[if !mso]><!->z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 19,
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 19,
        end: 20,
      },
    ],
    "24",
  );
});

test(`25 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - missing dash in the opening's end`, () => {
  let gathered = [];
  ct("<!--[if !mso]><!--z>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 20,
        kind: "not",
        closing: false,
      },
    ],
    "25",
  );
});

test(`26 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - expanded notation, no space`, () => {
  let gathered = [];
  ct("<!--[if !mso]><!---->z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 21,
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 21,
        end: 22,
      },
    ],
    "26",
  );
});

test(`27 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - expanded notation, with space`, () => {
  let gathered = [];
  ct("<!--[if !mso]><!-- -->z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 22,
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 22,
        end: 23,
      },
    ],
    "27",
  );
});

test(`28 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - brackets missing`, () => {
  let gathered = [];
  ct("_<!--if !mso><!-->_<!--<!endif-->_", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 18,
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 18,
        end: 19,
      },
      {
        type: "comment",
        start: 19,
        end: 33,
        kind: "not",
        closing: true,
      },
      {
        type: "text",
        start: 33,
        end: 34,
      },
    ],
    "28",
  );
});

test(`29 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - brackets missing, spaced notation`, () => {
  let gathered = [];
  ct("_<!--if !mso><!-- -->_<!--<!endif-->_", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 21,
        kind: "not",
        closing: false,
      },
      {
        type: "text",
        start: 21,
        end: 22,
      },
      {
        type: "comment",
        start: 22,
        end: 36,
        kind: "not",
        closing: true,
      },
      {
        type: "text",
        start: 36,
        end: 37,
      },
    ],
    "29",
  );
});

test(`30 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - simplet following "not"-kind opening, minimal`, () => {
  let gathered = [];
  ct("x<!--[if !mso]><!--><!-->y", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "x",
      },
      {
        type: "comment",
        start: 1,
        end: 20,
        value: "<!--[if !mso]><!-->",
        kind: "not",
        closing: false,
      },
      {
        type: "comment",
        start: 20,
        end: 25,
        value: "<!-->",
        kind: "simplet",
        closing: null,
      },
      {
        type: "text",
        start: 25,
        end: 26,
        value: "y",
      },
    ],
    "30",
  );
});

test(`31 - ${`\u001b[${33}m${"kind: not"}\u001b[${39}m`} - simplet following "not"-kind opening, full`, () => {
  let gathered = [];
  ct(
    `<!--[if !mso]><!--><!-->
  <img src="gif"/>
<!--<![endif]-->`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    },
  );

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        value: "<!--[if !mso]><!-->",
        kind: "not",
        closing: false,
      },
      {
        type: "comment",
        start: 19,
        end: 24,
        value: "<!-->",
        kind: "simplet",
        closing: null,
      },
      {
        type: "text",
        start: 24,
        end: 27,
        value: "\n  ",
      },
      {
        type: "tag",
        start: 27,
        end: 43,
        value: '<img src="gif"/>',
        tagNameStartsAt: 28,
        tagNameEndsAt: 31,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "src",
            attribNameRecognised: true,
            attribNameStartsAt: 32,
            attribNameEndsAt: 35,
            attribOpeningQuoteAt: 36,
            attribClosingQuoteAt: 40,
            attribValueRaw: "gif",
            attribValue: [
              {
                type: "text",
                start: 37,
                end: 40,
                value: "gif",
              },
            ],
            attribValueStartsAt: 37,
            attribValueEndsAt: 40,
            attribStarts: 32,
            attribEnds: 41,
          },
        ],
      },
      {
        type: "text",
        start: 43,
        end: 44,
        value: "\n",
      },
      {
        type: "comment",
        start: 44,
        end: 60,
        value: "<!--<![endif]-->",
        kind: "not",
        closing: true,
      },
    ],
    "31",
  );
});

// 04. simplet-kind comments
// -----------------------------------------------------------------------------

test(`32 - ${`\u001b[${36}m${"simplet"}\u001b[${39}m`} - one instance, nothing around`, () => {
  let gathered = [];
  ct("<!-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 5,
        value: "<!-->",
        kind: "simplet",
        closing: null,
        language: "html",
      },
    ],
    "32.01",
  );
});

test(`33 - ${`\u001b[${36}m${"simplet"}\u001b[${39}m`} - one instance, nothing around`, () => {
  let gathered = [];
  ct("<!--><!-- ><!--  >", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 5,
        value: "<!-->",
        kind: "simplet",
        closing: null,
        language: "html",
      },
      {
        type: "comment",
        start: 5,
        end: 11,
        value: "<!-- >",
        kind: "simplet",
        closing: null,
        language: "html",
      },
      {
        type: "comment",
        start: 11,
        end: 18,
        value: "<!--  >",
        kind: "simplet",
        closing: null,
        language: "html",
      },
    ],
    "33.01",
  );
});

test(`34 - ${`\u001b[${36}m${"simplet"}\u001b[${39}m`} - one instance`, () => {
  let gathered = [];
  ct("x<!-->y", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 6,
        kind: "simplet",
      },
      {
        type: "text",
        start: 6,
        end: 7,
      },
    ],
    "34",
  );
});

test(`35 - ${`\u001b[${36}m${"simplet"}\u001b[${39}m`} - three instances`, () => {
  let gathered = [];
  ct("<!--><!--><!-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "comment",
        start: 0,
        end: 5,
        kind: "simplet",
      },
      {
        type: "comment",
        start: 5,
        end: 10,
        kind: "simplet",
      },
      {
        type: "comment",
        start: 10,
        end: 15,
        kind: "simplet",
      },
    ],
    "35",
  );
});

// -----------------------------------------------------------------------------

// For a reference:
// ===============

// a<!--b-->c

// abc<!--[if gte mso 9]><xml>
// <o:OfficeDocumentSettings>
// <o:AllowPNG/>
// <o:PixelsPerInch>96</o:PixelsPerInch>
// </o:OfficeDocumentSettings>
// </xml><![endif]-->def

// <!--[if mso]>
//     <img src="fallback"/>
// <![endif]-->

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

test.run();
