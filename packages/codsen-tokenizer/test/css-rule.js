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

tap.test(`03 - one rule, no linebreaks`, (t) => {
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

tap.test(`04 - one rule, value from multiple chunks`, (t) => {
  const gathered = [];
  ct(`<style>.a{  padding:  1px  2px  3px  4px  }`, {
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
        end: 43,
        value: ".a{  padding:  1px  2px  3px  4px  }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 42,
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
            start: 10,
            end: 12,
            value: "  ",
          },
          {
            start: 12,
            end: 40,
            property: "padding",
            propertyStarts: 12,
            propertyEnds: 19,
            value: "1px  2px  3px  4px",
            valueStarts: 22,
            valueEnds: 40,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 19,
            semi: null,
          },
          {
            type: "text",
            start: 40,
            end: 42,
            value: "  ",
          },
        ],
      },
    ],
    "04"
  );
  t.end();
});

tap.test(`05 - one rule, value from multiple chunks, important`, (t) => {
  const gathered = [];
  ct(`<style>.a{  padding:  1px  2px  3px  4px  !important  }`, {
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
        end: 55,
        value: ".a{  padding:  1px  2px  3px  4px  !important  }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 54,
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
            start: 10,
            end: 12,
            value: "  ",
          },
          {
            start: 12,
            end: 52,
            property: "padding",
            propertyStarts: 12,
            propertyEnds: 19,
            value: "1px  2px  3px  4px",
            valueStarts: 22,
            valueEnds: 40,
            importantStarts: 42,
            importantEnds: 52,
            important: "!important",
            colon: 19,
            semi: null,
          },
          {
            type: "text",
            start: 52,
            end: 54,
            value: "  ",
          },
        ],
      },
    ],
    "05"
  );
  t.end();
});

tap.test(`06 - one rule, no linebreaks`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!important;}`, {
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
    ],
    "06"
  );
  t.end();
});

tap.test(`07`, (t) => {
  const gathered = [];
  ct(`<style>.a{color: red !important ;}`, {
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
        end: 34,
        value: ".a{color: red !important ;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 33,
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
            end: 33,
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "red",
            valueStarts: 17,
            valueEnds: 20,
            importantStarts: 21,
            importantEnds: 31,
            important: "!important",
            colon: 15,
            semi: 32,
          },
        ],
      },
    ],
    "07"
  );
  t.end();
});

tap.test(`08`, (t) => {
  const gathered1 = [];
  ct(`<style>.a{!`, {
    tagCb: (obj) => {
      gathered1.push(obj);
    },
  });
  t.match(
    gathered1,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 11,
        value: ".a{!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 11,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 10,
            importantEnds: 11,
            colon: null,
            semi: null,
          },
        ],
      },
    ],
    "08.01"
  );

  // ---

  const gathered2 = [];
  ct(`<style>.a{!}</style>`, {
    tagCb: (obj) => {
      gathered2.push(obj);
    },
  });
  t.match(
    gathered2,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 12,
        value: ".a{!}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 11,
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
            end: 11,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 10,
            importantEnds: 11,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 12,
        end: 20,
        value: "</style>",
      },
    ],
    "08.02"
  );

  t.end();
});

tap.test(`09`, (t) => {
  const gathered1 = [];
  ct(`<style>.a{! `, {
    tagCb: (obj) => {
      gathered1.push(obj);
    },
  });
  t.match(
    gathered1,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 12,
        value: ".a{! ",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 11,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 10,
            importantEnds: 11,
            colon: null,
            semi: null,
          },
          {
            type: "text",
            start: 11,
            end: 12,
            value: " ",
          },
        ],
      },
    ],
    "09.01"
  );

  // ---

  const gathered2 = [];
  ct(`<style>.a{! }</style>`, {
    tagCb: (obj) => {
      gathered2.push(obj);
    },
  });
  t.match(
    gathered2,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 13,
        value: ".a{! }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 12,
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
            end: 11,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 10,
            importantEnds: 11,
            colon: null,
            semi: null,
          },
          {
            type: "text",
            start: 11,
            end: 12,
            value: " ",
          },
        ],
      },
      {
        type: "tag",
        start: 13,
        end: 21,
        value: "</style>",
      },
    ],
    "09.02"
  );

  // ---

  const gathered3 = [];
  ct(`<style>.a{! </style>`, {
    tagCb: (obj) => {
      gathered3.push(obj);
    },
  });
  t.match(
    gathered3,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 11,
        value: ".a{!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 11,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 10,
            importantEnds: 11,
            colon: null,
            semi: null,
          },
          {
            type: "text",
            start: 11,
            end: null,
            value: null,
          },
        ],
      },
      {
        type: "text",
        start: 11,
        end: 12,
        value: " ",
      },
      {
        type: "tag",
        start: 12,
        end: 20,
        value: "</style>",
      },
    ],
    "09.03"
  );

  t.end();
});

tap.test(`10`, (t) => {
  const gathered = [];
  ct(`<style>.a{b!`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 12,
        value: ".a{b!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 12,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 11,
            importantEnds: 12,
            colon: null,
            semi: null,
          },
        ],
      },
    ],
    "10"
  );

  t.end();
});

tap.test(`11`, (t) => {
  const gathered = [];
  ct(`<style>.a{b!}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 13,
        value: ".a{b!}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 12,
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
            end: 12,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 11,
            importantEnds: 12,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 13,
        end: 21,
        value: "</style>",
      },
    ],
    "11"
  );

  t.end();
});

