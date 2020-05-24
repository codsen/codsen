import tap from "tap";
import cparser from "../dist/codsen-parser.esm";

// 01. basics
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${33}m${`style`}\u001b[${39}m`} - two tags`, (t) => {
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
            left: 6,
            nested: false,
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

        kind: null,
        attribs: [],
      },
    ],
    "01"
  );
  t.end();
});

// 02. media
// -----------------------------------------------------------------------------

tap.test(
  `02 - ${`\u001b[${36}m${`media`}\u001b[${39}m`} - two selectors with empty curlies`,
  (t) => {
    t.same(
      cparser(`<style>
@media screen and {
.a, .b {}
}
</style>`),
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<style>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "style",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
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
              type: "at",
              start: 8,
              end: 39,
              value: "@media screen and {\n.a, .b {}\n}",
              left: 6,
              nested: false,
              openingCurlyAt: 26,
              closingCurlyAt: 38,
              identifier: "media",
              identifierStartsAt: 9,
              identifierEndsAt: 14,
              query: "screen and",
              queryStartsAt: 15,
              queryEndsAt: 25,
              rules: [
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
                  value: ".a, .b {}",
                  left: 26,
                  nested: true,
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
              ],
            },
            {
              type: "text",
              start: 39,
              end: 40,
              value: "\n",
            },
          ],
        },
        {
          type: "tag",
          start: 40,
          end: 48,
          value: "</style>",
          tagNameStartsAt: 42,
          tagNameEndsAt: 47,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
          children: [],
        },
      ],
      "02"
    );
    t.end();
  }
);
