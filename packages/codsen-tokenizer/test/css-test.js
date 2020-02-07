const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. CSS
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`css`}\u001b[${39}m`} - one rule, no linebreaks`,
  t => {
    const gathered = [];
    ct(`<style>.a-b{c}</style>`, {
      tagCb: obj => {
        gathered.push(obj);
      }
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
          type: "rule",
          start: 7,
          end: 14,
          openingCurlyAt: 11,
          closingCurlyAt: 13,
          selectors: [
            {
              value: ".a-b",
              selectorStart: 7,
              selectorEnd: 11
            }
          ]
        },
        {
          type: "html",
          start: 14,
          end: 22,
          kind: "style"
        }
      ],
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`css`}\u001b[${39}m`} - one rule, linebreaks`,
  t => {
    const gathered = [];
    ct(
      `<style>
.a-b{c}
</style>`,
      {
        tagCb: obj => {
          gathered.push(obj);
        }
      }
    );
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
          type: "rule",
          start: 8,
          end: 15,
          openingCurlyAt: 12,
          closingCurlyAt: 14,
          selectors: [
            {
              value: ".a-b",
              selectorStart: 8,
              selectorEnd: 12
            }
          ]
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
      "01.02"
    );
    t.end();
  }
);
