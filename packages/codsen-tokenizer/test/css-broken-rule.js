import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// css broken rule
// -----------------------------------------------------------------------------

test(`01 - repeated closing curlies`, () => {
  let gathered = [];
  ct(
    `<style>
.a{x}}
.b{x}}
</style>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  equal(
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
        end: 13,
        value: ".a{x}",
        left: 6,
        nested: false,
        openingCurlyAt: 10,
        closingCurlyAt: 12,
        selectorsStart: 8,
        selectorsEnd: 10,
        selectors: [
          {
            value: ".a",
            selectorStarts: 8,
            selectorEnds: 10,
          },
        ],
        properties: [
          {
            property: "x",
            propertyStarts: 11,
            propertyEnds: 12,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 11,
            end: 12,
          },
        ],
      },
      {
        type: "text",
        start: 13,
        end: 15,
        value: "}\n",
      },
      {
        type: "rule",
        start: 15,
        end: 20,
        value: ".b{x}",
        left: 13,
        nested: false,
        openingCurlyAt: 17,
        closingCurlyAt: 19,
        selectorsStart: 15,
        selectorsEnd: 17,
        selectors: [
          {
            value: ".b",
            selectorStarts: 15,
            selectorEnds: 17,
          },
        ],
        properties: [
          {
            property: "x",
            propertyStarts: 18,
            propertyEnds: 19,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 18,
            end: 19,
          },
        ],
      },
      {
        type: "text",
        start: 20,
        end: 22,
        value: "}\n",
      },
      {
        type: "tag",
        start: 22,
        end: 30,
        value: "</style>",
        tagNameStartsAt: 24,
        tagNameEndsAt: 29,
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
});

// missing semicols in head CSS
// -----------------------------------------------------------------------------

test(`02 - missing semicol`, () => {
  let gathered = [];
  ct(`<style>.a{b:c d:e;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: ".a{b:c d:e;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 18,
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
            semi: null,
            start: 10,
            end: 13,
          },
          {
            type: "text",
            start: 13,
            end: 14,
            value: " ",
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
        ],
      },
    ],
    "02"
  );
});

test(`03 - missing semicol, !important on the left`, () => {
  let gathered = [];
  ct(`<style>.a{b:c !important d:e;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 30,
        value: ".a{b:c !important d:e;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 29,
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
            importantStarts: 14,
            importantEnds: 24,
            important: "!important",
            colon: 11,
            semi: null,
          },
          {
            type: "text",
            start: 24,
            end: 25,
            value: " ",
          },
          {
            start: 25,
            end: 29,
            property: "d",
            propertyStarts: 25,
            propertyEnds: 26,
            value: "e",
            valueStarts: 27,
            valueEnds: 28,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 26,
            semi: 28,
          },
        ],
      },
    ],
    "03"
  );
});

test(`04 - missing semicol`, () => {
  let gathered = [];
  ct(`<style>.a{color: red text-align: left;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 39,
      value: ".a{color: red text-align: left;}",
      left: 6,
      nested: false,
      openingCurlyAt: 9,
      closingCurlyAt: 38,
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
          property: "color",
          propertyStarts: 10,
          propertyEnds: 15,
          colon: 15,
          value: "red",
          valueStarts: 17,
          valueEnds: 20,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: null, // <---
          start: 10,
          end: 20,
        },
        {
          type: "text",
          start: 20,
          end: 21,
          value: " ",
        },
        {
          property: "text-align",
          propertyStarts: 21,
          propertyEnds: 31,
          colon: 31,
          value: "left",
          valueStarts: 33,
          valueEnds: 37,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 37,
          start: 21,
          end: 38,
        },
      ],
    },
    "04"
  );
});

// missing value
// -----------------------------------------------------------------------------

test(`05 - missing value`, () => {
  let gathered = [];
  ct(`<style>.a{b}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 12,
      value: ".a{b}",
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
          property: "b",
          propertyStarts: 10,
          propertyEnds: 11,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: null,
          start: 10,
          end: 11,
        },
      ],
    },
    "05"
  );
});

test(`06 - missing value, trailing space`, () => {
  let gathered = [];
  ct(`<style>.a{b }</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 13,
      value: ".a{b }",
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
          property: "b",
          propertyStarts: 10,
          propertyEnds: 11,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: null,
          start: 10,
          end: 11,
        },
        {
          type: "text",
          start: 11,
          end: 12,
          value: " ",
        },
      ],
    },
    "06"
  );
});

