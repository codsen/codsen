const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");

// 01. ESP (Email Service Provider) and other templating language tags
// -----------------------------------------------------------------------------

t.test(t => {
  const gathered = [];
  ct(`{% zz %}`, obj => {
    gathered.push(obj);
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 8,
        tail: "%}"
      }
    ],
    "01.01 - ESP literals among text get reported"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`ab {% if something %} cd`, obj => {
    gathered.push(obj);
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
    "01.02 - ESP literals among text get reported"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`<a>{% if something %}<b>`, obj => {
    gathered.push(obj);
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
    "01.03 - ESP literals surrounded by HTML tags"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`<a>{% if a<b and c>d '"'''' ><><><><><><><><><><>< %}<b>`, obj => {
    gathered.push(obj);
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
        end: 53,
        tail: "%}"
      },
      {
        type: "html",
        start: 53,
        end: 56
      }
    ],
    "01.04 - ESP literals surrounded by HTML tags"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`<a b="c{{ z("'") }}"><b>`, obj => {
    gathered.push(obj);
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
    "01.05 - ESP tag with sandwiched quotes inside HTML tag's attribute 1 mini"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(
    `<a href="https://zzz.yyy/?api=1&query={{ some_key | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}"><b>`,
    obj => {
      gathered.push(obj);
    }
  );
  t.match(
    gathered,
    [
      {
        type: "html",
        start: 0,
        end: 170
      },
      {
        type: "html",
        start: 170,
        end: 173
      }
    ],
    "01.06 - ESP tag with sandwiched quotes inside HTML tag's attribute 2"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`<a>$(something)<b>`, obj => {
    gathered.push(obj);
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
    "01.07 - Responsys-style ESP tag"
  );
  t.end();
});

// heuristically detecting tails and again new heads
t.test(t => {
  const gathered = [];
  ct(`{%- a -%}{%- b -%}`, obj => {
    gathered.push(obj);
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
    "01.08 - two nunjucks tags, same pattern set of two, tight"
  );
  t.end();
});

// heuristically detecting tails and again new heads, this time slightly different
t.test(t => {
  const gathered = [];
  ct(`{%- if count > 1 -%}{% if count > 1 %}`, obj => {
    gathered.push(obj);
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
    "01.09 - two nunjucks tags, different pattern set of two, tight"
  );
  t.end();
});

// heuristically detecting tails and again new heads
t.test(t => {
  const gathered = [];
  ct(`*|zzz|**|yyy|*`, obj => {
    gathered.push(obj);
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
    "01.10 - different set, *|zzz|*"
  );
  t.end();
});

t.test(t => {
  const gathered = [];
  ct(`*|zzz*|*|yyy|*`, obj => {
    gathered.push(obj);
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
    "01.11 - error, two ESP tags joined, first one ends with heads instead of tails"
  );
  t.end();
});
