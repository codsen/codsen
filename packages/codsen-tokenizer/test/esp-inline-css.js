/* eslint no-template-curly-in-string:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

test("01 - no semi - no px", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
  ]);
});

test("02 - no semi - no px, with important", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}!important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 38,
      value: '<div style="width: {{ w }}!important">',
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
          attribClosingQuoteAt: 36,
          attribValueRaw: "width: {{ w }}!important",
          attribValue: [
            {
              start: 12,
              end: 36,
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
              important: "!important",
              importantStarts: 26,
              importantEnds: 36,
              colon: 17,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 36,
          attribStarts: 5,
          attribEnds: 37,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("03 - no semi - no px, with broken important", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 37,
      value: '<div style="width: {{ w }}important">',
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
          attribClosingQuoteAt: 35,
          attribValueRaw: "width: {{ w }}important",
          attribValue: [
            {
              start: 12,
              end: 35,
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
              important: "important",
              importantStarts: 26,
              importantEnds: 35,
              colon: 17,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 35,
          attribStarts: 5,
          attribEnds: 36,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("04 - with semi - no px", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }};">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
  ]);
});

test("05 - with semi - no px - important", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}!important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 39,
      value: '<div style="width: {{ w }}!important;">',
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
          attribClosingQuoteAt: 37,
          attribValueRaw: "width: {{ w }}!important;",
          attribValue: [
            {
              start: 12,
              end: 37,
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
              important: "!important",
              importantStarts: 26,
              importantEnds: 36,
              colon: 17,
              semi: 36,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 37,
          attribStarts: 5,
          attribEnds: 38,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("06 - no semi - with px", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}px">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
  ]);
});

test("07 - no semi - with px - important", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}px !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 41,
      value: '<div style="width: {{ w }}px !important">',
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
          attribValueRaw: "width: {{ w }}px !important",
          attribValue: [
            {
              start: 12,
              end: 39,
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
              important: "!important",
              importantStarts: 29,
              importantEnds: 39,
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
  ]);
});

test("08 - with semi - with px", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}px;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
          attribValueRaw: "width: {{ w }}px;",
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
  ]);
});

test("09 - with semi - with px - tight important", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}px!important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 41,
      value: '<div style="width: {{ w }}px!important;">',
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
          attribValueRaw: "width: {{ w }}px!important;",
          attribValue: [
            {
              start: 12,
              end: 39,
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
              important: "!important",
              importantStarts: 28,
              importantEnds: 38,
              colon: 17,
              semi: 38,
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
  ]);
});

test("10 - with semi - with px - spaced important", () => {
  let gathered = [];
  let input = '<div style="width: {{ w }}px !important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 42,
      value: '<div style="width: {{ w }}px !important;">',
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
          attribValueRaw: "width: {{ w }}px !important;",
          attribValue: [
            {
              start: 12,
              end: 40,
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
              important: "!important",
              importantStarts: 29,
              importantEnds: 39,
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
  ]);
});

test("11 - sneaky, first text then ESP - no semi", () => {
  let gathered = [];
  let input = '<div style="width: 100{{ w }}">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
              end: 22,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "100",
              valueStarts: 19,
              valueEnds: 22,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
          attribValueStartsAt: 12,
          attribValueEndsAt: 29,
          attribStarts: 5,
          attribEnds: 30,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("12 - sneaky, first text then ESP - no semi - tight important", () => {
  let gathered = [];
  let input = '<div style="width: 100{{ w }}!important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 41,
      value: '<div style="width: 100{{ w }}!important">',
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
          attribValueRaw: "width: 100{{ w }}!important",
          attribValue: [
            {
              start: 12,
              end: 22,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "100",
              valueStarts: 19,
              valueEnds: 22,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
            {
              start: 29,
              end: 39,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 29,
              importantEnds: 39,
              colon: null,
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
  ]);
});

test("13 - sneaky, first text then ESP - no semi - spaced important", () => {
  let gathered = [];
  let input = '<div style="width: 100{{ w }} !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 42,
      value: '<div style="width: 100{{ w }} !important">',
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
          attribValueRaw: "width: 100{{ w }} !important",
          attribValue: [
            {
              start: 12,
              end: 22,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "100",
              valueStarts: 19,
              valueEnds: 22,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
            {
              type: "text",
              start: 29,
              end: 30,
              value: " ",
            },
            {
              start: 30,
              end: 40,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 30,
              importantEnds: 40,
              colon: null,
              semi: null,
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
  ]);
});

test("14 - sneaky, first text then ESP - with semi", () => {
  let gathered = [];
  let input = '<div style="width: 100{{ w }};">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
              end: 22,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "100",
              valueStarts: 19,
              valueEnds: 22,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
            {
              start: 29,
              end: 30,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
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
  ]);
});

test("15 - sneaky, first text then ESP - with semi, important", () => {
  let gathered = [];
  let input = '<div style="width: 100{{ w }}!important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 42,
      value: '<div style="width: 100{{ w }}!important;">',
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
          attribValueRaw: "width: 100{{ w }}!important;",
          attribValue: [
            {
              start: 12,
              end: 22,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "100",
              valueStarts: 19,
              valueEnds: 22,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
            {
              start: 29,
              end: 40,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 29,
              importantEnds: 39,
              colon: null,
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
  ]);
});

test("16 - sandwiched, first text then ESP - no semi", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0px">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 30,
              property: "0px",
              propertyStarts: 27,
              propertyEnds: 30,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
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
  ]);
});

test("17 - sandwiched, first text then ESP - no semi, with important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0px!important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 42,
      value: '<div style="width: 1{{ w }}0px!important">',
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
          attribValueRaw: "width: 1{{ w }}0px!important",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 40,
              property: "0px",
              propertyStarts: 27,
              propertyEnds: 30,
              value: "",
              valueStarts: 31,
              valueEnds: 31,
              important: "important",
              importantStarts: 31,
              importantEnds: 40,
              colon: 30,
              semi: null,
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
  ]);
});

test("18 - sandwiched, first text then ESP - with semi", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0px;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 31,
              property: "0px",
              propertyStarts: 27,
              propertyEnds: 30,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
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
  ]);
});

test("19 - sandwiched, first text then ESP - with semi, with tight important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0px!important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 43,
      value: '<div style="width: 1{{ w }}0px!important;">',
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
          attribClosingQuoteAt: 41,
          attribValueRaw: "width: 1{{ w }}0px!important;",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 41,
              property: "0px",
              propertyStarts: 27,
              propertyEnds: 30,
              value: "",
              valueStarts: 31,
              valueEnds: 31,
              important: "important",
              importantStarts: 31,
              importantEnds: 40,
              colon: 30,
              semi: 40,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 41,
          attribStarts: 5,
          attribEnds: 42,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("20 - sandwiched, first text then ESP - with semi, with spaced important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0px!important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 43,
      value: '<div style="width: 1{{ w }}0px!important;">',
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
          attribClosingQuoteAt: 41,
          attribValueRaw: "width: 1{{ w }}0px!important;",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 41,
              property: "0px",
              propertyStarts: 27,
              propertyEnds: 30,
              value: "",
              valueStarts: 31,
              valueEnds: 31,
              important: "important",
              importantStarts: 31,
              importantEnds: 40,
              colon: 30,
              semi: 40,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 41,
          attribStarts: 5,
          attribEnds: 42,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("21 - multiple, sandwiched, first text then ESP - no semi", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }}">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
          attribValueStartsAt: 12,
          attribValueEndsAt: 39,
          attribStarts: 5,
          attribEnds: 40,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("22 - multiple, sandwiched, first text then ESP - no semi, tight important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }}!important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 51,
      value: '<div style="width: 1{{ w }}0p{{ XorT }}!important">',
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
          attribClosingQuoteAt: 49,
          attribValueRaw: "width: 1{{ w }}0p{{ XorT }}!important",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              start: 39,
              end: 49,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 39,
              importantEnds: 49,
              colon: null,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 49,
          attribStarts: 5,
          attribEnds: 50,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("23 - multiple, sandwiched, first text then ESP - no semi, spaced important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }} !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 52,
      value: '<div style="width: 1{{ w }}0p{{ XorT }} !important">',
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
          attribClosingQuoteAt: 50,
          attribValueRaw: "width: 1{{ w }}0p{{ XorT }} !important",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              type: "text",
              start: 39,
              end: 40,
              value: " ",
            },
            {
              start: 40,
              end: 50,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 40,
              importantEnds: 50,
              colon: null,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 50,
          attribStarts: 5,
          attribEnds: 51,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("24 - multiple, sandwiched, first text then ESP - no semi, excessively spaced important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }}   !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 54,
      value: '<div style="width: 1{{ w }}0p{{ XorT }}   !important">',
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
          attribClosingQuoteAt: 52,
          attribValueRaw: "width: 1{{ w }}0p{{ XorT }}   !important",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              type: "text",
              start: 39,
              end: 42,
              value: "   ",
            },
            {
              start: 42,
              end: 52,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 42,
              importantEnds: 52,
              colon: null,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 52,
          attribStarts: 5,
          attribEnds: 53,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("25 - multiple, sandwiched, first text then ESP - with semi", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }};">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              start: 39,
              end: 40,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
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
  ]);
});

test("26 - multiple, sandwiched, first text then ESP - with semi and tight important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }}!important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 52,
      value: '<div style="width: 1{{ w }}0p{{ XorT }}!important;">',
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
          attribClosingQuoteAt: 50,
          attribValueRaw: "width: 1{{ w }}0p{{ XorT }}!important;",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              start: 39,
              end: 50,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 39,
              importantEnds: 49,
              colon: null,
              semi: 49,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 50,
          attribStarts: 5,
          attribEnds: 51,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("27 - multiple, sandwiched, first text then ESP - with semi and spaced important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }} !important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 53,
      value: '<div style="width: 1{{ w }}0p{{ XorT }} !important;">',
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
          attribClosingQuoteAt: 51,
          attribValueRaw: "width: 1{{ w }}0p{{ XorT }} !important;",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              type: "text",
              start: 39,
              end: 40,
              value: " ",
            },
            {
              start: 40,
              end: 51,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 40,
              importantEnds: 50,
              colon: null,
              semi: 50,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 51,
          attribStarts: 5,
          attribEnds: 52,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("28 - multiple, sandwiched, first text then ESP - with semi and excessively spaced important", () => {
  let gathered = [];
  let input = '<div style="width: 1{{ w }}0p{{ XorT }}    !important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 56,
      value: '<div style="width: 1{{ w }}0p{{ XorT }}    !important;">',
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
          attribClosingQuoteAt: 54,
          attribValueRaw: "width: 1{{ w }}0p{{ XorT }}    !important;",
          attribValue: [
            {
              start: 12,
              end: 20,
              property: "width",
              propertyStarts: 12,
              propertyEnds: 17,
              value: "1",
              valueStarts: 19,
              valueEnds: 20,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 17,
              semi: null,
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
              start: 27,
              end: 29,
              property: "0p",
              propertyStarts: 27,
              propertyEnds: 29,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
            {
              type: "text",
              start: 39,
              end: 43,
              value: "    ",
            },
            {
              start: 43,
              end: 54,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 43,
              importantEnds: 53,
              colon: null,
              semi: 53,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 54,
          attribStarts: 5,
          attribEnds: 55,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("29 - chain", () => {
  let gathered = [];
  let input = '<div style="x: a{{ b }}c{{ d }}e;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
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
              end: 16,
              property: "x",
              propertyStarts: 12,
              propertyEnds: 13,
              value: "a",
              valueStarts: 15,
              valueEnds: 16,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 13,
              semi: null,
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
              start: 23,
              end: 24,
              property: "c",
              propertyStarts: 23,
              propertyEnds: 24,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
              semi: null,
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
              start: 31,
              end: 33,
              property: "e",
              propertyStarts: 31,
              propertyEnds: 32,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: null,
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
  ]);
});

test("30 - spaced chain, text-ESP, no important", () => {
  let gathered = [];
  let input = '<div style="padding: 1px {{ r }}">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 34,
      value: '<div style="padding: 1px {{ r }}">',
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
          attribClosingQuoteAt: 32,
          attribValueRaw: "padding: 1px {{ r }}",
          attribValue: [
            {
              start: 12,
              end: 24,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: "1px",
              valueStarts: 21,
              valueEnds: 24,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 19,
              semi: null,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: " ",
            },
            {
              type: "esp",
              start: 25,
              end: 32,
              value: "{{ r }}",
              head: "{{",
              headStartsAt: 25,
              headEndsAt: 27,
              tail: "}}",
              tailStartsAt: 30,
              tailEndsAt: 32,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 32,
          attribStarts: 5,
          attribEnds: 33,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("31 - spaced chain, text-ESP, with important", () => {
  let gathered = [];
  let input = '<div style="padding: 1px {{ r }} !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 45,
      value: '<div style="padding: 1px {{ r }} !important">',
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
          attribClosingQuoteAt: 43,
          attribValueRaw: "padding: 1px {{ r }} !important",
          attribValue: [
            {
              start: 12,
              end: 24,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: "1px",
              valueStarts: 21,
              valueEnds: 24,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 19,
              semi: null,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: " ",
            },
            {
              type: "esp",
              start: 25,
              end: 32,
              value: "{{ r }}",
              head: "{{",
              headStartsAt: 25,
              headEndsAt: 27,
              tail: "}}",
              tailStartsAt: 30,
              tailEndsAt: 32,
            },
            {
              type: "text",
              start: 32,
              end: 33,
              value: " ",
            },
            {
              start: 33,
              end: 43,
              property: null,
              propertyStarts: null,
              propertyEnds: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              important: "!important",
              importantStarts: 33,
              importantEnds: 43,
              colon: null,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 43,
          attribStarts: 5,
          attribEnds: 44,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("32 - spaced chain", () => {
  let gathered = [];
  let input = '<div style="padding: {{ t }} {{ r }} {{ b }} {{ l }}">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 54,
      value: '<div style="padding: {{ t }} {{ r }} {{ b }} {{ l }}">',
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
          attribClosingQuoteAt: 52,
          attribValueRaw: "padding: {{ t }} {{ r }} {{ b }} {{ l }}",
          attribValue: [
            {
              start: 12,
              end: 52,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 21,
                  end: 28,
                  value: "{{ t }}",
                  head: "{{",
                  headStartsAt: 21,
                  headEndsAt: 23,
                  tail: "}}",
                  tailStartsAt: 26,
                  tailEndsAt: 28,
                },
                {
                  type: "text",
                  start: 28,
                  end: 29,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 29,
                  end: 36,
                  value: "{{ r }}",
                  head: "{{",
                  headStartsAt: 29,
                  headEndsAt: 31,
                  tail: "}}",
                  tailStartsAt: 34,
                  tailEndsAt: 36,
                },
                {
                  type: "text",
                  start: 36,
                  end: 37,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 37,
                  end: 44,
                  value: "{{ b }}",
                  head: "{{",
                  headStartsAt: 37,
                  headEndsAt: 39,
                  tail: "}}",
                  tailStartsAt: 42,
                  tailEndsAt: 44,
                },
                {
                  type: "text",
                  start: 44,
                  end: 45,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 45,
                  end: 52,
                  value: "{{ l }}",
                  head: "{{",
                  headStartsAt: 45,
                  headEndsAt: 47,
                  tail: "}}",
                  tailStartsAt: 50,
                  tailEndsAt: 52,
                },
              ],
              valueStarts: 21,
              valueEnds: 52,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 19,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 52,
          attribStarts: 5,
          attribEnds: 53,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("33 - spaced chain", () => {
  let gathered = [];
  let input =
    '<div style="padding: {{ t }} {{ r }} {{ b }} {{ l }} !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 65,
      value:
        '<div style="padding: {{ t }} {{ r }} {{ b }} {{ l }} !important">',
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
          attribClosingQuoteAt: 63,
          attribValueRaw: "padding: {{ t }} {{ r }} {{ b }} {{ l }} !important",
          attribValue: [
            {
              start: 12,
              end: 63,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 21,
                  end: 28,
                  value: "{{ t }}",
                  head: "{{",
                  headStartsAt: 21,
                  headEndsAt: 23,
                  tail: "}}",
                  tailStartsAt: 26,
                  tailEndsAt: 28,
                },
                {
                  type: "text",
                  start: 28,
                  end: 29,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 29,
                  end: 36,
                  value: "{{ r }}",
                  head: "{{",
                  headStartsAt: 29,
                  headEndsAt: 31,
                  tail: "}}",
                  tailStartsAt: 34,
                  tailEndsAt: 36,
                },
                {
                  type: "text",
                  start: 36,
                  end: 37,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 37,
                  end: 44,
                  value: "{{ b }}",
                  head: "{{",
                  headStartsAt: 37,
                  headEndsAt: 39,
                  tail: "}}",
                  tailStartsAt: 42,
                  tailEndsAt: 44,
                },
                {
                  type: "text",
                  start: 44,
                  end: 45,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 45,
                  end: 52,
                  value: "{{ l }}",
                  head: "{{",
                  headStartsAt: 45,
                  headEndsAt: 47,
                  tail: "}}",
                  tailStartsAt: 50,
                  tailEndsAt: 52,
                },
              ],
              valueStarts: 21,
              valueEnds: 52,
              important: "!important",
              importantStarts: 53,
              importantEnds: 63,
              colon: 19,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 63,
          attribStarts: 5,
          attribEnds: 64,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("34 - spaced chain", () => {
  let gathered = [];
  let input = '<div style="padding: {{ t }} 1px {{ b }} {{ l }} !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 61,
      value: '<div style="padding: {{ t }} 1px {{ b }} {{ l }} !important">',
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
          attribClosingQuoteAt: 59,
          attribValueRaw: "padding: {{ t }} 1px {{ b }} {{ l }} !important",
          attribValue: [
            {
              start: 12,
              end: 59,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 21,
                  end: 28,
                  value: "{{ t }}",
                  head: "{{",
                  headStartsAt: 21,
                  headEndsAt: 23,
                  tail: "}}",
                  tailStartsAt: 26,
                  tailEndsAt: 28,
                },
                {
                  type: "text",
                  start: 28,
                  end: 33,
                  value: " 1px ",
                },
                {
                  type: "esp",
                  start: 33,
                  end: 40,
                  value: "{{ b }}",
                  head: "{{",
                  headStartsAt: 33,
                  headEndsAt: 35,
                  tail: "}}",
                  tailStartsAt: 38,
                  tailEndsAt: 40,
                },
                {
                  type: "text",
                  start: 40,
                  end: 41,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 41,
                  end: 48,
                  value: "{{ l }}",
                  head: "{{",
                  headStartsAt: 41,
                  headEndsAt: 43,
                  tail: "}}",
                  tailStartsAt: 46,
                  tailEndsAt: 48,
                },
              ],
              valueStarts: 21,
              valueEnds: 48,
              important: "!important",
              importantStarts: 49,
              importantEnds: 59,
              colon: 19,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 59,
          attribStarts: 5,
          attribEnds: 60,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("35 - spaced chain", () => {
  let gathered = [];
  let input = '<div style="padding: {{ t }} {{ r }} {{ b }} 1px !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 61,
      value: '<div style="padding: {{ t }} {{ r }} {{ b }} 1px !important">',
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
          attribClosingQuoteAt: 59,
          attribValueRaw: "padding: {{ t }} {{ r }} {{ b }} 1px !important",
          attribValue: [
            {
              start: 12,
              end: 59,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 21,
                  end: 28,
                  value: "{{ t }}",
                  head: "{{",
                  headStartsAt: 21,
                  headEndsAt: 23,
                  tail: "}}",
                  tailStartsAt: 26,
                  tailEndsAt: 28,
                },
                {
                  type: "text",
                  start: 28,
                  end: 29,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 29,
                  end: 36,
                  value: "{{ r }}",
                  head: "{{",
                  headStartsAt: 29,
                  headEndsAt: 31,
                  tail: "}}",
                  tailStartsAt: 34,
                  tailEndsAt: 36,
                },
                {
                  type: "text",
                  start: 36,
                  end: 37,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 37,
                  end: 44,
                  value: "{{ b }}",
                  head: "{{",
                  headStartsAt: 37,
                  headEndsAt: 39,
                  tail: "}}",
                  tailStartsAt: 42,
                  tailEndsAt: 44,
                },
                {
                  type: "text",
                  start: 44,
                  end: 48,
                  value: " 1px",
                },
              ],
              valueStarts: 21,
              valueEnds: 48,
              important: "!important",
              importantStarts: 49,
              importantEnds: 59,
              colon: 19,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 59,
          attribStarts: 5,
          attribEnds: 60,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("36 - spaced chain", () => {
  let gathered = [];
  let input = '<div style="padding: {{ t }} {{ r }} 1px 1px !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 57,
      value: '<div style="padding: {{ t }} {{ r }} 1px 1px !important">',
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
          attribClosingQuoteAt: 55,
          attribValueRaw: "padding: {{ t }} {{ r }} 1px 1px !important",
          attribValue: [
            {
              start: 12,
              end: 55,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 21,
                  end: 28,
                  value: "{{ t }}",
                  head: "{{",
                  headStartsAt: 21,
                  headEndsAt: 23,
                  tail: "}}",
                  tailStartsAt: 26,
                  tailEndsAt: 28,
                },
                {
                  type: "text",
                  start: 28,
                  end: 29,
                  value: " ",
                },
                {
                  type: "esp",
                  start: 29,
                  end: 36,
                  value: "{{ r }}",
                  head: "{{",
                  headStartsAt: 29,
                  headEndsAt: 31,
                  tail: "}}",
                  tailStartsAt: 34,
                  tailEndsAt: 36,
                },
                {
                  type: "text",
                  start: 36,
                  end: 44,
                  value: " 1px 1px",
                },
              ],
              valueStarts: 21,
              valueEnds: 44,
              important: "!important",
              importantStarts: 45,
              importantEnds: 55,
              colon: 19,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 55,
          attribStarts: 5,
          attribEnds: 56,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("37 - two tight esp tokens, with semi", () => {
  let gathered = [];
  let input = '<div style="padding:{{ t }}{{ r }};">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 37,
      value: '<div style="padding:{{ t }}{{ r }};">',
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
          attribClosingQuoteAt: 35,
          attribValueRaw: "padding:{{ t }}{{ r }};",
          attribValue: [
            {
              start: 12,
              end: 35,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 20,
                  end: 27,
                  value: "{{ t }}",
                  head: "{{",
                  headStartsAt: 20,
                  headEndsAt: 22,
                  tail: "}}",
                  tailStartsAt: 25,
                  tailEndsAt: 27,
                },
                {
                  type: "esp",
                  start: 27,
                  end: 34,
                  value: "{{ r }}",
                  head: "{{",
                  headStartsAt: 27,
                  headEndsAt: 29,
                  tail: "}}",
                  tailStartsAt: 32,
                  tailEndsAt: 34,
                },
              ],
              valueStarts: 20,
              valueEnds: 34,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 19,
              semi: 34,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 35,
          attribStarts: 5,
          attribEnds: 36,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("38 - two tight esp tokens", () => {
  let gathered = [];
  let input = '<div style="padding:{{ t }}\t{{ r }}">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 37,
      value: '<div style="padding:{{ t }}\t{{ r }}">',
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
          attribClosingQuoteAt: 35,
          attribValueRaw: "padding:{{ t }}\t{{ r }}",
          attribValue: [
            {
              start: 12,
              end: 35,
              property: "padding",
              propertyStarts: 12,
              propertyEnds: 19,
              value: [
                {
                  type: "esp",
                  start: 20,
                  end: 27,
                  value: "{{ t }}",
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
                  end: 28,
                  value: "\t",
                },
                {
                  type: "esp",
                  start: 28,
                  end: 35,
                  value: "{{ r }}",
                  head: "{{",
                  headStartsAt: 28,
                  headEndsAt: 30,
                  tail: "}}",
                  tailStartsAt: 33,
                  tailEndsAt: 35,
                },
              ],
              valueStarts: 20,
              valueEnds: 35,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 19,
              semi: null,
            },
          ],
          attribValueStartsAt: 12,
          attribValueEndsAt: 35,
          attribStarts: 5,
          attribEnds: 36,
          attribLeft: 3,
        },
      ],
    },
  ]);
});

test("39", () => {
  let gathered = [];
  let input =
    '<td style="color: red;    {% if so %}text-align: left;{% endif %}     float: left;">x</td>';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 84,
      value:
        '<td style="color: red;    {% if so %}text-align: left;{% endif %}     float: left;">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 3,
      tagName: "td",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: null,
      attribs: [
        {
          attribName: "style",
          attribNameRecognised: true,
          attribNameStartsAt: 4,
          attribNameEndsAt: 9,
          attribOpeningQuoteAt: 10,
          attribClosingQuoteAt: 82,
          attribValueRaw:
            "color: red;    {% if so %}text-align: left;{% endif %}     float: left;",
          attribValue: [
            {
              start: 11,
              end: 22,
              property: "color",
              propertyStarts: 11,
              propertyEnds: 16,
              value: "red",
              valueStarts: 18,
              valueEnds: 21,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 16,
              semi: 21,
            },
            {
              type: "text",
              start: 22,
              end: 26,
              value: "    ",
            },
            {
              type: "esp",
              start: 26,
              end: 37,
              value: "{% if so %}",
              head: "{%",
              headStartsAt: 26,
              headEndsAt: 28,
              tail: "%}",
              tailStartsAt: 35,
              tailEndsAt: 37,
            },
            {
              start: 37,
              end: 54,
              property: "text-align",
              propertyStarts: 37,
              propertyEnds: 47,
              value: "left",
              valueStarts: 49,
              valueEnds: 53,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 47,
              semi: 53,
            },
            {
              type: "esp",
              start: 54,
              end: 65,
              value: "{% endif %}",
              head: "{%",
              headStartsAt: 54,
              headEndsAt: 56,
              tail: "%}",
              tailStartsAt: 63,
              tailEndsAt: 65,
            },
            {
              type: "text",
              start: 65,
              end: 70,
              value: "     ",
            },
            {
              start: 70,
              end: 82,
              property: "float",
              propertyStarts: 70,
              propertyEnds: 75,
              value: "left",
              valueStarts: 77,
              valueEnds: 81,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 75,
              semi: 81,
            },
          ],
          attribValueStartsAt: 11,
          attribValueEndsAt: 82,
          attribStarts: 4,
          attribEnds: 83,
          attribLeft: 2,
        },
      ],
    },
    {
      type: "text",
      start: 84,
      end: 85,
      value: "x",
    },
    {
      type: "tag",
      start: 85,
      end: 90,
      value: "</td>",
      tagNameStartsAt: 87,
      tagNameEndsAt: 89,
      tagName: "td",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [],
    },
  ]);
});

test("40 - property without semi wrapped in ESP tokens", () => {
  let gathered = [];
  let input = `<td style="a: b;
    {% if x %}c: d{% endif %}
e: f;">x</td>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 54,
      value: '<td style="a: b;\n    {% if x %}c: d{% endif %}\ne: f;">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 3,
      tagName: "td",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: null,
      attribs: [
        {
          attribName: "style",
          attribNameRecognised: true,
          attribNameStartsAt: 4,
          attribNameEndsAt: 9,
          attribOpeningQuoteAt: 10,
          attribClosingQuoteAt: 52,
          attribValueRaw: "a: b;\n    {% if x %}c: d{% endif %}\ne: f;",
          attribValue: [
            {
              start: 11,
              end: 16,
              property: "a",
              propertyStarts: 11,
              propertyEnds: 12,
              value: "b",
              valueStarts: 14,
              valueEnds: 15,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 12,
              semi: 15,
            },
            {
              type: "text",
              start: 16,
              end: 21,
              value: "\n    ",
            },
            {
              type: "esp",
              start: 21,
              end: 31,
              value: "{% if x %}",
              head: "{%",
              headStartsAt: 21,
              headEndsAt: 23,
              tail: "%}",
              tailStartsAt: 29,
              tailEndsAt: 31,
            },
            {
              start: 31,
              end: 35,
              property: "c",
              propertyStarts: 31,
              propertyEnds: 32,
              value: "d",
              valueStarts: 34,
              valueEnds: 35,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 32,
              semi: null,
            },
            {
              type: "esp",
              start: 35,
              end: 46,
              value: "{% endif %}",
              head: "{%",
              headStartsAt: 35,
              headEndsAt: 37,
              tail: "%}",
              tailStartsAt: 44,
              tailEndsAt: 46,
            },
            {
              type: "text",
              start: 46,
              end: 47,
              value: "\n",
            },
            {
              start: 47,
              end: 52,
              property: "e",
              propertyStarts: 47,
              propertyEnds: 48,
              value: "f",
              valueStarts: 50,
              valueEnds: 51,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 48,
              semi: 51,
            },
          ],
          attribValueStartsAt: 11,
          attribValueEndsAt: 52,
          attribStarts: 4,
          attribEnds: 53,
          attribLeft: 2,
        },
      ],
    },
    {
      type: "text",
      start: 54,
      end: 55,
      value: "x",
    },
    {
      type: "tag",
      start: 55,
      end: 60,
      value: "</td>",
      tagNameStartsAt: 57,
      tagNameEndsAt: 59,
      tagName: "td",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [],
    },
  ]);
});

test("41 - property with semi wrapped in ESP tokens", () => {
  let gathered = [];
  let input = `<td style="a: b;
    {% if x %}c: d;{% endif %}
e: f;">x</td>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 55,
      value: '<td style="a: b;\n    {% if x %}c: d;{% endif %}\ne: f;">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 3,
      tagName: "td",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: null,
      attribs: [
        {
          attribName: "style",
          attribNameRecognised: true,
          attribNameStartsAt: 4,
          attribNameEndsAt: 9,
          attribOpeningQuoteAt: 10,
          attribClosingQuoteAt: 53,
          attribValueRaw: "a: b;\n    {% if x %}c: d;{% endif %}\ne: f;",
          attribValue: [
            {
              start: 11,
              end: 16,
              property: "a",
              propertyStarts: 11,
              propertyEnds: 12,
              value: "b",
              valueStarts: 14,
              valueEnds: 15,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 12,
              semi: 15,
            },
            {
              type: "text",
              start: 16,
              end: 21,
              value: "\n    ",
            },
            {
              type: "esp",
              start: 21,
              end: 31,
              value: "{% if x %}",
              head: "{%",
              headStartsAt: 21,
              headEndsAt: 23,
              tail: "%}",
              tailStartsAt: 29,
              tailEndsAt: 31,
            },
            {
              start: 31,
              end: 36,
              property: "c",
              propertyStarts: 31,
              propertyEnds: 32,
              value: "d",
              valueStarts: 34,
              valueEnds: 35,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 32,
              semi: 35,
            },
            {
              type: "esp",
              start: 36,
              end: 47,
              value: "{% endif %}",
              head: "{%",
              headStartsAt: 36,
              headEndsAt: 38,
              tail: "%}",
              tailStartsAt: 45,
              tailEndsAt: 47,
            },
            {
              type: "text",
              start: 47,
              end: 48,
              value: "\n",
            },
            {
              start: 48,
              end: 53,
              property: "e",
              propertyStarts: 48,
              propertyEnds: 49,
              value: "f",
              valueStarts: 51,
              valueEnds: 52,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 49,
              semi: 52,
            },
          ],
          attribValueStartsAt: 11,
          attribValueEndsAt: 53,
          attribStarts: 4,
          attribEnds: 54,
          attribLeft: 2,
        },
      ],
    },
    {
      type: "text",
      start: 55,
      end: 56,
      value: "x",
    },
    {
      type: "tag",
      start: 56,
      end: 61,
      value: "</td>",
      tagNameStartsAt: 58,
      tagNameEndsAt: 60,
      tagName: "td",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [],
    },
  ]);
});

test("42 - property + space wrapped in ESP tokens", () => {
  let gathered = [];
  let input = `<td style="a: b;
    {% if x %}c: d {% endif %}
e: f;">x</td>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 55,
      value: '<td style="a: b;\n    {% if x %}c: d {% endif %}\ne: f;">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 3,
      tagName: "td",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: null,
      attribs: [
        {
          attribName: "style",
          attribNameRecognised: true,
          attribNameStartsAt: 4,
          attribNameEndsAt: 9,
          attribOpeningQuoteAt: 10,
          attribClosingQuoteAt: 53,
          attribValueRaw: "a: b;\n    {% if x %}c: d {% endif %}\ne: f;",
          attribValue: [
            {
              start: 11,
              end: 16,
              property: "a",
              propertyStarts: 11,
              propertyEnds: 12,
              value: "b",
              valueStarts: 14,
              valueEnds: 15,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 12,
              semi: 15,
            },
            {
              type: "text",
              start: 16,
              end: 21,
              value: "\n    ",
            },
            {
              type: "esp",
              start: 21,
              end: 31,
              value: "{% if x %}",
              head: "{%",
              headStartsAt: 21,
              headEndsAt: 23,
              tail: "%}",
              tailStartsAt: 29,
              tailEndsAt: 31,
            },
            {
              start: 31,
              end: 35,
              property: "c",
              propertyStarts: 31,
              propertyEnds: 32,
              value: "d",
              valueStarts: 34,
              valueEnds: 35,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 32,
              semi: null,
            },
            {
              type: "text",
              start: 35,
              end: 36,
              value: " ",
            },
            {
              type: "esp",
              start: 36,
              end: 47,
              value: "{% endif %}",
              head: "{%",
              headStartsAt: 36,
              headEndsAt: 38,
              tail: "%}",
              tailStartsAt: 45,
              tailEndsAt: 47,
            },
            {
              type: "text",
              start: 47,
              end: 48,
              value: "\n",
            },
            {
              start: 48,
              end: 53,
              property: "e",
              propertyStarts: 48,
              propertyEnds: 49,
              value: "f",
              valueStarts: 51,
              valueEnds: 52,
              important: null,
              importantStarts: null,
              importantEnds: null,
              colon: 49,
              semi: 52,
            },
          ],
          attribValueStartsAt: 11,
          attribValueEndsAt: 53,
          attribStarts: 4,
          attribEnds: 54,
          attribLeft: 2,
        },
      ],
    },
    {
      type: "text",
      start: 55,
      end: 56,
      value: "x",
    },
    {
      type: "tag",
      start: 56,
      end: 61,
      value: "</td>",
      tagNameStartsAt: 58,
      tagNameEndsAt: 60,
      tagName: "td",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [],
    },
  ]);
});

test.run();
