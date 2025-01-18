import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// whole line
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - first line commented out`, () => {
  let gathered = [];
  ct("<style>// something\na{text-decoration: none;}</style>", {
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
        end: 45,
        value: "// something\na{text-decoration: none;}",
        left: 6,
        nested: false,
        openingCurlyAt: 21,
        closingCurlyAt: 44,
        selectorsStart: 7,
        selectorsEnd: 21,
        selectors: [
          {
            value: "// something\na",
            selectorStarts: 7,
            selectorEnds: 21,
          },
        ],
        properties: [
          {
            start: 22,
            end: 44,
            property: "text-decoration",
            propertyStarts: 22,
            propertyEnds: 37,
            value: "none",
            valueStarts: 39,
            valueEnds: 43,
            important: null,
            importantStarts: null,
            importantEnds: null,
            colon: 37,
            semi: 43,
          },
        ],
      },
      {
        type: "tag",
        start: 45,
        end: 53,
        value: "</style>",
        tagNameStartsAt: 47,
        tagNameEndsAt: 52,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ]),
    "01.01",
  );
});

test(`02 - ${`\u001b[${36}m${"rule"}\u001b[${39}m`} - line comment`, () => {
  let gathered = [];
  ct("<style>// something</style>", {
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
        end: 19,
        value: "// something",
        left: 6,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectorsStart: 7,
        selectorsEnd: null,
        selectors: [],
        properties: [],
      },
      {
        type: "tag",
        start: 19,
        end: 27,
        value: "</style>",
        tagNameStartsAt: 21,
        tagNameEndsAt: 26,
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

test.run();
