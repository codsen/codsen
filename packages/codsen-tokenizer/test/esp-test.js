const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. ESP (Email Service Provider) and other templating language tags
// -----------------------------------------------------------------------------

t.test("01.01 - only an ESP tag", (t) => {
  const gathered = [];
  ct(`{% zz %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 8,
        value: "{% zz %}",
        head: "{%",
        tail: "%}",
        kind: null,
      },
    ],
    "01.01"
  );
  t.end();
});

t.test("01.02 - text and ESP tag", (t) => {
  const gathered = [];
  ct(`a{% zz %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.same(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 9,
        value: "{% zz %}",
        head: "{%",
        tail: "%}",
        kind: null,
      },
    ],
    "01.02"
  );
  t.end();
});

t.test("01.03 - ESP tag surrounded by text", (t) => {
  const gathered = [];
  ct(`ab {% if something %} cd`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3,
      },
      {
        type: "esp",
        start: 3,
        end: 21,
        tail: "%}",
      },
      {
        type: "text",
        start: 21,
        end: 24,
      },
    ],
    "01.03"
  );
  t.end();
});

t.test("01.04 - ESP tag around HTML", (t) => {
  const gathered = [];
  ct(`<a>{% if something %}<b>`, {
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
        end: 21,
        tail: "%}",
      },
      {
        type: "tag",
        start: 21,
        end: 24,
      },
    ],
    "01.04"
  );
  t.end();
});

t.test("01.05 - ESP tag is a whole HTML tag attribute value", (t) => {
  const gathered = [];
  ct(`<a b="{% if something %}"><c>`, {
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
        end: 26,
      },
      {
        type: "tag",
        start: 26,
        end: 29,
      },
    ],
    "01.05"
  );
  t.end();
});

t.test("01.06 - ESP literals surrounded by HTML tags, tight", (t) => {
  const gathered = [];
  ct(`<a>{% if a<b and c>d '"'''' ><>< %}<b>`, {
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
        end: 35,
        tail: "%}",
      },
      {
        type: "tag",
        start: 35,
        end: 38,
      },
    ],
    "01.06"
  );
  t.end();
});

t.test("01.07 - ESP tag with The Killer Triplet", (t) => {
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
    "01.07"
  );
  t.end();
});

t.test("01.08 - Killer triplet within URL, ESP literal", (t) => {
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
    "01.08"
  );
  t.end();
});

t.test("01.09 - Killer triplet within URL - full version", (t) => {
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
    "01.09"
  );
  t.end();
});

t.test("01.10 - Responsys-style ESP tag", (t) => {
  const gathered = [];
  ct(`<a>$(something)<b>`, {
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
        end: 15,
        tail: ")$",
      },
      {
        type: "tag",
        start: 15,
        end: 18,
      },
    ],
    "01.10"
  );
  t.end();
});

// heuristically detecting tails and again new heads
t.test("01.11 - two nunjucks tags, same pattern set of two, tight", (t) => {
  const gathered = [];
  ct(`{%- a -%}{%- b -%}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 9,
      },
      {
        type: "esp",
        start: 9,
        end: 18,
      },
    ],
    "01.11"
  );
  t.end();
});

// heuristically detecting tails and again new heads, this time slightly different
t.test(
  "01.12 - two nunjucks tags, different pattern set of two, tight",
  (t) => {
    const gathered = [];
    ct(`{%- if count > 1 -%}{% if count > 1 %}`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 20,
        },
        {
          type: "esp",
          start: 20,
          end: 38,
        },
      ],
      "01.12"
    );
    t.end();
  }
);

// heuristically detecting tails and again new heads
t.test("01.13 - different set, *|zzz|*", (t) => {
  const gathered = [];
  ct(`*|zzz|**|yyy|*`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 7,
      },
      {
        type: "esp",
        start: 7,
        end: 14,
      },
    ],
    "01.13"
  );
  t.end();
});

t.test(
  "01.14 - error, two ESP tags joined, first one ends with heads instead of tails",
  (t) => {
    const gathered = [];
    ct(`*|zzz*|*|yyy|*`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 7,
        },
        {
          type: "esp",
          start: 7,
          end: 14,
        },
      ],
      "01.14"
    );
    t.end();
  }
);

// 02. false positives
// -----------------------------------------------------------------------------

t.test("02.01 - false positives - double perc", (t) => {
  const gathered = [];
  ct(`<table width="100%%">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "tag",
        tagName: "table",
        start: 0,
        end: 21,
        attribs: [
          {
            attribName: "width",
            attribNameStartsAt: 7,
            attribNameEndsAt: 12,
            attribOpeningQuoteAt: 13,
            attribClosingQuoteAt: 19,
            attribValue: "100%%",
            attribValueStartsAt: 14,
            attribValueEndsAt: 19,
            attribStart: 7,
            attribEnd: 20,
          },
        ],
      },
    ],
    "02.01"
  );
  t.end();
});

