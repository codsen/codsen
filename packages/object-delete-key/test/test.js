/* eslint-disable no-multi-str */

import test from "ava";
import parser from "posthtml-parser";
import deleteKey from "../dist/object-delete-key.esm";

let actual;
let intended;

// ==============================
// One-level plain objects
// ==============================

test("01.01 - delete a value which is string", t => {
  actual = deleteKey(
    {
      a: "a",
      b: "b"
    },
    {
      key: "b",
      val: "b"
    }
  );
  intended = {
    a: "a"
  };

  t.deepEqual(actual, intended, "01.01");
});

test("01.02 - delete a value which is plain object", t => {
  actual = deleteKey(
    {
      a: "a",
      b: { c: "d" }
    },
    {
      key: "b",
      val: { c: "d" }
    }
  );
  intended = {
    a: "a"
  };

  t.deepEqual(actual, intended, "01.02");
});

test("01.03 - delete two values, plain objects, cleanup=false", t => {
  actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" }
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: false
    }
  );
  intended = {
    a: { e: [{}] }
  };

  t.deepEqual(actual, intended, "01.03");
});

test("01.04 - delete two values, plain objects, cleanup=true", t => {
  actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" }
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: true
    }
  );
  intended = {};

  t.deepEqual(actual, intended, "01.04");
});

test("01.05 - delete two values which are plain objects (on default)", t => {
  actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" }
    },
    {
      key: "b",
      val: { c: "d" }
    }
  );
  intended = {};

  t.deepEqual(actual, intended, "01.05");
});

test("01.06 - delete a value which is an array", t => {
  actual = deleteKey(
    {
      a: "a",
      b: ["c", "d"]
    },
    {
      key: "b",
      val: ["c", "d"]
    }
  );
  intended = {
    a: "a"
  };

  t.deepEqual(actual, intended, "01.06");
});

test("01.07 - delete two values which are arrays, cleanup=false", t => {
  actual = deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"]
    },
    {
      key: "b",
      val: ["c", "d"],
      cleanup: false
    }
  );
  intended = {
    a: { e: [{}] }
  };

  t.deepEqual(actual, intended, "01.07");
});

test("01.08 - delete two values which are arrays, cleanup=default", t => {
  actual = deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"]
    },
    {
      key: "b",
      val: ["c", "d"]
    }
  );
  intended = {};

  t.deepEqual(actual, intended, "01.08");
});

// ==============================
// Omit value to target all keys
// ==============================

test("02.01 - simple plain object, couple instances found", t => {
  t.deepEqual(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: [{ b: "whatever as well" }]
      },
      {
        key: "b"
      }
    ),
    {
      a: "a"
    },
    "02.01.01 - no settings"
  );
  t.deepEqual(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: [{ b: "whatever as well" }]
      },
      {
        key: "b",
        only: "o" // object
      }
    ),
    {
      a: "a"
    },
    "02.01.02 - objects only (same outcome as 2.1.1)"
  );
  t.deepEqual(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: [{ b: "whatever as well" }]
      },
      {
        key: "b",
        only: "a" // array
      }
    ),
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever as well" }]
    },
    "02.01.03 - arrays only (none found)"
  );
  t.deepEqual(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: [{ b: "whatever as well" }]
      },
      {
        key: "b",
        only: "any" // same behaviour as defaults
      }
    ),
    {
      a: "a"
    },
    "02.01.04 - only=any"
  );
  t.deepEqual(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: ["a"]
      },
      {
        key: "a",
        only: "array"
      }
    ),
    {
      a: "a",
      b: "whatever"
    },
    '02.01.05 - does not touch key within object; cleanup will remove up to and including key "c"'
  );
  t.deepEqual(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: ["a"]
      },
      {
        key: "a",
        only: "object"
      }
    ),
    {
      b: "whatever",
      c: ["a"]
    },
    "02.01.06 - does not touch key within array"
  );
  t.deepEqual(
    deleteKey(
      {
        a: "apples",
        b: "whatever",
        c: ["chapels"]
      },
      {
        key: "*s",
        only: "a" // only target arrays
      }
    ),
    {
      a: "apples",
      b: "whatever"
    },
    "02.01.06 - does not touch key within array"
  );
  t.deepEqual(
    deleteKey(
      {
        a: "apples",
        b: "whatever",
        c: ["chapels"]
      },
      {
        key: "*s",
        only: "a", // only target arrays
        cleanup: false
      }
    ),
    {
      a: "apples",
      b: "whatever",
      c: []
    },
    "02.01.07 - same as #06 but without cleanup"
  );
});

