import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// css comments within inline HTML styles
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style`,
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
                  property: "color",
                  propertyStarts: 14,
                  propertyEnds: 19,
                  colon: 19,
                  value: "red",
                  valueStarts: 21,
                  valueEnds: 24,
                  semi: 24,
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
              attribStarts: 5,
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
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style, more`,
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
                  property: "color",
                  propertyStarts: 14,
                  propertyEnds: 19,
                  colon: 19,
                  value: "red",
                  valueStarts: 21,
                  valueEnds: 24,
                  semi: 24,
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
                  property: "text-align",
                  propertyStarts: 28,
                  propertyEnds: 38,
                  colon: 38,
                  value: "left",
                  valueStarts: 40,
                  valueEnds: 44,
                  semi: 44,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 45,
              attribStarts: 5,
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
      "02"
    );
    t.end();
  }
);

tap.only(
  `03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline css, erroneous line comment`,
  (t) => {
    const gathered = [];
    ct(`<div style="//color: red;">z</div>`, {
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
          end: 27,
          value: '<div style="//color: red;">',
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
              attribValueRaw: "//color: red;",
              attribValue: [
                {
                  property: "//color",
                  propertyStarts: 12,
                  propertyEnds: 19,
                  colon: 19,
                  value: "red",
                  valueStarts: 21,
                  valueEnds: 24,
                  semi: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 25,
              attribStarts: 5,
              attribEnd: 26,
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
      "03"
    );
    t.end();
  }
);
