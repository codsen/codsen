/* eslint-disable no-multi-str */

const t = require("tap");
const parser = require("posthtml-parser");
const deleteKey = require("../dist/object-delete-key.cjs");

// ==============================
// One-level plain objects
// ==============================

t.test("01.01 - delete a value which is string", (t) => {
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

  t.same(actual, intended, "01.01");
  t.end();
});

t.test("01.02 - delete a value which is plain object", (t) => {
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

  t.same(actual, intended, "01.02");
  t.end();
});

t.test("01.03 - delete two values, plain objects, cleanup=false", (t) => {
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

  t.same(actual, intended, "01.03");
  t.end();
});

t.test("01.04 - delete two values, plain objects, cleanup=true", (t) => {
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

  t.same(actual, intended, "01.04");
  t.end();
});

t.test(
  "01.05 - delete two values which are plain objects (on default)",
  (t) => {
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

    t.same(actual, intended, "01.05");
    t.end();
  }
);

t.test("01.06 - delete a value which is an array", (t) => {
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

  t.same(actual, intended, "01.06");
  t.end();
});

t.test("01.07 - delete two values which are arrays, cleanup=false", (t) => {
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

  t.same(actual, intended, "01.07");
  t.end();
});

t.test("01.08 - delete two values which are arrays, cleanup=default", (t) => {
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

  t.same(actual, intended, "01.08");
  t.end();
});

// ==============================
// Omit value to target all keys
// ==============================

t.test("02.01 - simple plain object, couple instances found", (t) => {
  const source = {
    a: "a",
    b: "whatever",
    c: [{ b: "whatever as well" }],
  };
  t.same(
    deleteKey(source, {
      key: "b",
    }),
    {
      a: "a",
    },
    "02.01.01 - no settings"
  );
  t.same(
    deleteKey(source, {
      key: "b",
      only: "o", // object
    }),
    {
      a: "a",
    },
    "02.01.02 - objects only (same outcome as 2.1.1)"
  );
  t.same(
    deleteKey(source, {
      key: "b",
      only: "a", // array
    }),
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever as well" }],
    },
    "02.01.03 - arrays only (none found)"
  );
  t.same(
    deleteKey(source, {
      key: "b",
      only: "any", // same behaviour as defaults
    }),
    {
      a: "a",
    },
    "02.01.04 - only=any"
  );

  // ensure no mutation happened:
  t.same(source, {
    a: "a",
    b: "whatever",
    c: [{ b: "whatever as well" }],
  });
  t.end();
});

t.test("02.02 - simple plain object, cleanup", (t) => {
  t.same(
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
    '02.02.01 - does not touch key within object; cleanup will remove up to and including key "c"'
  );
  t.same(
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
    "02.02.02 - does not touch key within array"
  );
  t.same(
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
    "02.02.03 - does not touch key within array"
  );
  t.same(
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
    "02.02.04 - same as #06 but without cleanup"
  );
  t.end();
});

t.test("02.03 - nested array/plain objects, multiple instances found", (t) => {
  t.same(
    deleteKey(
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
      {
        key: "b",
      }
    ),
    [{ a: "a" }],
    "02.03.01, default cleanup"
  );
  t.same(
    deleteKey(
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
      {
        key: "b",
        only: "object",
      }
    ),
    [{ a: "a" }],
    "02.03.02, only=object (same)"
  );
  t.same(
    deleteKey(
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
    "02.03.03, only=array (nothing done)"
  );
  t.end();
});

t.test(
  "02.04 - nested array/plain objects, multiple instances found, false",
  (t) => {
    t.same(
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
      "02.04 - cleanup=false"
    );
    t.end();
  }
);

t.test("02.05 - mixed array and object findings", (t) => {
  t.same(
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
    "02.05.01, default cleanup"
  );
  t.same(
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
    "02.05.02, only=any"
  );
  t.same(
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
    "02.05.03, only=object, mini case"
  );
  t.same(
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
    "02.05.04, only=arrays"
  );
  t.same(
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
    "02.05.05, only=object, bigger example"
  );
  t.end();
});

// ==============================
// Omit key to target all keys with a given value
// ==============================

t.test("03.01 - targets all keys by value, cleanup=true", (t) => {
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

  t.same(actual, intended, "03.01");
  t.end();
});

t.test("03.02 - targets all keys by value, cleanup=false", (t) => {
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

  t.same(actual, intended, "03.02");
  t.end();
});

// ======================================
// Carcasses cleanup functionality checks
// ======================================

// v2.0+
// empty tag's parent will be deleted just if it does not have any non-empty values in other keys
// in the following case, key "d" is deleted because it's dead branch.
// But once we go "upstream" from "d" to higher, we don't touch "cousin" key "b":
t.test(
  '04.01 - deletion limited to level where non-empty "uncles" exist',
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

    t.same(actual, intended, "04.01");
    t.end();
  }
);

