/* eslint-disable no-multi-str */

import tap from "tap";
import parser from "posthtml-parser";
import { deleteKey } from "../dist/object-delete-key.esm";

// ==============================
// One-level plain objects
// ==============================

tap.test("01 - delete a value which is string", (t) => {
  const actual = deleteKey(
    {
      a: "a",
      b: "b",
    },
    {
      key: "b",
      val: "b",
    }
  );
  const intended = {
    a: "a",
  };

  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test("02 - delete a value which is plain object", (t) => {
  const actual = deleteKey(
    {
      a: "a",
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
    }
  );
  const intended = {
    a: "a",
  };

  t.strictSame(actual, intended, "02");
  t.end();
});

tap.test("03 - delete two values, plain objects, cleanup=false", (t) => {
  const actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: false,
    }
  );
  const intended = {
    a: { e: [{}] },
  };

  t.strictSame(actual, intended, "03");
  t.end();
});

tap.test("04 - delete two values, plain objects, cleanup=true", (t) => {
  const actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: true,
    }
  );
  const intended = {};

  t.strictSame(actual, intended, "04");
  t.end();
});

tap.test("05 - delete two values which are plain objects (on default)", (t) => {
  const actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
    }
  );
  const intended = {};

  t.strictSame(actual, intended, "05");
  t.end();
});

tap.test("06 - delete a value which is an array", (t) => {
  const actual = deleteKey(
    {
      a: "a",
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
    }
  );
  const intended = {
    a: "a",
  };

  t.strictSame(actual, intended, "06");
  t.end();
});

tap.test("07 - delete two values which are arrays, cleanup=false", (t) => {
  const actual = deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
      cleanup: false,
    }
  );
  const intended = {
    a: { e: [{}] },
  };

  t.strictSame(actual, intended, "07");
  t.end();
});

tap.test("08 - delete two values which are arrays, cleanup=default", (t) => {
  const actual = deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
    }
  );
  const intended = {};

  t.strictSame(actual, intended, "08");
  t.end();
});

// ==============================
// Omit value to target all keys
// ==============================

tap.test("09 - simple plain object, couple instances found", (t) => {
  const source = {
    a: "a",
    b: "whatever",
    c: [{ b: "whatever as well" }],
  };
  t.strictSame(
    deleteKey(source, {
      key: "b",
    }),
    {
      a: "a",
    },
    "09.01 - no settings"
  );
  t.strictSame(
    deleteKey(source, {
      key: "b",
      only: "o", // object
    }),
    {
      a: "a",
    },
    "09.02 - objects only (same outcome as 2.1.1)"
  );
  t.strictSame(
    deleteKey(source, {
      key: "b",
      only: "a", // array
    }),
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever as well" }],
    },
    "09.03 - arrays only (none found)"
  );
  t.strictSame(
    deleteKey(source, {
      key: "b",
      only: "any", // same behaviour as defaults
    }),
    {
      a: "a",
    },
    "09.04 - only=any"
  );

  // ensure no mutation happened:
  t.strictSame(
    source,
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever as well" }],
    },
    "09.05"
  );
  t.end();
});

tap.test("10 - simple plain object, cleanup", (t) => {
  t.strictSame(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: ["a"],
      },
      {
        key: "a",
        only: "array",
      }
    ),
    {
      a: "a",
      b: "whatever",
    },
    '10.01 - does not touch key within object; cleanup will remove up to and including key "c"'
  );
  t.strictSame(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: ["a"],
      },
      {
        key: "a",
        only: "object",
      }
    ),
    {
      b: "whatever",
      c: ["a"],
    },
    "10.02 - does not touch key within array"
  );
  t.strictSame(
    deleteKey(
      {
        a: "apples",
        b: "whatever",
        c: ["chapels"],
      },
      {
        key: "*s",
        only: "a", // only target arrays
      }
    ),
    {
      a: "apples",
      b: "whatever",
    },
    "10.03 - does not touch key within array"
  );
  t.strictSame(
    deleteKey(
      {
        a: "apples",
        b: "whatever",
        c: ["chapels"],
      },
      {
        key: "*s",
        only: "a", // only target arrays
        cleanup: false,
      }
    ),
    {
      a: "apples",
      b: "whatever",
      c: [],
    },
    "10.04 - same as #06 but without cleanup"
  );
  t.end();
});

