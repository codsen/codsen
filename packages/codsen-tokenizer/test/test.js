// avanotonly

import test from "ava";
import ct from "../dist/codsen-tokenizer.esm";

// 00. api
// -----------------------------------------------------------------------------

test("00.01 - 1st arg missing", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct();
  });
  t.truthy(error1.message.includes("THROW_ID_01"));
});

test("00.02 - 1nd arg of a wrong type", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct(true);
  });
  t.truthy(error1.message.includes("THROW_ID_02"));
});

test("00.03 - 2nd arg (cb()) wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct("a", "z");
  });
  t.truthy(error1.message.includes("THROW_ID_03"));
});

test("00.04 - 4th arg (opts) is wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct("a", () => {}, "z");
  });
  t.truthy(error1.message.includes("THROW_ID_04"));
});

test("00.05 - opts.reportProgressFunc is wrong", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    ct("a", () => {}, { reportProgressFunc: "z" });
  });
  t.truthy(error1.message.includes("THROW_ID_05"));
});

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

test("03.07 - Responsys-style ESP tag", t => {
  const gathered = [];
  ct(`<a>$(something)<b>`, obj => {
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
      end: 15,
      tail: ")$",
      kind: null
    },
    {
      type: "html",
      start: 15,
      end: 18,
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
      kind: "style"
    }
  ]);
});

test("04.02 - CSS, no whitespace inside", t => {
  const gathered = [];
  ct(`<meta><style>.d-h{z}</style>`, obj => {
    gathered.push(obj);
  });
  t.deepEqual(gathered, [
    {
      type: "html",
      start: 0,
      end: 6,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 6,
      end: 13,
      tail: null,
      kind: "style"
    },
    {
      type: "css",
      start: 13,
      end: 20,
      tail: null,
      kind: null
    },
    {
      type: "html",
      start: 20,
      end: 28,
      tail: null,
      kind: "style"
    }
  ]);
});

// 05. opts.reportProgressFunc
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - null`, t => {
  const gathered = [];
  ct(
    "abc",
    token => {
      gathered.push(token);
    },
    { reportProgressFunc: null }
  );
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 3,
      tail: null,
      kind: null
    }
  ]);
});

test(`05.02 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - false`, t => {
  const gathered = [];
  ct(
    "abc",
    token => {
      gathered.push(token);
    },
    { reportProgressFunc: false }
  );
  t.deepEqual(gathered, [
    {
      type: "text",
      start: 0,
      end: 3,
      tail: null,
      kind: null
    }
  ]);
});

test(`05.03 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - short length reports only at 50%`, t => {
  const gathered = [];
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  // short input string should report only when passing at 50%:
  const error1 = t.throws(() => {
    ct(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(30),
      token => {
        gathered.push(token);
      },
      { reportProgressFunc: shouldveBeenCalled }
    );
  });
  t.regex(error1.message, /50/);
});

test(`05.04 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - longer length reports at 0-100%`, t => {
  let counter = 0;
  const countingFunction = () => {
    // const countingFunction = val => {
    //   console.log(`val received: ${val}`);
    counter++;
  };
  // long input (>1000 chars long) should report at each natural number percentage passed:

  // 1. our function will mutate the counter variable:
  t.pass(
    ct(
      `aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaa\n`.repeat(50),
      () => {},
      { reportProgressFunc: countingFunction }
    )
  );

  // 2. check the counter variable:
  t.truthy(counter);
});

test(`05.05 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - custom reporting range, short input`, t => {
  function shouldveBeenCalled(val) {
    throw new Error(val);
  }

  // short input string should report only when passing at 50%:
  const error1 = t.throws(() => {
    ct(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(20),
      () => {},
      {
        reportProgressFunc: shouldveBeenCalled,
        reportProgressFuncFrom: 21,
        reportProgressFuncTo: 86
      }
    );
  });
  t.regex(error1.message, /32/);
});

test(`05.06 - ${`\u001b[${36}m${`opts.reportProgressFunc`}\u001b[${39}m`} - custom reporting range, longer input`, t => {
  const gather = [];
  const countingFunction = val => {
    // const countingFunction = val => {
    // console.log(`val received: ${val}`);
    gather.push(val);
  };

  // long input (>1000 chars long) should report at each natural number percentage passed:
  // our function will mutate the counter variable:
  t.pass(
    ct(
      `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa\n`.repeat(
        50
      ),
      () => {},
      {
        reportProgressFunc: countingFunction,
        reportProgressFuncFrom: 21,
        reportProgressFuncTo: 86
      }
    )
  );

  // 2. check the counter variable:
  const compareTo = [];
  for (let i = 21; i < 86; i++) {
    compareTo.push(i);
  }
  // since we use Math.floor, some percentages can be skipped, so let's just
  // confirm that no numbers outside of permitted values are reported
  gather.forEach(perc => {
    t.true(compareTo.includes(perc), String(perc));
  });
  t.is(gather.length, 86 - 21);

  t.deepEqual(gather, compareTo);
});
