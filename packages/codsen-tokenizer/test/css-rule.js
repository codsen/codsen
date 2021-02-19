import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

// css rules
// -----------------------------------------------------------------------------

tap.test(`01 - one rule, no linebreaks`, (t) => {
  const gathered = [];
  ct(`<style>.a-b{c}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 14,
        value: ".a-b{c}",
        left: 6,
        nested: false,
        openingCurlyAt: 11,
        closingCurlyAt: 13,
        selectorsStart: 7,
        selectorsEnd: 11,
        selectors: [
          {
            value: ".a-b",
            selectorStarts: 7,
            selectorEnds: 11,
          },
        ],
        properties: [
          {
            property: "c",
            propertyStarts: 12,
            propertyEnds: 13,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 12,
            end: 13,
          },
        ],
      },
      {
        type: "tag",
        start: 14,
        end: 22,
        value: "</style>",
        tagNameStartsAt: 16,
        tagNameEndsAt: 21,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "01"
  );
  t.end();
});

tap.test(`02 - one rule, no linebreaks`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 15,
      value: ".a{b:c;}",
      left: 6,
      nested: false,
      openingCurlyAt: 9,
      closingCurlyAt: 14,
      selectorsStart: 7,
      selectorsEnd: 9,
      selectors: [
        {
          value: ".a",
          selectorStarts: 7,
          selectorEnds: 9,
        },
      ],
      properties: [
        {
          property: "b",
          propertyStarts: 10,
          propertyEnds: 11,
          colon: 11,
          value: "c",
          valueStarts: 12,
          valueEnds: 13,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 13,
          start: 10,
          end: 14,
        },
      ],
    },
    "02"
  );
  t.end();
});

tap.only(`03 - one rule, no linebreaks`, (t) => {
  const gathered = [];
  ct(`<style>.a { b : c ; }</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 21,
        value: ".a { b : c ; }",
        left: 6,
        nested: false,
        openingCurlyAt: 10,
        closingCurlyAt: 20,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            type: "text",
            start: 11,
            end: 12,
            value: " ",
          },
          {
            property: "b",
            propertyStarts: 12,
            propertyEnds: 13,
            colon: 14,
            value: "c",
            valueStarts: 16,
            valueEnds: 17,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 18,
            start: 12,
            end: 19,
          },
          {
            type: "text",
            start: 19,
            end: 20,
            value: " ",
          },
        ],
      },
      {
        type: "tag",
        start: 21,
        end: 29,
        value: "</style>",
        tagNameStartsAt: 23,
        tagNameEndsAt: 28,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "03"
  );
  t.end();
});

tap.test(`04 - one rule, no linebreaks`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 25,
        value: ".a{b:c!important;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 24,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            start: 10,
            end: 24,
            value: "c",
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            colon: 11,
            valueStarts: 12,
            valueEnds: 13,
            importantStarts: 13,
            importantEnds: 23,
            important: "!important",
            semi: 23,
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
        value: "</style>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 32,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "04"
  );
  t.end();
});

tap.todo(`<style>.a{!`);
tap.todo(`<style>.a{!`);
tap.todo(`<style>.a{b!`);
tap.todo(`<style>.a{b:!`);
tap.todo(`<style>.a{b: !`);
tap.todo(`<style>.a{b:c !`);
tap.todo(`<style>.a{b:c ! !`);
tap.todo(`<style>.a{b:c!`);
tap.todo(`<style>.a{b:c!!`);
tap.todo(`<style>.a{b:c! !`);
tap.todo(`<style>.a{b:c!;`);
tap.todo(`<style>.a{b:c !;`);
tap.todo(`<style>.a{b:c ! ;`);
tap.todo(`<style>.a{b:c ! ; `);
tap.todo(`<style>.a{b:c ! ;;`);
tap.todo(`<style>.a{b:c ! ;; `);
tap.todo(`<style>.a{b:c ! ; ; `);
// ...followed by:
// }</style>
// </style>
// EOL
// abc

tap.todo(`<style>.a{b:c z`);
tap.todo(`<style>.a{b:c?`);
tap.todo(`<style>.a{b:c ?`);
tap.todo(`<style>.a{b:c?important;`);
tap.todo(`<style>.a{b:c ?important;`);
tap.todo(`<style>.a{b:c1important;`);
tap.todo(`<style>.a{b:c 1important;`);

// also,
tap.todo(`<style.a{b:c !important;}</style>`);
tap.todo(`<style\n.a{b:c !important;}</style>`);

