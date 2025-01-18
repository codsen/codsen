import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

test(`01 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - stray closing closing block comment`, () => {
  let gathered = [];
  ct('<a style="   color: red;  */">', {
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
        end: 30,
        value: '<a style="   color: red;  */">',
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
            attribClosingQuoteAt: 28,
            attribValueRaw: "   color: red;  */",
            attribValue: [
              {
                type: "text",
                start: 10,
                end: 13,
                value: "   ",
              },
              {
                property: "color",
                propertyStarts: 13,
                propertyEnds: 18,
                colon: 18,
                value: "red",
                valueStarts: 20,
                valueEnds: 23,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 23,
                start: 13,
                end: 24,
              },
              {
                type: "text",
                start: 24,
                end: 26,
                value: "  ",
              },
              {
                type: "comment",
                start: 26,
                end: 28,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 28,
            attribStarts: 3,
            attribEnds: 29,
            attribLeft: 1,
          },
        ],
      },
    ],
    "01.01",
  );
});

test(`02 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - multiple stray closing closing block comments`, () => {
  let gathered = [];
  ct('<a style="  */*/ */  ">', {
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
        end: 23,
        value: '<a style="  */*/ */  ">',
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
            attribClosingQuoteAt: 21,
            attribValueRaw: "  */*/ */  ",
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
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
              {
                type: "comment",
                start: 14,
                end: 16,
                value: "*/",
                closing: true,
                kind: "block",
                language: "css",
              },
              {
                type: "text",
                start: 16,
                end: 17,
                value: " ",
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
                type: "text",
                start: 19,
                end: 21,
                value: "  ",
              },
            ],
            attribValueStartsAt: 10,
            attribValueEndsAt: 21,
            attribStarts: 3,
            attribEnds: 22,
            attribLeft: 1,
          },
        ],
      },
    ],
    "02.01",
  );
});

test.run();
