const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`style`}\u001b[${39}m`} - two tags`, t => {
  t.same(
    cparser(`<style>
.red{color: red;}
</style>`),
    [
      {
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
        attribs: [],
        children: [
          {
            type: "text",
            start: 7,
            end: 8
          },
          {
            type: "rule",
            start: 8,
            end: 25,
            openingCurlyAt: 12,
            closingCurlyAt: 24,
            selectors: [
              {
                value: ".red",
                selectorStart: 8,
                selectorEnd: 12
              }
            ]
          },
          {
            type: "text",
            start: 25,
            end: 26
          }
        ]
      },
      {
        children: [],
        type: "tag",
        start: 26,
        end: 34,
        tagNameStartsAt: 28,
        tagNameEndsAt: 33,
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
    "01.01"
  );
  t.end();
});
