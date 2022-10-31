import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// basic - double quoted attributes
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - single- and double-quoted attr`, () => {
  let gathered = [];
  ct(`<a b="c" d='e'>`, {
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
        attribs: [
          {
            attribName: "b",
            attribNameStartsAt: 3,
            attribNameEndsAt: 4,
            attribOpeningQuoteAt: 5,
            attribClosingQuoteAt: 7,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 6,
                end: 7,
                value: "c",
              },
            ],
            attribValueStartsAt: 6,
            attribValueEndsAt: 7,
            attribStarts: 3,
            attribEnds: 8,
            attribLeft: 1,
          },
          {
            attribName: "d",
            attribNameStartsAt: 9,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 13,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: "e",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 13,
            attribStarts: 9,
            attribEnds: 14,
            attribLeft: 7,
          },
        ],
      },
    ],
    "01"
  );
});

test(`02 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - value-less attribute`, () => {
  let gathered = [];
  ct(`<TD nowrap class="z">`, {
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
        end: 21,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 4,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 4,
            attribEnds: 10,
          },
          {
            attribName: "class",
            attribNameStartsAt: 11,
            attribNameEndsAt: 16,
            attribOpeningQuoteAt: 17,
            attribClosingQuoteAt: 19,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 18,
                end: 19,
                value: "z",
              },
            ],
            attribValueStartsAt: 18,
            attribValueEndsAt: 19,
            attribStarts: 11,
            attribEnds: 20,
          },
        ],
      },
    ],
    "02"
  );
});

test(`03 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - a closing tag`, () => {
  let gathered = [];
  ct(`</Td>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "td",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 5,
        kind: null,
        attribs: [],
      },
    ],
    "03"
  );
});

// space inside tag
test(`04 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - a closing tag`, () => {
  let gathered = [];
  ct(`</tD >`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "td",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 6,
        kind: null,
        attribs: [],
      },
    ],
    "04"
  );
});

test(`05 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - single- and double-quoted attr`, () => {
  let gathered = [];
  ct(`<a b="c" d='e'>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
    tagCbLookahead: 3,
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 15,
        attribs: [
          {
            attribName: "b",
            attribNameStartsAt: 3,
            attribNameEndsAt: 4,
            attribOpeningQuoteAt: 5,
            attribClosingQuoteAt: 7,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 6,
                end: 7,
                value: "c",
              },
            ],
            attribValueStartsAt: 6,
            attribValueEndsAt: 7,
            attribStarts: 3,
            attribEnds: 8,
          },
          {
            attribName: "d",
            attribNameStartsAt: 9,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 13,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: "e",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 13,
            attribStarts: 9,
            attribEnds: 14,
          },
        ],
      },
    ],
    "05.01"
  );
  equal(gathered.length, 1, "05.01");
});

// bool attributes
// -----------------------------------------------------------------------------

test(`06`, () => {
  let gathered = [];
  ct(`<td nowrap>`, {
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
        tagNameEndsAt: 3,
        tagName: "td",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 11,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 4,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 4,
            attribEnds: 10,
          },
        ],
      },
    ],
    "06"
  );
});

test(`07 - slash in the end`, () => {
  let gathered = [];
  ct(`<td nowrap/>`, {
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
        tagNameEndsAt: 3,
        tagName: "td",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 12,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 4,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 4,
            attribEnds: 10,
          },
        ],
      },
    ],
    "07"
  );
});

test(`08 - slash in front`, () => {
  let gathered = [];
  ct(`</td nowrap>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "td",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 12,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 5,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 5,
            attribEnds: 11,
          },
        ],
      },
    ],
    "08"
  );
});

test(`09 - now crazier`, () => {
  let gathered = [];
  ct(`</td nowrap yo yo/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "td",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 19,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 5,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 5,
            attribEnds: 11,
          },
          {
            attribName: "yo",
            attribNameStartsAt: 12,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 12,
            attribEnds: 14,
          },
          {
            attribName: "yo",
            attribNameStartsAt: 15,
            attribNameEndsAt: 17,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 15,
            attribEnds: 17,
          },
        ],
      },
    ],
    "09"
  );
});

test(`10 - unrecognised tag`, () => {
  let gathered = [];
  ct(`<zzz accept-charset="utf-8" yyy>`, {
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
        tagName: "zzz",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 32,
        kind: null,
        attribs: [
          {
            attribName: "accept-charset",
            attribNameStartsAt: 5,
            attribNameEndsAt: 19,
            attribOpeningQuoteAt: 20,
            attribClosingQuoteAt: 26,
            attribValueRaw: "utf-8",
            attribValue: [
              {
                type: "text",
                start: 21,
                end: 26,
                value: "utf-8",
              },
            ],
            attribValueStartsAt: 21,
            attribValueEndsAt: 26,
            attribStarts: 5,
            attribEnds: 27,
          },
          {
            attribName: "yyy",
            attribNameStartsAt: 28,
            attribNameEndsAt: 31,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 28,
            attribEnds: 31,
          },
        ],
      },
    ],
    "10"
  );
});

// erroneous code
// -----------------------------------------------------------------------------

test(`11 - two asterisks as an attribute's value`, () => {
  let gathered = [];
  ct(`<frameset cols="**">`, {
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
        tagNameEndsAt: 9,
        tagName: "frameset",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        start: 0,
        end: 20,
        kind: null,
        attribs: [
          {
            attribName: "cols",
            attribNameStartsAt: 10,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 18,
            attribValueRaw: "**",
            attribValue: [
              {
                type: "text",
                start: 16,
                end: 18,
                value: "**",
              },
            ],
            attribValueStartsAt: 16,
            attribValueEndsAt: 18,
            attribStarts: 10,
            attribEnds: 19,
          },
        ],
      },
    ],
    "11"
  );
});