test(`07 - missing value but colon present`, () => {
  let gathered = [];
  ct(`<style>.a{b:}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 13,
      value: ".a{b:}",
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
          colon: 11,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: null,
        },
      ],
    },
    "07"
  );
});

test(`08 - missing value but semi present`, () => {
  let gathered = [];
  ct(`<style>.a{b;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 13,
      value: ".a{b;}",
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
          property: "b",
          propertyStarts: 10,
          propertyEnds: 11,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 11,
          start: 10,
          end: 12,
        },
      ],
    },
    "08"
  );
});

test(`09 - missing value, both colon and semicolon present`, () => {
  let gathered = [];
  ct(`<style>.a{b:;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
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
          property: "b",
          propertyStarts: 10,
          propertyEnds: 11,
          colon: 11,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 12,
          start: 10,
          end: 13,
        },
      ],
    },
    "09"
  );
});

// not a colon is separating the key and value
// -----------------------------------------------------------------------------

test(`10 - semi instead of a colon - baseline, correct`, () => {
  let gathered = [];
  ct(`<style>div { float: left; }</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 27,
      value: "div { float: left; }",
      left: 6,
      nested: false,
      openingCurlyAt: 11,
      closingCurlyAt: 26,
      selectorsStart: 7,
      selectorsEnd: 10,
      selectors: [
        {
          value: "div",
          selectorStarts: 7,
          selectorEnds: 10,
        },
      ],
      properties: [
        {
          type: "text",
          start: 12,
          end: 13,
          value: " ",
        },
        {
          property: "float",
          propertyStarts: 13,
          propertyEnds: 18,
          colon: 18,
          value: "left",
          valueStarts: 20,
          valueEnds: 24,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 24,
          start: 13,
          end: 25,
        },
        {
          type: "text",
          start: 25,
          end: 26,
          value: " ",
        },
      ],
    },
    "10"
  );
});

test(`11 - semi instead of a colon`, () => {
  let gathered = [];
  ct(`<style>div { float; left; }</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 27,
      value: "div { float; left; }",
      left: 6,
      nested: false,
      openingCurlyAt: 11,
      closingCurlyAt: 26,
      selectorsStart: 7,
      selectorsEnd: 10,
      selectors: [
        {
          value: "div",
          selectorStarts: 7,
          selectorEnds: 10,
        },
      ],
      properties: [
        {
          type: "text",
          start: 12,
          end: 13,
          value: " ",
        },
        {
          property: "float",
          propertyStarts: 13,
          propertyEnds: 18,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 18,
          start: 13,
          end: 19,
        },
        {
          type: "text",
          start: 19,
          end: 20,
          value: " ",
        },
        {
          property: "left",
          propertyStarts: 20,
          propertyEnds: 24,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 24,
          start: 20,
          end: 25,
        },
        {
          type: "text",
          start: 25,
          end: 26,
          value: " ",
        },
      ],
    },
    "11"
  );
});

test(`12 - semi instead of a colon, tight`, () => {
  let gathered = [];
  ct(`<style>div{float;left;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 23,
      value: "div{float;left;}",
      left: 6,
      nested: false,
      openingCurlyAt: 10,
      closingCurlyAt: 22,
      selectorsStart: 7,
      selectorsEnd: 10,
      selectors: [
        {
          value: "div",
          selectorStarts: 7,
          selectorEnds: 10,
        },
      ],
      properties: [
        {
          property: "float",
          propertyStarts: 11,
          propertyEnds: 16,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 16,
          start: 11,
          end: 17,
        },
        {
          property: "left",
          propertyStarts: 17,
          propertyEnds: 21,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 21,
          start: 17,
          end: 22,
        },
      ],
    },
    "12"
  );
});

test(`13 - abrupty ended code`, () => {
  let gathered = [];
  ct(`<style>.a{color: red`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 20,
      value: ".a{color: red",
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
          property: "color",
          propertyStarts: 10,
          propertyEnds: 15,
          colon: 15,
          value: "red",
          valueStarts: 17,
          valueEnds: 20,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: null,
          start: 10,
          end: 20,
        },
      ],
    },
    "13"
  );
});

test(`14 - abrupty ended second css rule`, () => {
  let gathered = [];
  ct(`<style>.a{color:red; text-align`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered[1],
    {
      type: "rule",
      start: 7,
      end: 31,
      value: ".a{color:red; text-align",
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
          property: "color",
          propertyStarts: 10,
          propertyEnds: 15,
          colon: 15,
          value: "red",
          valueStarts: 16,
          valueEnds: 19,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: 19,
          start: 10,
          end: 20,
        },
        {
          type: "text",
          start: 20,
          end: 21,
          value: " ",
        },
        {
          property: "text-align",
          propertyStarts: 21,
          propertyEnds: 31,
          colon: null,
          value: null,
          valueStarts: null,
          valueEnds: null,
          importantStarts: null,
          importantEnds: null,
          important: null,
          semi: null,
          start: 21,
          end: 31,
        },
      ],
    },
    "14"
  );
});

