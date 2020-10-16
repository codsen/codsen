import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// css comments within inline HTML styles
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - empty body inline style`,
  (t) => {
    const gathered = [];
    ct(`<div style="">z</div>`, {
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
          end: 14,
          value: '<div style="">',
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
              attribClosingQuoteAt: 12,
              attribValueRaw: "",
              attribValue: [],
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStarts: 5,
              attribEnds: 13,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 14,
          end: 15,
          value: "z",
        },
        {
          type: "tag",
          start: 15,
          end: 21,
          value: "</div>",
          tagNameStartsAt: 17,
          tagNameEndsAt: 20,
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
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style`,
  (t) => {
    const gathered = [];
    ct(`<div style="color: red;">z</div>`, {
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
          end: 25,
          value: '<div style="color: red;">',
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
              attribValueRaw: "color: red;",
              attribValue: [
                {
                  property: "color",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "red",
                  valueStarts: 19,
                  valueEnds: 22,
                  semi: 22,
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
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - body inline style, no semi`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left">z</div>`, {
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
          end: 24,
          value: '<div style="float:left">',
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
              attribValueRaw: "float:left",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "left",
                  valueStarts: 18,
                  valueEnds: 22,
                  semi: null,
                  start: 12,
                  end: 22,
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
      "03"
    );
    t.end();
  }
);

tap.test(`04 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - two rules`, (t) => {
  const gathered = [];
  ct(`<div style="float:left;display:block;">z</div>`, {
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
        end: 39,
        value: '<div style="float:left;display:block;">',
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
            attribClosingQuoteAt: 37,
            attribValueRaw: "float:left;display:block;",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                semi: 22,
                start: 12,
                end: 23,
              },
              {
                property: "display",
                propertyStarts: 23,
                propertyEnds: 30,
                colon: 30,
                value: "block",
                valueStarts: 31,
                valueEnds: 36,
                semi: 36,
                start: 23,
                end: 37,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 37,
            attribStarts: 5,
            attribEnds: 38,
            attribLeft: 3,
          },
        ],
      },
      {
        type: "text",
        start: 39,
        end: 40,
        value: "z",
      },
      {
        type: "tag",
        start: 40,
        end: 46,
        value: "</div>",
        tagNameStartsAt: 42,
        tagNameEndsAt: 45,
        tagName: "div",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "04"
  );
  t.end();
});

tap.test(`05 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - two rules`, (t) => {
  const gathered = [];
  ct(`<div style="float:left;\ndisplay:block;">z</div>`, {
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
        end: 40,
        value: '<div style="float:left;\ndisplay:block;">',
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
            attribValueRaw: "float:left;\ndisplay:block;",
            attribValue: [
              {
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                colon: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                semi: 22,
                start: 12,
                end: 23,
              },
              {
                type: "text",
                start: 23,
                end: 24,
                value: "\n",
              },
              {
                property: "display",
                propertyStarts: 24,
                propertyEnds: 31,
                colon: 31,
                value: "block",
                valueStarts: 32,
                valueEnds: 37,
                semi: 37,
                start: 24,
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
    "05"
  );
  t.end();
});
