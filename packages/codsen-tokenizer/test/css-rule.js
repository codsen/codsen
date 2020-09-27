import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// 01. simple
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - one rule, no linebreaks`,
  (t) => {
    const gathered = [];
    ct(`<style>.a-b{c}</style>`, {
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
          start: 7,
          end: 14,
          openingCurlyAt: 11,
          closingCurlyAt: 13,
          selectors: [
            {
              value: ".a-b",
              selectorStarts: 7,
              selectorEnds: 11,
            },
          ],
        },
        {
          type: "tag",
          start: 14,
          end: 22,
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - one rule, linebreaks`,
  (t) => {
    const gathered = [];
    ct(
      `<style>
.a-b{c}
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
          type: "rule",
          start: 8,
          end: 15,
          openingCurlyAt: 12,
          closingCurlyAt: 14,
          selectors: [
            {
              value: ".a-b",
              selectorStarts: 8,
              selectorEnds: 12,
            },
          ],
        },
        {
          type: "text",
          start: 15,
          end: 16,
        },
        {
          type: "tag",
          start: 16,
          end: 24,
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - two selectors`,
  (t) => {
    const gathered = [];
    ct(`<style>.a,.b{c}</style>`, {
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
          start: 7,
          end: 15,
          openingCurlyAt: 12,
          closingCurlyAt: 14,
          selectorsStart: 7,
          selectorsEnd: 12,
          selectors: [
            {
              value: ".a",
              selectorStarts: 7,
              selectorEnds: 9,
            },
            {
              value: ".b",
              selectorStarts: 10,
              selectorEnds: 12,
            },
          ],
        },
        {
          type: "tag",
          start: 15,
          end: 23,
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - one rule, no linebreaks`,
  (t) => {
    const gathered = [];
    ct(
      `<style>

.a,  .b

{c}</style>`,
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
          end: 9,
        },
        {
          type: "rule",
          start: 9,
          end: 21,
          openingCurlyAt: 18,
          closingCurlyAt: 20,
          selectorsStart: 9,
          selectorsEnd: 16,
          selectors: [
            {
              value: ".a",
              selectorStarts: 9,
              selectorEnds: 11,
            },
            {
              value: ".b",
              selectorStarts: 14,
              selectorEnds: 16,
            },
          ],
        },
        {
          type: "tag",
          start: 21,
          end: 29,
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - dangling comma`,
  (t) => {
    const gathered = [];
    ct(`<style>.a,.b,{c}</style>`, {
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
          start: 7,
          end: 16,
          openingCurlyAt: 13,
          closingCurlyAt: 15,
          selectorsStart: 7,
          selectorsEnd: 13,
          selectors: [
            {
              value: ".a",
              selectorStarts: 7,
              selectorEnds: 9,
            },
            {
              value: ".b",
              selectorStarts: 10,
              selectorEnds: 12,
            },
          ],
        },
        {
          type: "tag",
          start: 16,
          end: 24,
        },
      ],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - double comma`,
  (t) => {
    const gathered = [];
    ct(`<style>.a,,.b{c}</style>`, {
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
          start: 7,
          end: 16,
          openingCurlyAt: 13,
          closingCurlyAt: 15,
          selectorsStart: 7,
          selectorsEnd: 13,
          selectors: [
            {
              value: ".a",
              selectorStarts: 7,
              selectorEnds: 9,
            },
            {
              value: ".b",
              selectorStarts: 11,
              selectorEnds: 13,
            },
          ],
        },
        {
          type: "tag",
          start: 16,
          end: 24,
        },
      ],
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - esp tags can't have curlies`,
  (t) => {
    const gathered = [];
    ct(`<style>.b%{c}</style>`, {
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
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "style",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,

          kind: null,
          attribs: [],
        },
        {
          type: "rule",
          start: 7,
          end: 13,
          openingCurlyAt: 10,
          closingCurlyAt: 12,
          selectorsStart: 7,
          selectorsEnd: 10,
          selectors: [
            {
              value: ".b%",
              selectorStarts: 7,
              selectorEnds: 10,
            },
          ],
        },
        {
          type: "tag",
          start: 13,
          end: 21,
          tagNameStartsAt: 15,
          tagNameEndsAt: 20,
          tagName: "style",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,

          kind: null,
          attribs: [],
        },
      ],
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - root level css declarations`,
  (t) => {
    const gathered = [];
    ct(
      `<head>
<style type="text/css">
.unused1[z] {a:1;}
.used[z] {a:2;}
</style>
</head>
<body class="  used  "><a class="used unused3">z</a>
</body>`,
      {
        tagCb: (obj) => {
          if (obj.type === "rule") {
            gathered.push(obj);
          }
        },
      }
    );

    t.strictSame(
      gathered,
      [
        {
          type: "rule",
          start: 31,
          end: 49,
          left: 29,
          nested: false,
          value: ".unused1[z] {a:1;}",
          openingCurlyAt: 43,
          closingCurlyAt: 48,
          selectorsStart: 31,
          selectorsEnd: 42,
          selectors: [
            {
              value: ".unused1[z]",
              selectorStarts: 31,
              selectorEnds: 42,
            },
          ],
        },
        {
          type: "rule",
          start: 50,
          end: 65,
          left: 48,
          nested: false,
          value: ".used[z] {a:2;}",
          openingCurlyAt: 59,
          closingCurlyAt: 64,
          selectorsStart: 50,
          selectorsEnd: 58,
          selectors: [
            {
              value: ".used[z]",
              selectorStarts: 50,
              selectorEnds: 58,
            },
          ],
        },
      ],
      "08"
    );
    t.end();
  }
);

tap.test(`09 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - @media`, (t) => {
  const gathered = [];
  ct(
    `<head>
<style type="text/css">
@namespace url(z);
@media (max-width: 600px) {
  .xx[z] {a:1;}
}
</style>
</head>
<body  class="  zz  "><a   class="yy zz">z</a>
</body>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );

  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 6,
        value: "<head>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 5,
        tagName: "head",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 6,
        end: 7,
        value: "\n",
      },
      {
        type: "tag",
        start: 7,
        end: 30,
        value: '<style type="text/css">',
        tagNameStartsAt: 8,
        tagNameEndsAt: 13,
        tagName: "style",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "type",
            attribNameRecognised: true,
            attribNameStartsAt: 14,
            attribNameEndsAt: 18,
            attribOpeningQuoteAt: 19,
            attribClosingQuoteAt: 28,
            attribValueRaw: "text/css",
            attribValue: [
              {
                type: "text",
                start: 20,
                end: 28,
                value: "text/css",
              },
            ],
            attribValueStartsAt: 20,
            attribValueEndsAt: 28,
            attribStart: 14,
            attribEnd: 29,
            attribLeft: 12,
          },
        ],
      },
      {
        type: "text",
        start: 30,
        end: 31,
        value: "\n",
      },
      {
        type: "at",
        start: 31,
        end: 49,
        value: "@namespace url(z);",
        left: 29,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        identifier: "namespace",
        identifierStartsAt: 32,
        identifierEndsAt: 41,
        query: "url(z)",
        queryStartsAt: 42,
        queryEndsAt: 48,
        rules: [],
      },
      {
        type: "text",
        start: 49,
        end: 50,
        value: "\n",
      },
      {
        type: "rule",
        start: 80,
        end: 93,
        value: ".xx[z] {a:1;}",
        left: 76,
        nested: true,
        openingCurlyAt: 87,
        closingCurlyAt: 92,
        selectorsStart: 80,
        selectorsEnd: 86,
        selectors: [
          {
            value: ".xx[z]",
            selectorStarts: 80,
            selectorEnds: 86,
          },
        ],
      },
      {
        type: "at",
        start: 50,
        end: 95,
        value: "@media (max-width: 600px) {\n  .xx[z] {a:1;}\n}",
        left: 48,
        nested: false,
        openingCurlyAt: 76,
        closingCurlyAt: 94,
        identifier: "media",
        identifierStartsAt: 51,
        identifierEndsAt: 56,
        query: "(max-width: 600px)",
        queryStartsAt: 57,
        queryEndsAt: 75,
        rules: [
          {
            type: "text",
            start: 77,
            end: 80,
            value: "\n  ",
          },
          {
            type: "rule",
            start: 80,
            end: 93,
            value: ".xx[z] {a:1;}",
            left: 76,
            nested: true,
            openingCurlyAt: 87,
            closingCurlyAt: 92,
            selectorsStart: 80,
            selectorsEnd: 86,
            selectors: [
              {
                value: ".xx[z]",
                selectorStarts: 80,
                selectorEnds: 86,
              },
            ],
          },
          {
            type: "text",
            start: 93,
            end: 94,
            value: "\n",
          },
        ],
      },
      {
        type: "text",
        start: 95,
        end: 96,
        value: "\n",
      },
      {
        type: "tag",
        start: 96,
        end: 104,
        value: "</style>",
        tagNameStartsAt: 98,
        tagNameEndsAt: 103,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 104,
        end: 105,
        value: "\n",
      },
      {
        type: "tag",
        start: 105,
        end: 112,
        value: "</head>",
        tagNameStartsAt: 107,
        tagNameEndsAt: 111,
        tagName: "head",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 112,
        end: 113,
        value: "\n",
      },
      {
        type: "tag",
        start: 113,
        end: 135,
        value: '<body  class="  zz  ">',
        tagNameStartsAt: 114,
        tagNameEndsAt: 118,
        tagName: "body",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 120,
            attribNameEndsAt: 125,
            attribOpeningQuoteAt: 126,
            attribClosingQuoteAt: 133,
            attribValueRaw: "  zz  ",
            attribValue: [
              {
                type: "text",
                start: 127,
                end: 133,
                value: "  zz  ",
              },
            ],
            attribValueStartsAt: 127,
            attribValueEndsAt: 133,
            attribStart: 120,
            attribEnd: 134,
            attribLeft: 117,
          },
        ],
      },
      {
        type: "tag",
        start: 135,
        end: 154,
        value: '<a   class="yy zz">',
        tagNameStartsAt: 136,
        tagNameEndsAt: 137,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 140,
            attribNameEndsAt: 145,
            attribOpeningQuoteAt: 146,
            attribClosingQuoteAt: 152,
            attribValueRaw: "yy zz",
            attribValue: [
              {
                type: "text",
                start: 147,
                end: 152,
                value: "yy zz",
              },
            ],
            attribValueStartsAt: 147,
            attribValueEndsAt: 152,
            attribStart: 140,
            attribEnd: 153,
            attribLeft: 136,
          },
        ],
      },
      {
        type: "text",
        start: 154,
        end: 155,
        value: "z",
      },
      {
        type: "tag",
        start: 155,
        end: 159,
        value: "</a>",
        tagNameStartsAt: 157,
        tagNameEndsAt: 158,
        tagName: "a",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 159,
        end: 160,
        value: "\n",
      },
      {
        type: "tag",
        start: 160,
        end: 167,
        value: "</body>",
        tagNameStartsAt: 162,
        tagNameEndsAt: 166,
        tagName: "body",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "09"
  );
  t.end();
});
