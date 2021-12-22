import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

const doubleQuotes = `\u0022`;
const apostrophe = `\u0027`;

// broken HTML in attribute areas
// -----------------------------------------------------------------------------

test(`01 - no equals but quotes present`, () => {
  let gathered = [];
  ct(`<a href"www" class'e'>`, {
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
        end: 22,
        value: `<a href"www" class'e'>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "href",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 7,
            attribClosingQuoteAt: 11,
            attribValueRaw: "www",
            attribValue: [
              {
                type: "text",
                start: 8,
                end: 11,
                value: "www",
              },
            ],
            attribValueStartsAt: 8,
            attribValueEndsAt: 11,
            attribStarts: 3,
            attribEnds: 12,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 18,
            attribOpeningQuoteAt: 18,
            attribClosingQuoteAt: 20,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 19,
                end: 20,
                value: "e",
              },
            ],
            attribValueStartsAt: 19,
            attribValueEndsAt: 20,
            attribStarts: 13,
            attribEnds: 21,
          },
        ],
      },
    ],
    "01"
  );
});

test(`02 - no opening quotes but equals present`, () => {
  let gathered = [];
  ct(`<a href=www" class=e'>`, {
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
        end: 22,
        value: `<a href=www" class=e'>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "href",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 11,
            attribValueRaw: "www",
            attribValue: [
              {
                type: "text",
                start: 8,
                end: 11,
                value: "www",
              },
            ],
            attribValueStartsAt: 8,
            attribValueEndsAt: 11,
            attribStarts: 3,
            attribEnds: 12,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 18,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 20,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 19,
                end: 20,
                value: "e",
              },
            ],
            attribValueStartsAt: 19,
            attribValueEndsAt: 20,
            attribStarts: 13,
            attribEnds: 21,
          },
        ],
      },
    ],
    "02"
  );
});

test(`03 - two equals`, () => {
  let gathered = [];
  ct(`<a b=="c" d=='e'>`, {
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
        end: 17,
        attribs: [
          {
            attribName: "b",
            attribNameStartsAt: 3,
            attribNameEndsAt: 4,
            attribOpeningQuoteAt: 6,
            attribClosingQuoteAt: 8,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 7,
                end: 8,
                value: "c",
              },
            ],
            attribValueStartsAt: 7,
            attribValueEndsAt: 8,
            attribStarts: 3,
            attribEnds: 9,
          },
          {
            attribName: "d",
            attribNameStartsAt: 10,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 15,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 15,
                value: "e",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 15,
            attribStarts: 10,
            attribEnds: 16,
          },
        ],
      },
    ],
    "03"
  );
});

test(`04 - empty attr value`, () => {
  let gathered = [];
  ct(`<body alink="">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 15,
        value: '<body alink="">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "body",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "alink",
            attribNameRecognised: true,
            attribNameStartsAt: 6,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 13,
            attribValueRaw: "",
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 6,
            attribEnds: 14,
            attribLeft: 4,
          },
        ],
      },
    ],
    "04"
  );
});

test(`05 - false alarm, brackets - rgb()`, () => {
  let gathered = [];
  ct(`<body alink="rgb()">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "body",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 20,
        kind: null,
        attribs: [
          {
            attribName: "alink",
            attribNameStartsAt: 6,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: "rgb()",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: "rgb()",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 6,
            attribEnds: 19,
          },
        ],
      },
    ],
    "05"
  );
});

test(`06 - space instead of equal`, () => {
  let gathered = [];
  ct(`<a class "c" id 'e' href "www">`, {
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
        end: 31,
        value: `<a class "c" id 'e' href "www">`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 11,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 11,
                value: "c",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 11,
            attribStarts: 3,
            attribEnds: 12,
          },
          {
            attribName: "id",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 15,
            attribOpeningQuoteAt: 16,
            attribClosingQuoteAt: 18,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 17,
                end: 18,
                value: "e",
              },
            ],
            attribValueStartsAt: 17,
            attribValueEndsAt: 18,
            attribStarts: 13,
            attribEnds: 19,
          },
          {
            attribName: "href",
            attribNameRecognised: true,
            attribNameStartsAt: 20,
            attribNameEndsAt: 24,
            attribOpeningQuoteAt: 25,
            attribClosingQuoteAt: 29,
            attribValueRaw: "www",
            attribValue: [
              {
                type: "text",
                start: 26,
                end: 29,
                value: "www",
              },
            ],
            attribValueStartsAt: 26,
            attribValueEndsAt: 29,
            attribStarts: 20,
            attribEnds: 30,
          },
        ],
      },
    ],
    "06"
  );
});

test(`07 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening quote repeated`, () => {
  let gathered = [];
  // <table width=""100">
  ct(
    `<table width="${doubleQuotes}100">
  zzz
</table>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 20,
        value: `<table width="${doubleQuotes}100">`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "table",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 7,
            attribNameEndsAt: 12,
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 18,
            attribValueRaw: `"100`,
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 18,
                value: `"100`,
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 18,
            attribStarts: 7,
            attribEnds: 19,
            attribLeft: 5,
          },
        ],
      },
      {
        type: "text",
        start: 20,
        end: 27,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 27,
        end: 35,
        value: "</table>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 34,
        tagName: "table",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "07"
  );
});

