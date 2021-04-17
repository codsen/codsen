/* eslint no-template-curly-in-string:0 */

import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

tap.test(`01 - no semi - no px`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}">';
  ct(input, {
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
        end: 28,
        value: '<div style="width: {{ w }}">',
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
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 26,
            attribValueRaw: "width: {{ w }}",
            attribValue: [
              {
                start: 12,
                end: 26,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "esp",
                    start: 19,
                    end: 26,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 19,
                    headEndsAt: 21,
                    tail: "}}",
                    tailStartsAt: 24,
                    tailEndsAt: 26,
                  },
                ],
                valueStarts: 19,
                valueEnds: 26,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 26,
            attribStarts: 5,
            attribEnds: 27,
            attribLeft: 3,
          },
        ],
      },
    ],
    "01"
  );
  t.end();
});

tap.test(`02 - with semi - no px`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }};">';
  ct(input, {
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
        end: 29,
        value: '<div style="width: {{ w }};">',
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
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 27,
            attribValueRaw: "width: {{ w }};",
            attribValue: [
              {
                start: 12,
                end: 27,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "esp",
                    start: 19,
                    end: 26,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 19,
                    headEndsAt: 21,
                    tail: "}}",
                    tailStartsAt: 24,
                    tailEndsAt: 26,
                  },
                ],
                valueStarts: 19,
                valueEnds: 26,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 26,
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
    ],
    "02"
  );
  t.end();
});

tap.todo(`03 - no semi - with px`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}px">';
  ct(input, {
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
        end: 30,
        value: '<div style="width: {{ w }}px">',
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
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 28,
            attribValueRaw: "width: {{ w }}px",
            attribValue: [
              {
                start: 12,
                end: 28,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "esp",
                    start: 19,
                    end: 26,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 19,
                    headEndsAt: 21,
                    tail: "}}",
                    tailStartsAt: 24,
                    tailEndsAt: 26,
                  },
                  {
                    type: "text",
                    start: 26,
                    end: 28,
                    value: "px",
                  },
                ],
                valueStarts: 19,
                valueEnds: 28,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 28,
            attribStarts: 5,
            attribEnds: 29,
            attribLeft: 3,
          },
        ],
      },
    ],
    "03"
  );
  t.end();
});

tap.todo(`04 - with semi - with px`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}px;">';
  ct(input, {
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
        end: 31,
        value: '<div style="width: {{ w }}px;">',
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
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 28,
            attribValueRaw: "width: {{ w }}px",
            attribValue: [
              {
                start: 12,
                end: 29,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "esp",
                    start: 19,
                    end: 26,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 19,
                    headEndsAt: 21,
                    tail: "}}",
                    tailStartsAt: 24,
                    tailEndsAt: 26,
                  },
                  {
                    type: "text",
                    start: 26,
                    end: 28,
                    value: "px",
                  },
                ],
                valueStarts: 19,
                valueEnds: 29,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 28,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 29,
            attribStarts: 5,
            attribEnds: 29,
            attribLeft: 3,
          },
        ],
      },
    ],
    "04"
  );
  t.end();
});

// TODO: multiple ESP + string
// TODO: !important
// TODO: broken ESP, only closing tails, missing opening
