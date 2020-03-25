const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`style`}\u001b[${39}m`} - two tags`, (t) => {
  t.same(
    cparser(`<style>
.red{color: red;}
</style>`),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: `<style>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "style",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        esp: [],
        kind: null,
        attribs: [],
        children: [
          {
            type: "text",
            start: 7,
            end: 8,
            value: "\n",
          },
          {
            type: "rule",
            start: 8,
            end: 25,
            value: `.red{color: red;}`,
            openingCurlyAt: 12,
            closingCurlyAt: 24,
            selectorsStart: 8,
            selectorsEnd: 12,
            selectors: [
              {
                value: ".red",
                selectorStarts: 8,
                selectorEnds: 12,
              },
            ],
          },
          {
            type: "text",
            start: 25,
            end: 26,
            value: `\n`,
          },
        ],
      },
      {
        children: [],
        type: "tag",
        start: 26,
        end: 34,
        value: `</style>`,
        tagNameStartsAt: 28,
        tagNameEndsAt: 33,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        esp: [],
        kind: null,
        attribs: [],
      },
    ],
    "01.01"
  );
  t.end();
});

// 02. media
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`media`}\u001b[${39}m`} - two selectors with empty curlies`,
  (t) => {
    t.same(
      cparser(`<style>
@media screen and {
.a, .b {}
}
</style>`),
      [
        {
          children: [
            {
              type: "text",
              start: 7,
              end: 8,
              value: "\n",
            },
            {
              type: "text",
              start: 27,
              end: 28,
              value: "\n",
            },
            {
              type: "rule",
              start: 28,
              end: 37,
              value: `.a, .b {}`,
              openingCurlyAt: 35,
              closingCurlyAt: 36,
              selectorsStart: 28,
              selectorsEnd: 34,
              selectors: [
                {
                  value: ".a",
                  selectorStarts: 28,
                  selectorEnds: 30,
                },
                {
                  value: ".b",
                  selectorStarts: 32,
                  selectorEnds: 34,
                },
              ],
            },
            {
              type: "text",
              start: 37,
              end: 38,
              value: "\n",
            },
            {
              type: "at",
              start: 8,
              end: 39,
              value: `@media screen and {\n.a, .b {}\n}`,
              identifier: "media",
              identifierStartsAt: 9,
              identifierEndsAt: 14,
              query: "screen and",
              queryStartsAt: 15,
              queryEndsAt: 25,
              openingCurlyAt: 26,
              closingCurlyAt: 38,
            },
            {
              type: "text",
              start: 39,
              end: 40,
              value: "\n",
            },
          ],
          type: "tag",
          start: 0,
          end: 7,
          value: `<style>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "style",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          esp: [],
          kind: null,
          attribs: [],
        },
        {
          children: [],
          type: "tag",
          start: 40,
          end: 48,
          value: `</style>`,
          tagNameStartsAt: 42,
          tagNameEndsAt: 47,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          esp: [],
          kind: null,
          attribs: [],
        },
      ],
      "02.01"
    );
    t.end();
  }
);