test(`12 - many asterisks as an attribute's value`, () => {
  let gathered = [];
  ct(`<frameset cols="******">`, {
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
        tagNameEndsAt: 9,
        tagName: "frameset",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        start: 0,
        end: 24,
        kind: null,
        attribs: [
          {
            attribName: "cols",
            attribNameStartsAt: 10,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 22,
            attribValueRaw: "******",
            attribValue: [
              {
                type: "text",
                start: 16,
                end: 22,
                value: "******",
              },
            ],
            attribValueStartsAt: 16,
            attribValueEndsAt: 22,
            attribStarts: 10,
            attribEnds: 23,
          },
        ],
      },
    ],
    "12"
  );
});

test(`13 - unescaped bracket as value, one tag`, () => {
  let gathered = [];
  ct(`<abc de=">">`, {
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
        end: 12,
        value: '<abc de=">">',
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
            attribClosingQuoteAt: 10,
            attribValueRaw: ">",
            attribValue: [
              {
                type: "text",
                start: 9,
                end: 10,
                value: ">",
              },
            ],
            attribValueStartsAt: 9,
            attribValueEndsAt: 10,
            attribStarts: 5,
            attribEnds: 11,
          },
        ],
      },
    ],
    "13"
  );
});

test(`14 - unescaped bracket as value, few tags`, () => {
  let gathered = [];
  ct(`<abc de=">" fg="h">`, {
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
        end: 19,
        value: '<abc de=">" fg="h">',
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
            attribClosingQuoteAt: 10,
            attribValueRaw: ">",
            attribValue: [
              {
                type: "text",
                start: 9,
                end: 10,
                value: ">",
              },
            ],
            attribValueStartsAt: 9,
            attribValueEndsAt: 10,
            attribStarts: 5,
            attribEnds: 11,
          },
          {
            attribName: "fg",
            attribNameRecognised: false,
            attribNameStartsAt: 12,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 17,
            attribValueRaw: "h",
            attribValue: [
              {
                type: "text",
                start: 16,
                end: 17,
                value: "h",
              },
            ],
            attribValueStartsAt: 16,
            attribValueEndsAt: 17,
            attribStarts: 12,
            attribEnds: 18,
          },
        ],
      },
    ],
    "14"
  );
});

test(`15 - unescaped bracket as value, more tags`, () => {
  let gathered = [];
  ct(
    `<img alt="click here >" width="7" height="8" border="9" style="display:block;"/>`,
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
        end: 80,
        value:
          '<img alt="click here >" width="7" height="8" border="9" style="display:block;"/>',
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
            attribClosingQuoteAt: 22,
            attribValueRaw: "click here >",
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 22,
                value: "click here >",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 22,
            attribStarts: 5,
            attribEnds: 23,
          },
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 24,
            attribNameEndsAt: 29,
            attribOpeningQuoteAt: 30,
            attribClosingQuoteAt: 32,
            attribValueRaw: "7",
            attribValue: [
              {
                type: "text",
                start: 31,
                end: 32,
                value: "7",
              },
            ],
            attribValueStartsAt: 31,
            attribValueEndsAt: 32,
            attribStarts: 24,
            attribEnds: 33,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 34,
            attribNameEndsAt: 40,
            attribOpeningQuoteAt: 41,
            attribClosingQuoteAt: 43,
            attribValueRaw: "8",
            attribValue: [
              {
                type: "text",
                start: 42,
                end: 43,
                value: "8",
              },
            ],
            attribValueStartsAt: 42,
            attribValueEndsAt: 43,
            attribStarts: 34,
            attribEnds: 44,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 45,
            attribNameEndsAt: 51,
            attribOpeningQuoteAt: 52,
            attribClosingQuoteAt: 54,
            attribValueRaw: "9",
            attribValue: [
              {
                type: "text",
                start: 53,
                end: 54,
                value: "9",
              },
            ],
            attribValueStartsAt: 53,
            attribValueEndsAt: 54,
            attribStarts: 45,
            attribEnds: 55,
          },
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 56,
            attribNameEndsAt: 61,
            attribOpeningQuoteAt: 62,
            attribClosingQuoteAt: 77,
            attribValueRaw: "display:block;",
            attribValue: [
              {
                property: "display",
                propertyStarts: 63,
                propertyEnds: 70,
                colon: 70,
                value: "block",
                valueStarts: 71,
                valueEnds: 76,
                semi: 76,
              },
            ],
            attribValueStartsAt: 63,
            attribValueEndsAt: 77,
            attribStarts: 56,
            attribEnds: 78,
          },
        ],
      },
    ],
    "15"
  );
});

