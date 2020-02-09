const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. ESP (Email Service Provider) and other templating language tags
// -----------------------------------------------------------------------------

t.test("01.01 - ESP literals among text get reported", t => {
  const gathered = [];
  ct(`{% zz %}`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.same(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 8,
        head: "{%",
        tail: "%}",
        kind: null
      }
    ],
    "01.01"
  );
  t.end();
});

t.test("01.02 - ESP literals among text get reported", t => {
  const gathered = [];
  ct(`ab {% if something %} cd`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 3
      },
      {
        type: "esp",
        start: 3,
        end: 21,
        tail: "%}"
      },
      {
        type: "text",
        start: 21,
        end: 24
      }
    ],
    "01.02"
  );
  t.end();
});

t.test("01.03 - ESP literals surrounded by HTML tags", t => {
  const gathered = [];
  ct(`<a>{% if something %}<b>`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 3
      },
      {
        type: "esp",
        start: 3,
        end: 21,
        tail: "%}"
      },
      {
        type: "html",
        start: 21,
        end: 24
      }
    ],
    "01.03"
  );
  t.end();
});

t.test("01.04", t => {
  const gathered = [];
  ct(`<a b="{% if something %}"><c>`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 26
      },
      {
        type: "html",
        start: 26,
        end: 29
      }
    ],
    "01.04"
  );
  t.end();
});

t.test("01.05 - ESP literals surrounded by HTML tags, tight", t => {
  const gathered = [];
  ct(`<a>{% if a<b and c>d '"'''' ><>< %}<b>`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 3
      },
      {
        type: "esp",
        start: 3,
        end: 35,
        tail: "%}"
      },
      {
        type: "html",
        start: 35,
        end: 38
      }
    ],
    "01.05"
  );
  t.end();
});

t.test("01.06 - ESP tag with The Killer Triplet", t => {
  const gathered = [];
  ct(`<a b="c{{ z("'") }}"><b>`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 21
      },
      {
        type: "html",
        start: 21,
        end: 24
      }
    ],
    "01.06"
  );
  t.end();
});

t.test("01.07 - Killer triplet within URL, ESP literal", t => {
  const gathered = [];
  ct(`<a href="https://z.y/?a=1&q={{ r("'", "%27") }}"><b>`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 49
      },
      {
        type: "html",
        start: 49,
        end: 52
      }
    ],
    "01.07"
  );
  t.end();
});

t.test("01.08 - Killer triplet within URL - full version", t => {
  const gathered = [];
  ct(
    `<a href="https://z.y/?a=1&q={{ r(" ", "+") | r("'", "%27") | r("&", "%26") | r("(", "%28") | r(")", "%29") }}"><b>`,
    {
      tagCb: obj => {
        gathered.push(obj);
      }
    }
  );
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 111
      },
      {
        type: "html",
        start: 111,
        end: 114
      }
    ],
    "01.08"
  );
  t.end();
});

t.test("01.09 - Responsys-style ESP tag", t => {
  const gathered = [];
  ct(`<a>$(something)<b>`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 3
      },
      {
        type: "esp",
        start: 3,
        end: 15,
        tail: ")$"
      },
      {
        type: "html",
        start: 15,
        end: 18
      }
    ],
    "01.09"
  );
  t.end();
});

// heuristically detecting tails and again new heads
t.test("01.10 - two nunjucks tags, same pattern set of two, tight", t => {
  const gathered = [];
  ct(`{%- a -%}{%- b -%}`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 9
      },
      {
        type: "esp",
        start: 9,
        end: 18
      }
    ],
    "01.10"
  );
  t.end();
});

// heuristically detecting tails and again new heads, this time slightly different
t.test("01.11 - two nunjucks tags, different pattern set of two, tight", t => {
  const gathered = [];
  ct(`{%- if count > 1 -%}{% if count > 1 %}`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 20
      },
      {
        type: "esp",
        start: 20,
        end: 38
      }
    ],
    "01.11"
  );
  t.end();
});

// heuristically detecting tails and again new heads
t.test("01.12 - different set, *|zzz|*", t => {
  const gathered = [];
  ct(`*|zzz|**|yyy|*`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 7
      },
      {
        type: "esp",
        start: 7,
        end: 14
      }
    ],
    "01.12"
  );
  t.end();
});

t.test(
  "01.13 - error, two ESP tags joined, first one ends with heads instead of tails",
  t => {
    const gathered = [];
    ct(`*|zzz*|*|yyy|*`, {
      tagCb: obj => {
        gathered.push(obj);
      }
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 7
        },
        {
          type: "esp",
          start: 7,
          end: 14
        }
      ],
      "01.13"
    );
    t.end();
  }
);

// 02. false positives
// -----------------------------------------------------------------------------

t.test("02.01 - false positives - double perc", t => {
  const gathered = [];
  ct(`<table width="100%%">`, {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.match(
    gathered,
    [
      {
        type: "html",
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
            attribEnd: 20
          }
        ]
      }
    ],
    "02.01"
  );
  t.end();
});
