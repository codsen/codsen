/* eslint no-template-curly-in-string:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// Mailchimp templating language
// https://templates.mailchimp.com/getting-started/template-language/

// const openingCurly = "\x7B";
const LEFTDOUBLEQUOTMARK = "\u201C";
const RIGHTDOUBLEQUOTMARK = "\u201D";

// mc:edit

test("01 - colon in attr name is not an issue", () => {
  let gathered = [];
  ct('<div mc:edit="right_content">', {
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
        value: '<div mc:edit="right_content">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: false,
        kind: null,
        attribs: [
          {
            attribName: "mc:edit",
            attribNameRecognised: false,
            attribNameStartsAt: 5,
            attribNameEndsAt: 12,
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 27,
            attribValueRaw: "right_content",
            attribValue: [
              {
                type: "text",
                start: 14,
                end: 27,
                value: "right_content",
              },
            ],
            attribValueStartsAt: 14,
            attribValueEndsAt: 27,
            attribStarts: 5,
            attribEnds: 28,
            attribLeft: 3,
          },
        ],
      },
    ],
    "01.01"
  );
});

// various

// <div mc:repeatable=.product.>
test("02 - fancy quotes pasted from MC documentation website", () => {
  let gathered = [];
  ct(`<div mc:repeatable=${LEFTDOUBLEQUOTMARK}product${RIGHTDOUBLEQUOTMARK}>`, {
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
        value: `<div mc:repeatable=${LEFTDOUBLEQUOTMARK}product${RIGHTDOUBLEQUOTMARK}>`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: false,
        kind: null,
        attribs: [
          {
            attribName: "mc:repeatable",
            attribNameRecognised: false,
            attribNameStartsAt: 5,
            attribNameEndsAt: 18,
            attribOpeningQuoteAt: 19,
            attribClosingQuoteAt: 27,
            attribValueRaw: "product",
            attribValue: [
              {
                type: "text",
                start: 20,
                end: 27,
                value: "product",
              },
            ],
            attribValueStartsAt: 20,
            attribValueEndsAt: 27,
            attribStarts: 5,
            attribEnds: 28,
            attribLeft: 3,
          },
        ],
      },
    ],
    "02.01"
  );
});

test.run();
