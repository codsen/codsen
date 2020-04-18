const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. healthy html, no tricks
// -----------------------------------------------------------------------------

t.test("01.01 - text-tag-text", (t) => {
  const gathered = [];
  ct("  <a>z", {
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
        end: 2,
      },
      {
        type: "tag",
        start: 2,
        end: 5,
      },
      {
        type: "text",
        start: 5,
        end: 6,
      },
    ],
    "01.01"
  );
  t.is(gathered.length, 3);
  t.end();
});

t.test("01.02 - text only", (t) => {
  const gathered = [];
  ct("  ", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2,
        value: "  ",
      },
    ],
    "01.02"
  );
  t.end();
});

t.test("01.03 - opening tag only", (t) => {
  const gathered = [];
  ct("<a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
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

        kind: null,
        attribs: [],
      },
    ],
    "01.03"
  );
  t.end();
});

t.test("01.04 - closing tag only", (t) => {
  const gathered = [];
  ct("</a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
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

        kind: null,
        attribs: [],
      },
    ],
    "01.04"
  );
  t.end();
});

// notice the tag name case is upper:
t.test("01.05 - self-closing tag only", (t) => {
  const gathered = [];
  ct("<BR/>", {
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
        tagName: "br",
        closing: false,
        void: true,
        start: 0,
        end: 5,
      },
    ],
    "01.05"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.06 - multiple tags", (t) => {
  const gathered = [];
  ct("<a><b><c>", {
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
        end: 3,
      },
      {
        type: "tag",
        start: 3,
        end: 6,
      },
      {
        type: "tag",
        start: 6,
        end: 9,
      },
    ],
    "01.06"
  );
  t.is(gathered.length, 3);
  t.end();
});

t.test("01.07 - closing bracket in the attribute's value", (t) => {
  const gathered = [];
  ct(`<a alt=">">`, {
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
      },
    ],
    "01.07"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.08 - closing bracket layers of nested quotes", (t) => {
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
    "01.08"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.09 - bracket as text", (t) => {
  const gathered = [];
  ct("a < b", {
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
        end: 5,
      },
    ],
    "01.09"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.10 - tag followed by brackets", (t) => {
  const gathered = [];
  ct(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj, next) => {
      gathered.push(
        Object.assign({}, obj, {
          next,
        })
      );
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
    "01.10"
  );
  t.is(gathered.length, 6);
  t.end();
});

t.test("01.11 - html5 doctype", (t) => {
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
      },
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
    "01.11"
  );
  t.is(gathered.length, 3);
  t.end();
});

t.test("01.12 - xhtml doctype", (t) => {
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
    "01.12"
  );
  t.is(gathered.length, 5);
  t.end();
});

t.test("01.13 - xhtml DTD doctype", (t) => {
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
    "01.13"
  );
  t.is(gathered.length, 7);
  t.end();
});

t.test("01.14 - void tags", (t) => {
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
    "01.14"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.15 - recognised tags", (t) => {
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
    "01.15"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.16 - unrecognised tags", (t) => {
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
    "01.16"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.17 - wrong case but still recognised tags", (t) => {
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
    "01.17"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.18 - correct HTML5 doctype", (t) => {
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
    "01.18"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.19 - correct HTML5 doctype", (t) => {
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
    "01.19"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.20 - tag names with numbers", (t) => {
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
    "01.20"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.21 - exact match, tag pair with whitespace", (t) => {
  const gathered = [];
  ct("<a href> </a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
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

        kind: null,
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
            attribStart: 3,
            attribEnd: 7,
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

        kind: null,
        attribs: [],
      },
    ],
    "01.21"
  );
  t.is(gathered.length, 3);
  t.end();
});