// 07. recognised and not recognised
// -----------------------------------------------------------------------------

test(`16 - two attrs, one recognised one not`, () => {
  let gathered = [];
  ct(`<table class="aa" bbb="cc">`, {
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
        tagName: "table",
        recognised: true,
        start: 0,
        end: 27,
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribStarts: 7,
            attribEnds: 17,
          },
          {
            attribName: "bbb",
            attribNameRecognised: false,
            attribStarts: 18,
            attribEnds: 26,
          },
        ],
      },
    ],
    "16"
  );
});

// 08. broken opening
// -----------------------------------------------------------------------------

test(`17 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - missing opening quote`, () => {
  let gathered = [];
  ct(
    `<span width=100">
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
        end: 17,
        value: '<span width=100">',
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 15,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 15,
                value: "100",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 15,
            attribStarts: 6,
            attribEnds: 16,
          },
        ],
      },
      {
        type: "text",
        start: 17,
        end: 24,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 24,
        end: 31,
        value: "</span>",
        tagNameStartsAt: 26,
        tagNameEndsAt: 30,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "17"
  );
});

test(`18 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes`, () => {
  let gathered = [];
  ct(`<span width='100"><span width='100">`, {
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
        end: 18,
        value: `<span width='100">`,
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
            attribClosingQuoteAt: 16,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 6,
            attribEnds: 17,
            attribLeft: 4,
          },
        ],
      },
      {
        type: "tag",
        start: 18,
        end: 36,
        value: `<span width='100">`,
        tagNameStartsAt: 19,
        tagNameEndsAt: 23,
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
            attribNameStartsAt: 24,
            attribNameEndsAt: 29,
            attribOpeningQuoteAt: 30,
            attribClosingQuoteAt: 34,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 31,
                end: 34,
                value: "100",
              },
            ],
            attribValueStartsAt: 31,
            attribValueEndsAt: 34,
            attribStarts: 24,
            attribEnds: 35,
            attribLeft: 22,
          },
        ],
      },
    ],
    "18.01"
  );
});

test(`19 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - false positives`, () => {
  let gathered = [];
  ct(`<span abc="Someone's" xyz="Someone's">`, {
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
        end: 38,
        value: `<span abc="Someone's" xyz="Someone's">`,
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
            attribName: "abc",
            attribNameRecognised: false,
            attribNameStartsAt: 6,
            attribNameEndsAt: 9,
            attribOpeningQuoteAt: 10,
            attribClosingQuoteAt: 20,
            attribValueRaw: "Someone's",
            attribValue: [
              {
                type: "text",
                start: 11,
                end: 20,
                value: "Someone's",
              },
            ],
            attribValueStartsAt: 11,
            attribValueEndsAt: 20,
            attribStarts: 6,
            attribEnds: 21,
            attribLeft: 4,
          },
          {
            attribName: "xyz",
            attribNameRecognised: false,
            attribNameStartsAt: 22,
            attribNameEndsAt: 25,
            attribOpeningQuoteAt: 26,
            attribClosingQuoteAt: 36,
            attribValueRaw: "Someone's",
            attribValue: [
              {
                type: "text",
                start: 27,
                end: 36,
                value: "Someone's",
              },
            ],
            attribValueStartsAt: 27,
            attribValueEndsAt: 36,
            attribStarts: 22,
            attribEnds: 37,
            attribLeft: 20,
          },
        ],
      },
    ],
    "19.01"
  );
});

test(`20 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes, the other way`, () => {
  let gathered = [];
  ct(`<span width="100'><span width="100'>`, {
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
        end: 18,
        value: `<span width="100'>`,
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
            attribClosingQuoteAt: 16,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 6,
            attribEnds: 17,
            attribLeft: 4,
          },
        ],
      },
      {
        type: "tag",
        start: 18,
        end: 36,
        value: `<span width="100'>`,
        tagNameStartsAt: 19,
        tagNameEndsAt: 23,
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
            attribNameStartsAt: 24,
            attribNameEndsAt: 29,
            attribOpeningQuoteAt: 30,
            attribClosingQuoteAt: 34,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 31,
                end: 34,
                value: "100",
              },
            ],
            attribValueStartsAt: 31,
            attribValueEndsAt: 34,
            attribStarts: 24,
            attribEnds: 35,
            attribLeft: 22,
          },
        ],
      },
    ],
    "20.01"
  );
});

