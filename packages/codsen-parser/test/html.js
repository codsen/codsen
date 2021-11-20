import tap from "tap";
import { cparser } from "../dist/codsen-parser.esm.js";

// 01. basics
// -----------------------------------------------------------------------------

tap.test("01 - basics - two tags", (t) => {
  t.hasStrict(
    cparser("<div><div>"),
    [
      {
        type: "tag",
        tagName: "div",
        start: 0,
        end: 5,
        children: [
          {
            type: "tag",
            tagName: "div",
            start: 5,
            end: 10,
            children: [],
          },
        ],
      },
    ],
    "01"
  );
  t.end();
});

tap.test("02 - basics - text and tag", (t) => {
  t.hasStrict(
    cparser("z<div>"),
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "tag",
        tagName: "div",
        start: 1,
        end: 6,
        children: [],
      },
    ],
    "02"
  );
  t.end();
});

tap.test("03 - basics - tag text tag", (t) => {
  t.hasStrict(
    cparser("<div>a<div>"),
    [
      {
        type: "tag",
        tagName: "div",
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
          },
          {
            type: "tag",
            tagName: "div",
            start: 6,
            end: 11,
            children: [],
          },
        ],
      },
    ],
    "03"
  );
  t.end();
});

tap.test("04 - basics - two div pairs", (t) => {
  t.hasStrict(
    cparser("<div>a</div><div>b</div>"),
    [
      {
        type: "tag",
        tagName: "div",
        closing: false,
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
          },
        ],
      },
      {
        type: "tag",
        tagName: "div",
        closing: true,
        start: 6,
        end: 12,
        children: [],
      },
      {
        type: "tag",
        tagName: "div",
        closing: false,
        start: 12,
        end: 17,
        children: [
          {
            type: "text",
            start: 17,
            end: 18,
          },
        ],
      },
      {
        type: "tag",
        tagName: "div",
        closing: true,
        start: 18,
        end: 24,
        children: [],
      },
    ],
    "04"
  );
  t.end();
});

tap.test("05 - basics - mixed combo", (t) => {
  t.hasStrict(
    cparser("<br>z</a>"),
    [
      {
        type: "tag",
        tagName: "br",
        closing: false,
        start: 0,
        end: 4,
        children: [],
      },
      {
        type: "text",
        start: 4,
        end: 5,
      },
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 5,
        end: 9,
        children: [],
      },
    ],
    "05"
  );
  t.end();
});

tap.test("06 - basics - two nested pairs", (t) => {
  t.hasStrict(
    cparser("<div>1<a>2</a>3</div>"),
    [
      {
        type: "tag",
        tagName: "div",
        closing: false,
        start: 0,
        end: 5,
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
          },
          {
            type: "tag",
            tagName: "a",
            closing: false,
            start: 6,
            end: 9,
            children: [
              {
                type: "text",
                start: 9,
                end: 10,
              },
            ],
          },
          {
            type: "tag",
            tagName: "a",
            closing: true,
            start: 10,
            end: 14,
            children: [],
          },
          {
            type: "text",
            start: 14,
            end: 15,
          },
        ],
      },
      {
        type: "tag",
        tagName: "div",
        closing: true,
        start: 15,
        end: 21,
        children: [],
      },
    ],
    "06"
  );
  t.end();
});

tap.test("07 - basics - three nested pairs, empty", (t) => {
  t.hasStrict(
    cparser("<table><tr><td></td></tr></table>"),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 6,
        tagName: "table",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,

        kind: null,
        attribs: [],
        children: [
          {
            type: "tag",
            start: 7,
            end: 11,
            value: "<tr>",
            tagNameStartsAt: 8,
            tagNameEndsAt: 10,
            tagName: "tr",
            recognised: true,
            closing: false,
            void: false,
            pureHTML: true,

            kind: null,
            attribs: [],
            children: [
              {
                type: "tag",
                start: 11,
                end: 15,
                value: "<td>",
                tagNameStartsAt: 12,
                tagNameEndsAt: 14,
                tagName: "td",
                recognised: true,
                closing: false,
                void: false,
                pureHTML: true,

                kind: null,
                attribs: [],
                children: [],
              },
              {
                type: "tag",
                start: 15,
                end: 20,
                value: "</td>",
                tagNameStartsAt: 17,
                tagNameEndsAt: 19,
                tagName: "td",
                recognised: true,
                closing: true,
                void: false,
                pureHTML: true,

                kind: null,
                attribs: [],
                children: [],
              },
            ],
          },
          {
            type: "tag",
            start: 20,
            end: 25,
            value: "</tr>",
            tagNameStartsAt: 22,
            tagNameEndsAt: 24,
            tagName: "tr",
            recognised: true,
            closing: true,
            void: false,
            pureHTML: true,

            kind: null,
            attribs: [],
            children: [],
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
        value: "</table>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 32,
        tagName: "table",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,

        kind: null,
        attribs: [],
        children: [],
      },
    ],
    "07"
  );
  t.end();
});

tap.test(
  "08 - basics - single text node is not nested after closing tag",
  (t) => {
    t.hasStrict(
      cparser(`<td>
<table></table>
</td>`),
      [
        {
          type: "tag",
          start: 0,
          end: 4,
          value: "<td>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "td",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
          children: [
            {
              type: "text",
              start: 4,
              end: 5,
              value: "\n",
            },
            {
              type: "tag",
              start: 5,
              end: 12,
              value: "<table>",
              tagNameStartsAt: 6,
              tagNameEndsAt: 11,
              tagName: "table",
              recognised: true,
              closing: false,
              void: false,
              pureHTML: true,
              kind: null,
              attribs: [],
              children: [],
            },
            {
              type: "tag",
              start: 12,
              end: 20,
              value: "</table>",
              tagNameStartsAt: 14,
              tagNameEndsAt: 19,
              tagName: "table",
              recognised: true,
              closing: true,
              void: false,
              pureHTML: true,
              kind: null,
              attribs: [],
              children: [],
            },
            {
              type: "text",
              start: 20,
              end: 21,
              value: "\n",
            },
          ],
        },
        {
          type: "tag",
          start: 21,
          end: 26,
          value: "</td>",
          tagNameStartsAt: 23,
          tagNameEndsAt: 25,
          tagName: "td",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
          children: [],
        },
      ],
      "08"
    );
    t.end();
  }
);