tap.test(`12`, (t) => {
  const gathered = [];
  ct(`<style>.a{b!</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 12,
        value: ".a{b!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 12,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 11,
            importantEnds: 12,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 12,
        end: 20,
        value: "</style>",
        tagNameStartsAt: 14,
        tagNameEndsAt: 19,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "12"
  );

  t.end();
});

tap.test(`13 - exclamation mark after colon`, (t) => {
  const gathered1 = [];
  ct(`<style>.a{b:!`, {
    tagCb: (obj) => {
      gathered1.push(obj);
    },
  });
  t.match(
    gathered1,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 13,
        value: ".a{b:!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 13,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 12,
            importantEnds: 13,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "13"
  );

  t.end();
});

tap.test(`14`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:!}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:!}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 13,
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
            end: 13,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 12,
            importantEnds: 13,
            colon: 11,
            semi: null,
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
    "14"
  );

  t.end();
});

tap.test(`15`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:;}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 13,
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
            end: 13,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: 12,
          },
        ],
      },
      {
        type: "tag",
        start: 14,
        end: 22,
        value: "</style>",
      },
    ],
    "15"
  );

  t.end();
});

tap.test(`16`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:!;}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:!;}",
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 12,
            importantEnds: 13,
            colon: 11,
            semi: 13,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "16"
  );

  t.end();
});

tap.test(`17`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:!</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 13,
        value: ".a{b:!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 13,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 12,
            importantEnds: 13,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 13,
        end: 21,
        value: "</style>",
      },
    ],
    "17"
  );

  t.end();
});

tap.test(`18`, (t) => {
  const gathered = [];
  ct(`<style>.a{b: !`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b: !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "18"
  );

  t.end();
});

tap.test(`19`, (t) => {
  const gathered = [];
  ct(`<style>.a{b: !}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b: !}",
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "19"
  );

  t.end();
});

tap.test(`20`, (t) => {
  const gathered3 = [];
  ct(`<style>.a{b: !</style>`, {
    tagCb: (obj) => {
      gathered3.push(obj);
    },
  });
  t.match(
    gathered3,
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b: !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 14,
        end: 22,
        value: "</style>",
      },
    ],
    "20"
  );

  t.end();
});

tap.test(`21`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c !`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "21"
  );

  t.end();
});

tap.test(`22`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c !}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 16,
        value: ".a{b:c !}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 15,
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
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 16,
        end: 24,
        value: "</style>",
      },
    ],
    "22"
  );

  t.end();
});

tap.test(`23`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c !</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "23"
  );

  t.end();
});

tap.test(`24`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! !`, {
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
        end: 17,
        value: ".a{b:c ! !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
          {
            type: "text",
            start: 15,
            end: 16,
            value: " ",
          },
          {
            start: 16,
            end: 17,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 16,
            importantEnds: 17,
            colon: null,
            semi: null,
          },
        ],
      },
    ],
    "24"
  );

  t.end();
});

