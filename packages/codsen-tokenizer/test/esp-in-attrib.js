import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// ESP tags within attribute values
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - one ESP tag inside`, () => {
  let gathered = [];
  let value = `<a b="{% if something %}"><c>`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 26,
      value: `<a b="{% if something %}">`,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false, // <---- means there are ESP bits inside this tag
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 24,
          attribValueRaw: "{% if something %}",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 24,
              value: "{% if something %}",
              head: "{%",
              headStartsAt: 6,
              headEndsAt: 8,
              tail: "%}",
              tailStartsAt: 22,
              tailEndsAt: 24,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 24,
          attribStarts: 3,
          attribEnds: 25,
          attribLeft: 1,
        },
      ],
    },
    {
      type: "tag",
      start: 26,
      end: 29,
      value: "<c>",
      tagNameStartsAt: 27,
      tagNameEndsAt: 28,
      tagName: "c",
      recognised: false,
      closing: false,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [],
    },
  ]);
});

test(`02 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - one ESP tag + text`, () => {
  let gathered = [];
  let value = `<a b="{{ c }}d">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 16,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 14,
          attribValueRaw: "{{ c }}d",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 13,
              value: "{{ c }}",
              head: "{{",
              headStartsAt: 6,
              headEndsAt: 8,
              tail: "}}",
              tailStartsAt: 11,
              tailEndsAt: 13,
            },
            {
              type: "text",
              start: 13,
              end: 14,
              value: "d",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 14,
          attribStarts: 3,
          attribEnds: 15,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`03 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - one ESP tag + text`, () => {
  let gathered = [];
  let value = `<img src="{{ root }}z" width="9"/>`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 34,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 4,
      tagName: "img",
      recognised: true,
      closing: false,
      void: true,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "src",
          attribNameRecognised: true,
          attribNameStartsAt: 5,
          attribNameEndsAt: 8,
          attribOpeningQuoteAt: 9,
          attribClosingQuoteAt: 21,
          attribValueRaw: "{{ root }}z",
          attribValue: [
            {
              type: "esp",
              start: 10,
              end: 20,
              value: "{{ root }}",
              head: "{{",
              headStartsAt: 10,
              headEndsAt: 12,
              tail: "}}",
              tailStartsAt: 18,
              tailEndsAt: 20,
            },
            {
              type: "text",
              start: 20,
              end: 21,
              value: "z",
            },
          ],
          attribValueStartsAt: 10,
          attribValueEndsAt: 21,
          attribStarts: 5,
          attribEnds: 22,
          attribLeft: 3,
        },
        {
          attribName: "width",
          attribNameRecognised: true,
          attribNameStartsAt: 23,
          attribNameEndsAt: 28,
          attribOpeningQuoteAt: 29,
          attribClosingQuoteAt: 31,
          attribValueRaw: "9",
          attribValue: [
            {
              type: "text",
              start: 30,
              end: 31,
              value: "9",
            },
          ],
          attribValueStartsAt: 30,
          attribValueEndsAt: 31,
          attribStarts: 23,
          attribEnds: 32,
          attribLeft: 21,
        },
      ],
    },
  ]);
});

