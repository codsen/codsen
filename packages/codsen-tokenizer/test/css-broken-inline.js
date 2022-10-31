import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// errors within inline css
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi missing between two rules`, () => {
  let gathered = [];
  ct(`<div style="float:left color:red">`, {
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
        end: 34,
        value: '<div style="float:left color:red">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 32,
            attribValueRaw: "float:left color:red",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 12,
                end: 22,
              },
              {
                type: "text",
                start: 22,
                end: 23,
                value: " ",
              },
              {
                property: "color",
                propertyStarts: 23,
                propertyEnds: 28,
                colon: 28,
                value: "red",
                valueStarts: 29,
                valueEnds: 32,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 23,
                end: 32,
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
    ],
    "01.01"
  );
});

test(`02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`, () => {
  let gathered = [];
  ct(`<div style="float:left;x">z</div>`, {
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
        end: 26,
        value: '<div style="float:left;x">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "float:left;x",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 22,
                start: 12,
                end: 23,
              },
              {
                property: "x",
                propertyStarts: 23,
                propertyEnds: 24,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 23,
                end: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "z",
      },
      {
        type: "tag",
        start: 27,
        end: 33,
        value: "</div>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 32,
        tagName: "div",
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

test(`03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`, () => {
  let gathered = [];
  ct(`<div style="]\nfloat:left;">z</div>`, {
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
        end: 27,
        value: '<div style="]\nfloat:left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "]\nfloat:left;",
            attribValue: [
              {
                property: "]",
                propertyStarts: 12,
                propertyEnds: 13,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 12,
                end: 13,
              },
              {
                type: "text",
                start: 13,
                end: 14,
                value: "\n",
              },
              {
                property: "float",
                propertyStarts: 14,
                propertyEnds: 19,
                colon: 19,
                value: "left",
                valueStarts: 20,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 24,
                start: 14,
                end: 25,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 27,
        end: 28,
        value: "z",
      },
      {
        type: "tag",
        start: 28,
        end: 34,
        value: "</div>",
        tagNameStartsAt: 30,
        tagNameEndsAt: 33,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "03.01"
  );
});

test(`04 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - copious line breaks`, () => {
  let gathered = [];
  ct(`<div style="\n float:left;\n">z</div>`, {
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
        end: 28,
        value: '<div style="\n float:left;\n">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 26,
            attribValueRaw: "\n float:left;\n",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 14,
                value: "\n ",
              },
              {
                property: "float",
                propertyStarts: 14,
                propertyEnds: 19,
                colon: 19,
                value: "left",
                valueStarts: 20,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 24,
                start: 14,
                end: 25,
              },
              {
                type: "text",
                start: 25,
                end: 26,
                value: "\n",
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
      {
        type: "text",
        start: 28,
        end: 29,
        value: "z",
      },
      {
        type: "tag",
        start: 29,
        end: 35,
        value: "</div>",
        tagNameStartsAt: 31,
        tagNameEndsAt: 34,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "04.01"
  );
});

test(`05 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character before prop name`, () => {
  let gathered = [];
  ct(`<div style=".float:left;">z</div>`, {
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
        end: 26,
        value: '<div style=".float:left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: ".float:left;",
            attribValue: [
              {
                property: ".float", // <---
                propertyStarts: 12,
                propertyEnds: 18,
                colon: 18,
                value: "left",
                valueStarts: 19,
                valueEnds: 23,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 23,
                start: 12,
                end: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "z",
      },
      {
        type: "tag",
        start: 27,
        end: 33,
        value: "</div>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 32,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "05.01"
  );
});

test(`06 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character after prop name`, () => {
  let gathered = [];
  ct(`<div style="float.:left;">z</div>`, {
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
        end: 26,
        value: '<div style="float.:left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "float.:left;",
            attribValue: [
              {
                property: "float.", // <---
                propertyStarts: 12,
                propertyEnds: 18,
                colon: 18,
                value: "left",
                valueStarts: 19,
                valueEnds: 23,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 23,
                start: 12,
                end: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "z",
      },
      {
        type: "tag",
        start: 27,
        end: 33,
        value: "</div>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 32,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "06.01"
  );
});

test(`07 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character before prop name, no value`, () => {
  let gathered = [];
  ct(`<div style=".main">z</div>`, {
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
        end: 19,
        value: '<div style=".main">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 17,
            attribValueRaw: ".main",
            attribValue: [
              {
                property: ".main",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 12,
                end: 17,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 17,
            attribStarts: 5,
            attribEnds: 18,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 19,
        end: 20,
        value: "z",
      },
      {
        type: "tag",
        start: 20,
        end: 26,
        value: "</div>",
        tagNameStartsAt: 22,
        tagNameEndsAt: 25,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "07.01"
  );
});

test(`08 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character after value, no semi`, () => {
  let gathered = [];
  ct(`<div style="float:left.">z</div>`, {
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
        end: 25,
        value: '<div style="float:left.">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 23,
            attribValueRaw: "float:left.",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "left.",
                valueStarts: 18,
                valueEnds: 23,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 12,
                end: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 23,
            attribStarts: 5,
            attribEnds: 24,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 25,
        end: 26,
        value: "z",
      },
      {
        type: "tag",
        start: 26,
        end: 32,
        value: "</div>",
        tagNameStartsAt: 28,
        tagNameEndsAt: 31,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "08.01"
  );
});

test(`09 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character after value, with semi`, () => {
  let gathered = [];
  ct(`<div style="float:left.;">z</div>`, {
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
        end: 26,
        value: '<div style="float:left.;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "float:left.;",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "left.",
                valueStarts: 18,
                valueEnds: 23,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 23,
                start: 12,
                end: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "z",
      },
      {
        type: "tag",
        start: 27,
        end: 33,
        value: "</div>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 32,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "09.01"
  );
});

test(`10 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`, () => {
  let gathered = [];
  ct(`<div style="\n\n   float:left\n\n   .">z</div>`, {
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
        end: 35,
        value: '<div style="\n\n   float:left\n\n   .">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 33,
            attribValueRaw: "\n\n   float:left\n\n   .",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 17,
                value: "\n\n   ",
              },
              {
                property: "float",
                propertyStarts: 17,
                propertyEnds: 22,
                colon: 22,
                value: "left",
                valueStarts: 23,
                valueEnds: 27,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 17,
                end: 27,
              },
              {
                type: "text",
                start: 27,
                end: 32,
                value: "\n\n   ",
              },
              {
                property: ".",
                propertyStarts: 32,
                propertyEnds: 33,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 32,
                end: 33,
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
      {
        type: "text",
        start: 35,
        end: 36,
        value: "z",
      },
      {
        type: "tag",
        start: 36,
        end: 42,
        value: "</div>",
        tagNameStartsAt: 38,
        tagNameEndsAt: 41,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "10.01"
  );
});

test(`11 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`, () => {
  let gathered = [];
  ct(`<div style="\n\n   float:left;\n\n   .">z</div>`, {
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
        end: 36,
        value: '<div style="\n\n   float:left;\n\n   .">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 34,
            attribValueRaw: "\n\n   float:left;\n\n   .",
            attribValue: [
              {
                type: "text",
                start: 12,
                end: 17,
                value: "\n\n   ",
              },
              {
                property: "float",
                propertyStarts: 17,
                propertyEnds: 22,
                colon: 22,
                value: "left",
                valueStarts: 23,
                valueEnds: 27,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 27,
                start: 17,
                end: 28,
              },
              {
                type: "text",
                start: 28,
                end: 33,
                value: "\n\n   ",
              },
              {
                property: ".",
                propertyStarts: 33,
                propertyEnds: 34,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 33,
                end: 34,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 34,
            attribStarts: 5,
            attribEnds: 35,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 36,
        end: 37,
        value: "z",
      },
      {
        type: "tag",
        start: 37,
        end: 43,
        value: "</div>",
        tagNameStartsAt: 39,
        tagNameEndsAt: 42,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "11.01"
  );
});

test(`12 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi instead of a colon #1`, () => {
  let gathered = [];
  ct(`<div style="float;left">z</div>`, {
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
        end: 24,
        value: '<div style="float;left">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 22,
            attribValueRaw: "float;left",
            attribValue: [
              {
                start: 12,
                end: 18,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                colon: null,
                semi: 17,
              },
              {
                start: 18,
                end: 22,
                property: "left",
                propertyStarts: 18,
                propertyEnds: 22,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                colon: null,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 22,
            attribStarts: 5,
            attribEnds: 23,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 24,
        end: 25,
        value: "z",
      },
      {
        type: "tag",
        start: 25,
        end: 31,
        value: "</div>",
        tagNameStartsAt: 27,
        tagNameEndsAt: 30,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "12.01"
  );
});

test(`13 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi instead of a colon #2`, () => {
  let gathered = [];
  ct(`<div style="float;left;">z</div>`, {
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
        end: 25,
        value: '<div style="float;left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 23,
            attribValueRaw: "float;left;",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 17,
                start: 12,
                end: 18,
              },
              {
                property: "left",
                propertyStarts: 18,
                propertyEnds: 22,
                colon: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 22,
                start: 18,
                end: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 23,
            attribStarts: 5,
            attribEnds: 24,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 25,
        end: 26,
        value: "z",
      },
      {
        type: "tag",
        start: 26,
        end: 32,
        value: "</div>",
        tagNameStartsAt: 28,
        tagNameEndsAt: 31,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "13.01"
  );
});

// quoted
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, no semi #1`, () => {
  let gathered = [];
  ct(`<div style="float:"left"">z</div>`, {
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
        end: 26,
        value: `<div style="float:"left"">`,
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: `float:"left"`,
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: `"left"`,
                valueStarts: 18,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 12,
                end: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "z",
      },
      {
        type: "tag",
        start: 27,
        end: 33,
        value: "</div>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 32,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "14.01"
  );
});

test(`15 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, no semi #2`, () => {
  let gathered = [];
  ct(`<div style="float:'left'">z</div>`, {
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
        end: 26,
        value: "<div style=\"float:'left'\">",
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "float:'left'",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "'left'",
                valueStarts: 18,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 12,
                end: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "z",
      },
      {
        type: "tag",
        start: 27,
        end: 33,
        value: "</div>",
        tagNameStartsAt: 29,
        tagNameEndsAt: 32,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "15.01"
  );
});

test(`16 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, semi #3`, () => {
  let gathered = [];
  ct(`<div style="float:"left";">`, {
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
        end: 27,
        value: '<div style="float:"left";">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: 'float:"left";',
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: '"left"',
                valueStarts: 18,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 24,
                start: 12,
                end: 25,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
    ],
    "16.01"
  );
});

test(`17 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, semi #4`, () => {
  let gathered = [];
  ct(`<div style="float:'left';">z</div>`, {
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
        end: 27,
        value: "<div style=\"float:'left';\">",
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "float:'left';",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "'left'",
                valueStarts: 18,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 24,
                start: 12,
                end: 25,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 27,
        end: 28,
        value: "z",
      },
      {
        type: "tag",
        start: 28,
        end: 34,
        value: "</div>",
        tagNameStartsAt: 30,
        tagNameEndsAt: 33,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "17.01"
  );
});

test(`18 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property values`, () => {
  let gathered = [];
  ct(`<div style="float:'left'; color: 'red'">z</div>`, {
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
        end: 40,
        value: "<div style=\"float:'left'; color: 'red'\">",
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 38,
            attribValueRaw: "float:'left'; color: 'red'",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "'left'",
                valueStarts: 18,
                valueEnds: 24,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: 24,
                start: 12,
                end: 25,
              },
              {
                type: "text",
                start: 25,
                end: 26,
                value: " ",
              },
              {
                property: "color",
                propertyStarts: 26,
                propertyEnds: 31,
                colon: 31,
                value: "'red'",
                valueStarts: 33,
                valueEnds: 38,
                importantStarts: null,
                importantEnds: null,
                important: null,
                semi: null,
                start: 26,
                end: 38,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 38,
            attribStarts: 5,
            attribEnds: 39,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 40,
        end: 41,
        value: "z",
      },
      {
        type: "tag",
        start: 41,
        end: 47,
        value: "</div>",
        tagNameStartsAt: 43,
        tagNameEndsAt: 46,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "18.01"
  );
});

test(`19 - repeated !important`, () => {
  let gathered = [];
  ct(`<div style="float:left!important!important">`, {
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
        end: 44,
        value: '<div style="float:left!important!important">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 42,
            attribValueRaw: "float:left!important!important",
            attribValue: [
              {
                start: 12,
                end: 42,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                importantStarts: 22,
                importantEnds: 42,
                important: "!important!important",
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 42,
            attribStarts: 5,
            attribEnds: 43,
            attribLeft: 3,
          },
        ],
      },
    ],
    "19.01"
  );
});

test(`20 - !important cut off by a semy goes as important, not property`, () => {
  let gathered = [];
  ct(`<div style="float:left;!important">`, {
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
        end: 35,
        value: '<div style="float:left;!important">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 33,
            attribValueRaw: "float:left;!important",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                importantStarts: null,
                importantEnds: null,
                important: null,
                colon: 17,
                semi: 22,
              },
              {
                start: 23,
                end: 33,
                property: null,
                propertyStarts: null,
                propertyEnds: null,
                value: null,
                valueStarts: null,
                valueEnds: null,
                importantStarts: 23,
                importantEnds: 33,
                important: "!important",
                colon: null,
                semi: null,
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
    "20.01"
  );
});

test(`21`, () => {
  let gathered = [];
  ct(`<div style="float.left;">`, {
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
        end: 25,
        value: '<div style="float.left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 23,
            attribValueRaw: "float.left;",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 23,
            attribStarts: 5,
            attribEnds: 24,
            attribLeft: 3,
          },
        ],
      },
    ],
    "21.01"
  );
});

test(`22`, () => {
  let gathered = [];
  ct(`<div style="floa/t:left;">`, {
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
        end: 26,
        value: '<div style="floa/t:left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "floa/t:left;",
            attribValue: [
              {
                start: 12,
                end: 24,
                property: "floa/t",
                propertyStarts: 12,
                propertyEnds: 18,
                value: "left",
                valueStarts: 19,
                valueEnds: 23,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 18,
                semi: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "22.01"
  );
});

test(`23`, () => {
  let gathered = [];
  ct(`<div style="floa.t:left;">`, {
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
        end: 26,
        value: '<div style="floa.t:left;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "floa.t:left;",
            attribValue: [
              {
                start: 12,
                end: 24,
                property: "floa.t",
                propertyStarts: 12,
                propertyEnds: 18,
                value: "left",
                valueStarts: 19,
                valueEnds: 23,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 18,
                semi: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "23.01"
  );
});

// repeated semi

test(`24 - repeated semi, tight`, () => {
  let gathered = [];
  ct(`<div style="float:left;;">`, {
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
        end: 26,
        value: '<div style="float:left;;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: "float:left;;",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
              {
                start: 23,
                end: 24,
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
                semi: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "24.01"
  );
});

test(`25 - repeated semi, space in front`, () => {
  let gathered = [];
  ct(`<div style="float:left; ;">`, {
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
        end: 27,
        value: '<div style="float:left; ;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "float:left; ;",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
              {
                type: "text",
                start: 23,
                end: 24,
                value: " ",
              },
              {
                start: 24,
                end: 25,
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
                semi: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
    ],
    "25.01"
  );
});

test(`26 - repeated semi, tab in front`, () => {
  let gathered = [];
  ct(`<div style="float:left;\t;">`, {
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
        end: 27,
        value: '<div style="float:left;\t;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "float:left;\t;",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
              {
                type: "text",
                start: 23,
                end: 24,
                value: "\t",
              },
              {
                start: 24,
                end: 25,
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
                semi: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
    ],
    "26.01"
  );
});

test(`27 - repeated semi, space after, quotes follow`, () => {
  let gathered = [];
  ct(`<div style="float:left;; ">`, {
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
        end: 27,
        value: '<div style="float:left;; ">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "float:left;; ",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
              {
                start: 23,
                end: 24,
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
                semi: 23,
              },
              {
                type: "text",
                start: 24,
                end: 25,
                value: " ",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
    ],
    "27.01"
  );
});

test(`28 - repeated semi, space after, bracket follows`, () => {
  let gathered = [];
  ct(`<div style="float:left;; >`, {
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
        end: 26,
        value: '<div style="float:left;; >',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: null, // <----- !
            attribValueRaw: "float:left;; ",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
              {
                start: 23,
                end: 24,
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
                semi: 23,
              },
              {
                type: "text",
                start: 24,
                end: 25,
                value: " ",
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "28.01"
  );
});

test(`29 - repeated semi, space after`, () => {
  let gathered = [];
  ct(`<div style="float:left;; color:red;">`, {
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
        end: 37,
        value: '<div style="float:left;; color:red;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 35,
            attribValueRaw: "float:left;; color:red;",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
              },
              {
                start: 23,
                end: 24,
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
                semi: 23,
              },
              {
                type: "text",
                start: 24,
                end: 25,
                value: " ",
              },
              {
                start: 25,
                end: 35,
                property: "color",
                propertyStarts: 25,
                propertyEnds: 30,
                value: "red",
                valueStarts: 31,
                valueEnds: 34,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 30,
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
    ],
    "29.01"
  );
});

test(`30 - unrecognised prop only - tralala #1`, () => {
  let gathered = [];
  ct(`<div style="tra;; la;; la;;">`, {
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
        value: '<div style="tra;; la;; la;;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 27,
            attribValueRaw: "tra;; la;; la;;",
            attribValue: [
              {
                start: 12,
                end: 16,
                property: "tra",
                propertyStarts: 12,
                propertyEnds: 15,
                value: null,
                valueStarts: null,
                valueEnds: null,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: null,
                semi: 15,
              },
              {
                start: 16,
                end: 17,
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
                semi: 16,
              },
              {
                type: "text",
                start: 17,
                end: 18,
                value: " ",
              },
              {
                start: 18,
                end: 21,
                property: "la",
                propertyStarts: 18,
                propertyEnds: 20,
                value: null,
                valueStarts: null,
                valueEnds: null,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: null,
                semi: 20,
              },
              {
                start: 21,
                end: 22,
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
                semi: 21,
              },
              {
                type: "text",
                start: 22,
                end: 23,
                value: " ",
              },
              {
                start: 23,
                end: 26,
                property: "la",
                propertyStarts: 23,
                propertyEnds: 25,
                value: null,
                valueStarts: null,
                valueEnds: null,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: null,
                semi: 25,
              },
              {
                start: 26,
                end: 27,
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
    "30.01"
  );
});

test(`31 - unrecognised prop only - tralala #2`, () => {
  let gathered = [];
  ct(`<div style="tra;;la;;la;;">`, {
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
        end: 27,
        value: '<div style="tra;;la;;la;;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "tra;;la;;la;;",
            attribValue: [
              {
                start: 12,
                end: 16,
                property: "tra",
                propertyStarts: 12,
                propertyEnds: 15,
                value: null,
                valueStarts: null,
                valueEnds: null,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: null,
                semi: 15,
              },
              {
                start: 16,
                end: 17,
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
                semi: 16,
              },
              {
                start: 17,
                end: 20,
                property: "la",
                propertyStarts: 17,
                propertyEnds: 19,
                value: null,
                valueStarts: null,
                valueEnds: null,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: null,
                semi: 19,
              },
              {
                start: 20,
                end: 21,
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
                semi: 20,
              },
              {
                start: 21,
                end: 24,
                property: "la",
                propertyStarts: 21,
                propertyEnds: 23,
                value: null,
                valueStarts: null,
                valueEnds: null,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: null,
                semi: 23,
              },
              {
                start: 24,
                end: 25,
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
                semi: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
    ],
    "31.01"
  );
});

test(`32 - leading semi, tight`, () => {
  let gathered = [];
  ct(`<div style=";color: red;">`, {
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
        end: 26,
        value: '<div style=";color: red;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 24,
            attribValueRaw: ";color: red;",
            attribValue: [
              {
                start: 12,
                end: 13,
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
                semi: 12,
              },
              {
                start: 13,
                end: 24,
                property: "color",
                propertyStarts: 13,
                propertyEnds: 18,
                value: "red",
                valueStarts: 20,
                valueEnds: 23,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 18,
                semi: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "32.01"
  );
});

test(`33 - leading semi, spaced`, () => {
  let gathered = [];
  ct(`<div style="; color: red;">`, {
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
        end: 27,
        value: '<div style="; color: red;">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 25,
            attribValueRaw: "; color: red;",
            attribValue: [
              {
                start: 12,
                end: 13,
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
                semi: 12,
              },
              {
                type: "text",
                start: 13,
                end: 14,
                value: " ",
              },
              {
                start: 14,
                end: 25,
                property: "color",
                propertyStarts: 14,
                propertyEnds: 19,
                value: "red",
                valueStarts: 21,
                valueEnds: 24,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 19,
                semi: 24,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 25,
            attribStarts: 5,
            attribEnds: 26,
            attribLeft: 3,
          },
        ],
      },
    ],
    "33.01"
  );
});

test(`34 - value missing`, () => {
  let gathered = [];
  ct(`<img style="display" />`, {
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
        value: '<img style="display" />',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: 11,
            attribClosingQuoteAt: 19,
            attribValueRaw: "display",
            attribValue: [
              {
                start: 12,
                end: 19,
                property: "display",
                propertyStarts: 12,
                propertyEnds: 19,
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
            attribValueEndsAt: 19,
            attribStarts: 5,
            attribEnds: 20,
            attribLeft: 3,
          },
        ],
      },
    ],
    "34.01"
  );
});

test.run();