test(`21 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quoteless attribute should not affect tag that follows`, () => {
  let gathered = [];
  ct(`<table width=100 border="0"><tr>`, {
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
        end: 28,
        value: '<table width=100 border="0">',
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 7,
            attribEnds: 16,
            attribLeft: 5,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 17,
            attribNameEndsAt: 23,
            attribOpeningQuoteAt: 24,
            attribClosingQuoteAt: 26,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 25,
                end: 26,
                value: "0",
              },
            ],
            attribValueStartsAt: 25,
            attribValueEndsAt: 26,
            attribStarts: 17,
            attribEnds: 27,
            attribLeft: 15,
          },
        ],
      },
      {
        type: "tag",
        start: 28,
        end: 32,
        value: "<tr>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 31,
        tagName: "tr",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "21.01"
  );
});

test(`22 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes, opposite pairs`, () => {
  let gathered = [];
  ct(`<span width="100'><span width='100">`, {
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
        end: 18,
        value: `<span width="100'>`,
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
            attribClosingQuoteAt: 16,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 6,
            attribEnds: 17,
            attribLeft: 4,
          },
        ],
      },
      {
        type: "tag",
        start: 18,
        end: 36,
        value: `<span width='100">`,
        tagNameStartsAt: 19,
        tagNameEndsAt: 23,
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
            attribNameStartsAt: 24,
            attribNameEndsAt: 29,
            attribOpeningQuoteAt: 30,
            attribClosingQuoteAt: 34,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 31,
                end: 34,
                value: "100",
              },
            ],
            attribValueStartsAt: 31,
            attribValueEndsAt: 34,
            attribStarts: 24,
            attribEnds: 35,
            attribLeft: 22,
          },
        ],
      },
    ],
    "22.01"
  );
});

test(`23 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - whitespace chunk instead of opening`, () => {
  let gathered = [];
  ct(
    `<span width=  100'>
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
        end: 19,
        value: "<span width=  100'>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 17,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "100",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 18,
          },
        ],
      },
      {
        type: "text",
        start: 19,
        end: 26,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 26,
        end: 33,
        value: "</span>",
        tagNameStartsAt: 28,
        tagNameEndsAt: 32,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "23"
  );
});

test(`24 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, digits`, () => {
  let gathered = [];
  ct(
    `<span width=  100>
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
        end: 18,
        value: "<span width=  100>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "100",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 17,
          },
        ],
      },
      {
        type: "text",
        start: 18,
        end: 25,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 25,
        end: 32,
        value: "</span>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 31,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "24"
  );
});

test(`25 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word`, () => {
  let gathered = [];
  ct(
    `<span width=  zzz>
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
        end: 18,
        value: "<span width=  zzz>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "zzz",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "zzz",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 17,
          },
        ],
      },
      {
        type: "text",
        start: 18,
        end: 25,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 25,
        end: 32,
        value: "</span>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 31,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "25"
  );
});

test(`26 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`, () => {
  let gathered = [];
  ct(
    `<span width=  zzz height=yyy>
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
        end: 29,
        value: "<span width=  zzz height=yyy>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "zzz",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "zzz",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 17,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 18,
            attribNameEndsAt: 24,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "yyy",
            attribValue: [
              {
                type: "text",
                start: 25,
                end: 28,
                value: "yyy",
              },
            ],
            attribValueStartsAt: 25,
            attribValueEndsAt: 28,
            attribStarts: 18,
            attribEnds: 28,
          },
        ],
      },
      {
        type: "text",
        start: 29,
        end: 36,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 36,
        end: 43,
        value: "</span>",
        tagNameStartsAt: 38,
        tagNameEndsAt: 42,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "26"
  );
});

test(`27 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`, () => {
  let gathered = [];
  ct(
    `<span width=1 height=1>
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
        end: 23,
        value: "<span width=1 height=1>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "1",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: "1",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 13,
            attribStarts: 6,
            attribEnds: 13,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 14,
            attribNameEndsAt: 20,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "1",
            attribValue: [
              {
                type: "text",
                start: 21,
                end: 22,
                value: "1",
              },
            ],
            attribValueStartsAt: 21,
            attribValueEndsAt: 22,
            attribStarts: 14,
            attribEnds: 22,
          },
        ],
      },
      {
        type: "text",
        start: 23,
        end: 30,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 30,
        end: 37,
        value: "</span>",
        tagNameStartsAt: 32,
        tagNameEndsAt: 36,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "27"
  );
});

test(`28 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`, () => {
  let gathered = [];
  ct(`<span width=zzz height=yyy></span>`, {
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
        end: 27,
        value: "<span width=zzz height=yyy>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "zzz",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 15,
                value: "zzz",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 15,
            attribStarts: 6,
            attribEnds: 15,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 16,
            attribNameEndsAt: 22,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "yyy",
            attribValue: [
              {
                type: "text",
                start: 23,
                end: 26,
                value: "yyy",
              },
            ],
            attribValueStartsAt: 23,
            attribValueEndsAt: 26,
            attribStarts: 16,
            attribEnds: 26,
          },
        ],
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
    "28"
  );
});

test(`29 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - attr equals attr equals`, () => {
  let gathered = [];
  ct(
    `<span width=height=100">
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
        end: 24,
        value: '<span width=height=100">',
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 6,
            attribEnds: 12,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 12,
            attribNameEndsAt: 18,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 22,
            attribValueRaw: `100`,
            attribValue: [
              {
                type: "text",
                start: 19,
                end: 22,
                value: "100",
              },
            ],
            attribValueStartsAt: 19,
            attribValueEndsAt: 22,
            attribStarts: 12,
            attribEnds: 23,
          },
        ],
      },
      {
        type: "text",
        start: 24,
        end: 31,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 31,
        end: 38,
        value: "</span>",
        tagNameStartsAt: 33,
        tagNameEndsAt: 37,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "29"
  );
});

