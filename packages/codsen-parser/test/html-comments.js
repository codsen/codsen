const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. simple HTML comments
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one nested outlook-only comment`,
  t => {
    t.match(
      cparser("a<!--b-->c"),
      [
        {
          type: "text",
          start: 0,
          end: 1
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
              end: 6
            }
          ]
        },
        {
          type: "comment",
          kind: "simple",
          start: 6,
          end: 9
        },
        {
          type: "text",
          start: 9,
          end: 10
        }
      ],
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one nested outlook-only comment`,
  t => {
    t.match(
      cparser("a<!--b->c"),
      [
        {
          type: "text",
          start: 0,
          end: 1,
          value: "a"
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
              value: "b"
            }
          ]
        },
        {
          type: "comment",
          kind: "simple",
          start: 6,
          end: 8,
          value: "->",
          closing: true,
          children: []
        },
        {
          type: "text",
          start: 8,
          end: 9,
          value: "c"
        }
      ],
      "01.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - nested tags inside broken comment closing tag pair`,
  t => {
    t.match(
      cparser(`a<!--<table><tr><td>.</td></tr></table>->c`),
      [
        {
          type: "text",
          start: 0,
          end: 1,
          value: "a"
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
                          value: "."
                        }
                      ],
                      type: "tag",
                      start: 16,
                      end: 20,
                      value: "<td>"
                    },
                    {
                      children: [],
                      type: "tag",
                      start: 21,
                      end: 26,
                      value: "</td>"
                    }
                  ],
                  type: "tag",
                  start: 12,
                  end: 16,
                  value: "<tr>"
                },
                {
                  children: [],
                  type: "tag",
                  start: 26,
                  end: 31,
                  value: "</tr>"
                }
              ],
              type: "tag",
              start: 5,
              end: 12,
              value: "<table>"
            },
            {
              children: [],
              type: "tag",
              start: 31,
              end: 39,
              value: "</table>"
            }
          ]
        },
        {
          type: "comment",
          start: 39,
          end: 41,
          value: "->",
          kind: "simple",
          closing: true
        },
        {
          type: "text",
          start: 41,
          end: 42,
          value: "c"
        }
      ],
      "01.03"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - false positive`,
  t => {
    t.match(
      cparser("x<a>y->b"),
      [
        {
          type: "text",
          start: 0,
          end: 1
        },
        {
          children: [
            {
              type: "text", // <--------- !!!!
              start: 4,
              end: 8,
              value: "y->b"
            }
          ],
          type: "tag",
          start: 1,
          end: 4,
          value: "<a>"
        }
      ],
      "01.04"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - another false positive`,
  t => {
    t.match(
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
              value: "x"
            },
            {
              type: "tag",
              start: 5,
              end: 8,
              value: "<a>"
            }
          ]
        },
        {
          type: "comment",
          start: 8,
          end: 11,
          value: "-->"
        },
        {
          type: "text", // <--------- !!!!
          start: 11,
          end: 15,
          value: "y->b"
        }
      ],
      "01.05"
    );
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - rogue character in the closing`,
  t => {
    t.match(
      cparser(`a<!--b--!>c`),
      [
        {
          type: "text",
          start: 0,
          end: 1
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
              end: 6
            }
          ]
        },
        {
          type: "comment",
          kind: "simple",
          start: 6,
          end: 10
        },
        {
          type: "text",
          start: 10,
          end: 11
        }
      ],
      "01.06"
    );
    t.end();
  }
);

// 02. conditional "only" type comments
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${33}m${`only`}\u001b[${39}m`} - one pair`, t => {
  t.match(
    cparser(`a<!--[if gte mso 9]>x<![endif]-->z`),
    [
      {
        type: "text",
        start: 0,
        end: 1
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
            end: 21
          }
        ]
      },
      {
        type: "comment",
        start: 21,
        end: 33,
        kind: "only",
        closing: true
      },
      {
        type: "text",
        start: 33,
        end: 34
      }
    ],
    "02.01"
  );
  t.end();
});

// 03. conditional "not" type comments
// -----------------------------------------------------------------------------

t.test(`03.01 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - one pair`, t => {
  t.match(
    cparser(`a<!--[if !mso]><!-->x<!--<![endif]-->z`),
    [
      {
        type: "text",
        start: 0,
        end: 1
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
            end: 21
          }
        ]
      },
      {
        type: "comment",
        start: 21,
        end: 37,
        kind: "not",
        closing: true
      },
      {
        type: "text",
        start: 37,
        end: 38
      }
    ],
    "03.01"
  );
  t.end();
});

t.test(
  `03.02 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing bracket`,
  t => {
    t.match(
      cparser(`<img/>!--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6
        },
        {
          type: "comment",
          start: 6,
          end: 21,
          kind: "not",
          closing: true
        }
      ],
      "03.02"
    );
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing excl mark`,
  t => {
    t.match(
      cparser(`<img/><--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6
        },
        {
          type: "comment",
          start: 6,
          end: 21,
          kind: "not",
          closing: true
        }
      ],
      "03.03"
    );
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's character one`,
  t => {
    t.match(
      cparser(`<img/><1--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6
        },
        {
          type: "comment",
          start: 6,
          end: 22,
          kind: "not",
          closing: true
        }
      ],
      "03.04"
    );
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing dash`,
  t => {
    t.match(
      cparser(`<img/><!-<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6
        },
        {
          type: "comment",
          start: 6,
          end: 21,
          kind: "not",
          closing: true
        }
      ],
      "03.05"
    );
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing dash`,
  t => {
    t.match(
      cparser(`<img/><1--<1--<1--<1--<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6,
          value: "<img/>"
        },
        {
          type: "text",
          start: 6,
          end: 18,
          value: "<1--<1--<1--"
        },
        {
          type: "comment",
          start: 18,
          end: 34,
          value: `<1--<![endif]-->`,
          kind: "not",
          closing: true
        }
      ],
      "03.06"
    );
    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${33}m${`not`}\u001b[${39}m`} - first part's missing dash`,
  t => {
    t.match(
      cparser(`<img/><1--<1--<1--<1--zzzz<![endif]-->`),
      [
        {
          type: "tag",
          start: 0,
          end: 6
        },
        {
          type: "text",
          start: 6,
          end: 26
        },
        {
          type: "comment",
          start: 26,
          end: 38,
          kind: "only",
          closing: true
        }
      ],
      "03.07"
    );
    t.end();
  }
);
