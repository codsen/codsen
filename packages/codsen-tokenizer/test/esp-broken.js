import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// ESP stands for Email Service Provider
// in practice, we cover all other templating languages too, for example,
// Moustache, Liquid or Jinja or even PHP - it's the same principle - "special"
// heads and tails surrounding some string, which can be placed anywhere in HTML

// broken
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing a character - mini`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x }">`, {
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
          value: '<a b="{% x }">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "b",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 12,
              attribValueRaw: "{% x }",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 12,
                  value: "{% x }",
                  head: "{%",
                  headStartsAt: 6,
                  headEndsAt: 8,
                  tail: "}",
                  tailStartsAt: 11,
                  tailEndsAt: 12,
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 12,
              attribStarts: 3,
              attribEnd: 13,
              attribLeft: 1,
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
  `02 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing a character - midi`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x }1{% y %}2">`, {
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
          end: 23,
          value: '<a b="{% x }1{% y %}2">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "b",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 21,
              attribValueRaw: "{% x }1{% y %}2",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 12,
                  value: "{% x }",
                  head: "{%",
                  headStartsAt: 6,
                  headEndsAt: 8,
                  tail: "}", // <----- ends up with an error in Nunjucks/Jinja
                  tailStartsAt: 11,
                  tailEndsAt: 12,
                },
                {
                  type: "text",
                  start: 12,
                  end: 13,
                  value: "1",
                },
                {
                  type: "esp",
                  start: 13,
                  end: 20,
                  value: "{% y %}",
                  head: "{%",
                  headStartsAt: 13,
                  headEndsAt: 15,
                  tail: "%}",
                  tailStartsAt: 18,
                  tailEndsAt: 20,
                },
                {
                  type: "text",
                  start: 20,
                  end: 21,
                  value: "2",
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 21,
              attribStarts: 3,
              attribEnd: 22,
              attribLeft: 1,
            },
          ],
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails null - new heads follow`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x {% y %}2">`, {
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
          end: 21,
          value: '<a b="{% x {% y %}2">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "b",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 19,
              attribValueRaw: "{% x {% y %}2",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 11,
                  value: "{% x ",
                  head: "{%",
                  headStartsAt: 6,
                  headEndsAt: 8,
                  tail: null,
                  tailStartsAt: null,
                  tailEndsAt: null,
                },
                {
                  type: "esp",
                  start: 11,
                  end: 18,
                  value: "{% y %}",
                  head: "{%",
                  headStartsAt: 11,
                  headEndsAt: 13,
                  tail: "%}",
                  tailStartsAt: 16,
                  tailEndsAt: 18,
                },
                {
                  type: "text",
                  start: 18,
                  end: 19,
                  value: "2",
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 19,
              attribStarts: 3,
              attribEnd: 20,
              attribLeft: 1,
            },
          ],
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - error, two ESP tags joined, first one ends with heads instead of tails`,
  (t) => {
    const gathered = [];
    ct(`*|zzz*|*|yyy|*`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 7,
          value: "*|zzz*|",
          head: "*|",
          headStartsAt: 0,
          headEndsAt: 2,
          tail: "*|",
          tailStartsAt: 5,
          tailEndsAt: 7,
        },
        {
          type: "esp",
          start: 7,
          end: 14,
          value: "*|yyy|*",
          head: "*|",
          headStartsAt: 7,
          headEndsAt: 9,
          tail: "|*",
          tailStartsAt: 12,
          tailEndsAt: 14,
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing completely - attr end follows`,
  (t) => {
    const gathered = [];
    const value = `<tr class="{% x">`;
    ct(value, {
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
          end: value.length,
          value,
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "tr",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 4,
              attribNameEndsAt: 9,
              attribOpeningQuoteAt: 10,
              attribClosingQuoteAt: 15,
              attribValueRaw: "{% x",
              attribValue: [
                {
                  type: "esp",
                  start: 11,
                  end: 15,
                  value: "{% x",
                  head: "{%",
                  headStartsAt: 11,
                  headEndsAt: 13,
                  tail: null,
                  tailStartsAt: null,
                  tailEndsAt: null,
                },
              ],
              attribValueStartsAt: 11,
              attribValueEndsAt: 15,
              attribStarts: 4,
              attribEnd: 16,
              attribLeft: 2,
            },
          ],
        },
      ],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing completely - attr end follows`,
  (t) => {
    const gathered = [];
    ct(`<tr class="{% x"><td style="z"></td></tr>`, {
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
          end: 17,
          value: '<tr class="{% x">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "tr",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 4,
              attribNameEndsAt: 9,
              attribOpeningQuoteAt: 10,
              attribClosingQuoteAt: 15,
              attribValueRaw: "{% x",
              attribValue: [
                {
                  type: "esp",
                  start: 11,
                  end: 15,
                  value: "{% x",
                  head: "{%",
                  headStartsAt: 11,
                  headEndsAt: 13,
                  tail: null,
                  tailStartsAt: null,
                  tailEndsAt: null,
                },
              ],
              attribValueStartsAt: 11,
              attribValueEndsAt: 15,
              attribStarts: 4,
              attribEnd: 16,
              attribLeft: 2,
            },
          ],
        },
        {
          type: "tag",
          start: 17,
          end: 31,
          value: '<td style="z">',
          tagNameStartsAt: 18,
          tagNameEndsAt: 20,
          tagName: "td",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "style",
              attribNameRecognised: true,
              attribNameStartsAt: 21,
              attribNameEndsAt: 26,
              attribOpeningQuoteAt: 27,
              attribClosingQuoteAt: 29,
              attribValueRaw: "z",
              attribValue: [
                {
                  type: "text",
                  start: 28,
                  end: 29,
                  value: "z",
                },
              ],
              attribValueStartsAt: 28,
              attribValueEndsAt: 29,
              attribStarts: 21,
              attribEnd: 30,
              attribLeft: 19,
            },
          ],
        },
        {
          type: "tag",
          start: 31,
          end: 36,
          value: "</td>",
          tagNameStartsAt: 33,
          tagNameEndsAt: 35,
          tagName: "td",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "tag",
          start: 36,
          end: 41,
          value: "</tr>",
          tagNameStartsAt: 38,
          tagNameEndsAt: 40,
          tagName: "tr",
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
  `07 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing completely - attr end follows + another tag`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x"><c d="y %}">`, {
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
          end: 12,
          value: '<a b="{% x">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "b",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 10,
              attribValueRaw: "{% x",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 10,
                  value: "{% x",
                  head: "{%",
                  headStartsAt: 6,
                  headEndsAt: 8,
                  tail: null,
                  tailStartsAt: null,
                  tailEndsAt: null,
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 10,
              attribStarts: 3,
              attribEnd: 11,
              attribLeft: 1,
            },
          ],
        },
        {
          type: "tag",
          start: 12,
          end: 24,
          value: '<c d="y %}">',
          tagNameStartsAt: 13,
          tagNameEndsAt: 14,
          tagName: "c",
          recognised: false,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "d",
              attribNameRecognised: false,
              attribNameStartsAt: 15,
              attribNameEndsAt: 16,
              attribOpeningQuoteAt: 17,
              attribClosingQuoteAt: 22,
              attribValueRaw: "y %}",
              attribValue: [
                {
                  type: "text",
                  start: 18,
                  end: 20,
                  value: "y ",
                },
                {
                  type: "esp",
                  start: 20,
                  end: 22,
                  value: "%}",
                  head: "%}",
                  headStartsAt: 20,
                  headEndsAt: 22,
                  tail: null,
                  tailStartsAt: null,
                  tailEndsAt: null,
                },
              ],
              attribValueStartsAt: 18,
              attribValueEndsAt: 22,
              attribStarts: 15,
              attribEnd: 23,
              attribLeft: 13,
            },
          ],
        },
      ],
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - heads missing character, minimal`,
  (t) => {
    const gathered = [];
    ct(`<a b="{ x %}">`, {
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
          value: '<a b="{ x %}">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "b",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 12,
              attribValueRaw: "{ x %}",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 12,
                  value: "{ x %}",
                  head: "{",
                  headStartsAt: 6,
                  headEndsAt: 7,
                  tail: "%}",
                  tailStartsAt: 10,
                  tailEndsAt: 12,
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 12,
              attribStarts: 3,
              attribEnd: 13,
              attribLeft: 1,
            },
          ],
        },
      ],
      "08"
    );
    t.end();
  }
);

tap.todo(
  `09 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - heads missing character`,
  (t) => {
    const gathered = [];
    ct(`<a b="{ x %}1{% y %}2">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "09");
    t.end();
  }
);

tap.todo(
  `10 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - heads missing completely`,
  (t) => {
    const gathered = [];
    ct(`<a b="x %}1{% y %}2">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "10");
    t.end();
  }
);

tap.todo(
  `11 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - Venn`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x"><b c="y %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "11");
    t.end();
  }
);

tap.todo(
  `12 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - two heads, one tail only`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% {% %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "12");
    t.end();
  }
);

tap.todo(
  `13 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - two tails`,
  (t) => {
    const gathered = [];
    ct(`<a b="%} %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "13");
    t.end();
  }
);
