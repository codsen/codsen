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

tap.test(`03 - no semi - with px`, (t) => {
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

tap.test(`04 - with semi - with px`, (t) => {
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
            attribClosingQuoteAt: 29,
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
                valueEnds: 28,
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
            attribEnds: 30,
            attribLeft: 3,
          },
        ],
      },
    ],
    "04"
  );
  t.end();
});

tap.test(`05 - sneaky, first text then ESP - no semi`, (t) => {
  const gathered = [];
  const input = '<div style="width: 100{{ w }}">';
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
        value: '<div style="width: 100{{ w }}">',
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
            attribClosingQuoteAt: 29,
            attribValueRaw: "width: 100{{ w }}",
            attribValue: [
              {
                start: 12,
                end: 29,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "text",
                    start: 19,
                    end: 22,
                    value: "100",
                  },
                  {
                    type: "esp",
                    start: 22,
                    end: 29,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 22,
                    headEndsAt: 24,
                    tail: "}}",
                    tailStartsAt: 27,
                    tailEndsAt: 29,
                  },
                ],
                valueStarts: 19,
                valueEnds: 29,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 29,
            attribStarts: 5,
            attribEnds: 30,
            attribLeft: 3,
          },
        ],
      },
    ],
    "05"
  );
  t.end();
});

tap.test(`06 - sneaky, first text then ESP - with semi`, (t) => {
  const gathered = [];
  const input = '<div style="width: 100{{ w }};">';
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
        end: 32,
        value: '<div style="width: 100{{ w }};">',
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
            attribClosingQuoteAt: 30,
            attribValueRaw: "width: 100{{ w }};",
            attribValue: [
              {
                start: 12,
                end: 30,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "text",
                    start: 19,
                    end: 22,
                    value: "100",
                  },
                  {
                    type: "esp",
                    start: 22,
                    end: 29,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 22,
                    headEndsAt: 24,
                    tail: "}}",
                    tailStartsAt: 27,
                    tailEndsAt: 29,
                  },
                ],
                valueStarts: 19,
                valueEnds: 29,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 29,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
            attribLeft: 3,
          },
        ],
      },
    ],
    "06"
  );
  t.end();
});

tap.test(`07 - sandwiched, first text then ESP - no semi`, (t) => {
  const gathered = [];
  const input = '<div style="width: 1{{ w }}0px">';
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
        end: 32,
        value: '<div style="width: 1{{ w }}0px">',
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
            attribClosingQuoteAt: 30,
            attribValueRaw: "width: 1{{ w }}0px",
            attribValue: [
              {
                start: 12,
                end: 30,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "text",
                    start: 19,
                    end: 20,
                    value: "1",
                  },
                  {
                    type: "esp",
                    start: 20,
                    end: 27,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 20,
                    headEndsAt: 22,
                    tail: "}}",
                    tailStartsAt: 25,
                    tailEndsAt: 27,
                  },
                  {
                    type: "text",
                    start: 27,
                    end: 30,
                    value: "0px",
                  },
                ],
                valueStarts: 19,
                valueEnds: 30,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 30,
            attribStarts: 5,
            attribEnds: 31,
            attribLeft: 3,
          },
        ],
      },
    ],
    "07"
  );
  t.end();
});

tap.test(`08 - sandwiched, first text then ESP - with semi`, (t) => {
  const gathered = [];
  const input = '<div style="width: 1{{ w }}0px;">';
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
        end: 33,
        value: '<div style="width: 1{{ w }}0px;">',
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
            attribClosingQuoteAt: 31,
            attribValueRaw: "width: 1{{ w }}0px;",
            attribValue: [
              {
                start: 12,
                end: 31,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "text",
                    start: 19,
                    end: 20,
                    value: "1",
                  },
                  {
                    type: "esp",
                    start: 20,
                    end: 27,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 20,
                    headEndsAt: 22,
                    tail: "}}",
                    tailStartsAt: 25,
                    tailEndsAt: 27,
                  },
                  {
                    type: "text",
                    start: 27,
                    end: 30,
                    value: "0px",
                  },
                ],
                valueStarts: 19,
                valueEnds: 30,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 30,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 31,
            attribStarts: 5,
            attribEnds: 32,
            attribLeft: 3,
          },
        ],
      },
    ],
    "08"
  );
  t.end();
});

