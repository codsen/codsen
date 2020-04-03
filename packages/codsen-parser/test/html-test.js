const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.test("01.01 - basics - two tags", (t) => {
  t.match(
    cparser("<div><div>"),
    [
      {
        type: "tag",
        tagName: "div",
        start: 0,
        end: 5,
        children: [
          {
            type: "tag",
            tagName: "div",
            start: 5,
            end: 10,
            children: [],
          },
        ],
      },
    ],
    "01.01"
  );
  t.end();
});

t.test("01.02 - basics - text and tag", (t) => {
  t.match(
    cparser("z<div>"),
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "tag",
        tagName: "div",
        start: 1,
        end: 6,
        children: [],
      },
    ],
    "01.02"
  );
  t.end();
});

t.test("01.03 - basics - tag text tag", (t) => {
  t.match(
    cparser("<div>a<div>"),
    [
      {
        type: "tag",
        tagName: "div",
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
          },
          {
            type: "tag",
            tagName: "div",
            start: 6,
            end: 11,
            children: [],
          },
        ],
      },
    ],
    "01.03"
  );
  t.end();
});

t.test("01.04 - basics - two div pairs", (t) => {
  t.match(
    cparser("<div>a</div><div>b</div>"),
    [
      {
        type: "tag",
        tagName: "div",
        closing: false,
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
          },
        ],
      },
      {
        type: "tag",
        tagName: "div",
        closing: true,
        start: 6,
        end: 12,
        children: [],
      },
      {
        type: "tag",
        tagName: "div",
        closing: false,
        start: 12,
        end: 17,
        children: [
          {
            type: "text",
            start: 17,
            end: 18,
          },
        ],
      },
      {
        type: "tag",
        tagName: "div",
        closing: true,
        start: 18,
        end: 24,
        children: [],
      },
    ],
    "01.04"
  );
  t.end();
});

t.test("01.05 - basics - mixed combo", (t) => {
  t.match(
    cparser("<br>z</a>"),
    [
      {
        type: "tag",
        tagName: "br",
        closing: false,
        start: 0,
        end: 4,
        children: [],
      },
      {
        type: "text",
        start: 4,
        end: 5,
      },
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 5,
        end: 9,
        children: [],
      },
    ],
    "01.05"
  );
  t.end();
});

t.test("01.06 - basics - two nested pairs", (t) => {
  t.match(
    cparser("<div>1<a>2</a>3</div>"),
    [
      {
        type: "tag",
        tagName: "div",
        closing: false,
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
          },
          {
            type: "tag",
            tagName: "a",
            closing: false,
            start: 6,
            end: 9,
            children: [
              {
                type: "text",
                start: 9,
                end: 10,
              },
            ],
          },
          {
            type: "tag",
            tagName: "a",
            closing: true,
            start: 10,
            end: 14,
            children: [],
          },
          {
            type: "text",
            start: 14,
            end: 15,
          },
        ],
      },
      {
        type: "tag",
        tagName: "div",
        closing: true,
        start: 15,
        end: 21,
        children: [],
      },
    ],
    "01.06"
  );
  t.end();
});

t.test("01.07 - basics - three nested pairs, empty", (t) => {
  t.match(
    cparser("<table><tr><td></td></tr></table>"),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "table",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,

        kind: null,
        attribs: [],
        children: [
          {
            type: "tag",
            start: 7,
            end: 11,
            value: "<tr>",
            tagNameStartsAt: 8,
            tagNameEndsAt: 10,
            tagName: "tr",
            recognised: true,
            closing: false,
            void: false,
            pureHTML: true,

            kind: null,
            attribs: [],
            children: [
              {
                type: "tag",
                start: 11,
                end: 15,
                value: "<td>",
                tagNameStartsAt: 12,
                tagNameEndsAt: 14,
                tagName: "td",
                recognised: true,
                closing: false,
                void: false,
                pureHTML: true,

                kind: null,
                attribs: [],
                children: [],
              },
              {
                type: "tag",
                start: 15,
                end: 20,
                value: "</td>",
                tagNameStartsAt: 17,
                tagNameEndsAt: 19,
                tagName: "td",
                recognised: true,
                closing: true,
                void: false,
                pureHTML: true,

                kind: null,
                attribs: [],
                children: [],
              },
            ],
          },
          {
            type: "tag",
            start: 20,
            end: 25,
            value: "</tr>",
            tagNameStartsAt: 22,
            tagNameEndsAt: 24,
            tagName: "tr",
            recognised: true,
            closing: true,
            void: false,
            pureHTML: true,

            kind: null,
            attribs: [],
            children: [],
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
        value: "</table>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 32,
        tagName: "table",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,

        kind: null,
        attribs: [],
        children: [],
      },
    ],
    "01.07"
  );
  t.end();
});
