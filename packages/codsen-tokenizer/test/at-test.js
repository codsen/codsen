const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 00. MVP
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${34}m${`mvp`}\u001b[${39}m`} - minimal case, one level`,
  t => {
    const gathered = [];
    ct(`<style>@media a {.b{c}}</style>`, {
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
          end: 7
        },
        {
          type: "rule",
          start: 17,
          end: 22,
          openingCurlyAt: 19,
          closingCurlyAt: 21,
          selectors: [
            {
              value: ".b",
              selectorStart: 17,
              selectorEnd: 19
            }
          ]
        },
        {
          type: "at",
          start: 7,
          end: 23,
          identifier: "media",
          identifierStartsAt: 8,
          identifierEndsAt: 13,
          query: "a",
          queryStartsAt: 14,
          queryEndsAt: 15,
          openingCurlyAt: 16,
          closingCurlyAt: 22
        },
        {
          type: "html",
          start: 23,
          end: 31
        }
      ],
      "00.01"
    );
    t.end();
  }
);

t.todo(
  `00.02 - ${`\u001b[${34}m${`mvp`}\u001b[${39}m`} - minimal case, two levels`,
  t => {
    const gathered = [];
    ct(`@a b {.c{d: e}@f g {.h{i: j}}.k{l: m}}`, {
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
          end: 7
        },
        {
          type: "rule",
          start: 17,
          end: 22,
          openingCurlyAt: 19,
          closingCurlyAt: 21,
          selectors: [
            {
              value: ".b",
              selectorStart: 17,
              selectorEnd: 19
            }
          ]
        },
        {
          type: "at",
          start: 7,
          end: 23,
          identifier: "media",
          identifierStartsAt: 8,
          identifierEndsAt: 13,
          query: "a",
          queryStartsAt: 14,
          queryEndsAt: 15,
          openingCurlyAt: 16,
          closingCurlyAt: 22
        },
        {
          type: "html",
          start: 23,
          end: 31
        }
      ],
      "00.02"
    );
    t.end();
  }
);

// 01. simple
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${35}m${`at-rule`}\u001b[${39}m`} - one rule`, t => {
  const gathered = [];
  ct(
    `<style>
@media (max-width: 600px) {
  .xx[z] {a:1;}
}
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
        end: 7
      },
      {
        type: "text",
        start: 7,
        end: 8
      },
      {
        type: "text",
        start: 35,
        end: 38
      },
      {
        type: "rule",
        start: 38,
        end: 51,
        openingCurlyAt: 45,
        closingCurlyAt: 50,
        selectors: [
          {
            value: ".xx[z]",
            selectorStart: 38,
            selectorEnd: 44
          }
        ]
      },
      {
        type: "text",
        start: 51,
        end: 52
      },
      {
        type: "at",
        start: 8,
        end: 53,
        identifier: "media",
        identifierStartsAt: 9,
        identifierEndsAt: 14,
        query: "(max-width: 600px)",
        queryStartsAt: 15,
        queryEndsAt: 33,
        openingCurlyAt: 34,
        closingCurlyAt: 52
      },
      {
        type: "text",
        start: 53,
        end: 54
      },
      {
        type: "html",
        start: 54,
        end: 62
      }
    ],
    "01.01"
  );
  t.end();
});