test(`15 - abrupty ended second css rule`, () => {
  let gathered = [];
  ct(`<style>.a{color:red; text-align</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 7,
      },
      {
        type: "rule",
        start: 7,
        end: 31,
        value: ".a{color:red; text-align",
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
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            colon: 15,
            value: "red",
            valueStarts: 16,
            valueEnds: 19,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: 19,
            start: 10,
            end: 20,
          },
          {
            type: "text",
            start: 20,
            end: 21,
            value: " ",
          },
          {
            property: "text-align",
            propertyStarts: 21,
            propertyEnds: 31,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 21,
            end: 31,
          },
        ],
      },
      {
        type: "tag",
        start: 31,
        end: 39,
      },
    ]),
    "15"
  );
});

test(`16 - nothing after colon`, () => {
  let gathered = [];
  ct(`<style>.a{ color: }</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
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
        value: ".a{ color: }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 18,
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
            end: 11,
            value: " ",
          },
          {
            start: 11,
            end: 17,
            value: null,
            property: "color",
            propertyStarts: 11,
            propertyEnds: 16,
            colon: 16,
            valueStarts: null,
            valueEnds: null,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
          },
          {
            type: "text",
            start: 17,
            end: 18,
            value: " ",
          },
        ],
      },
      {
        type: "tag",
        start: 19,
        end: 27,
        value: "</style>",
      },
    ]),
    "16"
  );
});

test(`17 - semi before !important`, () => {
  let gathered = [];
  ct(`<style>.a{color:red; !important;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 33,
        value: ".a{color:red; !important;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 32,
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
            end: 20,
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "red",
            valueStarts: 16,
            valueEnds: 19,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 15,
            semi: 19,
          },
          {
            type: "text",
            start: 20,
            end: 21,
            value: " ",
          },
          {
            start: 21,
            end: 32,
            value: null,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            importantStarts: 21,
            importantEnds: 31,
            important: "!important",
            colon: null,
            valueStarts: null,
            valueEnds: null,
            semi: 31,
          },
        ],
      },
    ],
    "17"
  );
});

test(`18`, () => {
  let gathered = [];
  ct(`<style>.a{color:red!IMPOTANT;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 30,
        value: ".a{color:red!IMPOTANT;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 29,
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
            end: 29,
            value: "red",
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            importantStarts: 19,
            importantEnds: 28,
            important: "!IMPOTANT",
            colon: 15,
            valueStarts: 16,
            valueEnds: 19,
            semi: 28,
          },
        ],
      },
    ],
    "18"
  );
});

test(`19`, () => {
  let gathered = [];
  ct(`<style>.a{color:red;!IMPOTANT}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 30,
        value: ".a{color:red;!IMPOTANT}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 29,
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
            end: 20,
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "red",
            valueStarts: 16,
            valueEnds: 19,
            importantStarts: null,
            importantEnds: null,
            important: null,
            colon: 15,
            semi: 19,
          },
          {
            start: 20,
            end: 29,
            property: null,
            propertyStarts: null,
            propertyEnds: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            importantStarts: 20,
            importantEnds: 29,
            important: "!IMPOTANT",
            colon: null,
            semi: null,
          },
        ],
      },
    ],
    "19"
  );
});

test(`20`, () => {
  let gathered = [];
  ct(`<style>.a{color:red important}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 30,
        value: ".a{color:red important}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 29,
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
            end: 29,
            property: "color",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "red",
            valueStarts: 16,
            valueEnds: 19,
            importantStarts: 20,
            importantEnds: 29,
            important: "important",
            colon: 15,
            semi: null,
          },
        ],
      },
    ],
    "20"
  );
});