tap.test("11 - nested array/plain objects, multiple instances found", (t) => {
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
      }
    ),
    [{ a: "a" }],
    "11.01, default cleanup"
  );
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
        only: "object",
      }
    ),
    [{ a: "a" }],
    "11.02, only=object (same)"
  );
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
        only: "array",
      }
    ),
    [
      {
        a: "a",
        b: "delete this key",
        c: [{ b: "and this as well" }],
      },
      {
        b: ["and this key too", "together with this"],
        d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } },
      },
    ],
    "11.03, only=array (nothing done)"
  );
  t.end();
});

tap.test(
  "12 - nested array/plain objects, multiple instances found, false",
  (t) => {
    t.strictSame(
      deleteKey(
        [
          {
            a: "a",
            b: "delete this key",
            c: [{ b: "and this as well" }],
          },
          {
            b: ["and this key too", "together with this"],
            d: {
              e: { f: { g: { b: "and this, no matter how deep-nested" } } },
            },
          },
        ],
        {
          key: "b",
          cleanup: false,
        }
      ),
      [
        {
          a: "a",
          c: [{}],
        },
        {
          d: { e: { f: { g: {} } } },
        },
      ],
      "12 - cleanup=false"
    );
    t.end();
  }
);

tap.test("13 - mixed array and object findings", (t) => {
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
      }
    ),
    [{ a: "a" }],
    "13.01, default cleanup"
  );
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
        only: "whatever",
      }
    ),
    [{ a: "a" }],
    "13.02, only=any"
  );
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
      ],
      {
        key: "b",
        only: "object",
      }
    ),
    [
      {
        a: "a",
        c: ["b", "b"],
      },
    ],
    "13.03, only=object, mini case"
  );
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
        only: "arrays",
      }
    ),
    [
      {
        a: "a",
        b: "delete this key",
        c: [{ b: "d" }],
      },
      {
        b: ["and this key too", "together with this"],
        d: { e: { f: { g: [{ b: "and this, no matter how deep-nested" }] } } },
      },
    ],
    "13.04, only=arrays"
  );
  t.strictSame(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
        only: "object",
      }
    ),
    [
      {
        a: "a",
        c: ["b", "b"],
      },
      {
        d: { e: { f: { g: ["b"] } } },
      },
    ],
    "13.05, only=object, bigger example"
  );
  t.end();
});

// ==============================
// Omit key to target all keys with a given value
// ==============================

tap.test("14 - targets all keys by value, cleanup=true", (t) => {
  const actual = deleteKey(
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever" }],
    },
    {
      val: "whatever",
    }
  );
  const intended = {
    a: "a",
  };

  t.strictSame(actual, intended, "14");
  t.end();
});

tap.test("15 - targets all keys by value, cleanup=false", (t) => {
  const actual = deleteKey(
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever" }],
    },
    {
      val: "whatever",
      cleanup: false,
    }
  );
  const intended = {
    a: "a",
    c: [{}],
  };

  t.strictSame(actual, intended, "15");
  t.end();
});

// ======================================
// Carcasses cleanup functionality checks
// ======================================

// v2.0+
// empty tag's parent will be deleted just if it does not have any non-empty values in other keys
// in the following case, key "d" is deleted because it's dead branch.
// But once we go "upstream" from "d" to higher, we don't touch "cousin" key "b":
tap.test(
  '16 - deletion limited to level where non-empty "uncles" exist',
  (t) => {
    const actual = deleteKey(
      {
        a: "a",
        b: [[{}]],
        c: "c",
        d: {
          e: "",
        },
      },
      {
        key: "e",
        val: "",
        cleanup: true,
      }
    );
    const intended = {
      a: "a",
      b: [[{}]],
      c: "c",
    };

    t.strictSame(actual, intended, "16");
    t.end();
  }
);