tap.test(`25`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! !}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 18,
        value: ".a{b:c ! !}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 17,
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
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
          {
            type: "text",
            start: 15,
            end: 16,
            value: " ",
          },
          {
            start: 16,
            end: 17,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 16,
            importantEnds: 17,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 18,
        end: 26,
        value: "</style>",
      },
    ],
    "25"
  );

  t.end();
});

tap.test(`26`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! !</style>`, {
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
        end: 17,
        value: ".a{b:c ! !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
          {
            type: "text",
            start: 15,
            end: 16,
            value: " ",
          },
          {
            start: 16,
            end: 17,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 16,
            importantEnds: 17,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 17,
        end: 25,
        value: "</style>",
        tagNameStartsAt: 19,
        tagNameEndsAt: 24,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "26"
  );

  t.end();
});

tap.test(`27`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:c!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "27"
  );

  t.end();
});

tap.test(`28`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!}</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c!}",
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
        tagNameStartsAt: 17,
        tagNameEndsAt: 22,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "28"
  );

  t.end();
});

tap.test(`29`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:c!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 14,
        end: 22,
        value: "</style>",
      },
    ],
    "29"
  );

  t.end();
});

tap.test(`30`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!!</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c!!",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!!",
            importantStarts: 13,
            importantEnds: 15,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "30"
  );

  t.end();
});

tap.test(`31`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c! !</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 16,
        value: ".a{b:c! !",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: null,
          },
          {
            type: "text",
            start: 14,
            end: 15,
            value: " ",
          },
          {
            start: 15,
            end: 16,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: "!",
            importantStarts: 15,
            importantEnds: 16,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 16,
        end: 24,
        value: "</style>",
      },
    ],
    "31"
  );

  t.end();
});

tap.test(`32`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c!;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: 14,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "32"
  );

  t.end();
});

tap.test(`33`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!;`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c!;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 13,
            importantEnds: 14,
            colon: 11,
            semi: 14,
          },
        ],
      },
    ],
    "33"
  );

  t.end();
});

tap.test(`34`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c !;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 16,
        value: ".a{b:c !;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 16,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 15,
          },
        ],
      },
      {
        type: "tag",
        start: 16,
        end: 24,
        value: "</style>",
      },
    ],
    "34"
  );

  t.end();
});

tap.test(`35`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c !;`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 16,
        value: ".a{b:c !;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 16,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 15,
          },
        ],
      },
    ],
    "35"
  );

  t.end();
});

tap.test(`36`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 17,
        value: ".a{b:c ! ;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
        ],
      },
      {
        type: "tag",
        start: 17,
        end: 25,
        value: "</style>",
      },
    ],
    "36"
  );

  t.end();
});

tap.test(`37`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ;`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 17,
        value: ".a{b:c ! ;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
        ],
      },
    ],
    "37"
  );

  t.end();
});

tap.test(`38`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ; </style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 17,
        value: ".a{b:c ! ;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            type: "text",
            start: 17,
            end: null,
            value: null,
          },
        ],
      },
      {
        type: "text",
        start: 17,
        end: 18,
        value: " ",
      },
      {
        type: "tag",
        start: 18,
        end: 26,
        value: "</style>",
      },
    ],
    "38"
  );

  t.end();
});

tap.test(`39`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ; `, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 18,
        value: ".a{b:c ! ; ",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            type: "text",
            start: 17,
            end: 18,
            value: " ",
          },
        ],
      },
    ],
    "39"
  );

  t.end();
});

tap.test(`40`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ;;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 18,
        value: ".a{b:c ! ;;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            start: 17,
            end: 18,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 17,
          },
        ],
      },
      {
        type: "tag",
        start: 18,
        end: 26,
        value: "</style>",
      },
    ],
    "40"
  );

  t.end();
});

tap.test(`41`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ;;`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 18,
        value: ".a{b:c ! ;;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            start: 17,
            end: 18,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 17,
          },
        ],
      },
    ],
    "41"
  );

  t.end();
});

