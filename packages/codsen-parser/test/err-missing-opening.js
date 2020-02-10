const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags`, t => {
  t.same(
    cparser("<div></div>"),
    [
      {
        children: [],
        type: "html",
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
        type: "html",
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