test("02.02 - nested array/plain objects, multiple instances found", t => {
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } }
        }
      ],
      {
        key: "b"
      }
    ),
    [{ a: "a" }],
    "02.02.01, default cleanup"
  );
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } }
        }
      ],
      {
        key: "b",
        only: "object"
      }
    ),
    [{ a: "a" }],
    "02.02.02, only=object (same)"
  );
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } }
        }
      ],
      {
        key: "b",
        only: "array"
      }
    ),
    [
      {
        a: "a",
        b: "delete this key",
        c: [{ b: "and this as well" }]
      },
      {
        b: ["and this key too", "together with this"],
        d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } }
      }
    ],
    "02.02.03, only=array (nothing done)"
  );
});

test("02.03 - nested array/plain objects, multiple instances found, false", t => {
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } }
        }
      ],
      {
        key: "b",
        cleanup: false
      }
    ),
    [
      {
        a: "a",
        c: [{}]
      },
      {
        d: { e: { f: { g: {} } } }
      }
    ],
    "02.03 - cleanup=false"
  );
});

test("02.04 - mixed array and object findings", t => {
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: ["b", { b: "and this, no matter how deep-nested" }] } }
          }
        }
      ],
      {
        key: "b"
      }
    ),
    [{ a: "a" }],
    "02.04.01, default cleanup"
  );
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: ["b", { b: "and this, no matter how deep-nested" }] } }
          }
        }
      ],
      {
        key: "b",
        only: "whatever"
      }
    ),
    [{ a: "a" }],
    "02.04.02, only=any"
  );
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }]
        }
      ],
      {
        key: "b",
        only: "object"
      }
    ),
    [
      {
        a: "a",
        c: ["b", "b"]
      }
    ],
    "02.04.03, only=object, mini case"
  );
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: ["b", { b: "and this, no matter how deep-nested" }] } }
          }
        }
      ],
      {
        key: "b",
        only: "arrays"
      }
    ),
    [
      {
        a: "a",
        b: "delete this key",
        c: [{ b: "d" }]
      },
      {
        b: ["and this key too", "together with this"],
        d: { e: { f: { g: [{ b: "and this, no matter how deep-nested" }] } } }
      }
    ],
    "02.04.04, only=arrays"
  );
  t.deepEqual(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }]
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: ["b", { b: "and this, no matter how deep-nested" }] } }
          }
        }
      ],
      {
        key: "b",
        only: "object"
      }
    ),
    [
      {
        a: "a",
        c: ["b", "b"]
      },
      {
        d: { e: { f: { g: ["b"] } } }
      }
    ],
    "02.04.05, only=object, bigger example"
  );
});

// ==============================
// Omit key to target all keys with a given value
// ==============================

test("03.01 - targets all keys by value, cleanup=true", t => {
  actual = deleteKey(
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever" }]
    },
    {
      val: "whatever"
    }
  );
  intended = {
    a: "a"
  };

  t.deepEqual(actual, intended, "03.01");
});

test("03.02 - targets all keys by value, cleanup=false", t => {
  actual = deleteKey(
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever" }]
    },
    {
      val: "whatever",
      cleanup: false
    }
  );
  intended = {
    a: "a",
    c: [{}]
  };

  t.deepEqual(actual, intended, "03.02");
});

// ======================================
// Carcasses cleanup functionality checks
// ======================================

// v2.0+
// empty tag's parent will be deleted just if it does not have any non-empty values in other keys
// in the following case, key "d" is deleted because it's dead branch.
// But once we go "upstream" from "d" to higher, we don't touch "cousin" key "b":
test('04.01 - deletion limited to level where non-empty "uncles" exist', t => {
  actual = deleteKey(
    {
      a: "a",
      b: [[{}]],
      c: "c",
      d: {
        e: ""
      }
    },
    {
      key: "e",
      val: "",
      cleanup: true
    }
  );
  intended = {
    a: "a",
    b: [[{}]],
    c: "c"
  };

  t.deepEqual(actual, intended, "04.01");
});

