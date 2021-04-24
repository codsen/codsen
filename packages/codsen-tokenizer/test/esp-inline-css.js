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

tap.test(`02 - no semi - no px, with important`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}!important">';
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
    ],
    "02"
  );
  t.end();
});

tap.test(`03 - no semi - no px, with broken important`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}important">';
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
    ],
    "03"
  );
  t.end();
});

tap.test(`04 - with semi - no px`, (t) => {
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
    "04"
  );
  t.end();
});

tap.test(`05 - with semi - no px - important`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}!important;">';
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
    ],
    "05"
  );
  t.end();
});

tap.test(`06 - no semi - with px`, (t) => {
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
    "06"
  );
  t.end();
});

tap.todo(`07 - no semi - with px - important`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}px !important">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "07");
  t.end();
});

tap.test(`08 - with semi - with px`, (t) => {
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
    "08"
  );
  t.end();
});

tap.test(`09 - with semi - with px - tight important`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}px!important;">';
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
    ],
    "09"
  );
  t.end();
});

tap.todo(`10 - with semi - with px - spaced important`, (t) => {
  const gathered = [];
  const input = '<div style="width: {{ w }}px !important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "10");
  t.end();
});

tap.test(`11 - sneaky, first text then ESP - no semi`, (t) => {
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
    "11"
  );
  t.end();
});

tap.test(
  `12 - sneaky, first text then ESP - no semi - tight important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 100{{ w }}!important">';
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
                  end: 39,
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
      ],
      "12"
    );
    t.end();
  }
);

tap.todo(
  `13 - sneaky, first text then ESP - no semi - spaced important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 100{{ w }} !important">';
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "13");
    t.end();
  }
);

tap.test(`14 - sneaky, first text then ESP - with semi`, (t) => {
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
    "14"
  );
  t.end();
});

tap.test(`15 - sneaky, first text then ESP - with semi, important`, (t) => {
  const gathered = [];
  const input = '<div style="width: 100{{ w }}!important;">';
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
                end: 40,
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
    ],
    "15"
  );
  t.end();
});

tap.test(`16 - sandwiched, first text then ESP - no semi`, (t) => {
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
    "16"
  );
  t.end();
});

tap.test(
  `17 - sandwiched, first text then ESP - no semi, with important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0px!important">';
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
                      end: 30,
                      value: "0px",
                    },
                  ],
                  valueStarts: 19,
                  valueEnds: 30,
                  important: "!important",
                  importantStarts: 30,
                  importantEnds: 40,
                  colon: 17,
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
      ],
      "17"
    );
    t.end();
  }
);

tap.test(`18 - sandwiched, first text then ESP - with semi`, (t) => {
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
    "18"
  );
  t.end();
});

tap.test(
  `19 - sandwiched, first text then ESP - with semi, with tight important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0px!important;">';
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
                  end: 41,
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
                  important: "!important",
                  importantStarts: 30,
                  importantEnds: 40,
                  colon: 17,
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
      ],
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - sandwiched, first text then ESP - with semi, with spaced important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0px!important;">';
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
                  end: 41,
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
                  important: "!important",
                  importantStarts: 30,
                  importantEnds: 40,
                  colon: 17,
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
      ],
      "20"
    );
    t.end();
  }
);

tap.test(`21 - multiple, sandwiched, first text then ESP - no semi`, (t) => {
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
    "21"
  );
  t.end();
});

tap.test(
  `22 - multiple, sandwiched, first text then ESP - no semi, tight important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0p{{ XorT }}!important">';
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
                  end: 49,
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
                  important: "!important",
                  importantStarts: 39,
                  importantEnds: 49,
                  colon: 17,
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
      ],
      "22"
    );
    t.end();
  }
);

tap.todo(
  `23 - multiple, sandwiched, first text then ESP - no semi, spaced important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0p{{ XorT }} !important">';
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "23");
    t.end();
  }
);

tap.todo(
  `24 - multiple, sandwiched, first text then ESP - no semi, excessively spaced important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0p{{ XorT }}   !important">';
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "24");
    t.end();
  }
);

tap.test(`25 - multiple, sandwiched, first text then ESP - with semi`, (t) => {
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
    "25"
  );
  t.end();
});

tap.test(
  `26 - multiple, sandwiched, first text then ESP - with semi and tight important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0p{{ XorT }}!important;">';
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
                  end: 50,
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
                  important: "!important",
                  importantStarts: 39,
                  importantEnds: 49,
                  colon: 17,
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
      ],
      "26"
    );
    t.end();
  }
);

tap.todo(
  `27 - multiple, sandwiched, first text then ESP - with semi and spaced important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0p{{ XorT }} !important;">';
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "27");
    t.end();
  }
);

tap.todo(
  `28 - multiple, sandwiched, first text then ESP - with semi and excessively spaced important`,
  (t) => {
    const gathered = [];
    const input = '<div style="width: 1{{ w }}0p{{ XorT }}    !important;">';
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "28");
    t.end();
  }
);

tap.test(`29 - chain`, (t) => {
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
    "29"
  );
  t.end();
});

tap.test(`30 - chain with tight important`, (t) => {
  const gathered = [];
  const input = '<div style="x: a{{ b }}c{{ d }}e!important;">';
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
        end: 45,
        value: '<div style="x: a{{ b }}c{{ d }}e!important;">',
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
            attribValueRaw: "x: a{{ b }}c{{ d }}e!important;",
            attribValue: [
              {
                start: 12,
                end: 43,
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
                important: "!important",
                importantStarts: 32,
                importantEnds: 42,
                colon: 13,
                semi: 42,
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
    ],
    "30"
  );
  t.end();
});

tap.todo(`31 - chain with spaced important`, (t) => {
  const gathered = [];
  const input = '<div style="x: a{{ b }}c{{ d }}e !important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "31");
  t.end();
});

tap.todo(`32 - chain with copiously spaced important`, (t) => {
  const gathered = [];
  const input = '<div style="x: a{{ b }}c{{ d }}e  !important;">';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "32");
  t.end();
});

// TODO: broken ESP, only closing tails, missing opening