tap.test("17 - deletion of empty things is limited in arrays too", (t) => {
  const actual = deleteKey(
    [
      [
        {
          a: "",
        },
      ],
      {},
      {
        b: "b",
      },
      ["c"],
    ],
    {
      key: "a",
      val: "",
      cleanup: true,
    }
  );
  const intended = [
    {},
    {
      b: "b",
    },
    ["c"],
  ];

  t.strictSame(actual, intended, "17");
  t.end();
});

// ==============================
// Throws
// ==============================

tap.test("18 - both key and value missing - throws", (t) => {
  t.throws(() => {
    deleteKey({ a: "a" }, {});
  }, /THROW_ID_04/);
  t.end();
});

tap.test("19 - nonsensical options object - throws", (t) => {
  t.throws(() => {
    deleteKey({ a: "a" }, { z: "z" });
  }, /THROW_ID_04/);
  t.end();
});

tap.test("20 - nonsensical options object - throws", (t) => {
  t.throws(() => {
    deleteKey({ a: "a" }, 1);
  }, /THROW_ID_04/);
  t.end();
});

tap.test("21 - no input args - throws", (t) => {
  t.throws(() => {
    deleteKey();
  }, /THROW_ID_01/);
  t.end();
});

tap.test("22 - wrong input args - throws", (t) => {
  t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: 1,
        val: null,
        cleanup: true,
      }
    );
  }, /opts\.key/g);
  t.end();
});

tap.test("23 - wrong input args - throws", (t) => {
  t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: 1,
        val: null,
        cleanup: "zzz",
      }
    );
  }, /opts\.key/);
  t.end();
});

// ==============================
// Tests on real HTML
// ==============================