tap.test(`42`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ;; </style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 18,
        value: ".a{b:c ! ;;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            start: 17,
            end: 18,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 17,
          },
        ],
      },
      {
        type: "text",
        start: 18,
        end: 19,
        value: " ",
      },
      {
        type: "tag",
        start: 19,
        end: 27,
        value: "</style>",
      },
    ],
    "42"
  );

  t.end();
});

tap.test(`43`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ;; `, {
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
        value: ".a{b:c ! ;; ",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            start: 17,
            end: 18,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 17,
          },
          {
            type: "text",
            start: 18,
            end: 19,
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
  ct(`<style>.a{b:c ! ; ; </style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 19,
        value: ".a{b:c ! ; ;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            type: "text",
            start: 17,
            end: 18,
            value: " ",
          },
          {
            start: 18,
            end: 19,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 18,
          },
        ],
      },
      {
        type: "text",
        start: 19,
        end: 20,
        value: " ",
      },
      {
        type: "tag",
        start: 20,
        end: 28,
        value: "</style>",
      },
    ],
    "44"
  );

  t.end();
});

tap.test(`45`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ! ; ; `, {
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
        end: 20,
        value: ".a{b:c ! ; ; ",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 17,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "!",
            importantStarts: 14,
            importantEnds: 15,
            colon: 11,
            semi: 16,
          },
          {
            type: "text",
            start: 17,
            end: 18,
            value: " ",
          },
          {
            start: 18,
            end: 19,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 18,
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
    "45"
  );

  t.end();
});

tap.test(`46`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c z`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c z",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c z",
            valueStarts: 12,
            valueEnds: 15,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "46"
  );

  t.end();
});

tap.test(`47`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c z</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c z",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c z",
            valueStarts: 12,
            valueEnds: 15,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "47"
  );

  t.end();
});

tap.test(`48`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c?`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:c?",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c?",
            valueStarts: 12,
            valueEnds: 14,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "48"
  );

  t.end();
});

tap.test(`49`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c?</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:c?",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 14,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c?",
            valueStarts: 12,
            valueEnds: 14,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 14,
        end: 22,
        value: "</style>",
      },
    ],
    "49"
  );

  t.end();
});

tap.test(`50`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ?`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c ?",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c ?",
            valueStarts: 12,
            valueEnds: 15,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: null,
          },
        ],
      },
    ],
    "50"
  );

  t.end();
});

tap.test(`51`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ?</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 15,
        value: ".a{b:c ?",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 15,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c ?",
            valueStarts: 12,
            valueEnds: 15,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 11,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 15,
        end: 23,
        value: "</style>",
      },
    ],
    "51"
  );

  t.end();
});

tap.test(`52`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c?important;`, {
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
        end: 24,
        value: ".a{b:c?important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: null, // <------ !!!
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
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c?",
            valueStarts: 12,
            valueEnds: 14,
            important: "important",
            importantStarts: 14,
            importantEnds: 23,
            colon: 11,
            semi: 23,
          },
        ],
      },
    ],
    "52"
  );

  t.end();
});

tap.test(`53`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c?important;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 24,
        value: ".a{b:c?important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: null, // <------ !!!
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
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c?",
            valueStarts: 12,
            valueEnds: 14,
            important: "important",
            importantStarts: 14,
            importantEnds: 23,
            colon: 11,
            semi: 23,
          },
        ],
      },
      {
        type: "tag",
        start: 24,
        end: 32,
        value: "</style>",
      },
    ],
    "53"
  );

  t.end();
});

tap.test(`54`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ?important;`, {
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
        value: ".a{b:c ?important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 25,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "?important",
            importantStarts: 14,
            importantEnds: 24,
            colon: 11,
            semi: 24,
          },
        ],
      },
    ],
    "54"
  );

  t.end();
});

tap.test(`55`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c ?important;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 25,
        value: ".a{b:c ?important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 25,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "?important",
            importantStarts: 14,
            importantEnds: 24,
            colon: 11,
            semi: 24,
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
        value: "</style>",
      },
    ],
    "55"
  );

  t.end();
});