test("04.02 - deletion of empty things is limited in arrays too", t => {
  actual = deleteKey(
    [
      [
        {
          a: ""
        }
      ],
      {},
      {
        b: "b"
      },
      ["c"]
    ],
    {
      key: "a",
      val: "",
      cleanup: true
    }
  );
  intended = [
    {},
    {
      b: "b"
    },
    ["c"]
  ];

  t.deepEqual(actual, intended, "04.02");
});

// ==============================
// Throws
// ==============================

test("05.01 - both key and value missing - throws", t => {
  t.throws(() => {
    deleteKey({ a: "a" }, {});
  });
});

test("05.02 - nonsensical options object - throws", t => {
  t.throws(() => {
    deleteKey({ a: "a" }, { z: "z" });
  });
  t.throws(() => {
    deleteKey({ a: "a" }, 1);
  });
});

test("05.03 - no input args - throws", t => {
  t.throws(() => {
    deleteKey();
  });
});

test("05.04 - wrong input args - throws", t => {
  t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: "yyy",
        val: "zzz",
        cleanup: 1
      }
    );
  });
  t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: 1,
        val: null,
        cleanup: true
      }
    );
  });
  t.throws(() => {
    deleteKey(
      { a: "a" },
      {
        key: 1,
        val: null,
        cleanup: "zzz"
      }
    );
  });
  t.throws(() => {
    deleteKey({ a: "a" }, { key: 1 }, "third arg");
  });
});

// ==============================
// Tests on real HTML
// ==============================

