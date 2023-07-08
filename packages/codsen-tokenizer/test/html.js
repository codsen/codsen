import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// 01. healthy html, no tricks
// -----------------------------------------------------------------------------

test("01 - text-tag-text", () => {
  let gathered = [];
  ct("  <a>z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 2,
      value: "  ",
    },
    {
      type: "tag",
      start: 2,
      end: 5,
      value: "<a>",
      tagNameStartsAt: 3,
      tagNameEndsAt: 4,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
    {
      type: "text",
      start: 5,
      end: 6,
      value: "z",
    },
  ]);
});

test("02 - text only", () => {
  let gathered = [];
  ct("  ", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 2,
      value: "  ",
    },
  ]);
});

test("03 - opening tag only", () => {
  let gathered = [];
  ct("<a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
  ]);
});

test("04 - closing tag only", () => {
  let gathered = [];
  ct("</a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 4,
      value: "</a>",
      tagNameStartsAt: 2,
      tagNameEndsAt: 3,
      tagName: "a",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
  ]);
});

// notice the tag name case is upper:
test("05 - self-closing tag only", () => {
  let gathered = [];
  ct("<BR/>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 5,
      value: "<BR/>",
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
  ]);
});

test("06 - multiple tags", () => {
  let gathered = [];
  ct("<a><b><c>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
      type: "tag",
      start: 6,
      end: 9,
      value: "<c>",
      tagNameStartsAt: 7,
      tagNameEndsAt: 8,
      tagName: "c",
      recognised: false, // <---
      closing: false,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [],
    },
  ]);
});

test("07", () => {
  let gathered = [];
  ct('<x src="b" a />', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 15,
      value: '<x src="b" a />',
      tagNameStartsAt: 1,
      tagNameEndsAt: 2,
      tagName: "x",
      recognised: false,
      closing: false,
      void: false,
      pureHTML: true,
      kind: null,
      attribs: [
        {
          attribName: "src",
          attribNameRecognised: true,
          attribNameStartsAt: 3,
          attribNameEndsAt: 6,
          attribOpeningQuoteAt: 7,
          attribClosingQuoteAt: 9,
          attribValueRaw: "b",
          attribValue: [
            {
              type: "text",
              start: 8,
              end: 9,
              value: "b",
            },
          ],
          attribValueStartsAt: 8,
          attribValueEndsAt: 9,
          attribStarts: 3,
          attribEnds: 10,
          attribLeft: 1,
        },
        {
          attribName: "a",
          attribNameRecognised: false,
          attribNameStartsAt: 11,
          attribNameEndsAt: 12,
          attribOpeningQuoteAt: null,
          attribClosingQuoteAt: null,
          attribValueRaw: null,
          attribValue: [],
          attribValueStartsAt: null,
          attribValueEndsAt: null,
          attribStarts: 11,
          attribEnds: 12,
          attribLeft: 9,
        },
      ],
    },
  ]);
});

test("08 - closing bracket in the attribute's value", () => {
  let gathered = [];
  ct('<a alt=">">', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 11,
      value: '<a alt=">">',
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
          attribName: "alt",
          attribNameRecognised: true,
          attribNameStartsAt: 3,
          attribNameEndsAt: 6,
          attribOpeningQuoteAt: 7,
          attribClosingQuoteAt: 9,
          attribValueRaw: ">",
          attribValue: [
            {
              type: "text",
              start: 8,
              end: 9,
              value: ">",
            },
          ],
          attribValueStartsAt: 8,
          attribValueEndsAt: 9,
          attribStarts: 3,
          attribEnds: 10,
          attribLeft: 1,
        },
      ],
    },
  ]);
});

test("09 - closing bracket layers of nested quotes", () => {
  let gathered = [];
  ct("<a alt='\"'\">\"'\"'>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 17,
    },
  ]);
});

test("10 - bracket as text", () => {
  let gathered = [];
  ct("a < b", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 5,
      value: "a < b",
    },
  ]);
});

