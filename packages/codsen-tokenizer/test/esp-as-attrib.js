import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// ESP tags in the tag attributes
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"basic"}\u001b[${39}m`} - one Nunjucks tag goes in as attribute`, () => {
  let gathered = [];
  ct("<td{% z %}>", {
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
        end: 11,
        value: "<td{% z %}>",
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
            type: "esp",
            start: 3,
            end: 10,
            value: "{% z %}",
            head: "{%",
            headStartsAt: 3,
            headEndsAt: 5,
            tail: "%}",
            tailStartsAt: 8,
            tailEndsAt: 10,
          },
        ],
      },
    ],
    "01.01",
  );
});

test(`02 - ${`\u001b[${36}m${"basic"}\u001b[${39}m`} - Nunjucks conditionals wrapping an attr`, () => {
  let gathered = [];
  ct('<td{% x %} class="z"{% y %} id="z">', {
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
        value: '<td{% x %} class="z"{% y %} id="z">',
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
            type: "esp",
            start: 3,
            end: 10,
            value: "{% x %}",
            head: "{%",
            headStartsAt: 3,
            headEndsAt: 5,
            tail: "%}",
            tailStartsAt: 8,
            tailEndsAt: 10,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 11,
            attribNameEndsAt: 16,
            attribOpeningQuoteAt: 17,
            attribClosingQuoteAt: 19,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 18,
                end: 19,
                value: "z",
              },
            ],
            attribValueStartsAt: 18,
            attribValueEndsAt: 19,
            attribStarts: 11,
            attribEnds: 20,
            attribLeft: 9,
          },
          {
            type: "esp",
            start: 20,
            end: 27,
            value: "{% y %}",
            head: "{%",
            headStartsAt: 20,
            headEndsAt: 22,
            tail: "%}",
            tailStartsAt: 25,
            tailEndsAt: 27,
          },
          {
            attribName: "id",
            attribNameRecognised: true,
            attribNameStartsAt: 28,
            attribNameEndsAt: 30,
            attribOpeningQuoteAt: 31,
            attribClosingQuoteAt: 33,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 32,
                end: 33,
                value: "z",
              },
            ],
            attribValueStartsAt: 32,
            attribValueEndsAt: 33,
            attribStarts: 28,
            attribEnds: 34,
            attribLeft: 26,
          },
        ],
      },
    ],
    "02.01",
  );
});

test(`03 - ${`\u001b[${36}m${"basic"}\u001b[${39}m`} - Nunjucks conditionals wrapping an attr`, () => {
  let gathered = [];
  ct('<td{% if something %} class="z"{% endif %} id="y">', {
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
        end: 50,
        value: '<td{% if something %} class="z"{% endif %} id="y">',
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
            type: "esp",
            start: 3,
            end: 21,
            value: "{% if something %}",
            head: "{%",
            headStartsAt: 3,
            headEndsAt: 5,
            tail: "%}",
            tailStartsAt: 19,
            tailEndsAt: 21,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 22,
            attribNameEndsAt: 27,
            attribOpeningQuoteAt: 28,
            attribClosingQuoteAt: 30,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 29,
                end: 30,
                value: "z",
              },
            ],
            attribValueStartsAt: 29,
            attribValueEndsAt: 30,
            attribStarts: 22,
            attribEnds: 31,
            attribLeft: 20,
          },
          {
            type: "esp",
            start: 31,
            end: 42,
            value: "{% endif %}",
            head: "{%",
            headStartsAt: 31,
            headEndsAt: 33,
            tail: "%}",
            tailStartsAt: 40,
            tailEndsAt: 42,
          },
          {
            attribName: "id",
            attribNameRecognised: true,
            attribNameStartsAt: 43,
            attribNameEndsAt: 45,
            attribOpeningQuoteAt: 46,
            attribClosingQuoteAt: 48,
            attribValueRaw: "y",
            attribValue: [
              {
                type: "text",
                start: 47,
                end: 48,
                value: "y",
              },
            ],
            attribValueStartsAt: 47,
            attribValueEndsAt: 48,
            attribStarts: 43,
            attribEnds: 49,
            attribLeft: 41,
          },
        ],
      },
    ],
    "03.01",
  );
});

test.run();
