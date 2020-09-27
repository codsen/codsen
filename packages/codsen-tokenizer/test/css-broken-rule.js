import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// broken
// -----------------------------------------------------------------------------

tap.todo(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - repeated closing curlies`,
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
