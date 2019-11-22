// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";
import deepContains from "ast-deep-contains";

// 01. ESP (Email Service Provider) and other templating language tags
// -----------------------------------------------------------------------------

test("01.01 - ESP literals among text get reported", t => {
  const gathered = [];
  ct(`{% zz %}`, obj => {
    gathered.push(obj);
  });
  deepContains(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 8,
        tail: "%}"
      }
    ],
    t.is,
    t.fail
  );
});

test("01.02 - ESP literals among text get reported", t => {
  const gathered = [];
  ct(`ab {% if something %} cd`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

test("01.03 - ESP literals surrounded by HTML tags", t => {
  const gathered = [];
  ct(`<a>{% if something %}<b>`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

test("01.04 - ESP literals surrounded by HTML tags", t => {
  const gathered = [];
  ct(`<a>{% if a<b and c>d '"'''' ><><><><><><><><><><>< %}<b>`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

test("01.05 - ESP tag with sandwiched quotes inside HTML tag's attribute 1 mini", t => {
  const gathered = [];
  ct(`<a b="c{{ z("'") }}"><b>`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

test("01.06 - ESP tag with sandwiched quotes inside HTML tag's attribute 2", t => {
  const gathered = [];
  ct(
    `<a href="https://zzz.yyy/?api=1&query={{ some_key | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}"><b>`,
    obj => {
      gathered.push(obj);
    }
  );
  deepContains(
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
    t.is,
    t.fail
  );
});

test("01.07 - Responsys-style ESP tag", t => {
  const gathered = [];
  ct(`<a>$(something)<b>`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

// heuristically detecting tails and again new heads
test("01.08 - two nunjucks tags, same pattern set of two, tight", t => {
  const gathered = [];
  ct(`{%- a -%}{%- b -%}`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

// heuristically detecting tails and again new heads, this time slightly different
test("01.09 - two nunjucks tags, different pattern set of two, tight", t => {
  const gathered = [];
  ct(`{%- if count > 1 -%}{% if count > 1 %}`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});

// heuristically detecting tails and again new heads
test.only("01.10 - different set, *|zzz|*", t => {
  const gathered = [];
  ct(`*|zzz|**|yyy|*`, obj => {
    gathered.push(obj);
  });
  deepContains(
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
    t.is,
    t.fail
  );
});