test(`08 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening repeated, whitespace`, () => {
  let gathered = [];
  ct(`<span width="${doubleQuotes} 100">`, {
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
        end: 20,
        value: `<span width="${doubleQuotes} 100">`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "span",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 6,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: `${doubleQuotes} 100`,
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: `" 100`,
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 6,
            attribEnds: 19,
          },
        ],
      },
    ],
    "08"
  );
});

test(`09 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening repeated, two errors - repeated opening and mismatching closing`, () => {
  let gathered = [];
  ct(
    `<span width="${doubleQuotes} 100'>
  zzz
</span>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  compare(
    ok,
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 20,
        value: '<span width="" 100\'>',
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "span",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 6,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: `" 100`,
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: `" 100`,
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 6,
            attribEnds: 19,
          },
        ],
      },
      {
        type: "text",
        start: 20,
        end: 27,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 27,
        end: 34,
        value: "</span>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 33,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "09"
  );
});

test(`10 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening repeated, single quote style`, () => {
  let gathered = [];
  ct(
    `<span width='${apostrophe} 100'>
  zzz
</span>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  compare(
    ok,
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 20,
        value: "<span width='' 100'>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "span",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 6,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: "' 100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: "' 100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 6,
            attribEnds: 19,
          },
        ],
      },
      {
        type: "text",
        start: 20,
        end: 27,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 27,
        end: 34,
        value: "</span>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 33,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "10"
  );
});

test(`11 - attr value without quotes`, () => {
  let gathered = [];
  ct(`<abc de=fg hi="jkl">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 20,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "fg",
            attribValue: [
              {
                type: "text",
                start: 8,
                end: 10,
                value: "fg",
              },
            ],
            attribValueStartsAt: 8,
            attribValueEndsAt: 10,
            attribStarts: 5,
            attribEnds: 10,
          },
          {
            attribName: "hi",
            attribNameStartsAt: 11,
            attribNameEndsAt: 13,
            attribOpeningQuoteAt: 14,
            attribClosingQuoteAt: 18,
            attribValueRaw: "jkl",
            attribValue: [
              {
                type: "text",
                start: 15,
                end: 18,
                value: "jkl",
              },
            ],
            attribValueStartsAt: 15,
            attribValueEndsAt: 18,
            attribStarts: 11,
            attribEnds: 19,
          },
        ],
      },
    ],
    "11"
  );
});