test("11 - tag followed by brackets", () => {
  let gathered = [];
  ct("<a>\"something\"<span>'here'</span></a>", {
    tagCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      tagName: "a",
      closing: false,
      void: false,
      start: 0,
      end: 3,
    },
    {
      type: "text",
      start: 3,
      end: 14,
    },
    {
      type: "tag",
      tagName: "span",
      closing: false,
      void: false,
      start: 14,
      end: 20,
    },
    {
      type: "text",
      start: 20,
      end: 26,
    },
    {
      type: "tag",
      tagName: "span",
      closing: true,
      void: false,
      start: 26,
      end: 33,
    },
    {
      type: "tag",
      tagName: "a",
      closing: true,
      void: false,
      start: 33,
      end: 37,
    },
  ]);
});

test("12 - html5 doctype", () => {
  let gathered = [];
  ct("a<!DOCTYPE html>b", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
      value: "a",
    },
    {
      type: "tag",
      start: 1,
      end: 16,
      value: "<!DOCTYPE html>",
      tagNameStartsAt: 3,
      tagNameEndsAt: 10,
      tagName: "doctype",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: true,
      kind: "doctype",
      attribs: [
        {
          attribName: "html",
          attribNameRecognised: false,
          attribNameStartsAt: 11,
          attribNameEndsAt: 15,
          attribOpeningQuoteAt: null,
          attribClosingQuoteAt: null,
          attribValueRaw: null,
          attribValue: [],
          attribValueStartsAt: null,
          attribValueEndsAt: null,
          attribStarts: 11,
          attribEnds: 15,
          attribLeft: 9,
        },
      ],
    },
    {
      type: "text",
      start: 16,
      end: 17,
      value: "b",
    },
  ]);
});

test("13 - xhtml doctype", () => {
  let gathered = [];
  ct(
    `z<!DOCTYPE html PUBLIC
  "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="ar" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">z`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    },
  );
  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
    },
    {
      type: "tag",
      start: 1,
      end: 126,
      kind: "doctype",
    },
    {
      type: "text",
      start: 126,
      end: 127,
    },
    {
      type: "tag",
      start: 127,
      end: 190,
    },
    {
      type: "text",
      start: 190,
      end: 191,
    },
  ]);
});

test("14 - xhtml DTD doctype", () => {
  let gathered = [];
  ct(
    `z<?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">z`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    },
  );
  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
    },
    {
      type: "tag",
      start: 1,
      end: 39,
      kind: "xml",
    },
    {
      type: "text",
      start: 39,
      end: 41,
    },
    {
      type: "tag",
      start: 41,
      end: 160,
      kind: "doctype",
    },
    {
      type: "text",
      start: 160,
      end: 162,
    },
    {
      type: "tag",
      start: 162,
      end: 229,
    },
    {
      type: "text",
      start: 229,
      end: 230,
    },
  ]);
});

test("15 - void tags", () => {
  let gathered = [];
  ct("<br>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 4,
      void: true,
    },
  ]);
});

test("16 - recognised tags", () => {
  let gathered = [];
  ct("<content>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 9,
      void: false,
      recognised: true,
    },
  ]);
});

test("17 - unrecognised tags", () => {
  let gathered = [];
  ct("<contentz>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 10,
      void: false,
      recognised: false,
    },
  ]);
});

test("18 - wrong case but still recognised tags", () => {
  let gathered = [];
  ct("</tablE>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 8,
      void: false,
      recognised: true,
    },
  ]);
});

test("19 - correct HTML5 doctype", () => {
  let gathered = [];
  ct("<!DOCTYPE html>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 15,
      void: false,
      recognised: true,
    },
  ]);
});