tap.test("24 - deletes from real parsed HTML", (t) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>test</title>
</head>
<body>
<table class="" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td class="">
<img src="spacer.gif">
</td>
</tr>
</table>
</body>
</html>
`;
  const actual = deleteKey(parser(html), {
    key: "class",
    val: "",
    cleanup: true,
  });
  const intended = parser(`
<!DOCTYPE html>
<html lang="en">
<head>
<title>test</title>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<img src="spacer.gif">
</td>
</tr>
</table>
</body>
</html>
`);
  t.strictSame(actual, intended, "24");
  t.end();
});

tap.test("25 - real parsed HTML #1", (t) => {
  const actual = deleteKey(
    [
      "<!DOCTYPE html>",
      {
        tag: "html",
        attrs: {
          lang: "en",
        },
        content: [
          {
            tag: "head",
            content: [
              {
                tag: "div",
              },
            ],
          },
          {
            tag: "body",
            content: [
              {
                tag: "table",
                attrs: {
                  class: "",
                  width: "100%",
                  border: "0",
                  cellpadding: "0",
                  cellspacing: "0",
                },
                content: [
                  {
                    tag: "tr",
                    content: [
                      {
                        tag: "td",
                        attrs: {
                          class: "",
                        },
                        content: [
                          {
                            tag: "img",
                            attrs: {
                              src: "spacer.gif",
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    {
      key: "class",
      val: "",
    }
  );
  const intended = [
    "<!DOCTYPE html>",
    {
      tag: "html",
      attrs: {
        lang: "en",
      },
      content: [
        {
          tag: "head",
          content: [
            {
              tag: "div",
            },
          ],
        },
        {
          tag: "body",
          content: [
            {
              tag: "table",
              attrs: {
                width: "100%",
                border: "0",
                cellpadding: "0",
                cellspacing: "0",
              },
              content: [
                {
                  tag: "tr",
                  content: [
                    {
                      tag: "td",
                      content: [
                        {
                          tag: "img",
                          attrs: {
                            src: "spacer.gif",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  t.strictSame(actual, intended, "25");
  t.end();
});

tap.test("26 - real parsed HTML #2", (t) => {
  const actual = deleteKey(
    [
      {
        tag: "table",
        attrs: {
          class: "",
          width: "100%",
        },
      },
    ],
    {
      key: "class",
      val: "",
    }
  );
  const intended = [
    {
      tag: "table",
      attrs: {
        width: "100%",
      },
    },
  ];
  t.strictSame(actual, intended, "26");
  t.end();
});

tap.test("27 - real parsed HTML #3", (t) => {
  const actual = deleteKey(
    {
      a: {
        b: "",
        c: "d",
        e: "f",
      },
    },
    {
      key: "b",
      val: "",
      cleanup: false,
    }
  );
  const intended = {
    a: {
      c: "d",
      e: "f",
    },
  };
  t.strictSame(actual, intended, "27");
  t.end();
});

tap.test("28 - real parsed HTML #4", (t) => {
  const actual = deleteKey(
    {
      a: {
        b: "",
        c: "d",
      },
    },
    {
      key: "b",
      val: "",
      cleanup: true,
    }
  );
  const intended = {
    a: {
      c: "d",
    },
  };
  t.strictSame(actual, intended, "28");
  t.end();
});

// ======================================
// Prove input args are not being mutated
// ======================================

tap.test("29 - does not mutate input args", (t) => {
  const obj1 = {
    a: "a",
    b: "b",
  };
  const unneededRes = deleteKey(obj1, {
    key: "b",
    val: "b",
  });
  t.pass(unneededRes); // dummy to prevent JS Standard swearing
  t.strictSame(
    obj1,
    {
      a: "a",
      b: "b",
    },
    "29.01"
  ); // real deal
  t.end();
});

// ===============
// Tests on arrays
// ===============

tap.test("30 - delete a value which is empty string", (t) => {
  const actual = deleteKey(
    {
      a: ["b", "", "c"],
    },
    {
      key: "",
    }
  );
  const intended = {
    a: ["b", "c"],
  };

  t.strictSame(actual, intended, "30");
  t.end();
});

tap.test("31 - delete a value which is non-empty string", (t) => {
  const actual = deleteKey(
    {
      a: ["b", "", "c", "b"],
    },
    {
      key: "b",
    }
  );
  const intended = {
    a: ["", "c"],
  };

  t.strictSame(actual, intended, "31");
  t.end();
});

tap.test(
  "32 - delete a value which is non-empty string, with wildcards",
  (t) => {
    const actual = deleteKey(
      {
        a: ["beep", "", "c", "boop"],
      },
      {
        key: "b*p",
      }
    );
    const intended = {
      a: ["", "c"],
    };

    t.strictSame(actual, intended, "32");
    t.end();
  }
);

tap.test(
  "33 - delete a value which is a non-empty string, with wildcards, only on arrays",
  (t) => {
    const actual = deleteKey(
      {
        a: ["beep", "", "c", "boop"],
        bap: "bap",
      },
      {
        key: "b*p",
        only: "array",
      }
    );
    const intended = {
      a: ["", "c"],
      bap: "bap",
    };

    t.strictSame(actual, intended, "33");
    t.end();
  }
);

// ==============================
// Globbing tests
// ==============================

tap.test("34 - wildcard deletes two keys have string values", (t) => {
  // by key

  const actual = deleteKey(
    {
      axx: "xxxx",
      ayy: "yyyy",
      b: "b",
    },
    {
      key: "a*",
    }
  );
  const intended = {
    b: "b",
  };

  t.strictSame(actual, intended, "34");
  t.end();
});

tap.test("35 - wildcard deletes two keys have string values", (t) => {
  // by value
  // ---------------------------------------------------------------------------

  const actual = deleteKey(
    {
      axx: "xxxx",
      ayy: "yyyy",
      b: "b",
    },
    {
      key: "*xx",
    }
  );
  const intended = {
    ayy: "yyyy",
    b: "b",
  };

  t.strictSame(actual, intended, "35");

  // by both key and value, with wildcards, includes sneaky close positives
  // ---------------------------------------------------------------------------
  t.end();
});

tap.test("36 - wildcard deletes two keys have string values", (t) => {
  const actual = deleteKey(
    {
      axx: "yyy x",
      notmatching_key: "yyy x",
      ayy: "zzz x",
      azz: "not matching value",
      b: "b",
    },
    {
      key: "a*",
      val: "*x",
    }
  );
  const intended = {
    notmatching_key: "yyy x",
    azz: "not matching value",
    b: "b",
  };

  t.strictSame(actual, intended, "36");
  t.end();
});

tap.test("37 - wildcard deletes keys with plain object values, by key", (t) => {
  const actual = deleteKey(
    {
      apples: "a",
      brambles: { c: "d" },
      crawls: "e",
    },
    {
      key: "*les",
    }
  );
  const intended = {
    crawls: "e",
  };

  t.strictSame(actual, intended, "37");
  t.end();
});

tap.test("38 - wildcard delete two values, plain objects", (t) => {
  //
  // cleanup=false
  // ---------------------------------------------------------------------------

  const actual = deleteKey(
    {
      a: { e: [{ brunch: { c: "d" } }] },
      brother: { c: "d" },
    },
    {
      key: "br*",
      val: { c: "d" },
      cleanup: false,
    }
  );
  const intended = {
    a: { e: [{}] },
  };

  t.strictSame(actual, intended, "38");
  t.end();
});

tap.test("39 - wildcard delete two values, plain objects", (t) => {
  //
  // cleanup=true
  // ---------------------------------------------------------------------------

  const actual = deleteKey(
    {
      a: { e: [{ brunch: { c: "d" } }] },
      brother: { c: "d" },
    },
    {
      key: "br*",
      val: { c: "d" },
      cleanup: true,
    }
  );
  const intended = {};

  t.strictSame(actual, intended, "39");
  t.end();
});

tap.test("40 - issue #8 - undefined as a value", (t) => {
  const actual = deleteKey(
    {
      __typename: "sd",
      entryPoint: "a",
    },
    {
      key: "__typename",
    }
  );
  const intended = {
    entryPoint: "a",
  };

  t.strictSame(actual, intended, "40");
  t.end();
});

tap.test("41 - issue #8 - undefined as a value, outside deletion path", (t) => {
  t.strictSame(
    deleteKey(
      {
        __typename: "sd",
        entryPoint: undefined,
      },
      {
        key: "__typename",
        cleanup: true, // <---
      }
    ),
    {
      entryPoint: undefined,
    },
    "41"
  );
  t.end();
});

tap.test("42 - issue #8 - undefined as a value, outside deletion path", (t) => {
  t.strictSame(
    deleteKey(
      {
        __typename: "sd",
        entryPoint: undefined,
      },
      {
        key: "__typename",
        cleanup: false, // <---
      }
    ),
    {
      entryPoint: undefined,
    },
    "42"
  );

  t.end();
});

tap.test("43 - issue #8 - undefined as a value, outside deletion path", (t) => {
  const input = {
    a: { __typename: "sd" },
    entryPoint: undefined,
  };

  // since "entrypoint" is not in the way of deletion path, it is retained,
  // no matter the "cleanup" setting
  t.strictSame(
    deleteKey(input, {
      key: "__typename",
      cleanup: true, // <---
    }),
    {
      entryPoint: undefined,
    },
    "43.01"
  );
  t.strictSame(
    deleteKey(input, {
      key: "__typename",
      cleanup: false, // <---
    }),
    {
      a: {},
      entryPoint: undefined,
    },
    "43.02"
  );

  t.end();
});

tap.test("44 - issue #8", (t) => {
  const input = {
    a: { __typename: "sd", b: undefined, c: "" },
    entryPoint: undefined,
  };

  t.strictSame(
    deleteKey(input, {
      key: "__typename",
      cleanup: true, // <---
    }),
    {
      a: { b: undefined, c: "" },
      entryPoint: undefined,
    },
    "44.01"
  );
  t.strictSame(
    deleteKey(input, {
      key: "__typename",
      cleanup: false, // <---
    }),
    {
      a: { b: undefined, c: "" },
      entryPoint: undefined,
    },
    "44.02"
  );

  t.end();
});
