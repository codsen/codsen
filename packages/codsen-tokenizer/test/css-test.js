const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. CSS
// -----------------------------------------------------------------------------

t.test(t => {
  const gathered = [];
  ct(`<style>\n.d-h{z}\n</style>`, obj => {
    gathered.push(obj);
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 7,
        kind: "style"
      },
      {
        type: "text",
        start: 7,
        end: 8
      },
      {
        type: "css",
        start: 8,
        end: 15
      },
      {
        type: "text",
        start: 15,
        end: 16
      },
      {
        type: "html",
        start: 16,
        end: 24,
        kind: "style"
      }
    ],
    "01.01 - CSS in the head"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`<meta><style>.d-h{z}</style>`, obj => {
    gathered.push(obj);
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 6
      },
      {
        type: "html",
        start: 6,
        end: 13,
        kind: "style"
      },
      {
        type: "css",
        start: 13,
        end: 20
      },
      {
        type: "html",
        start: 20,
        end: 28,
        kind: "style"
      }
    ],
    "01.02 - CSS, no whitespace inside"
  );
  t.end();
});