test(`30 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes present, quoteless attr inside`, () => {
  let gathered = [];
  ct(
    `<span width="height=100">
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
        end: 25,
        value: '<span width="height=100">',
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
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 6,
            attribEnds: 13,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 19,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 23,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 20,
                end: 23,
                value: "100",
              },
            ],
            attribValueStartsAt: 20,
            attribValueEndsAt: 23,
            attribStarts: 13,
            attribEnds: 24,
          },
        ],
      },
      {
        type: "text",
        start: 25,
        end: 32,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 32,
        end: 39,
        value: "</span>",
      },
    ],
    "30"
  );
});

test(`31 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - unrecognised text - equal - value`, () => {
  let gathered = [];
  ct(
    `<span width="tralala=100">
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
        end: 26,
        value: '<span width="tralala=100">',
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
            attribClosingQuoteAt: 24,
            attribValueRaw: "tralala=100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 24,
                value: "tralala=100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 24,
            attribStarts: 6,
            attribEnds: 25,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 33,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 33,
        end: 40,
        value: "</span>",
      },
    ],
    "31"
  );
});

test(`32 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - pattern equal - quotes inside an attribute's value`, () => {
  let gathered = [];
  ct(
    `<span width="height="100">
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
        end: 26,
        value: '<span width="height="100">',
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
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 6,
            attribEnds: 13,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 19,
            attribOpeningQuoteAt: 20,
            attribClosingQuoteAt: 24,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 21,
                end: 24,
                value: "100",
              },
            ],
            attribValueStartsAt: 21,
            attribValueEndsAt: 24,
            attribStarts: 13,
            attribEnds: 25,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 33,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 33,
        end: 40,
        value: "</span>",
        tagNameStartsAt: 35,
        tagNameEndsAt: 39,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "32"
  );
});

test(`33 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - attr equals attr equals`, () => {
  let gathered = [];
  ct(
    `<span width=height=100>
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
        end: 23,
        value: "<span width=height=100>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 6,
            attribEnds: 12,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 12,
            attribNameEndsAt: 18,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 19,
                end: 22,
                value: "100",
              },
            ],
            attribValueStartsAt: 19,
            attribValueEndsAt: 22,
            attribStarts: 12,
            attribEnds: 22,
          },
        ],
      },
      {
        type: "text",
        start: 23,
        end: 30,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 30,
        end: 37,
        value: "</span>",
      },
    ],
    "33"
  );
});

