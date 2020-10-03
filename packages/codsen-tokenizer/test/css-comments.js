import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// css comments
// -----------------------------------------------------------------------------

tap.only(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - head style, one rule, no linebreaks`,
  (t) => {
    const gathered = [];
    ct(`<style>/* comment */</style>`, {
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
          tagName: "style",
        },
        {
          type: "comment",
          start: 7,
          end: 9,
          value: "/*",
          closing: false,
          kind: "block",
          language: "css",
        },
        {
          type: "text",
          start: 9,
          end: 18,
          value: " comment ",
        },
        {
          type: "comment",
          start: 18,
          end: 20,
          value: "*/",
          closing: true,
          kind: "block",
          language: "css",
        },
        {
          type: "tag",
          start: 20,
          end: 28,
          tagName: "style",
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.todo(
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style`,
  (t) => {
    const gathered = [];
    ct(`<div style="/*color: red;*/">z</div>`, {
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
          value: '<div style="/*color: red;*/">',
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
              attribValueRaw: "/*color: red;*/",
              attribValue: [
                {
                  type: "comment",
                  start: 12,
                  end: 14,
                  value: "/*",
                  closing: false,
                  kind: "block",
                  language: "css",
                },
                {
                  type: "text",
                  start: 14,
                  end: 25,
                  value: "color: red;",
                },
                {
                  type: "comment",
                  start: 25,
                  end: 27,
                  value: "*/",
                  closing: true,
                  kind: "block",
                  language: "css",
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 27,
              attribStart: 5,
              attribEnd: 28,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 29,
          end: 30,
          value: "z",
        },
        {
          type: "tag",
          start: 30,
          end: 36,
          value: "</div>",
          tagNameStartsAt: 32,
          tagNameEndsAt: 35,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.todo(
  `03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style, more`,
  (t) => {
    const gathered = [];
    ct(`<div style="/*color: red;*/ text-align: left;">z</div>`, {
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
          end: 47,
          value: '<div style="/*color: red;*/ text-align: left;">',
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
              attribClosingQuoteAt: 45,
              attribValueRaw: "/*color: red;*/ text-align: left;",
              attribValue: [
                {
                  type: "comment",
                  start: 12,
                  end: 14,
                  value: "/*",
                  closing: false,
                  kind: "block",
                  language: "css",
                },
                {
                  type: "text",
                  start: 14,
                  end: 25,
                  value: "color: red;",
                },
                {
                  type: "comment",
                  start: 25,
                  end: 27,
                  value: "*/",
                  closing: true,
                  kind: "block",
                  language: "css",
                },
                {
                  type: "text",
                  start: 27,
                  end: 28,
                  value: " ",
                },
                {
                  type: "rule",
                  start: 28,
                  end: 45,
                  value: "text-align: left;",
                  left: 26,
                  nested: false,
                  openingCurlyAt: null,
                  closingCurlyAt: null,
                  selectorsStart: 28,
                  selectorsEnd: null,
                  selectors: [],
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 45,
              attribStart: 5,
              attribEnd: 46,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 47,
          end: 48,
          value: "z",
        },
        {
          type: "tag",
          start: 48,
          end: 54,
          value: "</div>",
          tagNameStartsAt: 50,
          tagNameEndsAt: 53,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "03"
    );
    t.end();
  }
);
