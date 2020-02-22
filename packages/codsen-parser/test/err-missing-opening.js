const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 00. no error
// -----------------------------------------------------------------------------

t.test(`00.01 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags`, t => {
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
    "00.01"
  );
  t.end();
});

t.test(
  `00.02 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
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
      "00.02"
    );
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
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
      "00.03"
    );
    t.end();
  }
);

// 01. basic
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - two tags`, t => {
  const gatheredErr = [];
  t.match(
    cparser(`<div><a>z</a></div></div>`, {
      errCb: errObj => gatheredErr.push(errObj)
    }),
    [
      {
        children: [
          {
            children: [
              {
                type: "text",
                start: 8,
                end: 9
              }
            ],
            type: "tag",
            start: 5,
            end: 8,
            closing: false
          },
          {
            type: "tag",
            start: 9,
            end: 13,
            closing: true
          }
        ],
        type: "tag",
        start: 0,
        end: 5,
        closing: false
      },
      {
        type: "tag",
        start: 13,
        end: 19,
        closing: true
      },
      {
        type: "tag",
        start: 19,
        end: 25,
        closing: true
      }
    ],
    "01.01.01"
  );
  t.match(
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 19,
        idxTo: 25
      }
    ],
    "01.01.02"
  );
  t.end();
});