test(`34 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - attr equals space attr equals`, () => {
  let gathered = [];
  ct(
    `<span width= height=100">
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
        end: 25,
        value: '<span width= height=100">',
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 6,
            attribEnds: 12,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 19,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 23,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 20,
                end: 23,
                value: "100",
              },
            ],
            attribValueStartsAt: 20,
            attribValueEndsAt: 23,
            attribStarts: 13,
            attribEnds: 24,
          },
        ],
      },
      {
        type: "text",
        start: 25,
        end: 32,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 32,
        end: 39,
        value: "</span>",
      },
    ],
    "34"
  );
});

test(`35 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing, many attrs`, () => {
  let gathered = [];
  ct(`<table width=100 border=1 cellpadding=2 cellspacing=3>`, {
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
        end: 54,
        value: "<table width=100 border=1 cellpadding=2 cellspacing=3>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 7,
            attribEnds: 16,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 17,
            attribNameEndsAt: 23,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "1",
            attribValue: [
              {
                type: "text",
                start: 24,
                end: 25,
                value: "1",
              },
            ],
            attribValueStartsAt: 24,
            attribValueEndsAt: 25,
            attribStarts: 17,
            attribEnds: 25,
          },
          {
            attribName: "cellpadding",
            attribNameRecognised: true,
            attribNameStartsAt: 26,
            attribNameEndsAt: 37,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "2",
            attribValue: [
              {
                type: "text",
                start: 38,
                end: 39,
                value: "2",
              },
            ],
            attribValueStartsAt: 38,
            attribValueEndsAt: 39,
            attribStarts: 26,
            attribEnds: 39,
          },
          {
            attribName: "cellspacing",
            attribNameRecognised: true,
            attribNameStartsAt: 40,
            attribNameEndsAt: 51,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "3",
            attribValue: [
              {
                type: "text",
                start: 52,
                end: 53,
                value: "3",
              },
            ],
            attribValueStartsAt: 52,
            attribValueEndsAt: 53,
            attribStarts: 40,
            attribEnds: 53,
          },
        ],
      },
    ],
    "35"
  );
});

test(`36 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing, many attrs`, () => {
  let gathered = [];
  ct(`<table width=100 border=z cellpadding= cellspacing=0>`, {
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
        end: 53,
        value: "<table width=100 border=z cellpadding= cellspacing=0>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 7,
            attribEnds: 16,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 17,
            attribNameEndsAt: 23,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 24,
                end: 25,
                value: "z",
              },
            ],
            attribValueStartsAt: 24,
            attribValueEndsAt: 25,
            attribStarts: 17,
            attribEnds: 25,
          },
          {
            attribName: "cellpadding",
            attribNameRecognised: true,
            attribNameStartsAt: 26,
            attribNameEndsAt: 37,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 26,
            attribEnds: 38,
          },
          {
            attribName: "cellspacing",
            attribNameRecognised: true,
            attribNameStartsAt: 39,
            attribNameEndsAt: 50,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 51,
                end: 52,
                value: "0",
              },
            ],
            attribValueStartsAt: 51,
            attribValueEndsAt: 52,
            attribStarts: 39,
            attribEnds: 52,
          },
        ],
      },
    ],
    "36"
  );
});

test(`37 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - only opening quotes present`, () => {
  let gathered = [];
  ct(`<table width='100 border='1 cellpadding='2 cellspacing='3>`, {
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
        end: 58,
        value: "<table width='100 border='1 cellpadding='2 cellspacing='3>",
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
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "100",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 7,
            attribEnds: 17,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 18,
            attribNameEndsAt: 24,
            attribOpeningQuoteAt: 25,
            attribClosingQuoteAt: null,
            attribValueRaw: "1",
            attribValue: [
              {
                type: "text",
                start: 26,
                end: 27,
                value: "1",
              },
            ],
            attribValueStartsAt: 26,
            attribValueEndsAt: 27,
            attribStarts: 18,
            attribEnds: 27,
          },
          {
            attribName: "cellpadding",
            attribNameRecognised: true,
            attribNameStartsAt: 28,
            attribNameEndsAt: 39,
            attribOpeningQuoteAt: 40,
            attribClosingQuoteAt: null,
            attribValueRaw: "2",
            attribValue: [
              {
                type: "text",
                start: 41,
                end: 42,
                value: "2",
              },
            ],
            attribValueStartsAt: 41,
            attribValueEndsAt: 42,
            attribStarts: 28,
            attribEnds: 42,
          },
          {
            attribName: "cellspacing",
            attribNameRecognised: true,
            attribNameStartsAt: 43,
            attribNameEndsAt: 54,
            attribOpeningQuoteAt: 55,
            attribClosingQuoteAt: null,
            attribValueRaw: "3",
            attribValue: [
              {
                type: "text",
                start: 56,
                end: 57,
                value: "3",
              },
            ],
            attribValueStartsAt: 56,
            attribValueEndsAt: 57,
            attribStarts: 43,
            attribEnds: 57,
          },
        ],
      },
    ],
    "37"
  );
});

test(`38 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - only closing quotes present`, () => {
  let gathered = [];
  ct(`<table width=100' border=0' cellpadding=0' cellspacing=0'>`, {
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
        end: 58,
        value: "<table width=100' border=0' cellpadding=0' cellspacing=0'>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 16,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 7,
            attribEnds: 17,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 18,
            attribNameEndsAt: 24,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 26,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 25,
                end: 26,
                value: "0",
              },
            ],
            attribValueStartsAt: 25,
            attribValueEndsAt: 26,
            attribStarts: 18,
            attribEnds: 27,
          },
          {
            attribName: "cellpadding",
            attribNameRecognised: true,
            attribNameStartsAt: 28,
            attribNameEndsAt: 39,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 41,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 40,
                end: 41,
                value: "0",
              },
            ],
            attribValueStartsAt: 40,
            attribValueEndsAt: 41,
            attribStarts: 28,
            attribEnds: 42,
          },
          {
            attribName: "cellspacing",
            attribNameRecognised: true,
            attribNameStartsAt: 43,
            attribNameEndsAt: 54,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 56,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 55,
                end: 56,
                value: "0",
              },
            ],
            attribValueStartsAt: 55,
            attribValueEndsAt: 56,
            attribStarts: 43,
            attribEnds: 57,
          },
        ],
      },
    ],
    "38"
  );
});

test(`39 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - sneaky inner/outer combo`, () => {
  let gathered = [];
  ct(`<table width="100 border='0 cellpadding=0' cellspacing=0">`, {
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
        end: 58,
        value: `<table width="100 border='0 cellpadding=0' cellspacing=0">`,
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
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "100",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 7,
            attribEnds: 17,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 18,
            attribNameEndsAt: 24,
            attribOpeningQuoteAt: 25,
            attribClosingQuoteAt: null,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 26,
                end: 27,
                value: "0",
              },
            ],
            attribValueStartsAt: 26,
            attribValueEndsAt: 27,
            attribStarts: 18,
            attribEnds: 27,
          },
          {
            attribName: "cellpadding",
            attribNameRecognised: true,
            attribNameStartsAt: 28,
            attribNameEndsAt: 39,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 41,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 40,
                end: 41,
                value: "0",
              },
            ],
            attribValueStartsAt: 40,
            attribValueEndsAt: 41,
            attribStarts: 28,
            attribEnds: 42,
          },
          {
            attribName: "cellspacing",
            attribNameRecognised: true,
            attribNameStartsAt: 43,
            attribNameEndsAt: 54,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 56,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 55,
                end: 56,
                value: "0",
              },
            ],
            attribValueStartsAt: 55,
            attribValueEndsAt: 56,
            attribStarts: 43,
            attribEnds: 57,
          },
        ],
      },
    ],
    "39"
  );
});

test(`40 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening consists of two types`, () => {
  let gathered = [];
  ct(
    `<span width='"100">
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
        end: 19,
        value: '<span width=\'"100">',
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
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 17,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "100",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 18,
          },
        ],
      },
      {
        type: "text",
        start: 19,
        end: 26,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 26,
        end: 33,
        value: "</span>",
      },
    ],
    "40"
  );
});

