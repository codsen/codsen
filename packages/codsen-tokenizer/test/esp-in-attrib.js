import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// ESP tags within attribute values
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - one ESP tag inside`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% if something %}"><c>`, {
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
          end: 26,
          value: '<a b="{% if something %}">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false, // <---- means there are ESP bits inside this tag
          kind: null,
          attribs: [
            {
              attribName: "b",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 24,
              attribValueRaw: "{% if something %}",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 24,
                  value: "{% if something %}",
                  head: "{%",
                  tail: "%}",
                  kind: null,
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 24,
              attribStart: 3,
              attribEnd: 25,
            },
          ],
        },
        {
          type: "tag",
          start: 26,
          end: 29,
          value: "<c>",
          tagNameStartsAt: 27,
          tagNameEndsAt: 28,
          tagName: "c",
          recognised: false,
          closing: false,
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
  `02 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - one ESP tag + text`,
  (t) => {
    const gathered = [];
    ct(`<a b="{{ c }}d">`, {
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
          end: 16,
          value: `<a b="{{ c }}d">`,
          attribs: [
            {
              attribName: "b",
              attribValueRaw: `{{ c }}d`,
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 13,
                  value: "{{ c }}",
                  head: "{{",
                  tail: "}}",
                },
                {
                  type: "text",
                  start: 13,
                  end: 14,
                  value: "d",
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 14,
              attribStart: 3,
              attribEnd: 15,
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
  `03 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - one ESP tag + text`,
  (t) => {
    const gathered = [];
    ct(`<img src="{{ root }}z" width="9"/>`, {
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
          end: 34,
          value: `<img src="{{ root }}z" width="9"/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "src",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 21,
              attribValueRaw: `{{ root }}z`,
              attribValue: [
                {
                  type: "esp",
                  start: 10,
                  end: 20,
                  value: "{{ root }}",
                  head: "{{",
                  tail: "}}",
                },
                {
                  type: "text",
                  start: 20,
                  end: 21,
                  value: "z",
                },
              ],
              attribValueStartsAt: 10,
              attribValueEndsAt: 21,
              attribStart: 5,
              attribEnd: 22,
            },
            // then,
            // continues recording attributes as normal:
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 23,
              attribNameEndsAt: 28,
              attribOpeningQuoteAt: 29,
              attribClosingQuoteAt: 31,
              attribValueRaw: "9",
              attribValue: [
                {
                  type: "text",
                  start: 30,
                  end: 31,
                  value: "9",
                },
              ],
              attribValueStartsAt: 30,
              attribValueEndsAt: 31,
              attribStart: 23,
              attribEnd: 32,
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
  `04 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - esp-text-esp-text`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% x %}1{% y %}2">`, {
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
          end: 24,
          value: '<a b="{% x %}1{% y %}2">',
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
              attribClosingQuoteAt: 22,
              attribValueRaw: "{% x %}1{% y %}2",
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 13,
                  value: "{% x %}",
                  head: "{%",
                  tail: "%}",
                },
                {
                  type: "text",
                  start: 13,
                  end: 14,
                  value: "1",
                },
                {
                  type: "esp",
                  start: 14,
                  end: 21,
                  value: "{% y %}",
                  head: "{%",
                  tail: "%}",
                },
                {
                  type: "text",
                  start: 21,
                  end: 22,
                  value: "2",
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 22,
              attribStart: 3,
              attribEnd: 23,
            },
          ],
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - chain of text and ESP tag`,
  (t) => {
    const gathered = [];
    ct(`<a z="{% if something %}1{% else %}2{% endif %}" y="x"/>`, {
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
          end: 56,
          value: `<a z="{% if something %}1{% else %}2{% endif %}" y="x"/>`,
          attribs: [
            {
              attribName: "z",
              attribNameRecognised: false,
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 47,
              attribValueRaw: `{% if something %}1{% else %}2{% endif %}`,
              attribValue: [
                {
                  type: "esp",
                  start: 6,
                  end: 24,
                  value: "{% if something %}",
                  head: "{%",
                  tail: "%}",
                },
                {
                  type: "text",
                  start: 24,
                  end: 25,
                  value: "1",
                },
                {
                  type: "esp",
                  start: 25,
                  end: 35,
                  value: "{% else %}",
                  head: "{%",
                  tail: "%}",
                },
                {
                  type: "text",
                  start: 35,
                  end: 36,
                  value: "2",
                },
                {
                  type: "esp",
                  start: 36,
                  end: 47,
                  value: "{% endif %}",
                  head: "{%",
                  tail: "%}",
                },
              ],
              attribValueStartsAt: 6,
              attribValueEndsAt: 47,
              attribStart: 3,
              attribEnd: 48,
            },
            {
              attribName: "y",
              attribNameRecognised: false,
              attribNameStartsAt: 49,
              attribNameEndsAt: 50,
              attribOpeningQuoteAt: 51,
              attribClosingQuoteAt: 53,
              attribValueRaw: "x",
              attribValue: [
                {
                  type: "text",
                  start: 52,
                  end: 53,
                  value: "x",
                },
              ],
              attribValueStartsAt: 52,
              attribValueEndsAt: 53,
              attribStart: 49,
              attribEnd: 54,
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
  `06 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - otherwise a sensitive characters inside ESP tag`,
  (t) => {
    const gathered = [];
    ct(`<a>{% if a<b and c>d '"' ><>< %}<b>`, {
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
          end: 3,
        },
        {
          type: "esp",
          start: 3,
          end: 32,
          head: "{%",
          tail: "%}",
        },
        {
          type: "tag",
          start: 32,
          end: 35,
        },
      ],
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - The Killer Triplet, mini extract`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{{ z("'") }}"><b>`, {
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
          end: 21,
        },
        {
          type: "tag",
          start: 21,
          end: 24,
        },
      ],
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - The Killer Triplet, midi extract`,
  (t) => {
    const gathered = [];
    ct(`<a href="https://z.y/?a=1&q={{ r("'", "%27") }}"><b>`, {
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
          end: 49,
        },
        {
          type: "tag",
          start: 49,
          end: 52,
        },
      ],
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - The Killer Triplet, maxi extract`,
  (t) => {
    const gathered = [];
    ct(
      `<a href="https://z.y/?a=1&q={{ r(" ", "+") | r("'", "%27") | r("&", "%26") | r("(", "%28") | r(")", "%29") }}"><b>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 111,
        },
        {
          type: "tag",
          start: 111,
          end: 114,
        },
      ],
      "09"
    );
    t.end();
  }
);