test("20 - correct HTML5 doctype", () => {
  let gathered = [];
  ct(
    `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    },
  );
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 105,
      void: false,
      recognised: true,
    },
  ]);
});

test("21 - tag names with numbers", () => {
  let gathered = [];
  ct("<h1>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      tagNameStartsAt: 1,
      tagNameEndsAt: 3,
      tagName: "h1",
      closing: false,
      recognised: true,
      void: false,
      start: 0,
      end: 4,
    },
  ]);
});

test("22 - exact match, tag pair with whitespace", () => {
  let gathered = [];
  ct("<a href> </a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 8,
      value: "<a href>",
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
          attribOpeningQuoteAt: null,
          attribClosingQuoteAt: null,
          attribValueRaw: null,
          attribValue: [],
          attribValueStartsAt: null,
          attribValueEndsAt: null,
          attribStarts: 3,
          attribEnds: 7,
          attribLeft: 1,
        },
      ],
    },
    {
      type: "text",
      start: 8,
      end: 9,
      value: " ",
    },
    {
      type: "tag",
      start: 9,
      end: 13,
      value: "</a>",
      tagNameStartsAt: 11,
      tagNameEndsAt: 12,
      tagName: "a",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
  ]);
});

test("23 - closing tag with attributes", () => {
  let gathered = [];
  ct('</a class="z">', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 14,
      value: '</a class="z">',
      tagNameStartsAt: 2,
      tagNameEndsAt: 3,
      tagName: "a",
      recognised: true,
      closing: true,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [
        {
          attribName: "class",
          attribNameRecognised: true,
          attribNameStartsAt: 4,
          attribNameEndsAt: 9,
          attribOpeningQuoteAt: 10,
          attribClosingQuoteAt: 12,
          attribValueRaw: "z",
          attribValue: [
            {
              type: "text",
              start: 11,
              end: 12,
              value: "z",
            },
          ],
          attribValueStartsAt: 11,
          attribValueEndsAt: 12,
          attribStarts: 4,
          attribEnds: 13,
          attribLeft: 2,
        },
      ],
    },
  ]);
});

test("24 - empty style tag pair", () => {
  let gathered = [];
  ct("<style>\n\n</style>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 7,
      tagNameStartsAt: 1,
      tagNameEndsAt: 6,
      tagName: "style",
      recognised: true,
      closing: false,
      void: false,
    },
    {
      type: "text",
      start: 7,
      end: 9,
    },
    {
      type: "tag",
      start: 9,
      end: 17,
      tagNameStartsAt: 11,
      tagNameEndsAt: 16,
      tagName: "style",
      recognised: true,
      closing: true,
      void: false,
    },
  ]);
});

test("25 - line break", () => {
  let gathered = [];
  ct("a<a>\nb", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
      value: "a",
    },
    {
      type: "tag",
      start: 1,
      end: 4,
      value: "<a>",
      tagNameStartsAt: 2,
      tagNameEndsAt: 3,
      tagName: "a",
      recognised: true,
      closing: false,
      void: false,
      pureHTML: true,
      kind: "inline",
      attribs: [],
    },
    {
      type: "text",
      start: 4,
      end: 6,
      value: "\nb",
    },
  ]);
});

test("26 - dir attribute is also a known valid tag name", () => {
  let gathered = [];
  ct('<html dir="ltr">', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 16,
      value: '<html dir="ltr">',
    },
  ]);
});

// 04. custom tags
// -----------------------------------------------------------------------------

test("27 - unrecognised tag name", () => {
  let gathered = [];
  ct("<something>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 11,
      value: "<something>",
      tagNameStartsAt: 1,
      tagNameEndsAt: 10,
      tagName: "something",
      recognised: false,
      closing: false,
      void: false,
      pureHTML: true,

      kind: null,
      attribs: [],
    },
  ]);
});

test("28 - unrecognised tag name with dash", () => {
  let gathered = [];
  ct("<something-here>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  compare(ok, gathered, [
    {
      type: "tag",
      start: 0,
      end: 16,
      value: "<something-here>",
      tagNameStartsAt: 1,
      tagNameEndsAt: 15,
      tagName: "something-here",
      recognised: false,
      closing: false,
      void: false,
      pureHTML: true,

      kind: null,
      attribs: [],
    },
  ]);
});

// 05. lookaheads
// -----------------------------------------------------------------------------

test("29 - lookaheads - tag followed by brackets - without next", () => {
  let gathered = [];
  ct("<a>\"something\"<span>'here'</span></a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
    tagCbLookahead: 3,
  });
  gathered.forEach((obj) => {
    // eslint-disable-next-line no-prototype-builtins
    not.ok(obj.hasOwnProperty("next"));
  });
  compare(ok, gathered, [
    {
      type: "tag",
      tagName: "a",
      closing: false,
      void: false,
      start: 0,
      end: 3,
    },
    {
      type: "text",
      start: 3,
      end: 14,
    },
    {
      type: "tag",
      tagName: "span",
      closing: false,
      void: false,
      start: 14,
      end: 20,
    },
    {
      type: "text",
      start: 20,
      end: 26,
    },
    {
      type: "tag",
      tagName: "span",
      closing: true,
      void: false,
      start: 26,
      end: 33,
    },
    {
      type: "tag",
      tagName: "a",
      closing: true,
      void: false,
      start: 33,
      end: 37,
    },
  ]);
});

test("30 - lookaheads - tag followed by brackets - with next", () => {
  let gathered = [];
  ct("<a>\"something\"<span>'here'</span></a>", {
    tagCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    tagCbLookahead: 3,
  });
  compare(ok, gathered, [
    {
      type: "tag",
      tagName: "a",
      closing: false,
      void: false,
      start: 0,
      end: 3,
      next: [
        {
          type: "text",
          start: 3,
          end: 14,
        },
        {
          type: "tag",
          tagName: "span",
          closing: false,
          void: false,
          start: 14,
          end: 20,
        },
        {
          type: "text",
          start: 20,
          end: 26,
        },
      ],
    },
    {
      type: "text",
      start: 3,
      end: 14,
      next: [
        {
          type: "tag",
          tagName: "span",
          closing: false,
          void: false,
          start: 14,
          end: 20,
        },
        {
          type: "text",
          start: 20,
          end: 26,
        },
        {
          type: "tag",
          tagName: "span",
          closing: true,
          void: false,
          start: 26,
          end: 33,
        },
      ],
    },
    {
      type: "tag",
      tagName: "span",
      closing: false,
      void: false,
      start: 14,
      end: 20,
      next: [
        {
          type: "text",
          start: 20,
          end: 26,
        },
        {
          type: "tag",
          tagName: "span",
          closing: true,
          void: false,
          start: 26,
          end: 33,
        },
        {
          type: "tag",
          tagName: "a",
          closing: true,
          void: false,
          start: 33,
          end: 37,
        },
      ],
    },
    {
      type: "text",
      start: 20,
      end: 26,
      next: [
        {
          type: "tag",
          tagName: "span",
          closing: true,
          void: false,
          start: 26,
          end: 33,
        },
        {
          type: "tag",
          tagName: "a",
          closing: true,
          void: false,
          start: 33,
          end: 37,
        },
      ],
    },
    {
      type: "tag",
      tagName: "span",
      closing: true,
      void: false,
      start: 26,
      end: 33,
      next: [
        {
          type: "tag",
          tagName: "a",
          closing: true,
          void: false,
          start: 33,
          end: 37,
        },
      ],
    },
    {
      type: "tag",
      tagName: "a",
      closing: true,
      void: false,
      start: 33,
      end: 37,
    },
  ]);
});

test("31 - lookaheads - html5 doctype", () => {
  let gathered = [];
  ct("a<!DOCTYPE html>b", {
    tagCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    tagCbLookahead: 5,
  });
  compare(ok, gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
      next: [
        {
          type: "tag",
          start: 1,
          end: 16,
          kind: "doctype",
        },
        {
          type: "text",
          start: 16,
          end: 17,
        },
      ],
    },
    {
      type: "tag",
      start: 1,
      end: 16,
      kind: "doctype",
      next: [
        {
          type: "text",
          start: 16,
          end: 17,
        },
      ],
    },
    {
      type: "text",
      start: 16,
      end: 17,
    },
  ]);
});

test.run();