tap.test(`31 - one rule, no linebreaks`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c;d:e;f:g;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 23,
      value: ".a{b:c;d:e;f:g;}",
      left: 6,
      nested: false,
      openingCurlyAt: 9,
      closingCurlyAt: 22,
      selectorsStart: 7,
      selectorsEnd: 9,
      selectors: [
        {
          value: ".a",
          selectorStarts: 7,
          selectorEnds: 9,
        },
      ],
      properties: [
        {
          property: "b",
          propertyStarts: 10,
          propertyEnds: 11,
          colon: 11,
          value: "c",
          valueStarts: 12,
          valueEnds: 13,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 13,
          start: 10,
          end: 14,
        },
        {
          property: "d",
          propertyStarts: 14,
          propertyEnds: 15,
          colon: 15,
          value: "e",
          valueStarts: 16,
          valueEnds: 17,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 17,
          start: 14,
          end: 18,
        },
        {
          property: "f",
          propertyStarts: 18,
          propertyEnds: 19,
          colon: 19,
          value: "g",
          valueStarts: 20,
          valueEnds: 21,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 21,
          start: 18,
          end: 22,
        },
      ],
    },
    "31"
  );
  t.end();
});

tap.test(`32 - one rule, linebreaks`, (t) => {
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
    "32"
  );
  t.end();
});

tap.test(`33 - two selectors`, (t) => {
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
    "33"
  );
  t.end();
});

tap.test(`34 - one rule, no linebreaks`, (t) => {
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
    "34"
  );
  t.end();
});

tap.test(`35 - dangling comma`, (t) => {
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
    "35"
  );
  t.end();
});

tap.test(`36 - double comma`, (t) => {
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
    "36"
  );
  t.end();
});

tap.test(`37 - esp tags can't have curlies`, (t) => {
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
    "37"
  );
  t.end();
});

tap.test(`38 - root level css declarations`, (t) => {
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
        properties: [
          {
            property: "a",
            propertyStarts: 44,
            propertyEnds: 45,
            colon: 45,
            value: "1",
            valueStarts: 46,
            valueEnds: 47,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 47,
            start: 44,
            end: 48,
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
        properties: [
          {
            property: "a",
            propertyStarts: 60,
            propertyEnds: 61,
            colon: 61,
            value: "2",
            valueStarts: 62,
            valueEnds: 63,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 63,
            start: 60,
            end: 64,
          },
        ],
      },
    ],
    "38"
  );
  t.end();
});

tap.test(`39 - @media`, (t) => {
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
            attribStarts: 14,
            attribEnds: 29,
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
        properties: [
          {
            property: "a",
            propertyStarts: 88,
            propertyEnds: 89,
            colon: 89,
            value: "1",
            valueStarts: 90,
            valueEnds: 91,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 91,
            start: 88,
            end: 92,
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
            properties: [
              {
                property: "a",
                propertyStarts: 88,
                propertyEnds: 89,
                colon: 89,
                value: "1",
                valueStarts: 90,
                valueEnds: 91,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 91,
                start: 88,
                end: 92,
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
            attribStarts: 120,
            attribEnds: 134,
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
        kind: "inline",
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
            attribStarts: 140,
            attribEnds: 153,
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
        kind: "inline",
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
    "39"
  );
  t.end();
});

tap.test(`40 - parent selector ">" - 1`, (t) => {
  const gathered = [];
  ct(`<style>ab>cd#ef {display:block;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 32,
        value: "ab>cd#ef {display:block;}",
        left: 6,
        nested: false,
        openingCurlyAt: 16,
        closingCurlyAt: 31,
        selectorsStart: 7,
        selectorsEnd: 15,
        selectors: [
          {
            value: "ab>cd#ef",
            selectorStarts: 7,
            selectorEnds: 15,
          },
        ],
        properties: [
          {
            property: "display",
            propertyStarts: 17,
            propertyEnds: 24,
            colon: 24,
            value: "block",
            valueStarts: 25,
            valueEnds: 30,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 30,
            start: 17,
            end: 31,
          },
        ],
      },
      {
        type: "tag",
        start: 32,
        end: 40,
        value: "</style>",
        tagNameStartsAt: 34,
        tagNameEndsAt: 39,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "40"
  );
  t.end();
});

tap.test(`41 - parent selector ">" - 2`, (t) => {
  const gathered = [];
  ct(`<style>\na > something#here {display:block;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        type: "text",
        start: 7,
        end: 8,
        value: "\n",
      },
      {
        type: "rule",
        start: 8,
        end: 43,
        value: "a > something#here {display:block;}",
        left: 6,
        nested: false,
        openingCurlyAt: 27,
        closingCurlyAt: 42,
        selectorsStart: 8,
        selectorsEnd: 26,
        selectors: [
          {
            value: "a > something#here",
            selectorStarts: 8,
            selectorEnds: 26,
          },
        ],
        properties: [
          {
            property: "display",
            propertyStarts: 28,
            propertyEnds: 35,
            colon: 35,
            value: "block",
            valueStarts: 36,
            valueEnds: 41,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 41,
            start: 28,
            end: 42,
          },
        ],
      },
    ],
    "41"
  );
  t.end();
});

tap.test(`42 unfinished code`, (t) => {
  const gathered = [];
  ct(`<style>sup{`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 11,
        value: "sup{",
        left: 6,
        nested: false,
        openingCurlyAt: 10,
        closingCurlyAt: null,
        selectorsStart: 7,
        selectorsEnd: 10,
        selectors: [
          {
            value: "sup",
            selectorStarts: 7,
            selectorEnds: 10,
          },
        ],
        properties: [],
      },
    ],
    "42"
  );
  t.end();
});

