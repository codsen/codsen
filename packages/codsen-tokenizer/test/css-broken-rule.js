import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// css broken rule
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`broken rule`}\u001b[${39}m`} - repeated closing curlies`,
  (t) => {
    const gathered = [];
    ct(
      `<style>
.a{x}}
.b{x}}
</style>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.strictSame(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<style>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "style",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "text",
          start: 7,
          end: 8,
          value: "\n",
        },
        {
          type: "rule",
          start: 8,
          end: 13,
          value: ".a{x}",
          left: 6,
          nested: false,
          openingCurlyAt: 10,
          closingCurlyAt: 12,
          selectorsStart: 8,
          selectorsEnd: 10,
          selectors: [
            {
              value: ".a",
              selectorStarts: 8,
              selectorEnds: 10,
            },
          ],
          properties: [
            {
              property: "x",
              propertyStarts: 11,
              propertyEnds: 12,
              colon: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              semi: null,
            },
          ],
        },
        {
          type: "text",
          start: 13,
          end: 15,
          value: "}\n",
        },
        {
          type: "rule",
          start: 15,
          end: 20,
          value: ".b{x}",
          left: 13,
          nested: false,
          openingCurlyAt: 17,
          closingCurlyAt: 19,
          selectorsStart: 15,
          selectorsEnd: 17,
          selectors: [
            {
              value: ".b",
              selectorStarts: 15,
              selectorEnds: 17,
            },
          ],
          properties: [
            {
              property: "x",
              propertyStarts: 18,
              propertyEnds: 19,
              colon: null,
              value: null,
              valueStarts: null,
              valueEnds: null,
              semi: null,
            },
          ],
        },
        {
          type: "text",
          start: 20,
          end: 22,
          value: "}\n",
        },
        {
          type: "tag",
          start: 22,
          end: 30,
          value: "</style>",
          tagNameStartsAt: 24,
          tagNameEndsAt: 29,
          tagName: "style",
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

// missing semicols in head CSS
// -----------------------------------------------------------------------------

tap.only(
  `02 - ${`\u001b[${36}m${`broken rule`}\u001b[${39}m`} - missing semicol`,
  (t) => {
    const gathered = [];
    ct(`<style>.a{b:c d:e;}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered[1],
      {
        type: "rule",
        start: 7,
        end: 19,
        value: ".a{b:c d:e;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 18,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            colon: 11,
            value: "c",
            valueStarts: 12,
            valueEnds: 13,
            semi: null,
          },
          {
            property: "d",
            propertyStarts: 14,
            propertyEnds: 15,
            colon: 15,
            value: "e",
            valueStarts: 16,
            valueEnds: 17,
            semi: 17,
          },
        ],
      },
      "02"
    );
    t.end();
  }
);

// missing value
// -----------------------------------------------------------------------------

tap.test(
  `03 - ${`\u001b[${36}m${`broken rule`}\u001b[${39}m`} - missing value`,
  (t) => {
    const gathered = [];
    ct(`<style>.a{b}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered[1],
      {
        type: "rule",
        start: 7,
        end: 12,
        value: ".a{b}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 11,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            semi: null,
          },
        ],
      },
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`broken rule`}\u001b[${39}m`} - missing value, trailing space`,
  (t) => {
    const gathered = [];
    ct(`<style>.a{b }</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered[1],
      {
        type: "rule",
        start: 7,
        end: 13,
        value: ".a{b }",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 12,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            colon: null,
            value: null,
            valueStarts: null,
            valueEnds: null,
            semi: null,
          },
        ],
      },
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`broken rule`}\u001b[${39}m`} - missing value but colon present`,
  (t) => {
    const gathered = [];
    ct(`<style>.a{b:}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered[1],
      {
        type: "rule",
        start: 7,
        end: 13,
        value: ".a{b:}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 12,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            colon: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            semi: null,
          },
        ],
      },
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`broken rule`}\u001b[${39}m`} - missing value, both colon and semicolon present`,
  (t) => {
    const gathered = [];
    ct(`<style>.a{b:;}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered[1],
      {
        type: "rule",
        start: 7,
        end: 14,
        value: ".a{b:;}",
        left: 6,
        nested: false,
        openingCurlyAt: 9,
        closingCurlyAt: 13,
        selectorsStart: 7,
        selectorsEnd: 9,
        selectors: [
          {
            value: ".a",
            selectorStarts: 7,
            selectorEnds: 9,
          },
        ],
        properties: [
          {
            property: "b",
            propertyStarts: 10,
            propertyEnds: 11,
            colon: 11,
            value: null,
            valueStarts: null,
            valueEnds: null,
            semi: 12,
          },
        ],
      },
      "06"
    );
    t.end();
  }
);