test(`41 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - rogue character`, () => {
  let gathered = [];
  ct(
    `<span width=."100">
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
        end: 19,
        value: '<span width=."100">',
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
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 17,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "100",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 18,
          },
        ],
      },
      {
        type: "text",
        start: 19,
        end: 26,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 26,
        end: 33,
        value: "</span>",
        tagNameStartsAt: 28,
        tagNameEndsAt: 32,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "41"
  );
});

test(`42 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - many dots`, () => {
  let gathered = [];
  ct(
    `<span width....=....."100">
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
        end: 27,
        value: '<span width....=....."100">',
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
            attribOpeningQuoteAt: 21,
            attribClosingQuoteAt: 25,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 22,
                end: 25,
                value: "100",
              },
            ],
            attribValueStartsAt: 22,
            attribValueEndsAt: 25,
            attribStarts: 6,
            attribEnds: 26,
          },
        ],
      },
      {
        type: "text",
        start: 27,
        end: 34,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 34,
        end: 41,
        value: "</span>",
      },
    ],
    "42"
  );
});

test(`43 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - all spaced`, () => {
  let gathered = [];
  ct(
    `< span width = " 100 " >
  zzz
< / span >`,
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
        end: 24,
        value: '< span width = " 100 " >',
        tagNameStartsAt: 2,
        tagNameEndsAt: 6,
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
            attribNameStartsAt: 7,
            attribNameEndsAt: 12,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 21,
            attribValueRaw: " 100 ",
            attribValue: [
              {
                type: "text",
                start: 16,
                end: 21,
                value: " 100 ",
              },
            ],
            attribValueStartsAt: 16,
            attribValueEndsAt: 21,
            attribStarts: 7,
            attribEnds: 22,
          },
        ],
      },
      {
        type: "text",
        start: 24,
        end: 31,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 31,
        end: 41,
        value: "< / span >",
        tagNameStartsAt: 35,
        tagNameEndsAt: 39,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "43"
  );
});

test(`44 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`, () => {
  let gathered = [];
  ct(
    `<span width=  zzz/>
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
        end: 19,
        value: "<span width=  zzz/>",
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValueRaw: "zzz",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 17,
                value: "zzz",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 17,
            attribStarts: 6,
            attribEnds: 17,
          },
        ],
      },
      {
        type: "text",
        start: 19,
        end: 26,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 26,
        end: 33,
        value: "</span>",
        tagNameStartsAt: 28,
        tagNameEndsAt: 32,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "44"
  );
});

test(`45 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing, one attr`, () => {
  let gathered = [];
  ct(
    `<span width=100">
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
        end: 17,
        value: '<span width=100">',
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
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: 15,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 15,
                value: "100",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 15,
            attribStarts: 6,
            attribEnds: 16,
          },
        ],
      },
      {
        type: "text",
        start: 17,
        end: 24,
        value: "\n  zzz\n",
      },
      {
        type: "tag",
        start: 24,
        end: 31,
        value: "</span>",
      },
    ],
    "45"
  );
});

test(`46 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes and equal missing`, () => {
  let gathered = [];
  ct(`<a class"c' id"e'>`, {
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
        end: 18,
        value: `<a class"c' id"e'>`,
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
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: 10,
            attribValueRaw: "c",
            attribValue: [
              {
                type: "text",
                start: 9,
                end: 10,
                value: "c",
              },
            ],
            attribValueStartsAt: 9,
            attribValueEndsAt: 10,
            attribStarts: 3,
            attribEnds: 11,
            attribLeft: 1,
          },
          {
            attribName: "id",
            attribNameRecognised: true,
            attribNameStartsAt: 12,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 14,
            attribClosingQuoteAt: 16,
            attribValueRaw: "e",
            attribValue: [
              {
                type: "text",
                start: 15,
                end: 16,
                value: "e",
              },
            ],
            attribValueStartsAt: 15,
            attribValueEndsAt: 16,
            attribStarts: 12,
            attribEnds: 17,
            attribLeft: 10,
          },
        ],
      },
    ],
    "46.01"
  );
});