tap.test(`09 - multiple, sandwiched, first text then ESP - no semi`, (t) => {
  const gathered = [];
  const input = '<div style="width: 1{{ w }}0p{{ XorT }}">';
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
        end: 41,
        value: '<div style="width: 1{{ w }}0p{{ XorT }}">',
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
            attribClosingQuoteAt: 39,
            attribValueRaw: "width: 1{{ w }}0p{{ XorT }}",
            attribValue: [
              {
                start: 12,
                end: 39,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "text",
                    start: 19,
                    end: 20,
                    value: "1",
                  },
                  {
                    type: "esp",
                    start: 20,
                    end: 27,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 20,
                    headEndsAt: 22,
                    tail: "}}",
                    tailStartsAt: 25,
                    tailEndsAt: 27,
                  },
                  {
                    type: "text",
                    start: 27,
                    end: 29,
                    value: "0p",
                  },
                  {
                    type: "esp",
                    start: 29,
                    end: 39,
                    value: "{{ XorT }}",
                    head: "{{",
                    headStartsAt: 29,
                    headEndsAt: 31,
                    tail: "}}",
                    tailStartsAt: 37,
                    tailEndsAt: 39,
                  },
                ],
                valueStarts: 19,
                valueEnds: 39,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 39,
            attribStarts: 5,
            attribEnds: 40,
            attribLeft: 3,
          },
        ],
      },
    ],
    "09"
  );
  t.end();
});

tap.test(`10 - multiple, sandwiched, first text then ESP - with semi`, (t) => {
  const gathered = [];
  const input = '<div style="width: 1{{ w }}0p{{ XorT }};">';
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
        end: 42,
        value: '<div style="width: 1{{ w }}0p{{ XorT }};">',
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
            attribClosingQuoteAt: 40,
            attribValueRaw: "width: 1{{ w }}0p{{ XorT }};",
            attribValue: [
              {
                start: 12,
                end: 40,
                property: "width",
                propertyStarts: 12,
                propertyEnds: 17,
                value: [
                  {
                    type: "text",
                    start: 19,
                    end: 20,
                    value: "1",
                  },
                  {
                    type: "esp",
                    start: 20,
                    end: 27,
                    value: "{{ w }}",
                    head: "{{",
                    headStartsAt: 20,
                    headEndsAt: 22,
                    tail: "}}",
                    tailStartsAt: 25,
                    tailEndsAt: 27,
                  },
                  {
                    type: "text",
                    start: 27,
                    end: 29,
                    value: "0p",
                  },
                  {
                    type: "esp",
                    start: 29,
                    end: 39,
                    value: "{{ XorT }}",
                    head: "{{",
                    headStartsAt: 29,
                    headEndsAt: 31,
                    tail: "}}",
                    tailStartsAt: 37,
                    tailEndsAt: 39,
                  },
                ],
                valueStarts: 19,
                valueEnds: 39,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 39,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 40,
            attribStarts: 5,
            attribEnds: 41,
            attribLeft: 3,
          },
        ],
      },
    ],
    "10"
  );
  t.end();
});

tap.test(`11 - chain`, (t) => {
  const gathered = [];
  const input = '<div style="x: a{{ b }}c{{ d }}e;">';
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
        end: 35,
        value: '<div style="x: a{{ b }}c{{ d }}e;">',
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
            attribClosingQuoteAt: 33,
            attribValueRaw: "x: a{{ b }}c{{ d }}e;",
            attribValue: [
              {
                start: 12,
                end: 33,
                property: "x",
                propertyStarts: 12,
                propertyEnds: 13,
                value: [
                  {
                    type: "text",
                    start: 15,
                    end: 16,
                    value: "a",
                  },
                  {
                    type: "esp",
                    start: 16,
                    end: 23,
                    value: "{{ b }}",
                    head: "{{",
                    headStartsAt: 16,
                    headEndsAt: 18,
                    tail: "}}",
                    tailStartsAt: 21,
                    tailEndsAt: 23,
                  },
                  {
                    type: "text",
                    start: 23,
                    end: 24,
                    value: "c",
                  },
                  {
                    type: "esp",
                    start: 24,
                    end: 31,
                    value: "{{ d }}",
                    head: "{{",
                    headStartsAt: 24,
                    headEndsAt: 26,
                    tail: "}}",
                    tailStartsAt: 29,
                    tailEndsAt: 31,
                  },
                  {
                    type: "text",
                    start: 31,
                    end: 32,
                    value: "e",
                  },
                ],
                valueStarts: 15,
                valueEnds: 32,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 13,
                semi: 32,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 33,
            attribStarts: 5,
            attribEnds: 34,
            attribLeft: 3,
          },
        ],
      },
    ],
    "11"
  );
  t.end();
});

// TODO: multiple ESP + string
// TODO: !important
// TODO: broken ESP, only closing tails, missing opening
