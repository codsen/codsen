// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";

// 01. healthy code, no tricks
// -----------------------------------------------------------------------------

test("01.01 - text-tag-text", t => {
  const gathered = [];
  ct("  <a>z", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 2,
      tail: null
    },
    {
      type: "html",
      start: 2,
      end: 5,
      tail: null
    },
    {
      type: "text",
      start: 5,
      end: 6,
      tail: null
    }
  ]);
});

test("01.02 - text only", t => {
  const gathered = [];
  ct("  ", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 2,
      tail: null
    }
  ]);
});

test("01.03 - tag only", t => {
  const gathered = [];
  ct("<a>", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3,
      tail: null
    }
  ]);
});

test("01.04 - multiple tags", t => {
  const gathered = [];
  ct("<a><b><c>", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3,
      tail: null
    },
    {
      type: "html",
      start: 3,
      end: 6,
      tail: null
    },
    {
      type: "html",
      start: 6,
      end: 9,
      tail: null
    }
  ]);
});

test("01.05 - closing bracket in the attribute's value", t => {
  const gathered = [];
  ct(`<a alt=">">`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 11,
      tail: null
    }
  ]);
});

test("01.06 - closing bracket layers of nested quotes", t => {
  const gathered = [];
  ct(`<a alt='"'">"'"'>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 17,
      tail: null
    }
  ]);
});

test("01.07 - bracket as text", t => {
  const gathered = [];
  ct("a < b", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 5,
      tail: null
    }
  ]);
});

test("01.08 - tag followed by brackets", t => {
  const gathered = [];
  ct(`<a>"something"<span>'here'</span></a>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3,
      tail: null
    },
    {
      type: "text",
      start: 3,
      end: 14,
      tail: null
    },
    {
      type: "html",
      start: 14,
      end: 20,
      tail: null
    },
    {
      type: "text",
      start: 20,
      end: 26,
      tail: null
    },
    {
      type: "html",
      start: 26,
      end: 33,
      tail: null
    },
    {
      type: "html",
      start: 33,
      end: 37,
      tail: null
    }
  ]);
});

// 02. broken code
// -----------------------------------------------------------------------------

test("02.01 - space after opening bracket, non-dubious HTML tag name, no attrs", t => {
  const gathered = [];
  ct(`a < b class="">`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 2,
      tail: null
    },
    {
      type: "html",
      start: 2,
      end: 15,
      tail: null
    }
  ]);
});

// 03. ESP (Email Service Provider) and other templating language tags
// -----------------------------------------------------------------------------

test("03.01 - ESP literals among text get reported", t => {
  const gathered = [];
  ct(`{% zz %}`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "esp",
      start: 0,
      end: 8,
      tail: "%}"
    }
  ]);
});

test("03.02 - ESP literals among text get reported", t => {
  const gathered = [];
  ct(`ab {% if something %} cd`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 3,
      tail: null
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
      end: 24,
      tail: null
    }
  ]);
});

test("03.03 - ESP literals surrounded by HTML tags", t => {
  const gathered = [];
  ct(`<a>{% if something %}<b>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3,
      tail: null
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
      end: 24,
      tail: null
    }
  ]);
});

test("03.04 - ESP literals surrounded by HTML tags", t => {
  const gathered = [];
  ct(`<a>{% if a<b and c>d '"'''' ><><><><><><><><><><>< %}<b>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 3,
      tail: null
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
      end: 56,
      tail: null
    }
  ]);
});

test("03.05 - ESP tag with sandwiched quotes inside HTML tag's attribute 1 mini", t => {
  const gathered = [];
  ct(`<a b="c{{ z("'") }}"><b>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 21,
      tail: null
    },
    {
      type: "html",
      start: 21,
      end: 24,
      tail: null
    }
  ]);
});

test("03.06 - ESP tag with sandwiched quotes inside HTML tag's attribute 2", t => {
  const gathered = [];
  ct(
    `<a href="https://zzz.yyy/?api=1&query={{ some_key | lower | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}"><b>`,
    obj => {
      gathered.push(obj);
    }
  );
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 170,
      tail: null
    },
    {
      type: "html",
      start: 170,
      end: 173,
      tail: null
    }
  ]);
});

// 04. EOLs
// -----------------------------------------------------------------------------

//
