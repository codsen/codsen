import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// 01. healthy html, no tricks
// -----------------------------------------------------------------------------

tap.test(`01 - text-tag-text`, (t) => {
  const gathered = [];
  ct(`  <a>z`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.strictSame(
    gathered,
    [
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
    ],
    "01"
  );
  t.end();
});

tap.test(`02 - text only`, (t) => {
  const gathered = [];
  ct("  ", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2,
        value: "  ",
      },
    ],
    "02"
  );
  t.end();
});

tap.test(`03 - opening tag only`, (t) => {
  const gathered = [];
  ct("<a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
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
    ],
    "03"
  );
  t.end();
});

tap.test(`04 - closing tag only`, (t) => {
  const gathered = [];
  ct("</a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
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
    ],
    "04"
  );
  t.end();
});

// notice the tag name case is upper:
tap.test(`05 - self-closing tag only`, (t) => {
  const gathered = [];
  ct("<BR/>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
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
    ],
    "05"
  );
  t.end();
});

tap.test(`06 - multiple tags`, (t) => {
  const gathered = [];
  ct("<a><b><c>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
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
    ],
    "06"
  );
  t.end();
});

tap.test(`07 - closing bracket in the attribute's value`, (t) => {
  const gathered = [];
  ct(`<a alt=">">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
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
            attribEnd: 10,
            attribLeft: 1,
          },
        ],
      },
    ],
    "07"
  );
  t.end();
});

tap.test(`08 - closing bracket layers of nested quotes`, (t) => {
  const gathered = [];
  ct(`<a alt='"'">"'"'>`, {
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
        end: 17,
      },
    ],
    "08"
  );
  t.end();
});

tap.test(`09 - bracket as text`, (t) => {
  const gathered = [];
  ct("a < b", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 5,
        value: "a < b",
      },
    ],
    "09"
  );
  t.end();
});

tap.test(`10 - tag followed by brackets`, (t) => {
  const gathered = [];
  ct(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
  });
  t.match(
    gathered,
    [
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
    ],
    "10"
  );
  t.end();
});

tap.test(`11 - html5 doctype`, (t) => {
  const gathered = [];
  ct("a<!DOCTYPE html>b", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
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
            attribEnd: 15,
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
    ],
    "11"
  );
  t.end();
});

tap.test(`12 - xhtml doctype`, (t) => {
  const gathered = [];
  ct(
    `z<!DOCTYPE html PUBLIC
  "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="ar" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">z`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.match(
    gathered,
    [
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
    ],
    "12"
  );
  t.end();
});

tap.test(`13 - xhtml DTD doctype`, (t) => {
  const gathered = [];
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
    }
  );
  t.match(
    gathered,
    [
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
    ],
    "13"
  );
  t.end();
});

tap.test(`14 - void tags`, (t) => {
  const gathered = [];
  ct("<br>", {
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
        end: 4,
        void: true,
      },
    ],
    "14"
  );
  t.end();
});

tap.test(`15 - recognised tags`, (t) => {
  const gathered = [];
  ct("<content>", {
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
        end: 9,
        void: false,
        recognised: true,
      },
    ],
    "15"
  );
  t.end();
});

tap.test(`16 - unrecognised tags`, (t) => {
  const gathered = [];
  ct("<contentz>", {
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
        end: 10,
        void: false,
        recognised: false,
      },
    ],
    "16"
  );
  t.end();
});

tap.test(`17 - wrong case but still recognised tags`, (t) => {
  const gathered = [];
  ct("</tablE>", {
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
        end: 8,
        void: false,
        recognised: true,
      },
    ],
    "17"
  );
  t.end();
});

tap.test(`18 - correct HTML5 doctype`, (t) => {
  const gathered = [];
  ct("<!DOCTYPE html>", {
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
        end: 15,
        void: false,
        recognised: true,
      },
    ],
    "18"
  );
  t.end();
});

tap.test(`19 - correct HTML5 doctype`, (t) => {
  const gathered = [];
  ct(
    `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.match(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 105,
        void: false,
        recognised: true,
      },
    ],
    "19"
  );
  t.end();
});

tap.test(`20 - tag names with numbers`, (t) => {
  const gathered = [];
  ct("<h1>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
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
    ],
    "20"
  );
  t.end();
});

tap.test(`21 - exact match, tag pair with whitespace`, (t) => {
  const gathered = [];
  ct("<a href> </a>", {
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
            attribEnd: 7,
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
    ],
    "21"
  );
  t.end();
});

tap.test(`22 - closing tag with attributes`, (t) => {
  const gathered = [];
  ct(`</a class="z">`, {
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
        end: 14,
        value: `</a class="z">`,
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
            attribEnd: 13,
            attribLeft: 2,
          },
        ],
      },
    ],
    "22"
  );
  t.end();
});

tap.test(`23 - empty style tag pair`, (t) => {
  const gathered = [];
  ct(`<style>\n\n</style>`, {
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
    ],
    "23"
  );
  t.end();
});

tap.test(`24 - line break`, (t) => {
  const gathered = [];
  ct(`a<a>\nb`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
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
    ],
    "24"
  );
  t.end();
});

tap.test(`25 - dir attribute is also a known valid tag name`, (t) => {
  const gathered = [];
  ct(`<html dir="ltr">`, {
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
        end: 16,
        value: `<html dir="ltr">`,
      },
    ],
    "25"
  );
  t.end();
});

// 04. custom tags
// -----------------------------------------------------------------------------

tap.test("26 - unrecognised tag name", (t) => {
  const gathered = [];
  ct("<something>", {
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
        end: 11,
        value: `<something>`,
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
    ],
    "26"
  );
  t.end();
});

tap.test("27 - unrecognised tag name with dash", (t) => {
  const gathered = [];
  ct("<something-here>", {
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
        end: 16,
        value: `<something-here>`,
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
    ],
    "27"
  );
  t.end();
});

// 05. lookaheads
// -----------------------------------------------------------------------------

tap.test(`28 - lookaheads - tag followed by brackets - without next`, (t) => {
  const gathered = [];
  ct(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
    tagCbLookahead: 3,
  });
  gathered.forEach((obj) => {
    // eslint-disable-next-line no-prototype-builtins
    t.false(obj.hasOwnProperty("next"));
  });
  t.match(
    gathered,
    [
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
    ],
    "28"
  );
  t.end();
});

tap.test(`29 - lookaheads - tag followed by brackets - with next`, (t) => {
  const gathered = [];
  ct(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    tagCbLookahead: 3,
  });
  t.match(
    gathered,
    [
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
    ],
    "29"
  );
  t.end();
});

tap.test(`30 - lookaheads - html5 doctype`, (t) => {
  const gathered = [];
  ct("a<!DOCTYPE html>b", {
    tagCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    tagCbLookahead: 5,
  });
  t.match(
    gathered,
    [
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
    ],
    "30"
  );
  t.end();
});