test("06.01 - deletes from real parsed HTML", t => {
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
  actual = deleteKey(parser(html), {
    key: "class",
    val: "",
    cleanup: true
  });
  intended = parser(`
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
  t.deepEqual(actual, intended, "06.01");
});

test("06.02 - real parsed HTML #1", t => {
  actual = deleteKey(
    [
      "<!DOCTYPE html>",
      {
        tag: "html",
        attrs: {
          lang: "en"
        },
        content: [
          {
            tag: "head",
            content: [
              {
                tag: "div"
              }
            ]
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
                  cellspacing: "0"
                },
                content: [
                  {
                    tag: "tr",
                    content: [
                      {
                        tag: "td",
                        attrs: {
                          class: ""
                        },
                        content: [
                          {
                            tag: "img",
                            attrs: {
                              src: "spacer.gif"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    {
      key: "class",
      val: ""
    }
  );
  intended = [
    "<!DOCTYPE html>",
    {
      tag: "html",
      attrs: {
        lang: "en"
      },
      content: [
        {
          tag: "head",
          content: [
            {
              tag: "div"
            }
          ]
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
                cellspacing: "0"
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
                            src: "spacer.gif"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  t.deepEqual(actual, intended, "06.02");
});

test("06.03 - real parsed HTML #2", t => {
  actual = deleteKey(
    [
      {
        tag: "table",
        attrs: {
          class: "",
          width: "100%"
        }
      }
    ],
    {
      key: "class",
      val: ""
    }
  );
  intended = [
    {
      tag: "table",
      attrs: {
        width: "100%"
      }
    }
  ];
  t.deepEqual(actual, intended, "06.03");
});

test("06.04 - real parsed HTML #3", t => {
  actual = deleteKey(
    {
      a: {
        b: "",
        c: "d",
        e: "f"
      }
    },
    {
      key: "b",
      val: "",
      cleanup: false
    }
  );
  intended = {
    a: {
      c: "d",
      e: "f"
    }
  };
  t.deepEqual(actual, intended, "06.04");
});

test("06.05 - real parsed HTML #4", t => {
  actual = deleteKey(
    {
      a: {
        b: "",
        c: "d"
      }
    },
    {
      key: "b",
      val: "",
      cleanup: true
    }
  );
  intended = {
    a: {
      c: "d"
    }
  };
  t.deepEqual(actual, intended, "06.05");
});

// ======================================
// Prove input args are not being mutated
// ======================================

test("07.01 - does not mutate input args", t => {
  const obj1 = {
    a: "a",
    b: "b"
  };
  const unneededRes = deleteKey(obj1, {
    key: "b",
    val: "b"
  });
  t.pass(unneededRes); // dummy to prevent JS Standard swearing
  t.deepEqual(
    obj1,
    {
      a: "a",
      b: "b"
    },
    "07.01"
  ); // real deal
});

// ===============
// Tests on arrays
// ===============

test("08.01 - delete a value which is empty string", t => {
  actual = deleteKey(
    {
      a: ["b", "", "c"]
    },
    {
      key: ""
    }
  );
  intended = {
    a: ["b", "c"]
  };

  t.deepEqual(actual, intended, "08.01");
});

test("08.02 - delete a value which is non-empty string", t => {
  actual = deleteKey(
    {
      a: ["b", "", "c", "b"]
    },
    {
      key: "b"
    }
  );
  intended = {
    a: ["", "c"]
  };

  t.deepEqual(actual, intended, "08.02");
});

test("08.03 - delete a value which is non-empty string, with wildcards", t => {
  actual = deleteKey(
    {
      a: ["beep", "", "c", "boop"]
    },
    {
      key: "b*p"
    }
  );
  intended = {
    a: ["", "c"]
  };

  t.deepEqual(actual, intended, "08.03");
});

test("08.04 - delete a value which is a non-empty string, with wildcards, only on arrays", t => {
  actual = deleteKey(
    {
      a: ["beep", "", "c", "boop"],
      bap: "bap"
    },
    {
      key: "b*p",
      only: "array"
    }
  );
  intended = {
    a: ["", "c"],
    bap: "bap"
  };

  t.deepEqual(actual, intended, "08.04");
});

// ==============================
// Globbing tests
// ==============================

test("09.01 - wildcard deletes two keys have string values", t => {
  // by key

  actual = deleteKey(
    {
      axx: "xxxx",
      ayy: "yyyy",
      b: "b"
    },
    {
      key: "a*"
    }
  );
  intended = {
    b: "b"
  };

  t.deepEqual(actual, intended, "09.01.02");

  // by value
  // ---------------------------------------------------------------------------

  actual = deleteKey(
    {
      axx: "xxxx",
      ayy: "yyyy",
      b: "b"
    },
    {
      key: "*xx"
    }
  );
  intended = {
    ayy: "yyyy",
    b: "b"
  };

  t.deepEqual(actual, intended, "09.01.02");

  // by both key and value, with wildcards, includes sneaky close positives
  // ---------------------------------------------------------------------------

  actual = deleteKey(
    {
      axx: "yyy x",
      notmatching_key: "yyy x",
      ayy: "zzz x",
      azz: "not matching value",
      b: "b"
    },
    {
      key: "a*",
      val: "*x"
    }
  );
  intended = {
    notmatching_key: "yyy x",
    azz: "not matching value",
    b: "b"
  };

  t.deepEqual(actual, intended, "09.01.03");
});

test("09.02 - wildcard deletes keys with plain object values, by key", t => {
  actual = deleteKey(
    {
      apples: "a",
      brambles: { c: "d" },
      crawls: "e"
    },
    {
      key: "*les"
    }
  );
  intended = {
    crawls: "e"
  };

  t.deepEqual(actual, intended, "09.02");
});

test("09.03 - wildcard delete two values, plain objects", t => {
  //
  // cleanup=false
  // ---------------------------------------------------------------------------

  actual = deleteKey(
    {
      a: { e: [{ brunch: { c: "d" } }] },
      brother: { c: "d" }
    },
    {
      key: "br*",
      val: { c: "d" },
      cleanup: false
    }
  );
  intended = {
    a: { e: [{}] }
  };

  t.deepEqual(actual, intended, "09.03.01");

  //
  // cleanup=true
  // ---------------------------------------------------------------------------

  actual = deleteKey(
    {
      a: { e: [{ brunch: { c: "d" } }] },
      brother: { c: "d" }
    },
    {
      key: "br*",
      val: { c: "d" },
      cleanup: true
    }
  );
  intended = {};

  t.deepEqual(actual, intended, "09.03.02");
});
