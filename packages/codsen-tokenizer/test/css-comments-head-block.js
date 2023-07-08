import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// block
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - comment-only`, () => {
  let gathered = [];
  ct("<style>/* comment */</style>", {
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
        tagName: "style",
      },
      {
        type: "comment",
        start: 7,
        end: 9,
        value: "/*",
        closing: false,
        kind: "block",
        language: "css",
      },
      {
        type: "text",
        start: 9,
        end: 18,
        value: " comment ",
      },
      {
        type: "comment",
        start: 18,
        end: 20,
        value: "*/",
        closing: true,
        kind: "block",
        language: "css",
      },
      {
        type: "tag",
        start: 20,
        end: 28,
        tagName: "style",
      },
    ]),
    "01.01",
  );
});

test(`02 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - two comments`, () => {
  let gathered = [];
  ct("<style>/* comment 1 *//* comment 2 */</style>", {
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
        type: "comment",
        start: 7,
        end: 9,
        value: "/*",
        closing: false,
        kind: "block",
        language: "css",
      },
      {
        type: "text",
        start: 9,
        end: 20,
        value: " comment 1 ",
      },
      {
        type: "comment",
        start: 20,
        end: 22,
        value: "*/",
        closing: true,
        kind: "block",
        language: "css",
      },
      {
        type: "comment",
        start: 22,
        end: 24,
        value: "/*",
        closing: false,
        kind: "block",
        language: "css",
      },
      {
        type: "text",
        start: 24,
        end: 35,
        value: " comment 2 ",
      },
      {
        type: "comment",
        start: 35,
        end: 37,
        value: "*/",
        closing: true,
        kind: "block",
        language: "css",
      },
      {
        type: "tag",
        start: 37,
        end: 45,
        value: "</style>",
        tagNameStartsAt: 39,
        tagNameEndsAt: 44,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ]),
    "02.01",
  );
});

test(`03 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - two rules`, () => {
  let gathered = [];
  ct("<style>a{color:red;}/* comment 1 */p{float:left;}</style>", {
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
        end: 20,
        value: "a{color:red;}",
        left: 6,
        nested: false,
        openingCurlyAt: 8,
        closingCurlyAt: 19,
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
            property: "color",
            propertyStarts: 9,
            propertyEnds: 14,
            colon: 14,
            value: "red",
            valueStarts: 15,
            valueEnds: 18,
            semi: 18,
          },
        ],
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
        end: 33,
        value: " comment 1 ",
      },
      {
        type: "comment",
        start: 33,
        end: 35,
        value: "*/",
        closing: true,
        kind: "block",
        language: "css",
      },
      {
        type: "rule",
        start: 35,
        end: 49,
        value: "p{float:left;}",
        left: 34,
        nested: false,
        openingCurlyAt: 36,
        closingCurlyAt: 48,
        selectorsStart: 35,
        selectorsEnd: 36,
        selectors: [
          {
            value: "p",
            selectorStarts: 35,
            selectorEnds: 36,
          },
        ],
        properties: [
          {
            property: "float",
            propertyStarts: 37,
            propertyEnds: 42,
            colon: 42,
            value: "left",
            valueStarts: 43,
            valueEnds: 47,
            semi: 47,
          },
        ],
      },
      {
        type: "tag",
        start: 49,
        end: 57,
        value: "</style>",
      },
    ]),
    "03.01",
  );
});

test.run();
