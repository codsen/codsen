import tap from "tap";
import { cparser } from "../dist/codsen-parser.esm.js";

// 01. simple HTML comments
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one nested outlook-only comment`,
  (t) => {
    t.hasStrict(
      cparser("a<!--b-->c"),
      [
        {
          type: "text",
          start: 0,
          end: 1,
        },
        {
          type: "comment",
          kind: "simple",
          start: 1,
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
          type: "comment",
          kind: "simple",
          start: 6,
          end: 9,
        },
        {
          type: "text",
          start: 9,
          end: 10,
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one nested outlook-only comment`,
  (t) => {
    t.hasStrict(
      cparser("a<!--b->c"),
      [
        {
          type: "text",
          start: 0,
          end: 1,
          value: "a",
        },
        {
          type: "comment",
          kind: "simple",
          start: 1,
          end: 5,
          value: "<!--",
          closing: false,
          children: [
            {
              type: "text",
              start: 5,
              end: 6,
              value: "b",
            },
          ],
        },
        {
          type: "comment",
          kind: "simple",
          start: 6,
          end: 8,
          value: "->",
          closing: true,
          children: [],
        },
        {
          type: "text",
          start: 8,
          end: 9,
          value: "c",
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - nested tags inside broken comment closing tag pair`,
  (t) => {
    t.hasStrict(
      cparser(`a<!--<table><tr><td>.</td></tr></table>->c`),
      [
        {
          type: "text",
          start: 0,
          end: 1,
          value: "a",
        },
        {
          type: "comment",
          start: 1,
          end: 5,
          value: "<!--",
          children: [
            {
              children: [
                {
                  children: [
                    {
                      children: [
                        {
                          type: "text",
                          start: 20,
                          end: 21,
                          value: ".",
                        },
                      ],
                      type: "tag",
                      start: 16,
                      end: 20,
                      value: "<td>",
                    },
                    {
                      children: [],
                      type: "tag",
                      start: 21,
                      end: 26,
                      value: "</td>",
                    },
                  ],
                  type: "tag",
                  start: 12,
                  end: 16,
                  value: "<tr>",
                },
                {
                  children: [],
                  type: "tag",
                  start: 26,
                  end: 31,
                  value: "</tr>",
                },
              ],
              type: "tag",
              start: 5,
              end: 12,
              value: "<table>",
            },
            {
              children: [],
              type: "tag",
              start: 31,
              end: 39,
              value: "</table>",
            },
          ],
        },
        {
          type: "comment",
          start: 39,
          end: 41,
          value: "->",
          kind: "simple",
          closing: true,
        },
        {
          type: "text",
          start: 41,
          end: 42,
          value: "c",
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - false positive`,
  (t) => {
    t.hasStrict(
      cparser("x<a>y->b"),
      [
        {
          type: "text",
          start: 0,
          end: 1,
        },
        {
          children: [
            {
              type: "text", // <--------- !!!!
              start: 4,
              end: 8,
              value: "y->b",
            },
          ],
          type: "tag",
          start: 1,
          end: 4,
          value: "<a>",
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - another false positive`,
  (t) => {
    t.hasStrict(
      cparser("<!--x<a>-->y->b"),
      [
        {
          type: "comment",
          start: 0,
          end: 4,
          value: "<!--",
          children: [
            {
              type: "text",
              start: 4,
              end: 5,
              value: "x",
            },
            {
              type: "tag",
              start: 5,
              end: 8,
              value: "<a>",
            },
          ],
        },
        {
          type: "comment",
          start: 8,
          end: 11,
          value: "-->",
        },
        {
          type: "text", // <--------- !!!!
          start: 11,
          end: 15,
          value: "y->b",
        },
      ],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - rogue character in the closing`,
  (t) => {
    t.hasStrict(
      cparser(`a<!--b--!>c`),
      [
        {
          type: "text",
          start: 0,
          end: 1,
        },
        {
          type: "comment",
          kind: "simple",
          start: 1,
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
          type: "comment",
          kind: "simple",
          start: 6,
          end: 10,
        },
        {
          type: "text",
          start: 10,
          end: 11,
        },
      ],
      "06"
    );
    t.end();
  }
);

// 02. conditional "only" type comments
// -----------------------------------------------------------------------------

tap.test(`07 - ${`\u001b[${33}m${`only`}\u001b[${39}m`} - one pair`, (t) => {
  t.hasStrict(
    cparser(`a<!--[if gte mso 9]>x<![endif]-->z`),
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 20,
        kind: "only",
        closing: false,
        children: [
          {
            type: "text",
            start: 20,
            end: 21,
          },
        ],
      },
      {
        type: "comment",
        start: 21,
        end: 33,
        kind: "only",
        closing: true,
      },
      {
        type: "text",
        start: 33,
        end: 34,
      },
    ],
    "07"
  );
  t.end();
});

// 03. conditional "not" type comments
// -----------------------------------------------------------------------------

tap.test(`08 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - one pair`, (t) => {
  t.hasStrict(
    cparser(`a<!--[if !mso]><!-->x<!--<![endif]-->z`),
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "comment",
        start: 1,
        end: 20,
        kind: "not",
        closing: false,
        children: [
          {
            type: "text",
            start: 20,
            end: 21,
          },
        ],
      },
      {
        type: "comment",
        start: 21,
        end: 37,
        kind: "not",
        closing: true,
      },
      {
        type: "text",
        start: 37,
        end: 38,
      },
    ],
    "08"
  );
  t.end();
});

tap.test(
  `09 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing bracket`,
  (t) => {
    t.hasStrict(
      cparser(`<img/>!--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
        },
        {
          type: "comment",
          start: 6,
          end: 21,
          kind: "not",
          closing: true,
        },
      ],
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing excl mark`,
  (t) => {
    t.hasStrict(
      cparser(`<img/><--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
        },
        {
          type: "comment",
          start: 6,
          end: 21,
          kind: "not",
          closing: true,
        },
      ],
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's character one`,
  (t) => {
    t.hasStrict(
      cparser(`<img/><1--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
        },
        {
          type: "comment",
          start: 6,
          end: 22,
          kind: "not",
          closing: true,
        },
      ],
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing dash`,
  (t) => {
    t.hasStrict(
      cparser(`<img/><!-<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
        },
        {
          type: "comment",
          start: 6,
          end: 21,
          kind: "not",
          closing: true,
        },
      ],
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing dash`,
  (t) => {
    t.hasStrict(
      cparser(`<img/><1--<1--<1--<1--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
          value: "<img/>",
        },
        {
          type: "text",
          start: 6,
          end: 18,
          value: "<1--<1--<1--",
        },
        {
          type: "comment",
          start: 18,
          end: 34,
          value: `<1--<![endif]-->`,
          kind: "not",
          closing: true,
        },
      ],
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing dash`,
  (t) => {
    t.hasStrict(
      cparser(`<img/><1--<1--<1--<1--zzzz<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
        },
        {
          type: "text",
          start: 6,
          end: 26,
        },
        {
          type: "comment",
          start: 26,
          end: 38,
          kind: "only",
          closing: true,
        },
      ],
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - nested inside parent`,
  (t) => {
    // below, two tokens,
    // "<img src="gif"/>"
    // and
    // "!--"
    // would sit inside opening comment, inside its children[] value array
    t.strictSame(
      cparser(`<!--[if !mso]><!--><img src="gif"/>!--<![endif]-->`),
      [
        {
          type: "comment",
          start: 0,
          end: 19,
          value: "<!--[if !mso]><!-->",
          kind: "not",
          language: "html",
          closing: false,
          children: [
            {
              type: "tag",
              start: 19,
              end: 35,
              value: '<img src="gif"/>',
              tagNameStartsAt: 20,
              tagNameEndsAt: 23,
              tagName: "img",
              recognised: true,
              closing: false,
              void: true,
              pureHTML: true,
              kind: "inline",
              attribs: [
                {
                  attribName: "src",
                  attribNameRecognised: true,
                  attribNameStartsAt: 24,
                  attribNameEndsAt: 27,
                  attribOpeningQuoteAt: 28,
                  attribClosingQuoteAt: 32,
                  attribValueRaw: "gif",
                  attribValue: [
                    {
                      type: "text",
                      start: 29,
                      end: 32,
                      value: "gif",
                    },
                  ],
                  attribValueStartsAt: 29,
                  attribValueEndsAt: 32,
                  attribStarts: 24,
                  attribEnds: 33,
                  attribLeft: 22,
                },
              ],
              children: [],
            },
          ],
        },
        {
          type: "comment",
          start: 35,
          end: 50,
          value: "!--<![endif]-->",
          kind: "not",
          language: "html",
          closing: true,
          children: [],
        },
      ],
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - nested inside parent`,
  (t) => {
    // below, two tokens,
    // "<img src="gif"/>"
    // and
    // "!--"
    // would sit inside opening comment, inside its children[] value array
    t.strictSame(
      cparser(`<!--[if !mso]><!--><img src="gif"/>zzz!--<![endif]-->`),
      [
        {
          type: "comment",
          start: 0,
          end: 19,
          value: "<!--[if !mso]><!-->",
          kind: "not",
          language: "html",
          closing: false,
          children: [
            {
              type: "tag",
              start: 19,
              end: 35,
              value: '<img src="gif"/>',
              tagNameStartsAt: 20,
              tagNameEndsAt: 23,
              tagName: "img",
              recognised: true,
              closing: false,
              void: true,
              pureHTML: true,
              kind: "inline",
              attribs: [
                {
                  attribName: "src",
                  attribNameRecognised: true,
                  attribNameStartsAt: 24,
                  attribNameEndsAt: 27,
                  attribOpeningQuoteAt: 28,
                  attribClosingQuoteAt: 32,
                  attribValueRaw: "gif",
                  attribValue: [
                    {
                      type: "text",
                      start: 29,
                      end: 32,
                      value: "gif",
                    },
                  ],
                  attribValueStartsAt: 29,
                  attribValueEndsAt: 32,
                  attribStarts: 24,
                  attribEnds: 33,
                  attribLeft: 22,
                },
              ],
              children: [],
            },
            {
              type: "text",
              start: 35,
              end: 38,
              value: "zzz",
            },
          ],
        },
        {
          type: "comment",
          start: 38,
          end: 53,
          value: "!--<![endif]-->",
          kind: "not",
          language: "html",
          closing: true,
          children: [],
        },
      ],
      "16"
    );
    t.end();
  }
);

tap.test(`17 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - false alarm`, (t) => {
  // clauses are triggered but nothing's found from characters: <, ! and -
  t.strictSame(
    cparser(`<!--[if !mso]><!--><img src="gif"/>zzz-<![endif]-->`),
    [
      {
        type: "comment",
        start: 0,
        end: 19,
        value: "<!--[if !mso]><!-->",
        kind: "not",
        closing: false,
        children: [
          {
            type: "tag",
            start: 19,
            end: 35,
            value: '<img src="gif"/>',
            tagNameStartsAt: 20,
            tagNameEndsAt: 23,
            tagName: "img",
            recognised: true,
            closing: false,
            void: true,
            pureHTML: true,
            kind: "inline",
            attribs: [
              {
                attribName: "src",
                attribNameRecognised: true,
                attribNameStartsAt: 24,
                attribNameEndsAt: 27,
                attribOpeningQuoteAt: 28,
                attribClosingQuoteAt: 32,
                attribValueRaw: "gif",
                attribValue: [
                  {
                    type: "text",
                    start: 29,
                    end: 32,
                    value: "gif",
                  },
                ],
                attribValueStartsAt: 29,
                attribValueEndsAt: 32,
                attribStarts: 24,
                attribEnds: 33,
                attribLeft: 22,
              },
            ],
            children: [],
          },
          {
            type: "text",
            start: 35,
            end: 39,
            value: "zzz-",
          },
        ],
        language: "html",
      },
      {
        type: "comment",
        start: 39,
        end: 51,
        value: "<![endif]-->",
        kind: "only",
        closing: true,
        children: [],
        language: "html",
      },
    ],
    "17"
  );
  t.end();
});

tap.test(
  `18 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - rogue bracket`,
  (t) => {
    // clauses are triggered but nothing's found from characters: <, ! and -
    t.strictSame(
      cparser(`zzz<<![endif]-->`),
      [
        {
          type: "text",
          start: 0,
          end: 4,
          value: "zzz<",
        },
        {
          type: "comment",
          start: 4,
          end: 16,
          value: "<![endif]-->",
          kind: "only",
          closing: true,
          children: [],
          language: "html",
        },
      ],
      "18"
    );
    t.end();
  }
);

// various

tap.test(`19 - a test from html-table-patcher`, (t) => {
  t.hasStrict(
    cparser(`<table><!--a--><tr><!--b<table>c<tr>d-->`),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "comment",
            start: 7,
            end: 11,
            value: "<!--",
            children: [
              {
                type: "text",
                start: 11,
                end: 12,
                value: "a",
              },
            ],
          },
          {
            type: "comment",
            start: 12,
            end: 15,
            value: "-->",
          },
          {
            type: "tag",
            start: 15,
            end: 19,
            value: "<tr>",
            children: [
              {
                type: "comment",
                start: 19,
                end: 23,
                value: "<!--",
                children: [
                  {
                    type: "text",
                    start: 23,
                    end: 24,
                    value: "b",
                  },
                  {
                    type: "tag",
                    start: 24,
                    end: 31,
                    value: "<table>",
                    children: [
                      {
                        type: "text",
                        start: 31,
                        end: 32,
                        value: "c",
                      },
                      {
                        type: "tag",
                        start: 32,
                        end: 36,
                        value: "<tr>",
                        children: [
                          {
                            type: "text",
                            start: 36,
                            end: 37,
                            value: "d",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "comment",
                start: 37,
                end: 40,
                value: "-->",
              },
            ],
          },
        ],
      },
    ],
    "19"
  );
  t.end();
});

tap.test(`20 - a test from html-table-patcher`, (t) => {
  t.hasStrict(
    cparser(`<table>1<tr><td>
<table>x</table>
</td></tr></table>`),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "text",
            start: 7,
            end: 8,
            value: "1",
          },
          {
            type: "tag",
            start: 8,
            end: 12,
            value: "<tr>",
            children: [
              {
                type: "tag",
                start: 12,
                end: 16,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 16,
                    end: 17,
                    value: "\n",
                  },
                  {
                    type: "tag",
                    start: 17,
                    end: 24,
                    value: "<table>",
                    children: [
                      {
                        type: "text",
                        start: 24,
                        end: 25,
                        value: "x",
                      },
                    ],
                  },
                  {
                    type: "tag",
                    start: 25,
                    end: 33,
                    value: "</table>",
                  },
                  {
                    type: "text",
                    start: 33,
                    end: 34,
                    value: "\n",
                  },
                ],
              },
              {
                type: "tag",
                start: 34,
                end: 39,
                value: "</td>",
              },
            ],
          },
          {
            type: "tag",
            start: 39,
            end: 44,
            value: "</tr>",
          },
        ],
      },
      {
        type: "tag",
        start: 44,
        end: 52,
        value: "</table>",
      },
    ],
    "20"
  );
  t.end();
});