tap.todo(
  `10 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly`,
  (t) => {
    const gathered = [];
    ct(`<a b="{%- c %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "10");
    t.end();
  }
);

tap.todo(
  `11 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="{%- c %}x">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "11");
    t.end();
  }
);

tap.todo(
  `12 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="x{%- c %}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "12");
    t.end();
  }
);

tap.todo(
  `13 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly`,
  (t) => {
    const gathered = [];
    ct(`<a b="{%- c -%}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "13");
    t.end();
  }
);

tap.todo(
  `14 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="x{%- c -%}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "14");
    t.end();
  }
);

tap.todo(
  `15 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="{%- c -%}x">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "15");
    t.end();
  }
);

tap.todo(
  `16 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="z {%- c -%} x">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "16");
    t.end();
  }
);

tap.todo(
  `17 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% c -%}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "17");
    t.end();
  }
);

tap.todo(
  `18 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="x{% c -%}">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "18");
    t.end();
  }
);

tap.todo(
  `19 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="{% c -%}x">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "19");
    t.end();
  }
);

tap.todo(
  `20 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text`,
  (t) => {
    const gathered = [];
    ct(`<a b="z{% c -%}x">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "20");
    t.end();
  }
);

// triplets, slightly mismatching heads and tails
// -----------------------------------------------------------------------------

tap.todo(
  `21 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - A, baseline`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{% x %}d{% y %}e{% z %}f">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "21");
    t.end();
  }
);

tap.todo(
  `22 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - B`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{%- x %}d{%- y %}e{%- z %}f">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "22");
    t.end();
  }
);

tap.todo(
  `23 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{% x -%}d{% y -%}e{% z -%}f">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "23");
    t.end();
  }
);

tap.todo(
  `24 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{%- x %}d{% y -%}e{%- z %}f">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "24");
    t.end();
  }
);

tap.todo(
  `25 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{% x -%}d{%- y %}e{% z -%}f">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "25");
    t.end();
  }
);

tap.todo(
  `26 - ${`\u001b[${35}m${`ESP tags within attr values`}\u001b[${39}m`} - heads/tails not matching extractly, with text - X`,
  (t) => {
    const gathered = [];
    ct(`<a b="c{% x -%}d{%- y %}e{%- z %}f">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "26");
    t.end();
  }
);