tap.todo(`56`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c1important;`, {
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
        end: 24,
        value: ".a{b:c1important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 24,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "1important",
            importantStarts: 13,
            importantEnds: 23,
            colon: 11,
            semi: 23,
          },
        ],
      },
    ],
    "56"
  );

  t.end();
});

tap.test(
  `57 - if the whole value is numeric one's, don't extend the important`,
  (t) => {
    const gathered = [];
    ct(`<style>.a{b:11important;`, {
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
          end: 24,
          value: ".a{b:11important;",
          left: 6,
          nested: false,
          openingCurlyAt: 9,
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
              start: 10,
              end: 24,
              property: "b",
              propertyStarts: 10,
              propertyEnds: 11,
              value: "11",
              valueStarts: 12,
              valueEnds: 14,
              important: "important",
              importantStarts: 14,
              importantEnds: 23,
              colon: 11,
              semi: 23,
            },
          ],
        },
      ],
      "57"
    );

    t.end();
  }
);

tap.test(`58`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c1important;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 24,
        value: ".a{b:c1important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: null, // <----- !!!
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
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "1important",
            importantStarts: 13,
            importantEnds: 23,
            colon: 11,
            semi: 23,
          },
        ],
      },
      {
        type: "tag",
        start: 24,
        end: 32,
        value: "</style>",
      },
    ],
    "58"
  );

  t.end();
});

tap.test(`59`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c 1important;`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 25,
        value: ".a{b:c 1important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 25,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "1important",
            importantStarts: 14,
            importantEnds: 24,
            colon: 11,
            semi: 24,
          },
        ],
      },
    ],
    "59"
  );

  t.end();
});

tap.test(`60`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c 1important;</style>`, {
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
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 25,
        value: ".a{b:c 1important;",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
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
            start: 10,
            end: 25,
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            important: "1important",
            importantStarts: 14,
            importantEnds: 24,
            colon: 11,
            semi: 24,
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
        value: "</style>",
      },
    ],
    "60"
  );

  t.end();
});

tap.todo(`61`, (t) => {
  const gathered = [];
  ct(`<style.a{b:c !important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "61");

  t.end();
});

tap.todo(`62`, (t) => {
  const gathered = [];
  ct(`<style\n.a{b:c !important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "62");

  t.end();
});

tap.test(`63 - one rule, no linebreaks`, (t) => {
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
    "63"
  );
  t.end();
});

tap.test(`64 - one rule, linebreaks`, (t) => {
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
    "64"
  );
  t.end();
});

tap.test(`65 - two selectors`, (t) => {
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
    "65"
  );
  t.end();
});

tap.test(`66 - one rule, no linebreaks`, (t) => {
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
    "66"
  );
  t.end();
});

tap.test(`67 - dangling comma`, (t) => {
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
    "67"
  );
  t.end();
});

tap.test(`68 - double comma`, (t) => {
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
    "68"
  );
  t.end();
});

tap.test(`69 - esp tags can't have curlies`, (t) => {
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
    "69"
  );
  t.end();
});

tap.test(`70 - root level css declarations`, (t) => {
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
    "70"
  );
  t.end();
});

tap.test(`71 - @media`, (t) => {
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
    "71"
  );
  t.end();
});

tap.test(`72 - parent selector ">" - 1`, (t) => {
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
    "72"
  );
  t.end();
});

tap.test(`73 - parent selector ">" - 2`, (t) => {
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
    "73"
  );
  t.end();
});

tap.test(`74 unfinished code`, (t) => {
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
    "74"
  );
  t.end();
});

tap.test(`75`, (t) => {
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
    "75"
  );
  t.end();
});

tap.test(`76`, (t) => {
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
    "76"
  );
  t.end();
});

tap.test(`77`, (t) => {
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
    "77"
  );
  t.end();
});

tap.test(`78`, (t) => {
  const gathered = [];
  ct(`<style>.a{color: red ! float: left}`, {
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
    ],
    "78"
  );
  t.end();
});