// 09. broken closing
// -----------------------------------------------------------------------------

test(`47 - ${`\u001b[${33}m${`broken closing`}\u001b[${39}m`} - missing closing quote, one attr`, () => {
  let gathered = [];
  ct(`<span width="100>zzz</span>`, {
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
        value: '<span width="100>',
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
            attribClosingQuoteAt: null,
            attribValueRaw: "100",
            attribValue: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "100",
              },
            ],
            attribValueStartsAt: 13,
            attribValueEndsAt: 16,
            attribStarts: 6,
            attribEnds: 16,
          },
        ],
      },
      {
        type: "text",
        start: 17,
        end: 20,
        value: "zzz",
      },
      {
        type: "tag",
        start: 20,
        end: 27,
        value: "</span>",
        tagNameStartsAt: 22,
        tagNameEndsAt: 26,
        tagName: "span",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "47"
  );
});

test(`48 - ${`\u001b[${33}m${`broken closing`}\u001b[${39}m`} - missing closing quote, two attrs`, () => {
  let gathered = [];
  ct(`<a href="xyz border="0">`, {
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
        end: 24,
        value: '<a href="xyz border="0">',
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
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: null,
            attribValueRaw: "xyz",
            attribValue: [
              {
                type: "text",
                start: 9,
                end: 12,
                value: "xyz",
              },
            ],
            attribValueStartsAt: 9,
            attribValueEndsAt: 12,
            attribStarts: 3,
            attribEnds: 12,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 13,
            attribNameEndsAt: 19,
            attribOpeningQuoteAt: 20,
            attribClosingQuoteAt: 22,
            attribValueRaw: "0",
            attribValue: [
              {
                type: "text",
                start: 21,
                end: 22,
                value: "0",
              },
            ],
            attribValueStartsAt: 21,
            attribValueEndsAt: 22,
            attribStarts: 13,
            attribEnds: 23,
          },
        ],
      },
    ],
    "48"
  );
});

test(`49 - last attr empty, XHML`, () => {
  let gathered = [];
  ct(`<input type="radio" checked=""/>`, {
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
        end: 32,
        value: '<input type="radio" checked=""/>',
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "input",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "type",
            attribNameRecognised: true,
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
            attribLeft: 5,
          },
          {
            attribName: "checked",
            attribNameRecognised: true,
            attribNameStartsAt: 20,
            attribNameEndsAt: 27,
            attribOpeningQuoteAt: 28,
            attribClosingQuoteAt: 29,
            attribValueRaw: "",
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 20,
            attribEnds: 30,
            attribLeft: 18,
          },
        ],
      },
    ],
    "49"
  );
});

test(`50 - uri with query params`, () => {
  let gathered = [];
  ct(`<img src="https://example.com/my-image.png?query=" />`, {
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
        end: 53,
        value: '<img src="https://example.com/my-image.png?query=" />',
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
            attribName: "src",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 49,
            attribValueRaw: "https://example.com/my-image.png?query=",
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 49,
                value: "https://example.com/my-image.png?query=",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 49,
            attribStarts: 5,
            attribEnds: 50,
            attribLeft: 3,
          },
        ],
      },
    ],
    "50"
  );
});

test(`51 - more uris with query params`, () => {
  let gathered = [];
  ct(`<img src="codsen.com/my-image.png?query=" />`, {
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
        end: 44,
        attribs: [
          {
            attribName: "src",
            attribStarts: 5,
            attribEnds: 41,
            attribValueStartsAt: 10,
            attribValueEndsAt: 40,
          },
        ],
      },
    ],
    "51"
  );
});

// TODO
// -----------------------------------------------------------------------------

// MINOR ERRORS:

// <abc de =">"> text
// <abc de =">"> text<div class="z">
// <abc de =">'> text
// <abc de =">'> text<div class="z">
// <abc de =">' fg = 'hi"> text
// <abc de =">' fg = 'hi"> text <div class="z">

// INTERVENTION NEEDED:

// <abc de="> "a" > "z"
// <abc de="> a "text" b <div class="z">
// <abc de=" \n<div class="z">
// <abc de=" text<div class="z">
// <abc de="> < fgh>
// <abc de="> <fgh kl = "mn">

// <abc de=> text <def>
// <abc de=> fg="hi" <def>
// <abc de=> fg=hi" <def>

// <abc de=<def>
// <abc de=''<def>
// <abc de=""<def>
// <abc de='<def>
// <abc de="<def>
//
// <abc de= <def>
// <abc de='' <def>
// <abc de="" <def>
// <abc de=' <def>
// <abc de=" <def>
//
// <abc de=' fg="hi'<jkl>

// CRAZY:

// <abc de=">"a"

test.run();