test(`12 - attr value without quotes leads to tag's end`, () => {
  let gathered = [];
  ct(`<abc de=fg/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 12,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "fg",
            attribValue: [
              {
                type: "text",
                start: 8,
                end: 10,
                value: "fg",
              },
            ],
            attribValueStartsAt: 8,
            attribValueEndsAt: 10,
            attribStarts: 5,
            attribEnds: 10,
          },
        ],
      },
    ],
    "12"
  );
});

test(`13 - attr value without quotes leads to tag's end`, () => {
  let gathered = [];
  ct(`<abc de=fg>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 11,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "fg",
            attribValue: [
              {
                type: "text",
                start: 8,
                end: 10,
                value: "fg",
              },
            ],
            attribValueStartsAt: 8,
            attribValueEndsAt: 10,
            attribStarts: 5,
            attribEnds: 10,
          },
        ],
      },
    ],
    "13"
  );
});

// 05. mismatching quotes
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, A-B`, () => {
  let gathered = [];
  ct(`<div class="c'>.</div>`, {
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
        end: 15,
        value: `<div class="c'>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 13,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: "c",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 13,
            attribStarts: 5,
            attribEnds: 14,
          },
        ],
      },
      {
        type: "text",
        start: 15,
        end: 16,
        value: ".",
      },
      {
        type: "tag",
        start: 16,
        end: 22,
        value: "</div>",
        tagNameStartsAt: 18,
        tagNameEndsAt: 21,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "14"
  );
});

test(`15 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, B-A`, () => {
  let gathered = [];
  ct(`<div class='c">.</div>`, {
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
        end: 15,
        value: `<div class='c">`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 13,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: "c",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 13,
            attribStarts: 5,
            attribEnds: 14,
          },
        ],
      },
      {
        type: "text",
        start: 15,
        end: 16,
        value: ".",
      },
      {
        type: "tag",
        start: 16,
        end: 22,
        value: "</div>",
        tagNameStartsAt: 18,
        tagNameEndsAt: 21,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "15"
  );
});

test(`16 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - matching quotes as control - double quotes in the value, A-B-B-A. end of tag follows`, () => {
  let gathered = [];
  ct(`<img alt='so-called "artists"!'/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 33,
        value: `<img alt='so-called "artists"!'/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 30,
            attribValueRaw: `so-called "artists"!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 30,
                value: `so-called "artists"!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
            attribLeft: 3,
          },
        ],
      },
    ],
    "16"
  );
});

test(`17 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - matching quotes as control - double quotes in the value, A-B-B-A. another attribute follows`, () => {
  let gathered = [];
  ct(`<img alt='so-called "artists"!' class='yo'/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 44,
        value: `<img alt='so-called "artists"!' class='yo'/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 30,
            attribValueRaw: `so-called "artists"!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 30,
                value: `so-called "artists"!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
            attribLeft: 3,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 32,
            attribNameEndsAt: 37,
            attribOpeningQuoteAt: 38,
            attribClosingQuoteAt: 41,
            attribValueRaw: "yo",
            attribValue: [
              {
                type: "text",
                start: 39,
                end: 41,
                value: "yo",
              },
            ],
            attribValueStartsAt: 39,
            attribValueEndsAt: 41,
            attribStarts: 32,
            attribEnds: 42,
            attribLeft: 30,
          },
        ],
      },
    ],
    "17"
  );
});

test(`18 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B. end of tag follows`, () => {
  let gathered = [];
  ct(`<img alt='so-called "artists"!"/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 33,
        value: `<img alt='so-called "artists"!"/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 30,
            attribValueRaw: `so-called "artists"!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 30,
                value: `so-called "artists"!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
            attribLeft: 3,
          },
        ],
      },
    ],
    "18"
  );
});

test(`19 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B, attr follows`, () => {
  let gathered = [];
  ct(`<img alt='so-called "artists"!" style="display:block;"/>`, {
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
        end: 56,
        value: `<img alt='so-called "artists"!" style="display:block;"/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 30,
            attribValueRaw: `so-called "artists"!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 30,
                value: `so-called "artists"!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
          },
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 32,
            attribNameEndsAt: 37,
            attribOpeningQuoteAt: 38,
            attribClosingQuoteAt: 53,
            attribValueRaw: "display:block;",
            attribValue: [
              {
                property: "display",
                propertyStarts: 39,
                propertyEnds: 46,
                colon: 46,
                value: "block",
                valueStarts: 47,
                valueEnds: 52,
                semi: 52,
              },
            ],
            attribValueStartsAt: 39,
            attribValueEndsAt: 53,
            attribStarts: 32,
            attribEnds: 54,
          },
        ],
      },
    ],
    "19"
  );
});

test(`20 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, B-A`, () => {
  let gathered = [];
  ct(`<img alt="so-called "artists"!'/>`, {
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
        end: 33,
        value: `<img alt="so-called "artists"!'/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 30,
            attribValueRaw: `so-called "artists"!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 30,
                value: `so-called "artists"!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
          },
        ],
      },
    ],
    "20"
  );
});

test(`21 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-B`, () => {
  let gathered = [];
  ct(`<img alt="Deal is your's!'/>`, {
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
        end: 28,
        value: `<img alt="Deal is your's!'/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 25,
            attribValueRaw: `Deal is your's!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 25,
                value: `Deal is your's!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
          },
        ],
      },
    ],
    "21"
  );
});

test(`22 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, B-A`, () => {
  let gathered = [];
  ct(`<img alt='Deal is your's!"/>`, {
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
        end: 28,
        value: `<img alt='Deal is your's!"/>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 25,
            attribValueRaw: `Deal is your's!`,
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 25,
                value: `Deal is your's!`,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
          },
        ],
      },
    ],
    "22"
  );
});

