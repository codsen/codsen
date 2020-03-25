const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 00. MVP
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${34}m${`mvp`}\u001b[${39}m`} - minimal case, one level`,
  (t) => {
    const gathered = [];
    ct(`<style>@media a {.b{c}}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
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
              selectorStarts: 17,
              selectorEnds: 19,
            },
          ],
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
          closingCurlyAt: 22,
        },
        {
          type: "tag",
          start: 23,
          end: 31,
        },
      ],
      "00.01"
    );
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${34}m${`mvp`}\u001b[${39}m`} - minimal case, two levels`,
  (t) => {
    const gathered = [];
    ct(`<style>@a b {.c{d: e}@f g {.h{i: j}}.k{l: m}}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
        },
        {
          type: "rule",
          start: 13,
          end: 21,
          openingCurlyAt: 15,
          closingCurlyAt: 20,
          selectorsStart: 13,
          selectorsEnd: 15,
          selectors: [
            {
              value: ".c",
              selectorStarts: 13,
              selectorEnds: 15,
            },
          ],
        },
        {
          type: "rule",
          start: 27,
          end: 35,
          openingCurlyAt: 29,
          closingCurlyAt: 34,
          selectorsStart: 27,
          selectorsEnd: 29,
          selectors: [
            {
              value: ".h",
              selectorStarts: 27,
              selectorEnds: 29,
            },
          ],
        },
        {
          type: "at",
          start: 21,
          end: 36,
          identifier: "f",
          identifierStartsAt: 22,
          identifierEndsAt: 23,
          query: "g",
          queryStartsAt: 24,
          queryEndsAt: 25,
          openingCurlyAt: 26,
          closingCurlyAt: 35,
        },
        {
          type: "rule",
          start: 36,
          end: 44,
          openingCurlyAt: 38,
          closingCurlyAt: 43,
          selectorsStart: 36,
          selectorsEnd: 38,
          selectors: [
            {
              value: ".k",
              selectorStarts: 36,
              selectorEnds: 38,
            },
          ],
        },
        {
          type: "at",
          start: 7,
          end: 45,
          identifier: "a",
          identifierStartsAt: 8,
          identifierEndsAt: 9,
          query: "b",
          queryStartsAt: 10,
          queryEndsAt: 11,
          openingCurlyAt: 12,
          closingCurlyAt: 44,
        },
        {
          type: "tag",
          start: 45,
          end: 53,
        },
      ],
      "00.02"
    );
    t.end();
  }
);

// 01. simple
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${35}m${`at-rule`}\u001b[${39}m`} - one rule`,
  (t) => {
    const gathered = [];
    ct(
      `<style>
@media (max-width: 600px) {
  .xx[z] {a:1;}
}
</style>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
        },
        {
          type: "text",
          start: 7,
          end: 8,
        },
        {
          type: "text",
          start: 35,
          end: 38,
        },
        {
          type: "rule",
          start: 38,
          end: 51,
          openingCurlyAt: 45,
          closingCurlyAt: 50,
          selectorsStart: 38,
          selectorsEnd: 44,
          selectors: [
            {
              value: ".xx[z]",
              selectorStarts: 38,
              selectorEnds: 44,
            },
          ],
        },
        {
          type: "text",
          start: 51,
          end: 52,
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
          closingCurlyAt: 52,
        },
        {
          type: "text",
          start: 53,
          end: 54,
        },
        {
          type: "tag",
          start: 54,
          end: 62,
        },
      ],
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${35}m${`at-rule`}\u001b[${39}m`} - rule is nonsense`,
  (t) => {
    const gathered = [];
    ct(
      `<style>
@media (max-width: 600px) {
  zzz
}
</style>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
        },
        {
          type: "text",
          start: 7,
          end: 8,
        },
        {
          type: "text",
          start: 35,
          end: 38,
        },
        {
          type: "rule",
          start: 38,
          end: 41,
          openingCurlyAt: null,
          closingCurlyAt: null,
          selectors: [
            {
              value: "zzz",
              selectorStarts: 38,
              selectorEnds: 41,
            },
          ],
        },
        {
          type: "text",
          start: 41,
          end: 42,
        },
        {
          type: "at",
          start: 8,
          end: 43,
          identifier: "media",
          identifierStartsAt: 9,
          identifierEndsAt: 14,
          query: "(max-width: 600px)",
          queryStartsAt: 15,
          queryEndsAt: 33,
          openingCurlyAt: 34,
          closingCurlyAt: 42,
        },
        {
          type: "text",
          start: 43,
          end: 44,
        },
        {
          type: "tag",
          start: 44,
          end: 52,
        },
      ],
      "01.02"
    );
    t.end();
  }
);
