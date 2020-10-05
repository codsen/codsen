import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// errors within inline css
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi missing between two rules`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left color:red">z</div>`, {
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
                  semi: null,
                },
                {
                  property: "color",
                  propertyStarts: 23,
                  propertyEnds: 28,
                  colon: 28,
                  value: "red",
                  valueStarts: 29,
                  valueEnds: 32,
                  semi: null,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 32,
              attribStarts: 5,
              attribEnd: 33,
              attribLeft: 3,
            },
          ],
        },
        {
          type: "text",
          start: 34,
          end: 35,
          value: "z",
        },
        {
          type: "tag",
          start: 35,
          end: 41,
          value: "</div>",
          tagNameStartsAt: 37,
          tagNameEndsAt: 40,
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
                  semi: 22,
                },
                {
                  property: "x",
                  propertyStarts: 23,
                  propertyEnds: 24,
                  colon: null,
                  value: null,
                  valueStarts: null,
                  valueEnds: null,
                  semi: null,
                },
              ],
              attribValueStartsAt: 12,
              attribValueEndsAt: 24,
              attribStarts: 5,
              attribEnd: 25,
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
                  semi: null,
                },
                {
                  property: "float",
                  propertyStarts: 14,
                  propertyEnds: 19,
                  colon: 19,
                  value: "left",
                  valueStarts: 20,
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

tap.todo(
  `04 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style=".float:left;">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "04");
    t.end();
  }
);

tap.todo(
  `05 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="\n float:left;\n">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "05");
    t.end();
  }
);

tap.todo(
  `06 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="float.:left;">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "06");
    t.end();
  }
);

tap.todo(
  `07 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style=".main">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "07");
    t.end();
  }
);

tap.todo(
  `08 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left.">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "08");
    t.end();
  }
);

tap.todo(
  `09 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="\n\n   float:left\n\n   .">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "09");
    t.end();
  }
);

tap.todo(
  `10 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(`<div style="\n\n   float:left;\n\n   .">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "10");
    t.end();
  }
);

tap.todo(
  `11 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi instead of a colon #1`,
  (t) => {
    const gathered = [];
    ct(`<div style="float;left">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "11");
    t.end();
  }
);

tap.todo(
  `12 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi instead of a colon #2`,
  (t) => {
    const gathered = [];
    ct(`<div style="float;left;">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "12");
    t.end();
  }
);

tap.todo(
  `13 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, no semi #1`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:"left"">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "13");
    t.end();
  }
);

tap.todo(
  `14 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, no semi #2`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:'left'">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "14");
    t.end();
  }
);

tap.todo(
  `15 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, semi #3`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:"left";">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "15");
    t.end();
  }
);

tap.todo(
  `16 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property value, semi #4`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:'left';">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "16");
    t.end();
  }
);

tap.todo(
  `17 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - quoted property values`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:'left'; color: 'red'">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "17");
    t.end();
  }
);