tap.test(`43`, (t) => {
  const gathered = [];
  ct(`<style>.a{color:red }`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 21,
        value: ".a{color:red }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 20,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            start: 10,
            end: 19,
            value: "red",
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 15,
            valueStarts: 16,
            valueEnds: 19,
            semi: null,
          },
          {
            type: "text",
            start: 19,
            end: 20,
            value: " ",
          },
        ],
      },
    ],
    "43"
  );
  t.end();
});

tap.test(`44`, (t) => {
  const gathered = [];
  ct(`<style>.a { b : c    `, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 21,
        value: ".a { b : c    ",
        left: 6,
        nested: false,
        openingCurlyAt: 10,
        closingCurlyAt: null,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            type: "text",
            start: 11,
            end: 12,
            value: " ",
          },
          {
            start: 12,
            end: 17,
            value: "c",
            property: "b",
            propertyStarts: 12,
            propertyEnds: 13,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 14,
            valueStarts: 16,
            valueEnds: 17,
            semi: null,
          },
          {
            type: "text",
            start: 17,
            end: 21,
            value: "    ",
          },
        ],
      },
    ],
    "44"
  );
  t.end();
});

tap.test(`45`, (t) => {
  const gathered = [];
  ct(`<style>.a { b :    `, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 19,
        value: ".a { b :    ",
        left: 6,
        nested: false,
        openingCurlyAt: 10,
        closingCurlyAt: null,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            type: "text",
            start: 11,
            end: 12,
            value: " ",
          },
          {
            start: 12,
            end: 15,
            value: null,
            property: "b",
            propertyStarts: 12,
            propertyEnds: 13,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 14,
            valueStarts: null,
            valueEnds: null,
            semi: null,
          },
          {
            type: "text",
            start: 15,
            end: 19,
            value: "    ",
          },
        ],
      },
    ],
    "45"
  );
  t.end();
});

tap.test(`46`, (t) => {
  const gathered = [];
  ct(`<style>.a{color: red ! float: left}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 35,
        value: ".a{color: red ! float: left}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 34,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            start: 10,
            end: 22,
            value: "red",
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            importantStarts: 21,
            importantEnds: 22,
            important: "!",
            colon: 15,
            valueStarts: 17,
            valueEnds: 20,
            semi: null,
          },
          {
            type: "text",
            start: 22,
            end: 23,
            value: " ",
          },
          {
            start: 23,
            end: 34,
            value: "left",
            property: "float",
            propertyStarts: 23,
            propertyEnds: 28,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 28,
            valueStarts: 30,
            valueEnds: 34,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 35,
        end: 43,
        value: "</style>",
        tagNameStartsAt: 37,
        tagNameEndsAt: 42,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "46"
  );
  t.end();
});

tap.test(`47`, (t) => {
  const gathered = [];
  ct(`<style>.a{color: red !important float: left}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
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
        end: 44,
        value: ".a{color: red !important float: left}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 43,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            start: 10,
            end: 31,
            value: "red",
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            importantStarts: 21,
            importantEnds: 31,
            important: "!important",
            colon: 15,
            valueStarts: 17,
            valueEnds: 20,
            semi: null,
          },
          {
            type: "text",
            start: 31,
            end: 32,
            value: " ",
          },
          {
            start: 32,
            end: 43,
            value: "left",
            property: "float",
            propertyStarts: 32,
            propertyEnds: 37,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 37,
            valueStarts: 39,
            valueEnds: 43,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 44,
        end: 52,
        value: "</style>",
        tagNameStartsAt: 46,
        tagNameEndsAt: 51,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "47"
  );
  t.end();
});

tap.todo(`48`, (t) => {
  const gathered = [];
  ct(`<style>.a{color: red important float: left}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "48");
  t.end();
});
