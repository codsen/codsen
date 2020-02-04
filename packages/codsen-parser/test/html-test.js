const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.test("01.01 - basics - two tags", t => {
  t.match(
    cparser("<div><div>"),
    [
      {
        type: "html",
        tagName: "div",
        start: 0,
        end: 5,
        children: [
          {
            type: "html",
            tagName: "div",
            start: 5,
            end: 10,
            children: []
          }
        ]
      }
    ],
    "01.01"
  );
  t.end();
});

t.test("01.02 - basics - text and tag", t => {
  t.match(
    cparser("z<div>"),
    [
      {
        type: "text",
        start: 0,
        end: 1,
        children: []
      },
      {
        type: "html",
        tagName: "div",
        start: 1,
        end: 6,
        children: []
      }
    ],
    "01.02"
  );
  t.end();
});

t.test("01.03 - basics - tag text tag", t => {
  t.match(
    cparser("<div>a<div>"),
    [
      {
        type: "html",
        tagName: "div",
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
            children: []
          },
          {
            type: "html",
            tagName: "div",
            start: 6,
            end: 11,
            children: []
          }
        ]
      }
    ],
    "01.03"
  );
  t.end();
});

t.test("01.04 - basics - two div pairs", t => {
  t.match(
    cparser("<div>a</div><div>b</div>"),
    [
      {
        type: "html",
        tagName: "div",
        closing: false,
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6
          }
        ]
      },
      {
        type: "html",
        tagName: "div",
        closing: true,
        start: 6,
        end: 12,
        children: []
      },
      {
        type: "html",
        tagName: "div",
        closing: false,
        start: 12,
        end: 17,
        children: [
          {
            type: "text",
            start: 17,
            end: 18
          }
        ]
      },
      {
        type: "html",
        tagName: "div",
        closing: true,
        start: 18,
        end: 24,
        children: []
      }
    ],
    "01.04"
  );
  t.end();
});