test(`04 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - esp-text-esp-text`, () => {
  let gathered = [];
  ct(`<a b="{% x %}1{% y %}2">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 24,
      value: '<a b="{% x %}1{% y %}2">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 22,
          attribValueRaw: "{% x %}1{% y %}2",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 13,
              value: "{% x %}",
              head: "{%",
              headStartsAt: 6,
              headEndsAt: 8,
              tail: "%}",
              tailStartsAt: 11,
              tailEndsAt: 13,
            },
            {
              type: "text",
              start: 13,
              end: 14,
              value: "1",
            },
            {
              type: "esp",
              start: 14,
              end: 21,
              value: "{% y %}",
              head: "{%",
              headStartsAt: 14,
              headEndsAt: 16,
              tail: "%}",
              tailStartsAt: 19,
              tailEndsAt: 21,
            },
            {
              type: "text",
              start: 21,
              end: 22,
              value: "2",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 22,
          attribStarts: 3,
          attribEnds: 23,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`05 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - chain of text and ESP tag`, () => {
  let gathered = [];
  ct(`<a z="{% if something %}1{% else %}2{% endif %}" y="x"/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 56,
      value: `<a z="{% if something %}1{% else %}2{% endif %}" y="x"/>`,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "z",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 47,
          attribValueRaw: `{% if something %}1{% else %}2{% endif %}`,
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 24,
              value: "{% if something %}",
              head: "{%",
              headStartsAt: 6,
              headEndsAt: 8,
              tail: "%}",
              tailStartsAt: 22,
              tailEndsAt: 24,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: "1",
            },
            {
              type: "esp",
              start: 25,
              end: 35,
              value: "{% else %}",
              head: "{%",
              headStartsAt: 25,
              headEndsAt: 27,
              tail: "%}",
              tailStartsAt: 33,
              tailEndsAt: 35,
            },
            {
              type: "text",
              start: 35,
              end: 36,
              value: "2",
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
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 47,
          attribStarts: 3,
          attribEnds: 48,
          attribLeft: 1,
        },
        {
          attribName: "y",
          attribNameRecognised: false,
          attribNameStartsAt: 49,
          attribNameEndsAt: 50,
          attribOpeningQuoteAt: 51,
          attribClosingQuoteAt: 53,
          attribValueRaw: "x",
          attribValue: [
            {
              type: "text",
              start: 52,
              end: 53,
              value: "x",
            },
          ],
          attribValueStartsAt: 52,
          attribValueEndsAt: 53,
          attribStarts: 49,
          attribEnds: 54,
          attribLeft: 47,
        },
      ],
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - otherwise a sensitive characters inside ESP tag`, () => {
  let gathered = [];
  ct(`<a>{% if a<b and c>d '"' ><>< %}<b>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 3,
    },
    {
      type: "esp",
      start: 3,
      end: 32,
      value: "{% if a<b and c>d '\"' ><>< %}",
      head: "{%",
      headStartsAt: 3,
      headEndsAt: 5,
      tail: "%}",
      tailStartsAt: 30,
      tailEndsAt: 32,
    },
    {
      type: "tag",
      start: 32,
      end: 35,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - The Killer Triplet, mini extract`, () => {
  let gathered = [];
  ct(`<a b="c{{ z("'") }}"><b>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 21,
      value: `<a b="c{{ z("'") }}">`,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 19,
          attribValueRaw: `c{{ z("'") }}`,
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 19,
              value: `{{ z("'") }}`,
              head: "{{",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "}}",
              tailStartsAt: 17,
              tailEndsAt: 19,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 19,
          attribStarts: 3,
          attribEnds: 20,
          attribLeft: 1,
        },
      ],
    },
    {
      type: "tag",
      start: 21,
      end: 24,
      value: "<b>",
      tagNameStartsAt: 22,
      tagNameEndsAt: 23,
      tagName: "b",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
  ]);
});

test(`08 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - The Killer Triplet, midi extract`, () => {
  let gathered = [];
  ct(`<a href="https://z.y/?a=1&q={{ r("'", "%27") }}"><b>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 49,
      value: `<a href="https://z.y/?a=1&q={{ r("'", "%27") }}">`,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "href",
          attribNameRecognised: true,
          attribNameStartsAt: 3,
          attribNameEndsAt: 7,
          attribOpeningQuoteAt: 8,
          attribClosingQuoteAt: 47,
          attribValueRaw: `https://z.y/?a=1&q={{ r("'", "%27") }}`,
          attribValue: [
            {
              type: "text",
              start: 9,
              end: 28,
              value: `https://z.y/?a=1&q=`,
            },
            {
              type: "esp",
              start: 28,
              end: 47,
              value: `{{ r("'", "%27") }}`,
              head: "{{",
              headStartsAt: 28,
              headEndsAt: 30,
              tail: "}}",
              tailStartsAt: 45,
              tailEndsAt: 47,
            },
          ],
          attribValueStartsAt: 9,
          attribValueEndsAt: 47,
          attribStarts: 3,
          attribEnds: 48,
          attribLeft: 1,
        },
      ],
    },
    {
      type: "tag",
      start: 49,
      end: 52,
      value: "<b>",
      tagNameStartsAt: 50,
      tagNameEndsAt: 51,
      tagName: "b",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
  ]);
});