t.test("04.02 - deletion of empty things is limited in arrays too", (t) => {
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

  t.same(actual, intended, "04.02");
  t.end();
});

// ==============================
// Throws
// ==============================

t.test("05.01 - both key and value missing - throws", (t) => {
  const error1 = t.throws(() => {
    deleteKey({ a: "a" }, {});
  });
  t.match(error1.message, /THROW_ID_04/);
  t.end();
});

t.test("05.02 - nonsensical options object - throws", (t) => {
  const error1 = t.throws(() => {
    deleteKey({ a: "a" }, { z: "z" });
  });
  t.match(error1.message, /THROW_ID_04/);
  t.end();
});

t.test("05.03 - nonsensical options object - throws", (t) => {
  const error1 = t.throws(() => {
    deleteKey({ a: "a" }, 1);
  });
  t.match(error1.message, /THROW_ID_04/);
  t.end();
});

t.test("05.04 - no input args - throws", (t) => {
  const error1 = t.throws(() => {
    deleteKey();
  });
  t.match(error1.message, /THROW_ID_01/);
  t.end();
});

t.test("05.05 - wrong input args - throws", (t) => {
  const error1 = t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: 1,
        val: null,
        cleanup: true,
      }
    );
  });
  t.match(error1.message, /opts\.key/g);
  t.end();
});

t.test("05.06 - wrong input args - throws", (t) => {
  const error1 = t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: 1,
        val: null,
        cleanup: "zzz",
      }
    );
  });
  t.match(error1.message, /opts\.key/);
  t.end();
});

// ==============================
// Tests on real HTML
// ==============================

t.test("06.01 - deletes from real parsed HTML", (t) => {
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
  t.same(actual, intended, "06.01");
  t.end();
});

t.test("06.02 - real parsed HTML #1", (t) => {
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
  t.same(actual, intended, "06.02");
  t.end();
});

t.test("06.03 - real parsed HTML #2", (t) => {
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
  t.same(actual, intended, "06.03");
  t.end();
});

t.test("06.04 - real parsed HTML #3", (t) => {
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
  t.same(actual, intended, "06.04");
  t.end();
});

t.test("06.05 - real parsed HTML #4", (t) => {
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
  t.same(actual, intended, "06.05");
  t.end();
});

// ======================================
// Prove input args are not being mutated
// ======================================

t.test("07.01 - does not mutate input args", (t) => {
  const obj1 = {
    a: "a",
    b: "b",
  };
  const unneededRes = deleteKey(obj1, {
    key: "b",
    val: "b",
  });
  t.pass(unneededRes); // dummy to prevent JS Standard swearing
  t.same(
    obj1,
    {
      a: "a",
      b: "b",
    },
    "07.01"
  ); // real deal
  t.end();
});

// ===============
// Tests on arrays
// ===============

t.only("08.01 - delete a value which is empty string", (t) => {
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

  t.same(actual, intended, "08.01");
  t.end();
});

t.test("08.02 - delete a value which is non-empty string", (t) => {
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

  t.same(actual, intended, "08.02");
  t.end();
});

t.test(
  "08.03 - delete a value which is non-empty string, with wildcards",
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

    t.same(actual, intended, "08.03");
    t.end();
  }
);

t.test(
  "08.04 - delete a value which is a non-empty string, with wildcards, only on arrays",
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

    t.same(actual, intended, "08.04");
    t.end();
  }
);

// ==============================
// Globbing tests
// ==============================

t.test("09.01 - wildcard deletes two keys have string values", (t) => {
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

  t.same(actual, intended, "09.01.02");
  t.end();
});

t.test("09.01 - wildcard deletes two keys have string values", (t) => {
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

  t.same(actual, intended, "09.01.02");

  // by both key and value, with wildcards, includes sneaky close positives
  // ---------------------------------------------------------------------------
  t.end();
});

t.test("09.01 - wildcard deletes two keys have string values", (t) => {
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

  t.same(actual, intended, "09.01.03");
  t.end();
});

t.test(
  "09.02 - wildcard deletes keys with plain object values, by key",
  (t) => {
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

    t.same(actual, intended, "09.02");
    t.end();
  }
);

t.test("09.03 - wildcard delete two values, plain objects", (t) => {
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

  t.same(actual, intended, "09.03.01");
  t.end();
});

t.test("09.03 - wildcard delete two values, plain objects", (t) => {
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

  t.same(actual, intended, "09.03.02");
  t.end();
});