// 06. terminating unclosed string value (content within quotes)
// -----------------------------------------------------------------------------

test(`23 - attr value without quotes leads to tag's end`, () => {
  let gathered = [];
  ct(`<abc de =">\ntext<div class="z">`, {
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
        end: 11,
        value: '<abc de =">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameRecognised: false,
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 5,
            attribEnds: 10,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 11,
        end: 16,
        value: "\ntext",
      },
      {
        type: "tag",
        start: 16,
        end: 31,
        value: '<div class="z">',
        tagNameStartsAt: 17,
        tagNameEndsAt: 20,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 21,
            attribNameEndsAt: 26,
            attribOpeningQuoteAt: 27,
            attribClosingQuoteAt: 29,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 28,
                end: 29,
                value: "z",
              },
            ],
            attribValueStartsAt: 28,
            attribValueEndsAt: 29,
            attribStarts: 21,
            attribEnds: 30,
            attribLeft: 19,
          },
        ],
      },
    ],
    "23"
  );
});

test(`24 - missing closing quote, cheeky raw text bracket follows`, () => {
  let gathered = [];
  ct(`<abc de="> "a" > "z"`, {
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
        end: 10,
        value: '<abc de=">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameRecognised: false,
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 5,
            attribEnds: 9,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 10,
        end: 20,
        value: ' "a" > "z"',
      },
    ],
    "24"
  );
});

test(`25 - two errors: space before equal and closing quotes missing`, () => {
  let gathered = [];
  ct(`<input type="radio" checked =">`, {
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
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "input",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        start: 0,
        end: 31,
        kind: "inline",
        attribs: [
          {
            attribName: "type",
            attribNameStartsAt: 7,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: "radio",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: "radio",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 7,
            attribEnds: 19,
          },
          {
            attribName: "checked",
            attribNameStartsAt: 20,
            attribNameEndsAt: 27,
            attribOpeningQuoteAt: 29,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 20,
            attribEnds: 30,
          },
        ],
      },
    ],
    "25"
  );
});

test(`26 - two errors: space before equal and closing quotes missing, text follows`, () => {
  let gathered = [];
  ct(`<input type="radio" checked ="> x y z `, {
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
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "input",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        start: 0,
        end: 31,
        kind: "inline",
        attribs: [
          {
            attribName: "type",
            attribNameStartsAt: 7,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: "radio",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: "radio",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 7,
            attribEnds: 19,
          },
          {
            attribName: "checked",
            attribNameStartsAt: 20,
            attribNameEndsAt: 27,
            attribOpeningQuoteAt: 29,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 20,
            attribEnds: 30,
          },
        ],
      },
      {
        type: "text",
        start: 31,
        end: 38,
      },
    ],
    "26"
  );
});

test(`27 - two layers of quotes`, () => {
  let gathered = [];
  ct(`<span width="'100'">`, {
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
        end: 20,
        value: "<span width=\"'100'\">",
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "span",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 6,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: 12,
            attribClosingQuoteAt: 18,
            attribValueRaw: "'100'",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 18,
                value: "'100'",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 18,
            attribStarts: 6,
            attribEnds: 19,
            attribLeft: 4,
          },
        ],
      },
    ],
    "27"
  );
});

test.run();
