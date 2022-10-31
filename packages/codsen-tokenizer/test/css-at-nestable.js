import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { compare } from "ast-compare";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// css - nestable at rules

//
//
//
//
//
//
//
//
//
//
//
//
// MVP
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`mvp`}\u001b[${39}m`} - minimal case, one level`, () => {
  let gathered = [];
  ct(`<style>@media a {.b{c}}</style>`, {
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
        start: 17,
        end: 22,
        value: `.b{c}`,
        left: 16,
        nested: true,
        openingCurlyAt: 19,
        closingCurlyAt: 21,
        selectorsStart: 17,
        selectorsEnd: 19,
        selectors: [
          {
            value: ".b",
            selectorStarts: 17,
            selectorEnds: 19,
          },
        ],
        properties: [
          {
            property: "c",
            propertyStarts: 20,
            propertyEnds: 21,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 20,
            end: 21,
          },
        ],
      },
      {
        type: "at",
        start: 7,
        end: 23,
        value: `@media a {.b{c}}`,
        left: 6,
        nested: false,
        identifier: "media",
        identifierStartsAt: 8,
        identifierEndsAt: 13,
        query: "a",
        queryStartsAt: 14,
        queryEndsAt: 15,
        openingCurlyAt: 16,
        closingCurlyAt: 22,
        rules: [
          {
            type: "rule",
            start: 17,
            end: 22,
            value: `.b{c}`,
            left: 16,
            nested: true,
            openingCurlyAt: 19,
            closingCurlyAt: 21,
            selectorsStart: 17,
            selectorsEnd: 19,
            selectors: [
              {
                value: ".b",
                selectorStarts: 17,
                selectorEnds: 19,
              },
            ],
            properties: [
              {
                property: "c",
                propertyStarts: 20,
                propertyEnds: 21,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 20,
                end: 21,
              },
            ],
          },
        ],
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
    "01.01"
  );
});

// @a b {
//    .c {
//       d:e
//    }
//    @f g {
//       .h {
//          i:j
//       }
//    }
//    .k {
//       l: m
//    }
// }
test(`02 - ${`\u001b[${34}m${`mvp`}\u001b[${39}m`} - minimal case, two levels`, () => {
  let gathered = [];
  ct(`<style>@a b {.c{d: e}@f g {.h{i: j}}.k{l: m}}</style>`, {
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
        start: 13,
        end: 21,
        value: ".c{d: e}",
        left: 12,
        nested: true,
        openingCurlyAt: 15,
        closingCurlyAt: 20,
        selectorsStart: 13,
        selectorsEnd: 15,
        selectors: [
          {
            value: ".c",
            selectorStarts: 13,
            selectorEnds: 15,
          },
        ],
        properties: [
          {
            property: "d",
            propertyStarts: 16,
            propertyEnds: 17,
            colon: 17,
            value: "e",
            valueStarts: 19,
            valueEnds: 20,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 16,
            end: 20,
          },
        ],
      },
      {
        type: "rule",
        start: 27,
        end: 35,
        value: ".h{i: j}",
        left: 26,
        nested: true,
        openingCurlyAt: 29,
        closingCurlyAt: 34,
        selectorsStart: 27,
        selectorsEnd: 29,
        selectors: [
          {
            value: ".h",
            selectorStarts: 27,
            selectorEnds: 29,
          },
        ],
        properties: [
          {
            property: "i",
            propertyStarts: 30,
            propertyEnds: 31,
            colon: 31,
            value: "j",
            valueStarts: 33,
            valueEnds: 34,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 30,
            end: 34,
          },
        ],
      },
      {
        type: "at",
        start: 21,
        end: 36,
        value: "@f g {.h{i: j}}",
        left: 20,
        nested: true,
        openingCurlyAt: 26,
        closingCurlyAt: 35,
        identifier: "f",
        identifierStartsAt: 22,
        identifierEndsAt: 23,
        query: "g",
        queryStartsAt: 24,
        queryEndsAt: 25,
        rules: [
          {
            type: "rule",
            start: 27,
            end: 35,
            value: ".h{i: j}",
            left: 26,
            nested: true,
            openingCurlyAt: 29,
            closingCurlyAt: 34,
            selectorsStart: 27,
            selectorsEnd: 29,
            selectors: [
              {
                value: ".h",
                selectorStarts: 27,
                selectorEnds: 29,
              },
            ],
            properties: [
              {
                property: "i",
                propertyStarts: 30,
                propertyEnds: 31,
                colon: 31,
                value: "j",
                valueStarts: 33,
                valueEnds: 34,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 30,
                end: 34,
              },
            ],
          },
        ],
      },
      {
        type: "rule",
        start: 36,
        end: 44,
        value: ".k{l: m}",
        left: 35,
        nested: true,
        openingCurlyAt: 38,
        closingCurlyAt: 43,
        selectorsStart: 36,
        selectorsEnd: 38,
        selectors: [
          {
            value: ".k",
            selectorStarts: 36,
            selectorEnds: 38,
          },
        ],
        properties: [
          {
            property: "l",
            propertyStarts: 39,
            propertyEnds: 40,
            colon: 40,
            value: "m",
            valueStarts: 42,
            valueEnds: 43,
            importantStarts: null,
            importantEnds: null,
            important: null,
            semi: null,
            start: 39,
            end: 43,
          },
        ],
      },
      {
        type: "at",
        start: 7,
        end: 45,
        value: "@a b {.c{d: e}@f g {.h{i: j}}.k{l: m}}",
        left: 6,
        nested: false,
        openingCurlyAt: 12,
        closingCurlyAt: 44,
        identifier: "a",
        identifierStartsAt: 8,
        identifierEndsAt: 9,
        query: "b",
        queryStartsAt: 10,
        queryEndsAt: 11,
        rules: [
          {
            type: "rule",
            start: 13,
            end: 21,
            value: ".c{d: e}",
            left: 12,
            nested: true,
            openingCurlyAt: 15,
            closingCurlyAt: 20,
            selectorsStart: 13,
            selectorsEnd: 15,
            selectors: [
              {
                value: ".c",
                selectorStarts: 13,
                selectorEnds: 15,
              },
            ],
            properties: [
              {
                property: "d",
                propertyStarts: 16,
                propertyEnds: 17,
                colon: 17,
                value: "e",
                valueStarts: 19,
                valueEnds: 20,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 16,
                end: 20,
              },
            ],
          },
          {
            type: "at",
            start: 21,
            end: 36,
            value: "@f g {.h{i: j}}",
            left: 20,
            nested: true,
            openingCurlyAt: 26,
            closingCurlyAt: 35,
            identifier: "f",
            identifierStartsAt: 22,
            identifierEndsAt: 23,
            query: "g",
            queryStartsAt: 24,
            queryEndsAt: 25,
            rules: [
              {
                type: "rule",
                start: 27,
                end: 35,
                value: ".h{i: j}",
                left: 26,
                nested: true,
                openingCurlyAt: 29,
                closingCurlyAt: 34,
                selectorsStart: 27,
                selectorsEnd: 29,
                selectors: [
                  {
                    value: ".h",
                    selectorStarts: 27,
                    selectorEnds: 29,
                  },
                ],
                properties: [
                  {
                    property: "i",
                    propertyStarts: 30,
                    propertyEnds: 31,
                    colon: 31,
                    value: "j",
                    valueStarts: 33,
                    valueEnds: 34,
                    importantStarts: null,
                    importantEnds: null,
                    important: null,
                    semi: null,
                    start: 30,
                    end: 34,
                  },
                ],
              },
            ],
          },
          {
            type: "rule",
            start: 36,
            end: 44,
            value: ".k{l: m}",
            left: 35,
            nested: true,
            openingCurlyAt: 38,
            closingCurlyAt: 43,
            selectorsStart: 36,
            selectorsEnd: 38,
            selectors: [
              {
                value: ".k",
                selectorStarts: 36,
                selectorEnds: 38,
              },
            ],
            properties: [
              {
                property: "l",
                propertyStarts: 39,
                propertyEnds: 40,
                colon: 40,
                value: "m",
                valueStarts: 42,
                valueEnds: 43,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 39,
                end: 43,
              },
            ],
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
    ],
    "02.01"
  );
});

//
//
//
//
//
//
//
//
//
//
//
//
// simple
// -----------------------------------------------------------------------------

test(`03 - ${`\u001b[${35}m${`simple`}\u001b[${39}m`} - one rule`, () => {
  let gathered = [];
  ct(
    `<style>
@media (max-width: 600px) {
  .xx[z] {a:1;}
}
</style>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  ok(
    compare(gathered, [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<style>",
      },
      {
        type: "text",
        start: 7,
        end: 8,
        value: "\n",
      },
      {
        type: "rule",
        start: 38,
        end: 51,
        nested: true,
        value: ".xx[z] {a:1;}",
      },
      {
        type: "at",
        start: 8,
        end: 53,
        value: "@media (max-width: 600px) {\n  .xx[z] {a:1;}\n}",
        identifier: "media",
        identifierStartsAt: 9,
        identifierEndsAt: 14,
        query: "(max-width: 600px)",
        queryStartsAt: 15,
        queryEndsAt: 33,
        openingCurlyAt: 34,
        closingCurlyAt: 52,
        rules: [
          {
            type: "text",
            start: 35,
            end: 38,
            value: "\n  ",
          },
          {
            type: "rule",
            start: 38,
            end: 51,
            openingCurlyAt: 45,
            closingCurlyAt: 50,
            selectorsStart: 38,
            selectorsEnd: 44,
            selectors: [
              {
                value: ".xx[z]",
                selectorStarts: 38,
                selectorEnds: 44,
              },
            ],
          },
          {
            type: "text",
            start: 51,
            end: 52,
            value: "\n",
          },
        ],
      },
      {
        type: "text",
        start: 53,
        end: 54,
        value: "\n",
      },
      {
        type: "tag",
        start: 54,
        end: 62,
        value: "</style>",
      },
    ]),
    "03.01"
  );
});

test(`04 - ${`\u001b[${35}m${`simple`}\u001b[${39}m`} - rule is nonsense`, () => {
  let gathered = [];
  ct(
    `<style>
@media (max-width: 600px) {
  zzz
}
</style>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  ok(
    compare(gathered, [
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
        start: 38,
        end: 41,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectors: [
          {
            value: "zzz",
            selectorStarts: 38,
            selectorEnds: 41,
          },
        ],
      },
      {
        type: "at",
        start: 8,
        end: 43,
        identifier: "media",
        identifierStartsAt: 9,
        identifierEndsAt: 14,
        query: "(max-width: 600px)",
        queryStartsAt: 15,
        queryEndsAt: 33,
        openingCurlyAt: 34,
        closingCurlyAt: 42,
        rules: [
          {
            type: "text",
            start: 35,
            end: 38,
          },
          {
            type: "rule",
            start: 38,
            end: 41,
            selectors: [
              {
                value: "zzz",
                selectorStarts: 38,
                selectorEnds: 41,
              },
            ],
          },
          {
            type: "text",
            start: 41,
            end: 42,
          },
        ],
      },
      {
        type: "text",
        start: 43,
        end: 44,
      },
      {
        type: "tag",
        start: 44,
        end: 52,
      },
    ]),
    "04.01"
  );
});

test.run();
