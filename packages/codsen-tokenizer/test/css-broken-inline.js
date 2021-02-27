import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

// errors within inline css
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi missing between two rules`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left color:red">`, {
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
          end: 34,
          value: '<div style="float:left color:red">',
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
              attribClosingQuoteAt: 32,
              attribValueRaw: "float:left color:red",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "left",
                  valueStarts: 18,
                  valueEnds: 22,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 12,
                  end: 22,
                },
                {
                  type: "text",
                  start: 22,
                  end: 23,
                  value: " ",
                },
                {
                  property: "color",
                  propertyStarts: 23,
                  propertyEnds: 28,
                  colon: 28,
                  value: "red",
                  valueStarts: 29,
                  valueEnds: 32,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 23,
                  end: 32,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 32,
              attribStarts: 5,
              attribEnds: 33,
              attribLeft: 3,
            },
          ],
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left;x">z</div>`, {
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
          end: 26,
          value: '<div style="float:left;x">',
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
              attribClosingQuoteAt: 24,
              attribValueRaw: "float:left;x",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "left",
                  valueStarts: 18,
                  valueEnds: 22,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 22,
                  start: 12,
                  end: 23,
                },
                {
                  property: "x",
                  propertyStarts: 23,
                  propertyEnds: 24,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 23,
                  end: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnds: 25,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 27,
          value: "z",
        },
        {
          type: "tag",
          start: 27,
          end: 33,
          value: "</div>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 32,
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
  `03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="]\nfloat:left;">z</div>`, {
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
          end: 27,
          value: '<div style="]\nfloat:left;">',
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
              attribValueRaw: "]\nfloat:left;",
              attribValue: [
                {
                  property: "]",
                  propertyStarts: 12,
                  propertyEnds: 13,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 12,
                  end: 13,
                },
                {
                  type: "text",
                  start: 13,
                  end: 14,
                  value: "\n",
                },
                {
                  property: "float",
                  propertyStarts: 14,
                  propertyEnds: 19,
                  colon: 19,
                  value: "left",
                  valueStarts: 20,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 24,
                  start: 14,
                  end: 25,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 25,
              attribStarts: 5,
              attribEnds: 26,
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

tap.test(
  `04 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - copious line breaks`,
  (t) => {
    const gathered = [];
    ct(`<div style="\n float:left;\n">z</div>`, {
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
          end: 28,
          value: '<div style="\n float:left;\n">',
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
              attribClosingQuoteAt: 26,
              attribValueRaw: "\n float:left;\n",
              attribValue: [
                {
                  type: "text",
                  start: 12,
                  end: 14,
                  value: "\n ",
                },
                {
                  property: "float",
                  propertyStarts: 14,
                  propertyEnds: 19,
                  colon: 19,
                  value: "left",
                  valueStarts: 20,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 24,
                  start: 14,
                  end: 25,
                },
                {
                  type: "text",
                  start: 25,
                  end: 26,
                  value: "\n",
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 26,
              attribStarts: 5,
              attribEnds: 27,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 28,
          end: 29,
          value: "z",
        },
        {
          type: "tag",
          start: 29,
          end: 35,
          value: "</div>",
          tagNameStartsAt: 31,
          tagNameEndsAt: 34,
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
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character before prop name`,
  (t) => {
    const gathered = [];
    ct(`<div style=".float:left;">z</div>`, {
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
          end: 26,
          value: '<div style=".float:left;">',
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
              attribClosingQuoteAt: 24,
              attribValueRaw: ".float:left;",
              attribValue: [
                {
                  property: ".float", // <---
                  propertyStarts: 12,
                  propertyEnds: 18,
                  colon: 18,
                  value: "left",
                  valueStarts: 19,
                  valueEnds: 23,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 23,
                  start: 12,
                  end: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnds: 25,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 27,
          value: "z",
        },
        {
          type: "tag",
          start: 27,
          end: 33,
          value: "</div>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 32,
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
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character after prop name`,
  (t) => {
    const gathered = [];
    ct(`<div style="float.:left;">z</div>`, {
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
          end: 26,
          value: '<div style="float.:left;">',
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
              attribClosingQuoteAt: 24,
              attribValueRaw: "float.:left;",
              attribValue: [
                {
                  property: "float.", // <---
                  propertyStarts: 12,
                  propertyEnds: 18,
                  colon: 18,
                  value: "left",
                  valueStarts: 19,
                  valueEnds: 23,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 23,
                  start: 12,
                  end: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnds: 25,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 27,
          value: "z",
        },
        {
          type: "tag",
          start: 27,
          end: 33,
          value: "</div>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 32,
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
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character before prop name, no value`,
  (t) => {
    const gathered = [];
    ct(`<div style=".main">z</div>`, {
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
          end: 19,
          value: '<div style=".main">',
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
              attribClosingQuoteAt: 17,
              attribValueRaw: ".main",
              attribValue: [
                {
                  property: ".main",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 12,
                  end: 17,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 17,
              attribStarts: 5,
              attribEnds: 18,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 19,
          end: 20,
          value: "z",
        },
        {
          type: "tag",
          start: 20,
          end: 26,
          value: "</div>",
          tagNameStartsAt: 22,
          tagNameEndsAt: 25,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character after value, no semi`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left.">z</div>`, {
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
          value: '<div style="float:left.">',
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
              attribValueRaw: "float:left.",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "left.",
                  valueStarts: 18,
                  valueEnds: 23,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
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
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character after value, with semi`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left.;">z</div>`, {
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
          end: 26,
          value: '<div style="float:left.;">',
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
              attribClosingQuoteAt: 24,
              attribValueRaw: "float:left.;",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "left.",
                  valueStarts: 18,
                  valueEnds: 23,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 23,
                  start: 12,
                  end: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnds: 25,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 27,
          value: "z",
        },
        {
          type: "tag",
          start: 27,
          end: 33,
          value: "</div>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 32,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="\n\n   float:left\n\n   .">z</div>`, {
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
          end: 35,
          value: '<div style="\n\n   float:left\n\n   .">',
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
              attribClosingQuoteAt: 33,
              attribValueRaw: "\n\n   float:left\n\n   .",
              attribValue: [
                {
                  type: "text",
                  start: 12,
                  end: 17,
                  value: "\n\n   ",
                },
                {
                  property: "float",
                  propertyStarts: 17,
                  propertyEnds: 22,
                  colon: 22,
                  value: "left",
                  valueStarts: 23,
                  valueEnds: 27,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 17,
                  end: 27,
                },
                {
                  type: "text",
                  start: 27,
                  end: 32,
                  value: "\n\n   ",
                },
                {
                  property: ".",
                  propertyStarts: 32,
                  propertyEnds: 33,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 32,
                  end: 33,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 33,
              attribStarts: 5,
              attribEnds: 34,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 35,
          end: 36,
          value: "z",
        },
        {
          type: "tag",
          start: 36,
          end: 42,
          value: "</div>",
          tagNameStartsAt: 38,
          tagNameEndsAt: 41,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="\n\n   float:left;\n\n   .">z</div>`, {
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
          end: 36,
          value: '<div style="\n\n   float:left;\n\n   .">',
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
              attribClosingQuoteAt: 34,
              attribValueRaw: "\n\n   float:left;\n\n   .",
              attribValue: [
                {
                  type: "text",
                  start: 12,
                  end: 17,
                  value: "\n\n   ",
                },
                {
                  property: "float",
                  propertyStarts: 17,
                  propertyEnds: 22,
                  colon: 22,
                  value: "left",
                  valueStarts: 23,
                  valueEnds: 27,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 27,
                  start: 17,
                  end: 28,
                },
                {
                  type: "text",
                  start: 28,
                  end: 33,
                  value: "\n\n   ",
                },
                {
                  property: ".",
                  propertyStarts: 33,
                  propertyEnds: 34,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 33,
                  end: 34,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 34,
              attribStarts: 5,
              attribEnds: 35,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 36,
          end: 37,
          value: "z",
        },
        {
          type: "tag",
          start: 37,
          end: 43,
          value: "</div>",
          tagNameStartsAt: 39,
          tagNameEndsAt: 42,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi instead of a colon #1`,
  (t) => {
    const gathered = [];
    ct(`<div style="float;left">z</div>`, {
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
          value: '<div style="float;left">',
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
              attribValueRaw: "float;left",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 17,
                  start: 12,
                  end: 18,
                },
                {
                  property: "left",
                  propertyStarts: 18,
                  propertyEnds: 22,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 18,
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
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi instead of a colon #2`,
  (t) => {
    const gathered = [];
    ct(`<div style="float;left;">z</div>`, {
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
          value: '<div style="float;left;">',
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
              attribValueRaw: "float;left;",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 17,
                  start: 12,
                  end: 18,
                },
                {
                  property: "left",
                  propertyStarts: 18,
                  propertyEnds: 22,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 22,
                  start: 18,
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
      "13"
    );
    t.end();
  }
);

// quoted
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, no semi #1`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:"left"">z</div>`, {
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
          end: 26,
          value: `<div style="float:"left"">`,
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
              attribClosingQuoteAt: 24,
              attribValueRaw: `float:"left"`,
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: `"left"`,
                  valueStarts: 18,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 12,
                  end: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnds: 25,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 27,
          value: "z",
        },
        {
          type: "tag",
          start: 27,
          end: 33,
          value: "</div>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 32,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, no semi #2`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:'left'">z</div>`, {
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
          end: 26,
          value: "<div style=\"float:'left'\">",
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
              attribClosingQuoteAt: 24,
              attribValueRaw: "float:'left'",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "'left'",
                  valueStarts: 18,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 12,
                  end: 24,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnds: 25,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 27,
          value: "z",
        },
        {
          type: "tag",
          start: 27,
          end: 33,
          value: "</div>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 32,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, semi #3`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:"left";">`, {
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
          end: 27,
          value: '<div style="float:"left";">',
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
              attribValueRaw: 'float:"left";',
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: '"left"',
                  valueStarts: 18,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 24,
                  start: 12,
                  end: 25,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 25,
              attribStarts: 5,
              attribEnds: 26,
              attribLeft: 3,
            },
          ],
        },
      ],
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, semi #4`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:'left';">z</div>`, {
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
          end: 27,
          value: "<div style=\"float:'left';\">",
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
              attribValueRaw: "float:'left';",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "'left'",
                  valueStarts: 18,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 24,
                  start: 12,
                  end: 25,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 25,
              attribStarts: 5,
              attribEnds: 26,
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
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property values`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:'left'; color: 'red'">z</div>`, {
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
          value: "<div style=\"float:'left'; color: 'red'\">",
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
              attribValueRaw: "float:'left'; color: 'red'",
              attribValue: [
                {
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  colon: 17,
                  value: "'left'",
                  valueStarts: 18,
                  valueEnds: 24,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: 24,
                  start: 12,
                  end: 25,
                },
                {
                  type: "text",
                  start: 25,
                  end: 26,
                  value: " ",
                },
                {
                  property: "color",
                  propertyStarts: 26,
                  propertyEnds: 31,
                  colon: 31,
                  value: "'red'",
                  valueStarts: 33,
                  valueEnds: 38,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  semi: null,
                  start: 26,
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
      "18"
    );
    t.end();
  }
);

tap.test(`19 - repeated !important`, (t) => {
  const gathered = [];
  ct(`<div style="float:left!important!important">`, {
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
        end: 44,
        value: '<div style="float:left!important!important">',
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
            attribClosingQuoteAt: 42,
            attribValueRaw: "float:left!important!important",
            attribValue: [
              {
                start: 12,
                end: 42,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                importantStarts: 22,
                importantEnds: 42,
                important: "!important!important",
                colon: 17,
                semi: null,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 42,
            attribStarts: 5,
            attribEnds: 43,
            attribLeft: 3,
          },
        ],
      },
    ],
    "19"
  );
  t.end();
});

tap.only(
  `20 - !important cut off by a semy goes as important, not property`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left;!important">`, {
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
          end: 35,
          value: '<div style="float:left;!important">',
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
              attribClosingQuoteAt: 33,
              attribValueRaw: "float:left;!important",
              attribValue: [
                {
                  start: 12,
                  end: 23,
                  property: "float",
                  propertyStarts: 12,
                  propertyEnds: 17,
                  value: "left",
                  valueStarts: 18,
                  valueEnds: 22,
                  importantStarts: null,
                  importantEnds: null,
                  important: null,
                  colon: 17,
                  semi: 22,
                },
                {
                  start: 23,
                  end: 33,
                  property: null,
                  propertyStarts: null,
                  propertyEnds: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  importantStarts: 23,
                  importantEnds: 33,
                  important: "!important",
                  colon: null,
                  semi: null,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 33,
              attribStarts: 5,
              attribEnds: 34,
              attribLeft: 3,
            },
          ],
        },
      ],
      "20"
    );
    t.end();
  }
);

tap.test(`21`, (t) => {
  const gathered = [];
  ct(`<div style="float.left;">`, {
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
        value: '<div style="float.left;">',
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
            attribValueRaw: "float.left;",
            attribValue: [
              {
                start: 12,
                end: 23,
                property: "float",
                propertyStarts: 12,
                propertyEnds: 17,
                value: "left",
                valueStarts: 18,
                valueEnds: 22,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 17,
                semi: 22,
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
    ],
    "21"
  );
  t.end();
});

tap.test(`22`, (t) => {
  const gathered = [];
  ct(`<div style="floa/t:left;">`, {
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
        end: 26,
        value: '<div style="floa/t:left;">',
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
            attribClosingQuoteAt: 24,
            attribValueRaw: "floa/t:left;",
            attribValue: [
              {
                start: 12,
                end: 24,
                property: "floa/t",
                propertyStarts: 12,
                propertyEnds: 18,
                value: "left",
                valueStarts: 19,
                valueEnds: 23,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 18,
                semi: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "22"
  );
  t.end();
});

tap.test(`23`, (t) => {
  const gathered = [];
  ct(`<div style="floa.t:left;">`, {
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
        end: 26,
        value: '<div style="floa.t:left;">',
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
            attribClosingQuoteAt: 24,
            attribValueRaw: "floa.t:left;",
            attribValue: [
              {
                start: 12,
                end: 24,
                property: "floa.t",
                propertyStarts: 12,
                propertyEnds: 18,
                value: "left",
                valueStarts: 19,
                valueEnds: 23,
                important: null,
                importantStarts: null,
                importantEnds: null,
                colon: 18,
                semi: 23,
              },
            ],
            attribValueStartsAt: 12,
            attribValueEndsAt: 24,
            attribStarts: 5,
            attribEnds: 25,
            attribLeft: 3,
          },
        ],
      },
    ],
    "23"
  );
  t.end();
});
