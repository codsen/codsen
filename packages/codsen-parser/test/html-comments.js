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

// 03. conditional "only" type comments
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