test(`21`, () => {
  let gathered = [];
  ct(`<style>.a{color:red 1important}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 31,
        value: ".a{color:red 1important}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 30,
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
            valueStarts: 16,
            valueEnds: 19,
            importantStarts: 20,
            importantEnds: 30,
            important: "1important",
            colon: 15,
            semi: null,
          },
        ],
      },
    ],
    "21"
  );
});

test(`22 - rogue letter`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;x}.b{color: red}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 23,
        value: ".a{float:left;x}",
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
            start: 10,
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
            property: "x",
            propertyStarts: 21,
            propertyEnds: 22,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "rule",
        start: 23,
        end: 37,
        value: ".b{color: red}",
        left: 22,
        nested: false,
        openingCurlyAt: 25,
        closingCurlyAt: 36,
        selectorsStart: 23,
        selectorsEnd: 25,
        selectors: [
          {
            value: ".b",
            selectorStarts: 23,
            selectorEnds: 25,
          },
        ],
        properties: [
          {
            start: 26,
            end: 36,
            property: "color",
            propertyStarts: 26,
            propertyEnds: 31,
            value: "red",
            valueStarts: 33,
            valueEnds: 36,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 31,
            semi: null,
          },
        ],
      },
    ]),
    "22"
  );
});

test(`23 - rogue hash`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;#}.b{color: red}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 23,
        value: ".a{float:left;#}",
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
            start: 10,
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
            property: "#",
            propertyStarts: 21,
            propertyEnds: 22,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "rule",
        start: 23,
        end: 37,
        value: ".b{color: red}",
        left: 22,
        nested: false,
        openingCurlyAt: 25,
        closingCurlyAt: 36,
        selectorsStart: 23,
        selectorsEnd: 25,
        selectors: [
          {
            value: ".b",
            selectorStarts: 23,
            selectorEnds: 25,
          },
        ],
        properties: [
          {
            start: 26,
            end: 36,
            property: "color",
            propertyStarts: 26,
            propertyEnds: 31,
            value: "red",
            valueStarts: 33,
            valueEnds: 36,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 31,
            semi: null,
          },
        ],
      },
    ]),
    "23"
  );
});

test(`24 - rogue quote`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;"}.b{color: red}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "rule",
        start: 7,
        end: 23,
        value: '.a{float:left;"}',
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
            start: 10,
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
            property: '"',
            propertyStarts: 21,
            propertyEnds: 22,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "rule",
        start: 23,
        end: 37,
        value: ".b{color: red}",
        left: 22,
        nested: false,
        openingCurlyAt: 25,
        closingCurlyAt: 36,
        selectorsStart: 23,
        selectorsEnd: 25,
        selectors: [
          {
            value: ".b",
            selectorStarts: 23,
            selectorEnds: 25,
          },
        ],
        properties: [
          {
            start: 26,
            end: 36,
            property: "color",
            propertyStarts: 26,
            propertyEnds: 31,
            value: "red",
            valueStarts: 33,
            valueEnds: 36,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 31,
            semi: null,
          },
        ],
      },
    ]),
    "24"
  );
});

test(`25 - rogue quote+bracket, curlies follow`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;x">color: red}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
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
        value: '.a{float:left;x">color: red}',
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 34,
            property: 'x">color',
            propertyStarts: 21,
            propertyEnds: 29,
            value: "red",
            valueStarts: 31,
            valueEnds: 34,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 29,
            semi: null,
          },
        ],
      },
    ]),
    "25"
  );
});

test(`26`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;">color: red}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  ok(
    compare(gathered, [
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
        value: '.a{float:left;">color: red}',
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 33,
            property: '">color',
            propertyStarts: 21,
            propertyEnds: 28,
            value: "red",
            valueStarts: 30,
            valueEnds: 33,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 28,
            semi: null,
          },
        ],
      },
    ]),
    "26"
  );
});

test(`27 - spillage from HTML styles - rogue quote+bracket`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;x">.b,.c{color: red}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 23,
        value: '.a{float:left;x"',
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 23,
            property: 'x"',
            propertyStarts: 21,
            propertyEnds: 22,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: null,
          },
        ],
      },
      {
        type: "rule",
        start: 23,
        end: 41,
        value: ">.b,.c{color: red}",
        left: 22,
        nested: false,
        openingCurlyAt: 29,
        closingCurlyAt: 40,
        selectorsStart: 23,
        selectorsEnd: 29,
        selectors: [
          {
            value: ">.b",
            selectorStarts: 23,
            selectorEnds: 26,
          },
          {
            value: ".c",
            selectorStarts: 27,
            selectorEnds: 29,
          },
        ],
        properties: [
          {
            start: 30,
            end: 40,
            property: "color",
            propertyStarts: 30,
            propertyEnds: 35,
            value: "red",
            valueStarts: 37,
            valueEnds: 40,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 35,
            semi: null,
          },
        ],
      },
    ],
    "27"
  );
});

test(`28 - rogue quote+bracket, curlies follow`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;">}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: '.a{float:left;">}',
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 23,
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 23,
            property: '">',
            propertyStarts: 21,
            propertyEnds: 23,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: null,
          },
        ],
      },
    ],
    "28"
  );
});

test(`29`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;"}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 23,
        value: '.a{float:left;"}',
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
            start: 10,
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
            property: '"',
            propertyStarts: 21,
            propertyEnds: 22,
            value: null,
            valueStarts: null,
            valueEnds: null,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: null,
          },
        ],
      },
    ],
    "29"
  );
});

test(`30 - repeated semi, tight`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 23,
        value: ".a{float:left;;}",
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
            start: 10,
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
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
            semi: 21,
          },
        ],
      },
    ],
    "30"
  );
});

test(`31 - repeated semi, space in front`, () => {
  let gathered = [];
  ct(`<style>.a{float:left; ;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: ".a{float:left; ;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 23,
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            type: "text",
            start: 21,
            end: 22,
            value: " ",
          },
          {
            start: 22,
            end: 23,
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
            semi: 22,
          },
        ],
      },
    ],
    "31"
  );
});