// 03. ESP tags in the attributes
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - one Nunjucks tag goes in as attribute`,
  (t) => {
    const gathered = [];
    ct(`<td{% z %}>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(gathered, [
      {
        type: "tag",
        start: 0,
        end: 11,
        value: `<td{% z %}>`,
        attribs: [
          {
            type: "esp",
            start: 3,
            end: 10,
            value: "{% z %}",
            head: "{%",
            tail: "%}",
            kind: null,
          },
        ],
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - Nunjucks conditionals wrapping an attr`,
  (t) => {
    const gathered = [];
    ct(`<td{% x %} class="z"{% y %} id="z">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(gathered, [
      {
        type: "tag",
        start: 0,
        end: 35,
        value: `<td{% x %} class="z"{% y %} id="z">`,
        attribs: [
          {
            type: "esp",
            start: 3,
            end: 10,
            value: "{% x %}",
            head: "{%",
            tail: "%}",
            kind: null,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 11,
            attribNameEndsAt: 16,
            attribOpeningQuoteAt: 17,
            attribClosingQuoteAt: 19,
            attribValue: "z",
            attribValueStartsAt: 18,
            attribValueEndsAt: 19,
            attribStart: 11,
            attribEnd: 20,
          },
          {
            type: "esp",
            start: 20,
            end: 27,
            value: "{% y %}",
            head: "{%",
            tail: "%}",
            kind: null,
          },
          {
            attribName: "id",
            attribNameRecognised: true,
            attribNameStartsAt: 28,
            attribNameEndsAt: 30,
            attribOpeningQuoteAt: 31,
            attribClosingQuoteAt: 33,
            attribValue: "z",
            attribValueStartsAt: 32,
            attribValueEndsAt: 33,
            attribStart: 28,
            attribEnd: 34,
          },
        ],
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - Nunjucks conditionals wrapping an attr`,
  (t) => {
    const gathered = [];
    ct(`<td{% if something %} class="z"{% endif %} id="y">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(gathered, [
      {
        type: "tag",
        start: 0,
        end: 50,
        value: '<td{% if something %} class="z"{% endif %} id="y">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 3,
        tagName: "td",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            type: "esp",
            start: 3,
            end: 21,
            value: "{% if something %}",
            head: "{%",
            tail: "%}",
            kind: null,
          },
          {
            attribName: "class",
            attribNameRecognised: true,
            attribNameStartsAt: 22,
            attribNameEndsAt: 27,
            attribOpeningQuoteAt: 28,
            attribClosingQuoteAt: 30,
            attribValue: "z",
            attribValueStartsAt: 29,
            attribValueEndsAt: 30,
            attribStart: 22,
            attribEnd: 31,
          },
          {
            type: "esp",
            start: 31,
            end: 42,
            value: "{% endif %}",
            head: "{%",
            tail: "%}",
            kind: null,
          },
          {
            attribName: "id",
            attribNameRecognised: true,
            attribNameStartsAt: 43,
            attribNameEndsAt: 45,
            attribOpeningQuoteAt: 46,
            attribClosingQuoteAt: 48,
            attribValue: "y",
            attribValueStartsAt: 47,
            attribValueEndsAt: 48,
            attribStart: 43,
            attribEnd: 49,
          },
        ],
      },
    ]);
    t.end();
  }
);

// Java:
// <%@ ... %>
// <c:forEach ... > (no slash)
// <jsp:useBean ... />
// <c:set ... />
