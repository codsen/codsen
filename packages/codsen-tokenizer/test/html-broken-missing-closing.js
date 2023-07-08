import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";
// const BACKSLASH = "\u005C";

// 01. general tests, exact matching via t.strictDeepEqual
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"exact key set matching"}\u001b[${39}m`}`, () => {
  let gathered = [];
  ct("<a\n<b>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        start: 0,
        end: 2,
        value: "<a",
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        kind: "inline",
        attribs: [],
      },
      {
        type: "text",
        start: 2,
        end: 3,
        value: "\n",
      },
      {
        type: "tag",
        start: 3,
        end: 6,
        value: "<b>",
        tagNameStartsAt: 4,
        tagNameEndsAt: 5,
        tagName: "b",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "01.01",
  );
});

test(`02 - ${`\u001b[${33}m${"exact key set matching"}\u001b[${39}m`}`, () => {
  let gathered = [];
  ct('<a href="z" click here</a>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        start: 0,
        end: 12,
        value: '<a href="z" ',
        type: "tag",
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [
          {
            attribName: "href",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: 10,
            attribValueRaw: "z",
            attribValue: [
              {
                type: "text",
                start: 9,
                end: 10,
                value: "z",
              },
            ],
            attribValueStartsAt: 9,
            attribValueEndsAt: 10,
            attribStarts: 3,
            attribEnds: 11,
            attribLeft: 1,
          },
        ],
      },
      {
        type: "text",
        start: 12,
        end: 22,
        value: "click here",
      },
      {
        type: "tag",
        start: 22,
        end: 26,
        value: "</a>",
        tagNameStartsAt: 24,
        tagNameEndsAt: 25,
        tagName: "a",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "02.01",
  );
});

// 02. tag pair
// -----------------------------------------------------------------------------

test(`03 - ${`\u001b[${33}m${"tag pair"}\u001b[${39}m`} - space is melded into tag's range`, () => {
  let gathered = [];
  // notice space at index 11:
  ct('<a href="z" click here</a>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
    gathered,
    [
      {
        start: 0,
        end: 12, // not 11
        type: "tag",
      },
      {
        start: 12, // not 11
        end: 22,
        type: "text",
      },
      {
        start: 22,
        end: 26,
        type: "tag",
      },
    ],
    "03",
  );
});

test(`04 - ${`\u001b[${33}m${"tag pair"}\u001b[${39}m`} - two spaces`, () => {
  let gathered = [];
  // notice space at index 11:
  ct('<a href="z"  click here</a>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
    gathered,
    [
      {
        start: 0,
        end: 11, // not 13
        type: "tag",
      },
      {
        start: 11, // not 13
        end: 23,
        type: "text",
      },
      {
        start: 23,
        end: 27,
        type: "tag",
      },
    ],
    "04",
  );
});

test(`05 - ${`\u001b[${33}m${"tag pair"}\u001b[${39}m`} - no spaces`, () => {
  let gathered = [];
  ct('<a href="z"click here</a>', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
    gathered,
    [
      {
        start: 0,
        end: 11,
        type: "tag",
      },
      {
        start: 11,
        end: 21,
        type: "text",
      },
      {
        start: 21,
        end: 25,
        type: "tag",
      },
    ],
    "05",
  );
});

// 03. missing bracket followed by opening bracket
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${36}m${"tag follows"}\u001b[${39}m`} - tight`, () => {
  let gathered = [];
  ct("<a><b>c</b</a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(
    ok,
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 3,
        value: "<a>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "tag",
        start: 3,
        end: 6,
        value: "<b>",
        tagNameStartsAt: 4,
        tagNameEndsAt: 5,
        tagName: "b",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "text",
        start: 6,
        end: 7,
        value: "c",
      },
      {
        type: "tag",
        start: 7,
        end: 10,
        value: "</b",
        tagNameStartsAt: 9,
        tagNameEndsAt: 10,
        tagName: "b",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "tag",
        start: 10,
        end: 14,
        value: "</a>",
        tagNameStartsAt: 12,
        tagNameEndsAt: 13,
        tagName: "a",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
    ],
    "06",
  );
});

test(`07 - ${`\u001b[${36}m${"tag follows"}\u001b[${39}m`} - void tag without slash follow by a tag`, () => {
  let gathered = [];
  ct("<br<div>", {
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
        end: 3,
        value: "<br",
        tagNameStartsAt: 1,
        tagNameEndsAt: 3,
        tagName: "br",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "tag",
        start: 3,
        end: 8,
        value: "<div>",
        tagNameStartsAt: 4,
        tagNameEndsAt: 7,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "07.01",
  );
});

test(`08 - ${`\u001b[${36}m${"tag follows"}\u001b[${39}m`} - void tag without slash follow by a tag`, () => {
  let gathered = [];
  ct("<br/<div>", {
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
        end: 4,
        value: "<br/",
        tagNameStartsAt: 1,
        tagNameEndsAt: 3,
        tagName: "br",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "tag",
        start: 4,
        end: 9,
        value: "<div>",
        tagNameStartsAt: 5,
        tagNameEndsAt: 8,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "08.01",
  );
});

test(`09 - ${`\u001b[${36}m${"tag follows"}\u001b[${39}m`} - void tag without slash follow by whitespace, then a tag`, () => {
  let gathered = [];
  ct("<br/    <div>", {
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
        end: 4,
        value: "<br/",
        tagNameStartsAt: 1,
        tagNameEndsAt: 3,
        tagName: "br",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: "inline",
        attribs: [],
      },
      {
        type: "text",
        start: 4,
        end: 8,
        value: "    ",
      },
      {
        type: "tag",
        start: 8,
        end: 13,
        value: "<div>",
        tagNameStartsAt: 9,
        tagNameEndsAt: 12,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "09.01",
  );
});

// 04. EOL ends the input and tag abruptly ends
// -----------------------------------------------------------------------------

test("10 - abruptly ended after tag name", () => {
  let gathered = [];
  ct("</div", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        start: 0,
        end: 5,
        value: "</div",
        tagNameStartsAt: 2,
        tagNameEndsAt: 5,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,

        type: "tag",
        kind: null,
        attribs: [],
      },
    ],
    "10.01",
  );
});

// -----------------------------------------------------------------------------

// TODO

// - tag pair: truncated at the various levels of the attribute:
// <a href</a>
// <a href </a>
// <a href=</a>
// <a href= </a>
// <a href="</a>
// <a href=" </a>
// <a href="z</a>
// <a href="z </a>
// <a href="z"</a>
// <a href="z" </a>
// <a href="z" click</a>
// <a href="z" click here</a>

// - different tags: truncated at the various levels of the attribute:
// <a href<b>
// <a href <b>
// <a href=<b>
// <a href= <b>
// <a href="<b>
// <a href=" <b>
// <a href="z<b>
// <a href="z <b>
// <a href="z"<b>
// <a href="z" <b>
// <a href="z" click<b>
// <a href="z" click here<b>

test.run();
