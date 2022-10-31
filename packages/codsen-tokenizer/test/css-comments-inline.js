import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// css comments within inline HTML styles
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style`, () => {
  let gathered = [];
  ct(`<div style="/*color: red;*/">z</div>`, {
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
        end: 29,
        value: '<div style="/*color: red;*/">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 27,
            attribValueRaw: "/*color: red;*/",
            attribValue: [
              {
                type: "comment",
                start: 12,
                end: 14,
                value: "/*",
                closing: false,
                kind: "block",
                language: "css",
              },
              {
                type: "text", // <--- it's not a property token
                start: 14,
                end: 25,
                value: "color: red;",
              },
              {
                type: "comment",
                start: 25,
                end: 27,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 27,
            attribStarts: 5,
            attribEnds: 28,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 29,
        end: 30,
        value: "z",
      },
      {
        type: "tag",
        start: 30,
        end: 36,
        value: "</div>",
        tagNameStartsAt: 32,
        tagNameEndsAt: 35,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "01.01"
  );
});

test(`02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style, more`, () => {
  let gathered = [];
  ct(`<div style="/*color: red;*/ text-align: left;">z</div>`, {
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
        end: 47,
        value: '<div style="/*color: red;*/ text-align: left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 45,
            attribValueRaw: "/*color: red;*/ text-align: left;",
            attribValue: [
              {
                type: "comment",
                start: 12,
                end: 14,
                value: "/*",
                closing: false,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 14,
                end: 25,
                value: "color: red;",
              },
              {
                type: "comment",
                start: 25,
                end: 27,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 27,
                end: 28,
                value: " ",
              },
              {
                property: "text-align",
                propertyStarts: 28,
                propertyEnds: 38,
                colon: 38,
                value: "left",
                valueStarts: 40,
                valueEnds: 44,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 44,
                start: 28,
                end: 45,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 45,
            attribStarts: 5,
            attribEnds: 46,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 47,
        end: 48,
        value: "z",
      },
      {
        type: "tag",
        start: 48,
        end: 54,
        value: "</div>",
        tagNameStartsAt: 50,
        tagNameEndsAt: 53,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "02.01"
  );
});

test(`03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline css, erroneous line comment`, () => {
  let gathered = [];
  ct(`<div style="//color: red;">z</div>`, {
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
        end: 27,
        value: '<div style="//color: red;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "//color: red;",
            attribValue: [
              {
                property: "//color",
                propertyStarts: 12,
                propertyEnds: 19,
                colon: 19,
                value: "red",
                valueStarts: 21,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 24,
                start: 12,
                end: 25,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 27,
        end: 28,
        value: "z",
      },
      {
        type: "tag",
        start: 28,
        end: 34,
        value: "</div>",
        tagNameStartsAt: 30,
        tagNameEndsAt: 33,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "03.01"
  );
});

test(`04 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - text comment`, () => {
  let gathered = [];
  ct(`<a style="/* zzz */color: red">`, {
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
        end: 31,
        value: '<a style="/* zzz */color: red">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 29,
            attribValueRaw: "/* zzz */color: red",
            attribValue: [
              {
                type: "comment",
                start: 10,
                end: 12,
                value: "/*",
                closing: false,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 12,
                end: 17,
                value: " zzz ",
              },
              {
                type: "comment",
                start: 17,
                end: 19,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
              {
                property: "color",
                propertyStarts: 19,
                propertyEnds: 24,
                colon: 24,
                value: "red",
                valueStarts: 26,
                valueEnds: 29,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 19,
                end: 29,
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 29,
            attribStarts: 3,
            attribEnds: 30,
            attribLeft: 1,
          },
        ],
      },
    ],
    "04.01"
  );
});

test(`05 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - property terminates comment`, () => {
  let gathered = [];
  ct(`<a style="  /* zzz */color: red;  ">`, {
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
        end: 36,
        value: '<a style="  /* zzz */color: red;  ">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 34,
            attribValueRaw: "  /* zzz */color: red;  ",
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 12,
                value: "  ",
              },
              {
                type: "comment",
                start: 12,
                end: 14,
                value: "/*",
                closing: false,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 14,
                end: 19,
                value: " zzz ",
              },
              {
                type: "comment",
                start: 19,
                end: 21,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
              {
                property: "color",
                propertyStarts: 21,
                propertyEnds: 26,
                colon: 26,
                value: "red",
                valueStarts: 28,
                valueEnds: 31,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 31,
                start: 21,
                end: 32,
              },
              {
                type: "text",
                start: 32,
                end: 34,
                value: "  ",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 34,
            attribStarts: 3,
            attribEnds: 35,
            attribLeft: 1,
          },
        ],
      },
    ],
    "05.01"
  );
});

test(`06 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - property terminates text`, () => {
  let gathered = [];
  ct(`<a style="  /* zzz */ color: red;  ">`, {
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
        end: 37,
        value: '<a style="  /* zzz */ color: red;  ">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 35,
            attribValueRaw: "  /* zzz */ color: red;  ",
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 12,
                value: "  ",
              },
              {
                type: "comment",
                start: 12,
                end: 14,
                value: "/*",
                closing: false,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 14,
                end: 19,
                value: " zzz ",
              },
              {
                type: "comment",
                start: 19,
                end: 21,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 21,
                end: 22,
                value: " ",
              },
              {
                property: "color",
                propertyStarts: 22,
                propertyEnds: 27,
                colon: 27,
                value: "red",
                valueStarts: 29,
                valueEnds: 32,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 32,
                start: 22,
                end: 33,
              },
              {
                type: "text",
                start: 33,
                end: 35,
                value: "  ",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 35,
            attribStarts: 3,
            attribEnds: 36,
            attribLeft: 1,
          },
        ],
      },
    ],
    "06.01"
  );
});

test(`07 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - property (no semi), then comment`, () => {
  let gathered = [];
  ct(`<a style="color: red/* zzz */">`, {
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
        end: 31,
        value: '<a style="color: red/* zzz */">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 29,
            attribValueRaw: "color: red/* zzz */",
            attribValue: [
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
              {
                type: "comment",
                start: 20,
                end: 22,
                value: "/*",
                closing: false,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 22,
                end: 27,
                value: " zzz ",
              },
              {
                type: "comment",
                start: 27,
                end: 29,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 29,
            attribStarts: 3,
            attribEnds: 30,
            attribLeft: 1,
          },
        ],
      },
    ],
    "07.01"
  );
});

test.run();
