import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { cparser } from "../dist/codsen-parser.esm.js";

// 01. basics
// -----------------------------------------------------------------------------

test("01 - two tags", () => {
  compare(
    ok,
    cparser(`<style>
.red{color: red;}
</style>`),
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
        children: [
          {
            type: "text",
            start: 7,
            end: 8,
            value: "\n",
          },
          {
            type: "rule",
            start: 8,
            end: 25,
            value: ".red{color: red;}",
            left: 6,
            nested: false,
            openingCurlyAt: 12,
            closingCurlyAt: 24,
            selectorsStart: 8,
            selectorsEnd: 12,
            selectors: [
              {
                value: ".red",
                selectorStarts: 8,
                selectorEnds: 12,
              },
            ],
            properties: [
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
            ],
          },
          {
            type: "text",
            start: 25,
            end: 26,
            value: "\n",
          },
        ],
      },
      {
        children: [],
        type: "tag",
        start: 26,
        end: 34,
        value: "</style>",
        tagNameStartsAt: 28,
        tagNameEndsAt: 33,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,

        kind: null,
        attribs: [],
      },
    ],
    "01",
  );
});

// 02. media
// -----------------------------------------------------------------------------

test(`02 - ${`\u001b[${36}m${"media"}\u001b[${39}m`} - two selectors with empty curlies`, () => {
  compare(
    ok,
    cparser(`<style>
@media screen and {
.a, .b {}
}
</style>`),
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
        children: [
          {
            type: "text",
            start: 7,
            end: 8,
            value: "\n",
          },
          {
            type: "at",
            start: 8,
            end: 39,
            value: "@media screen and {\n.a, .b {}\n}",
            left: 6,
            nested: false,
            openingCurlyAt: 26,
            closingCurlyAt: 38,
            identifier: "media",
            identifierStartsAt: 9,
            identifierEndsAt: 14,
            query: "screen and",
            queryStartsAt: 15,
            queryEndsAt: 25,
            rules: [
              {
                type: "text",
                start: 27,
                end: 28,
                value: "\n",
              },
              {
                type: "rule",
                start: 28,
                end: 37,
                value: ".a, .b {}",
                left: 26,
                nested: true,
                openingCurlyAt: 35,
                closingCurlyAt: 36,
                selectorsStart: 28,
                selectorsEnd: 34,
                selectors: [
                  {
                    value: ".a",
                    selectorStarts: 28,
                    selectorEnds: 30,
                  },
                  {
                    value: ".b",
                    selectorStarts: 32,
                    selectorEnds: 34,
                  },
                ],
                properties: [],
              },
              {
                type: "text",
                start: 37,
                end: 38,
                value: "\n",
              },
            ],
          },
          {
            type: "text",
            start: 39,
            end: 40,
            value: "\n",
          },
        ],
      },
      {
        type: "tag",
        start: 40,
        end: 48,
        value: "</style>",
        tagNameStartsAt: 42,
        tagNameEndsAt: 47,
        tagName: "style",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
        children: [],
      },
    ],
    "02",
  );
});

test.run();
