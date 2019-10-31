// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";

// 01. healthy html, no tricks
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
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 2,
      end: 5,
      tail: null,
      kind: null
    },
    {
      type: "text",
      start: 5,
      end: 6,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
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
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 3,
      end: 6,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 6,
      end: 9,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
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
      tail: null,
      kind: null
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
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "text",
      start: 3,
      end: 14,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 14,
      end: 20,
      tail: null,
      kind: null
    },
    {
      type: "text",
      start: 20,
      end: 26,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 26,
      end: 33,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 33,
      end: 37,
      tail: null,
      kind: null
    }
  ]);
});

test("01.09 - html comment", t => {
  const gathered = [];
  ct("<table><!--[if (gte mso 9)|(IE)]>\n<table", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 7,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 7,
      end: 33,
      tail: null,
      kind: "comment"
    },
    {
      type: "text",
      start: 33,
      end: 34,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 34,
      end: 40,
      tail: null,
      kind: null
    }
  ]);
});

test("01.10 - html5 doctype", t => {
  const gathered = [];
  ct("a<!DOCTYPE html>b", obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 1,
      end: 16,
      tail: null,
      kind: "doctype"
    },
    {
      type: "text",
      start: 16,
      end: 17,
      tail: null,
      kind: null
    }
  ]);
});

test("01.11 - xhtml doctype", t => {
  const gathered = [];
  ct(
    `z<!DOCTYPE html PUBLIC
  "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="ar" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">z`,
    obj => {
      gathered.push(obj);
    }
  );
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 1,
      end: 126,
      tail: null,
      kind: "doctype"
    },
    {
      type: "text",
      start: 126,
      end: 127,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 127,
      end: 190,
      tail: null,
      kind: null
    },
    {
      type: "text",
      start: 190,
      end: 191,
      tail: null,
      kind: null
    }
  ]);
});

test("01.12 - xhtml DTD doctype", t => {
  const gathered = [];
  ct(
    `z<?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">z`,
    obj => {
      gathered.push(obj);
    }
  );
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 1,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 1,
      end: 39,
      tail: null,
      kind: "xml"
    },
    {
      type: "text",
      start: 39,
      end: 41,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 41,
      end: 160,
      tail: null,
      kind: "doctype"
    },
    {
      type: "text",
      start: 160,
      end: 162,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 162,
      end: 229,
      tail: null,
      kind: null
    },
    {
      type: "text",
      start: 229,
      end: 230,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 2,
      end: 15,
      tail: null,
      kind: null
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
      tail: "%}",
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "esp",
      start: 3,
      end: 21,
      tail: "%}",
      kind: null
    },
    {
      type: "text",
      start: 21,
      end: 24,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "esp",
      start: 3,
      end: 21,
      tail: "%}",
      kind: null
    },
    {
      type: "html",
      start: 21,
      end: 24,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "esp",
      start: 3,
      end: 53,
      tail: "%}",
      kind: null
    },
    {
      type: "html",
      start: 53,
      end: 56,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 21,
      end: 24,
      tail: null,
      kind: null
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
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 170,
      end: 173,
      tail: null,
      kind: null
    }
  ]);
});

// 04. CSS
// -----------------------------------------------------------------------------

test("04.01 - CSS in the head", t => {
  const gathered = [];
  ct(`<style>\n.d-h{z}\n</style>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 7,
      tail: null,
      kind: "style"
    },
    {
      type: "text",
      start: 7,
      end: 8,
      tail: null,
      kind: null
    },
    {
      type: "css",
      start: 8,
      end: 15,
      tail: null,
      kind: null
    },
    {
      type: "text",
      start: 15,
      end: 16,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 16,
      end: 24,
      tail: null,
      kind: null
    }
  ]);
});
