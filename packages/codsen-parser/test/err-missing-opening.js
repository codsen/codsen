const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags`, t => {
  t.same(
    cparser(`<div></div>`),
    [
      {
        children: [],
        type: "tag",
        start: 0,
        end: 5,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        esp: [],
        kind: null,
        attribs: []
      },
      {
        children: [],
        type: "tag",
        start: 5,
        end: 11,
        tagNameStartsAt: 7,
        tagNameEndsAt: 10,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        esp: [],
        kind: null,
        attribs: []
      }
    ],
    "01.01"
  );
  t.end();
});

t.only(
  `01.02 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
  t => {
    t.same(
      cparser(`<style>\n\n</style>`),
      [
        {
          children: [
            {
              type: "text",
              start: 7,
              end: 9
            }
          ],
          type: "tag",
          start: 0,
          end: 7,
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "style",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          esp: [],
          kind: null,
          attribs: []
        },
        {
          children: [],
          type: "tag",
          start: 9,
          end: 17,
          tagNameStartsAt: 11,
          tagNameEndsAt: 16,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          esp: [],
          kind: null,
          attribs: []
        }
      ],
      "01.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
  t => {
    t.same(
      cparser(`<div>\n\n</div>`),
      [
        {
          children: [
            {
              type: "text",
              start: 5,
              end: 7
            }
          ],
          type: "tag",
          start: 0,
          end: 5,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "div",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          esp: [],
          kind: null,
          attribs: []
        },
        {
          children: [],
          type: "tag",
          start: 7,
          end: 13,
          tagNameStartsAt: 9,
          tagNameEndsAt: 12,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          esp: [],
          kind: null,
          attribs: []
        }
      ],
      "01.03"
    );
    t.end();
  }
);
