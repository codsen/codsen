const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. basics
// -----------------------------------------------------------------------------

t.only("01.01 - basics - two divs", t => {
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