t.test("01.22 - closing tag with attributes", (t) => {
  const gathered = [];
  ct(`</a class="z">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
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

        kind: null,
        attribs: [
          {
            attribName: "class",
            attribStart: 4,
            attribEnd: 13,
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
          },
        ],
      },
    ],
    "01.22"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("01.23 - empty style tag pair", (t) => {
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
    "01.23"
  );
  t.is(gathered.length, 3);
  t.end();
});

t.test("01.24 - line break", (t) => {
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

        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 4,
        end: 6,
        value: "\nb",
      },
    ],
    "01.24"
  );
  t.is(gathered.length, 3);
  t.end();
});

t.test("01.25 - dir attribute is also a known valid tag name", (t) => {
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
    "01.23"
  );
  t.is(gathered.length, 1);
  t.end();
});

// 02. CDATA
// -----------------------------------------------------------------------------

t.test("02.01 - CDATA - correct", (t) => {
  const gathered = [];
  ct(`<![CDATA[x<y]]>`, {
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
        kind: "cdata",
      },
    ],
    "02.01"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("02.02 - CDATA - messed up 1", (t) => {
  const gathered = [];
  ct(`<[CDATA[x<y]]>`, {
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
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "02.02"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("02.03 - CDATA - messed up 2", (t) => {
  const gathered = [];
  ct(`<!CDATA[x<y]]>`, {
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
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "02.03"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("02.04 - CDATA - messed up 3", (t) => {
  const gathered = [];
  ct(`<![ CData[x<y]]>`, {
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
        void: false,
        recognised: true,
        kind: "cdata",
      },
    ],
    "02.04"
  );
  t.is(gathered.length, 1);
  t.end();
});

t.test("02.05 - CDATA - with line breaks", (t) => {
  const gathered = [];
  ct(
    `a\n<![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]>\nb`,
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
        end: 2,
      },
      {
        type: "tag",
        start: 2,
        end: 90,
        void: false,
        recognised: true,
        kind: "cdata",
      },
      {
        type: "text",
        start: 90,
        end: 92,
      },
    ],
    "02.05"
  );
  t.is(gathered.length, 3);
  t.end();
});

// 03. XML
// -----------------------------------------------------------------------------

t.test("03.01 - XML - correct", (t) => {
  const gathered = [];
  ct(`<?xml version="1.0" encoding="UTF-8"?>`, {
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
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "03.01"
  );
  t.end();
});

t.test("03.02 - XML - incorrect 1", (t) => {
  const gathered = [];
  ct(`< ?xml version="1.0" encoding="UTF-8"?>`, {
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
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "03.02"
  );
  t.end();
});

t.test("03.03 - XML - incorrect 2", (t) => {
  const gathered = [];
  ct(`<? xml version="1.0" encoding="UTF-8"?>`, {
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
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "03.03"
  );
  t.end();
});

t.test("03.04 - XML - incorrect 3", (t) => {
  const gathered = [];
  ct(`< ?XML version="1.0" encoding="UTF-8"?>`, {
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
        void: false,
        recognised: true,
        kind: "xml",
      },
    ],
    "03.04"
  );
  t.end();
});

// 04. custom tags
// -----------------------------------------------------------------------------

t.test("04.01 - unrecognised tag name", (t) => {
  const gathered = [];
  ct("<something>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
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
    "04.01"
  );
  t.end();
});

t.test("04.02 - unrecognised tag name with dash", (t) => {
  const gathered = [];
  ct("<something-here>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
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
    "04.01"
  );
  t.end();
});

// 05. lookaheads
// -----------------------------------------------------------------------------

t.test(`06.01 - lookaheads - tag followed by brackets - without next`, (t) => {
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
    "01.10"
  );
  t.is(gathered.length, 6);
  t.end();
});

t.test(`06.02 - lookaheads - tag followed by brackets - with next`, (t) => {
  const gathered = [];
  ct(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj, next) => {
      gathered.push(
        Object.assign({}, obj, {
          next,
        })
      );
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
    "01.10"
  );
  t.is(gathered.length, 6);
  t.end();
});

t.test(`06.02 - lookaheads - html5 doctype`, (t) => {
  const gathered = [];
  ct("a<!DOCTYPE html>b", {
    tagCb: (obj, next) => {
      gathered.push(
        Object.assign({}, obj, {
          next,
        })
      );
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
    "06.02"
  );
  t.is(gathered.length, 3);
  t.end();
});