test(`32 - repeated semi, tab in front`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;\t;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: ".a{float:left;\t;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 23,
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            type: "text",
            start: 21,
            end: 22,
            value: "\t",
          },
          {
            start: 22,
            end: 23,
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
            semi: 22,
          },
        ],
      },
    ],
    "32"
  );
});

test(`33 - repeated semi, space after, bracket`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;; }`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: ".a{float:left;; }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 23,
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
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
            semi: 21,
          },
          {
            type: "text",
            start: 22,
            end: 23,
            value: " ",
          },
        ],
      },
    ],
    "33"
  );
});

test(`34 - repeated semi, space after, bracket missing`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;; </style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 22,
        value: ".a{float:left;;",
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
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
            semi: 21,
          },
          {
            type: "text",
            start: 22,
            end: null,
            value: null,
          },
        ],
      },
      {
        type: "text",
        start: 22,
        end: 23,
        value: " ",
      },
      {
        type: "tag",
        start: 23,
        end: 31,
        value: "</style>",
        tagNameStartsAt: 25,
        tagNameEndsAt: 30,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "34"
  );
});

test(`35 - repeated semi, space after, new property follows`, () => {
  let gathered = [];
  ct(`<style>.a{float:left;; color:red;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: ".a{float:left;; color:red;}",
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
            end: 21,
            property: "float",
            propertyStarts: 10,
            propertyEnds: 15,
            value: "left",
            valueStarts: 16,
            valueEnds: 20,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 15,
            semi: 20,
          },
          {
            start: 21,
            end: 22,
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
            semi: 21,
          },
          {
            type: "text",
            start: 22,
            end: 23,
            value: " ",
          },
          {
            start: 23,
            end: 33,
            property: "color",
            propertyStarts: 23,
            propertyEnds: 28,
            value: "red",
            valueStarts: 29,
            valueEnds: 32,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 28,
            semi: 32,
          },
        ],
      },
    ],
    "35"
  );
});

test(`36`, () => {
  let gathered = [];
  ct(`<style>a{;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        value: "a{;}",
        left: 6,
        nested: false,
        openingCurlyAt: 8,
        closingCurlyAt: 10,
        selectorsStart: 7,
        selectorsEnd: 8,
        selectors: [
          {
            value: "a",
            selectorStarts: 7,
            selectorEnds: 8,
          },
        ],
        properties: [
          {
            start: 9,
            end: 10,
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
            semi: 9,
          },
        ],
      },
    ],
    "36"
  );
});

test(`37`, () => {
  let gathered = [];
  ct(`<style>a{ ; }`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 13,
        value: "a{ ; }",
        left: 6,
        nested: false,
        openingCurlyAt: 8,
        closingCurlyAt: 12,
        selectorsStart: 7,
        selectorsEnd: 8,
        selectors: [
          {
            value: "a",
            selectorStarts: 7,
            selectorEnds: 8,
          },
        ],
        properties: [
          {
            type: "text",
            start: 9,
            end: 10,
            value: " ",
          },
          {
            start: 10,
            end: 11,
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
            semi: 10,
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
    "37"
  );
});

test(`38`, () => {
  let gathered = [];
  ct(`<style>.a{;;}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        end: 13,
        value: ".a{;;}",
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
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: null,
            semi: 10,
          },
          {
            start: 11,
            end: 12,
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
            semi: 11,
          },
        ],
      },
    ],
    "38"
  );
});

// test.todo(`<style>.a{b:c z`);
// test.todo(`<style>.a{b:c?`);
// test.todo(`<style>.a{b:c ?`);
// test.todo(`<style>.a{b:c?important;`);
// test.todo(`<style>.a{b:c ?important;`);
// test.todo(`<style>.a{b:c1important;`);
// test.todo(`<style>.a{b:c 1important;`);

// // also,
// test.todo(`<style.a{b:c !important;}</style>`);
// test.todo(`<style\n.a{b:c !important;}</style>`);

test.run();
