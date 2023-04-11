import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// 01. empty bracket pair
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"empty bracket pair"}\u001b[${39}m`} - empty`, () => {
  let gathered = [];
  ct("<>", {
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
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 0,
        end: 2,
      },
    ],
    "01"
  );
});

test(`02 - ${`\u001b[${36}m${"empty bracket pair"}\u001b[${39}m`} - empty`, () => {
  let gathered = [];
  ct("<>a", {
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
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 0,
        end: 2,
      },
      {
        type: "text",
        start: 2,
        end: 3,
      },
    ],
    "02"
  );
});

test(`03 - ${`\u001b[${36}m${"empty bracket pair"}\u001b[${39}m`} - space`, () => {
  let gathered = [];
  ct("< >", {
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
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 0,
        end: 3,
      },
    ],
    "03"
  );
});

test(`04 - ${`\u001b[${36}m${"empty bracket pair"}\u001b[${39}m`} - space`, () => {
  let gathered = [];
  ct("< >< >< >", {
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
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 0,
        end: 3,
      },
      {
        type: "tag",
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 3,
        end: 6,
      },
      {
        type: "tag",
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 6,
        end: 9,
      },
    ],
    "04"
  );
});

test(`05 - ${`\u001b[${36}m${"empty bracket pair"}\u001b[${39}m`} - space`, () => {
  let gathered = [];
  ct(" < > < > < > ", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
      },
      {
        type: "tag",
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 1,
        end: 4,
      },
      {
        type: "text",
        start: 4,
        end: 5,
      },
      {
        type: "tag",
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 5,
        end: 8,
      },
      {
        type: "text",
        start: 8,
        end: 9,
      },
      {
        type: "tag",
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        start: 9,
        end: 12,
      },
      {
        type: "text",
        start: 12,
        end: 13,
      },
    ],
    "05"
  );
});

test("06", () => {
  let gathered = [];
  ct("<div>some text /div>", {
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
        end: 5,
        value: "<div>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 5,
        end: 15,
        value: "some text ",
      },
      {
        type: "tag",
        start: 15,
        end: 20,
        value: "/div>",
        tagNameStartsAt: 16,
        tagNameEndsAt: 19,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "06"
  );
});

// 02. comment and comment-like tags
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${36}m${"comment-like"}\u001b[${39}m`} - one dash`, () => {
  let gathered = [];
  ct("<->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3,
        value: "<->",
      },
    ],
    "07.01"
  );
  is(gathered.length, 1, "07.01");
});

test(`08 - ${`\u001b[${36}m${"comment-like"}\u001b[${39}m`} - one dash`, () => {
  let gathered = [];
  ct("<-->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 4,
        value: "<-->",
      },
    ],
    "08.01"
  );
  is(gathered.length, 1, "08.01");
});

test(`09 - ${`\u001b[${36}m${"comment-like"}\u001b[${39}m`} - one dash`, () => {
  let gathered = [];
  ct("<----->", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 7,
        value: "<----->",
      },
    ],
    "09"
  );
});

// issues with attributes
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${36}m${"comment-like"}\u001b[${39}m`} - one dash`, () => {
  let gathered = [];
  ct('<img alt="/>', {
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
        end: 12,
        value: '<img alt="/>',
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
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: null,
            attribValueRaw: null,
            attribValue: [],
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStarts: 5,
            attribEnds: 10,
            attribLeft: 3,
          },
        ],
      },
    ],
    "10.01"
  );
});

test.run();