tap.test(`79`, (t) => {
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
    "79"
  );
  t.end();
});

tap.test(`80`, (t) => {
  const gathered = [];
  ct(`<style>.a{padding:1px 2px 3px 4px !important}`, {
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
        end: 45,
        value: ".a{padding:1px 2px 3px 4px !important}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 44,
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
            end: 44,
            property: "padding",
            propertyStarts: 10,
            propertyEnds: 17,
            value: "1px 2px 3px 4px",
            valueStarts: 18,
            valueEnds: 33,
            importantStarts: 34,
            importantEnds: 44,
            important: "!important",
            colon: 17,
            semi: null,
          },
        ],
      },
    ],
    "80"
  );
  t.end();
});

tap.test(`81 - no space or excl. mark`, (t) => {
  const gathered = [];
  ct(`<style>.a{color:1pximportant}`, {
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
        end: 29,
        value: ".a{color:1pximportant}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 28,
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
            end: 28,
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "1px",
            valueStarts: 16,
            valueEnds: 19,
            importantStarts: 19,
            importantEnds: 28,
            important: "important",
            colon: 15,
            semi: null,
          },
        ],
      },
    ],
    "81"
  );
  t.end();
});

tap.test(`82`, (t) => {
  const gathered = [];
  ct(`<style>.a{color: red important float: left}</style>`, {
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
        end: 43,
        value: ".a{color: red important float: left}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 42,
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
            end: 30,
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "red",
            valueStarts: 17,
            valueEnds: 20,
            important: "important",
            importantStarts: 21,
            importantEnds: 30,
            colon: 15,
            semi: null,
          },
          {
            type: "text",
            start: 30,
            end: 31,
            value: " ",
          },
          {
            start: 31,
            end: 42,
            property: "float",
            propertyStarts: 31,
            propertyEnds: 36,
            value: "left",
            valueStarts: 38,
            valueEnds: 42,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 36,
            semi: null,
          },
        ],
      },
      {
        type: "tag",
        start: 43,
        end: 51,
        value: "</style>",
        tagNameStartsAt: 45,
        tagNameEndsAt: 50,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "82"
  );
  t.end();
});

tap.test(`83 - ESP var as a CSS rule's value`, (t) => {
  const gathered = [];
  ct(
    `<style>
.yyy {
  font-family: {{ zzz }} important;
}
</style>`,
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
        end: 52,
        value: ".yyy {\n  font-family: {{ zzz }} important;\n}",
        left: 6,
        nested: false,
        openingCurlyAt: 13,
        closingCurlyAt: 51,
        selectorsStart: 8,
        selectorsEnd: 12,
        selectors: [
          {
            value: ".yyy",
            selectorStarts: 8,
            selectorEnds: 12,
          },
        ],
        properties: [
          {
            type: "text",
            start: 14,
            end: 17,
            value: "\n  ",
          },
          {
            start: 17,
            end: 50,
            property: "font-family",
            propertyStarts: 17,
            propertyEnds: 28,
            value: "{{ zzz }}",
            valueStarts: 30,
            valueEnds: 39,
            important: "important",
            importantStarts: 40,
            importantEnds: 49,
            colon: 28,
            semi: 49,
          },
          {
            type: "text",
            start: 50,
            end: 51,
            value: "\n",
          },
        ],
      },
      {
        type: "text",
        start: 52,
        end: 53,
        value: "\n",
      },
      {
        type: "tag",
        start: 53,
        end: 61,
        value: "</style>",
        tagNameStartsAt: 55,
        tagNameEndsAt: 60,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "83"
  );
  t.end();
});

tap.todo(`84 - standalone semi in head CSS - chopped`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!important};`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "84");
  t.end();
});

tap.todo(`85 - standalone semi in head CSS - closed`, (t) => {
  const gathered = [];
  ct(`<style>.red{color:red!important};</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "85");
  t.end();
});

tap.todo(`86 - standalone semi in head CSS - surroundings`, (t) => {
  const gathered = [];
  ct(
    `<style>.a{b:c!important};
.b{text-align:left;}`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.strictSame(gathered, [], "86");
  t.end();
});
