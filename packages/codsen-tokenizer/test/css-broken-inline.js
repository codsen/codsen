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