test(`09 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - The Killer Triplet, maxi extract`, () => {
  let gathered = [];
  ct(
    `<a href="https://z.y/?a=1&q={{ r(" ", "+") | r("'", "%27") | r("&", "%26") | r("(", "%28") | r(")", "%29") }}"><b>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 111,
      value: `<a href="https://z.y/?a=1&q={{ r(" ", "+") | r("'", "%27") | r("&", "%26") | r("(", "%28") | r(")", "%29") }}">`,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "href",
          attribNameRecognised: true,
          attribNameStartsAt: 3,
          attribNameEndsAt: 7,
          attribOpeningQuoteAt: 8,
          attribClosingQuoteAt: 109,
          attribValueRaw: `https://z.y/?a=1&q={{ r(" ", "+") | r("'", "%27") | r("&", "%26") | r("(", "%28") | r(")", "%29") }}`,
          attribValue: [
            {
              type: "text",
              start: 9,
              end: 28,
              value: "https://z.y/?a=1&q=",
            },
            {
              type: "esp",
              start: 28,
              end: 109,
              value: `{{ r(" ", "+") | r("'", "%27") | r("&", "%26") | r("(", "%28") | r(")", "%29") }}`,
              head: "{{",
              headStartsAt: 28,
              headEndsAt: 30,
              tail: "}}",
              tailStartsAt: 107,
              tailEndsAt: 109,
            },
          ],
          attribValueStartsAt: 9,
          attribValueEndsAt: 109,
          attribStarts: 3,
          attribEnds: 110,
          attribLeft: 1,
        },
      ],
    },
    {
      type: "tag",
      start: 111,
      end: 114,
      value: "<b>",
      tagNameStartsAt: 112,
      tagNameEndsAt: 113,
      tagName: "b",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly`, () => {
  let gathered = [];
  ct(`<a b="{%- c %}">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 16,
      value: '<a b="{%- c %}">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 14,
          attribValueRaw: "{%- c %}",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 14,
              value: "{%- c %}",
              head: "{%-",
              headStartsAt: 6,
              headEndsAt: 9,
              tail: "%}",
              tailStartsAt: 12,
              tailEndsAt: 14,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 14,
          attribStarts: 3,
          attribEnds: 15,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  ct(`<a b="{%- c %}x">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 17,
      value: '<a b="{%- c %}x">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 15,
          attribValueRaw: "{%- c %}x",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 14,
              value: "{%- c %}",
              head: "{%-",
              headStartsAt: 6,
              headEndsAt: 9,
              tail: "%}",
              tailStartsAt: 12,
              tailEndsAt: 14,
            },
            {
              type: "text",
              start: 14,
              end: 15,
              value: "x",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 15,
          attribStarts: 3,
          attribEnds: 16,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  ct(`<a b="x{%- c %}">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 17,
      value: '<a b="x{%- c %}">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 15,
          attribValueRaw: "x{%- c %}",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "x",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{%- c %}",
              head: "{%-",
              headStartsAt: 7,
              headEndsAt: 10,
              tail: "%}",
              tailStartsAt: 13,
              tailEndsAt: 15,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 15,
          attribStarts: 3,
          attribEnds: 16,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`13 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly`, () => {
  let gathered = [];
  ct(`<a b="{%- c -%}">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 17,
      value: '<a b="{%- c -%}">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 15,
          attribValueRaw: "{%- c -%}",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 15,
              value: "{%- c -%}",
              head: "{%-",
              headStartsAt: 6,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 15,
          attribStarts: 3,
          attribEnds: 16,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  ct(`<a b="x{%- c -%}">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 18,
      value: '<a b="x{%- c -%}">',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 16,
          attribValueRaw: "x{%- c -%}",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "x",
            },
            {
              type: "esp",
              start: 7,
              end: 16,
              value: "{%- c -%}",
              head: "{%-",
              headStartsAt: 7,
              headEndsAt: 10,
              tail: "-%}",
              tailStartsAt: 13,
              tailEndsAt: 16,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 16,
          attribStarts: 3,
          attribEnds: 17,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  let value = `<a b="{%- c -%}x">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 18,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 16,
          attribValueRaw: "{%- c -%}x",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 15,
              value: "{%- c -%}",
              head: "{%-",
              headStartsAt: 6,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "x",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 16,
          attribStarts: 3,
          attribEnds: 17,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`16 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  let value = `<a b="z {%- c -%} x">`;
  ct(`<a b="z {%- c -%} x">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 21,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 19,
          attribValueRaw: "z {%- c -%} x",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 8,
              value: "z ",
            },
            {
              type: "esp",
              start: 8,
              end: 17,
              value: "{%- c -%}",
              head: "{%-",
              headStartsAt: 8,
              headEndsAt: 11,
              tail: "-%}",
              tailStartsAt: 14,
              tailEndsAt: 17,
            },
            {
              type: "text",
              start: 17,
              end: 19,
              value: " x",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 19,
          attribStarts: 3,
          attribEnds: 20,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly`, () => {
  let gathered = [];
  let value = `<a b="{% c -%}">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 16,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 14,
          attribValueRaw: "{% c -%}",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 14,
              value: "{% c -%}",
              head: "{%",
              headStartsAt: 6,
              headEndsAt: 8,
              tail: "-%}",
              tailStartsAt: 11,
              tailEndsAt: 14,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 14,
          attribStarts: 3,
          attribEnds: 15,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  let value = `<a b="x{% c -%}">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 17,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 15,
          attribValueRaw: "x{% c -%}",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "x",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{% c -%}",
              head: "{%",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 15,
          attribStarts: 3,
          attribEnds: 16,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  let value = `<a b="{% c -%}x">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 17,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 15,
          attribValueRaw: "{% c -%}x",
          attribValue: [
            {
              type: "esp",
              start: 6,
              end: 14,
              value: "{% c -%}",
              head: "{%",
              headStartsAt: 6,
              headEndsAt: 8,
              tail: "-%}",
              tailStartsAt: 11,
              tailEndsAt: 14,
            },
            {
              type: "text",
              start: 14,
              end: 15,
              value: "x",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 15,
          attribStarts: 3,
          attribEnds: 16,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`, () => {
  let gathered = [];
  let value = `<a b="z{% c -%}x">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 18,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 16,
          attribValueRaw: "z{% c -%}x",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "z",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{% c -%}",
              head: "{%",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "x",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 16,
          attribStarts: 3,
          attribEnds: 17,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

// triplets, slightly mismatching heads and tails
// -----------------------------------------------------------------------------

test(`21 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - A, baseline`, () => {
  let gathered = [];
  let value = `<a b="c{% x %}d{% y %}e{% z %}f">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 33,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 31,
          attribValueRaw: "c{% x %}d{% y %}e{% z %}f",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 14,
              value: "{% x %}",
              head: "{%",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "%}",
              tailStartsAt: 12,
              tailEndsAt: 14,
            },
            {
              type: "text",
              start: 14,
              end: 15,
              value: "d",
            },
            {
              type: "esp",
              start: 15,
              end: 22,
              value: "{% y %}",
              head: "{%",
              headStartsAt: 15,
              headEndsAt: 17,
              tail: "%}",
              tailStartsAt: 20,
              tailEndsAt: 22,
            },
            {
              type: "text",
              start: 22,
              end: 23,
              value: "e",
            },
            {
              type: "esp",
              start: 23,
              end: 30,
              value: "{% z %}",
              head: "{%",
              headStartsAt: 23,
              headEndsAt: 25,
              tail: "%}",
              tailStartsAt: 28,
              tailEndsAt: 30,
            },
            {
              type: "text",
              start: 30,
              end: 31,
              value: "f",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 31,
          attribStarts: 3,
          attribEnds: 32,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`22 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - B`, () => {
  let gathered = [];
  let value = `<a b="c{%- x %}d{%- y %}e{%- z %}f">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 36,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 34,
          attribValueRaw: "c{%- x %}d{%- y %}e{%- z %}f",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{%- x %}",
              head: "{%-",
              headStartsAt: 7,
              headEndsAt: 10,
              tail: "%}",
              tailStartsAt: 13,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "d",
            },
            {
              type: "esp",
              start: 16,
              end: 24,
              value: "{%- y %}",
              head: "{%-",
              headStartsAt: 16,
              headEndsAt: 19,
              tail: "%}",
              tailStartsAt: 22,
              tailEndsAt: 24,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: "e",
            },
            {
              type: "esp",
              start: 25,
              end: 33,
              value: "{%- z %}",
              head: "{%-",
              headStartsAt: 25,
              headEndsAt: 28,
              tail: "%}",
              tailStartsAt: 31,
              tailEndsAt: 33,
            },
            {
              type: "text",
              start: 33,
              end: 34,
              value: "f",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 34,
          attribStarts: 3,
          attribEnds: 35,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`23 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`, () => {
  let gathered = [];
  let value = `<a b="c{% x -%}d{% y -%}e{% z -%}f">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 36,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 34,
          attribValueRaw: "c{% x -%}d{% y -%}e{% z -%}f",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{% x -%}",
              head: "{%",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "d",
            },
            {
              type: "esp",
              start: 16,
              end: 24,
              value: "{% y -%}",
              head: "{%",
              headStartsAt: 16,
              headEndsAt: 18,
              tail: "-%}",
              tailStartsAt: 21,
              tailEndsAt: 24,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: "e",
            },
            {
              type: "esp",
              start: 25,
              end: 33,
              value: "{% z -%}",
              head: "{%",
              headStartsAt: 25,
              headEndsAt: 27,
              tail: "-%}",
              tailStartsAt: 30,
              tailEndsAt: 33,
            },
            {
              type: "text",
              start: 33,
              end: 34,
              value: "f",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 34,
          attribStarts: 3,
          attribEnds: 35,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`24 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`, () => {
  let gathered = [];
  let value = `<a b="c{%- x %}d{% y -%}e{%- z %}f">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 36,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 34,
          attribValueRaw: "c{%- x %}d{% y -%}e{%- z %}f",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{%- x %}",
              head: "{%-",
              headStartsAt: 7,
              headEndsAt: 10,
              tail: "%}",
              tailStartsAt: 13,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "d",
            },
            {
              type: "esp",
              start: 16,
              end: 24,
              value: "{% y -%}",
              head: "{%",
              headStartsAt: 16,
              headEndsAt: 18,
              tail: "-%}",
              tailStartsAt: 21,
              tailEndsAt: 24,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: "e",
            },
            {
              type: "esp",
              start: 25,
              end: 33,
              value: "{%- z %}",
              head: "{%-",
              headStartsAt: 25,
              headEndsAt: 28,
              tail: "%}",
              tailStartsAt: 31,
              tailEndsAt: 33,
            },
            {
              type: "text",
              start: 33,
              end: 34,
              value: "f",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 34,
          attribStarts: 3,
          attribEnds: 35,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`25 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`, () => {
  let gathered = [];
  let value = `<a b="c{% x -%}d{%- y %}e{% z -%}f">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 36,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 34,
          attribValueRaw: "c{% x -%}d{%- y %}e{% z -%}f",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{% x -%}",
              head: "{%",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "d",
            },
            {
              type: "esp",
              start: 16,
              end: 24,
              value: "{%- y %}",
              head: "{%-",
              headStartsAt: 16,
              headEndsAt: 19,
              tail: "%}",
              tailStartsAt: 22,
              tailEndsAt: 24,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: "e",
            },
            {
              type: "esp",
              start: 25,
              end: 33,
              value: "{% z -%}",
              head: "{%",
              headStartsAt: 25,
              headEndsAt: 27,
              tail: "-%}",
              tailStartsAt: 30,
              tailEndsAt: 33,
            },
            {
              type: "text",
              start: 33,
              end: 34,
              value: "f",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 34,
          attribStarts: 3,
          attribEnds: 35,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test(`26 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`, () => {
  let gathered = [];
  let value = `<a\tb="c{% x -%}d{%- y %}e{%- z %}f">`;
  ct(value, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 36,
      value,
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: false,
      kind: "inline",
      attribs: [
        {
          attribName: "b",
          attribNameRecognised: false,
          attribNameStartsAt: 3,
          attribNameEndsAt: 4,
          attribOpeningQuoteAt: 5,
          attribClosingQuoteAt: 34,
          attribValueRaw: "c{% x -%}d{%- y %}e{%- z %}f",
          attribValue: [
            {
              type: "text",
              start: 6,
              end: 7,
              value: "c",
            },
            {
              type: "esp",
              start: 7,
              end: 15,
              value: "{% x -%}",
              head: "{%",
              headStartsAt: 7,
              headEndsAt: 9,
              tail: "-%}",
              tailStartsAt: 12,
              tailEndsAt: 15,
            },
            {
              type: "text",
              start: 15,
              end: 16,
              value: "d",
            },
            {
              type: "esp",
              start: 16,
              end: 24,
              value: "{%- y %}",
              head: "{%-",
              headStartsAt: 16,
              headEndsAt: 19,
              tail: "%}",
              tailStartsAt: 22,
              tailEndsAt: 24,
            },
            {
              type: "text",
              start: 24,
              end: 25,
              value: "e",
            },
            {
              type: "esp",
              start: 25,
              end: 33,
              value: "{%- z %}",
              head: "{%-",
              headStartsAt: 25,
              headEndsAt: 28,
              tail: "%}",
              tailStartsAt: 31,
              tailEndsAt: 33,
            },
            {
              type: "text",
              start: 33,
              end: 34,
              value: "f",
            },
          ],
          attribValueStartsAt: 6,
          attribValueEndsAt: 34,
          attribStarts: 3,
          attribEnds: 35,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test.run();
