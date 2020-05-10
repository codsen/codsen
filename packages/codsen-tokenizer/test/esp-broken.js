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
    t.same(
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
                  kind: null,
                  head: "{%",
                  tail: "}",
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 12,
              attribStart: 3,
              attribEnd: 13,
            },
          ],
        },
      ],
      "01.01"
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
    t.match(
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
                  kind: null,
                  head: "{%",
                  tail: "}", // <----- error in Nunjucks/Jinja
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
                  kind: null,
                  head: "{%",
                  tail: "%}",
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
              attribStart: 3,
              attribEnd: 22,
            },
          ],
        },
      ],
      "02.01"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing completely - new heads follow`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x {% y %}2">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 6,
          end: 11,
          value: "{% x ",
          kind: null,
          head: "{%",
          tail: null,
        },
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
                  kind: null,
                  head: "{%",
                  tail: null,
                },
                {
                  type: "esp",
                  start: 11,
                  end: 18,
                  value: "{% y %}",
                  kind: null,
                  head: "{%",
                  tail: "%}",
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
              attribStart: 3,
              attribEnd: 20,
            },
          ],
        },
      ],
      "03.01"
    );
    t.end();
  }
);

tap.todo(
  `05.04 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing completely - attr end follows`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.04");
    t.end();
  }
);

tap.todo(
  `05.04 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - tails missing completely - attr end follows + another tag`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x"><c d="y %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.04");
    t.end();
  }
);

tap.todo(
  `05.05 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - heads missing character`,
  (t) => {
    const gathered = [];
    ct(`<a b="{ x %}1{% y %}2">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.05");
    t.end();
  }
);

tap.todo(
  `05.06 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - heads missing completely`,
  (t) => {
    const gathered = [];
    ct(`<a b="x %}1{% y %}2">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.06");
    t.end();
  }
);

tap.todo(
  `05.07 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - Venn`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x"><b c="y %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.07");
    t.end();
  }
);

tap.todo(
  `05.08 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - two heads, one tail only`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% {% %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.08");
    t.end();
  }
);

tap.todo(
  `05.09 - ${`\u001b[${35}m${`broken ESP tags`}\u001b[${39}m`} - two tails`,
  (t) => {
    const gathered = [];
    ct(`<a b="%} %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "05.09");
    t.end();
  }
);

// -----------------------------------------------------------------------------

// Java:
// <%@ ... %>
// <c:forEach ... > (no slash)
// <jsp:useBean ... />
// <c:set ... />
