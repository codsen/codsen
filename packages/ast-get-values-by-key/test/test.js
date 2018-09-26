import test from "ava";
import get from "../dist/ast-get-values-by-key.esm";
import objectPath from "object-path";

// ==============================
// GET
// ==============================

test("01.01 - just a plain object", t => {
  const source = {
    tag: "html"
  };

  t.deepEqual(
    get(source, "tag"),
    [
      {
        val: "html",
        path: "tag"
      }
    ],
    "01.01.01"
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.is(objectPath.get(source, "tag"), "html", "01.01.02");

  t.deepEqual(
    get(
      {
        Tag: "html"
      },
      "tag"
    ),
    [],
    "01.01.03"
  );
});

test("01.02 - single plain object within array", t => {
  const source = [
    {
      tag: "html"
    }
  ];
  t.deepEqual(
    get(source, "tag"),
    [
      {
        val: "html",
        path: "0.tag"
      }
    ],
    "01.02.01"
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.is(objectPath.get(source, "0.tag"), "html", "01.02.02");
});

test("01.03 - string in array as result", t => {
  const source = {
    tag: ["html"]
  };
  const res = [
    {
      val: ["html"],
      path: "tag"
    }
  ];
  t.deepEqual(get(source, "tag"), res, "01.03.01");
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.deepEqual(objectPath.get(source, "tag"), ["html"], "01.03.02");
});

test("01.04 - two strings as result", t => {
  t.deepEqual(
    get(
      [
        {
          tag: "html1",
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        },
        {
          tag: "html2",
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        }
      ],
      "tag"
    ),
    [
      {
        val: "html1",
        path: "0.tag"
      },
      { val: "html2", path: "1.tag" }
    ],
    "01.04.01"
  );
});

test("01.05 - query by key, returns mixed results", t => {
  t.deepEqual(
    get(
      [
        {
          tag: ["html1"],
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        },
        {
          tag: { html2: "html2" },
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        },
        {
          tag: "html3",
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        }
      ],
      "tag"
    ),
    [
      { val: ["html1"], path: "0.tag" },
      { val: { html2: "html2" }, path: "1.tag" },
      { val: "html3", path: "2.tag" }
    ],
    "01.05.01"
  );
});

test("01.06 - deep tree", t => {
  const source = [
    {
      a: {
        b: [
          {
            c: {
              d: [
                {
                  e: {
                    f: [
                      {
                        g: {
                          h: {
                            tag: "html"
                          }
                        }
                      }
                    ]
                  }
                },
                "whatnot"
              ]
            }
          },
          "also here too"
        ]
      }
    }
  ];
  const retrievedPath = "0.a.b.0.c.d.0.e.f.0.g.h.tag";
  t.deepEqual(
    get(source, "tag"),
    [{ val: "html", path: retrievedPath }],
    "01.06.01"
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.is(objectPath.get(source, retrievedPath), "html", "01.06.02");
});

test("01.07 - query returns an array", t => {
  t.deepEqual(
    get(
      [
        {
          tag: ["z"]
        }
      ],
      "tag"
    ),
    [{ val: ["z"], path: "0.tag" }],
    "01.07"
  );
});

test("01.08 - query returns a string", t => {
  t.deepEqual(
    get(
      [
        {
          tag: "z"
        }
      ],
      "tag"
    ),
    [{ val: "z", path: "0.tag" }],
    "01.08"
  );
});

test("01.09 - query returns array with two objects", t => {
  const source = [
    {
      tag: [
        {
          a: "a",
          b: "b"
        },
        {
          c: "c",
          d: "d"
        }
      ]
    }
  ];
  const retrievedValue = [
    {
      a: "a",
      b: "b"
    },
    {
      c: "c",
      d: "d"
    }
  ];
  t.deepEqual(
    get(source, "tag"),
    [
      {
        val: retrievedValue,
        path: "0.tag"
      }
    ],
    "01.09"
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.deepEqual(objectPath.get(source, "0.tag"), retrievedValue, "01.09.02");
});

// ==============================
// GET WITH NO RESULTS
// ==============================

test("02.01 - no results query", t => {
  t.deepEqual(
    get(
      {
        style: "html"
      },
      "tag"
    ),
    [],
    "02.01"
  );
});

// ==============================
// SET
// ==============================

test("03.01 - string replaced", t => {
  t.deepEqual(
    get(
      {
        tag: "html"
      },
      "tag",
      ["style"]
    ),
    {
      tag: "style"
    },
    "03.01"
  );
});

test("03.02 - string within array replaced", t => {
  t.deepEqual(
    get(
      {
        tag: ["html"]
      },
      "tag",
      [["style"]]
    ),
    {
      tag: ["style"]
    },
    "03.02"
  );
});

test("03.03 - value is object and is replaced", t => {
  t.deepEqual(
    get(
      {
        tag: {
          a: "b"
        }
      },
      "tag",
      [
        {
          c: "d"
        }
      ]
    ),
    {
      tag: {
        c: "d"
      }
    },
    "03.03"
  );
});

test("03.04 - two objects replaced", t => {
  t.deepEqual(
    get(
      [
        {
          tag: {
            a: "b"
          }
        },
        {
          tag: {
            x: "y"
          }
        }
      ],
      "tag",
      [
        {
          c: "d"
        },
        {
          m: "n"
        }
      ]
    ),
    [
      {
        tag: {
          c: "d"
        }
      },
      {
        tag: {
          m: "n"
        }
      }
    ],
    "03.04"
  );
});

test("03.05 - simple edit", t => {
  t.deepEqual(
    get(
      [
        {
          tag: "html1",
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        },
        {
          tag: "html2",
          attrs: {
            lang: "en"
          },
          content: ["\n"]
        }
      ],
      "tag",
      ["html3", "html4"]
    ),
    [
      {
        tag: "html3",
        attrs: {
          lang: "en"
        },
        content: ["\n"]
      },
      {
        tag: "html4",
        attrs: {
          lang: "en"
        },
        content: ["\n"]
      }
    ],
    "03.05"
  );
});

test("03.06 - replaced to an empty string", t => {
  t.deepEqual(
    get(
      {
        tag: "html"
      },
      "tag",
      ""
    ),
    {
      tag: ""
    },
    "03.06 - empty string given as a replacement"
  );
});

test("03.07 - not enough replacement values given", t => {
  t.deepEqual(
    get(
      {
        meta: [
          {
            tag: "no1"
          },
          {
            tag: "no2"
          },
          {
            tag: "no3"
          }
        ]
      },
      "tag",
      ["", ""]
    ),
    {
      meta: [
        {
          tag: ""
        },
        {
          tag: ""
        },
        {
          tag: "no3"
        }
      ]
    },
    "03.07 - still works"
  );
});

// ==============================
// SET WITH NO RESULTS
// ==============================

test("04.01 - no results replacement", t => {
  t.deepEqual(
    get(
      {
        style: "html"
      },
      "tag",
      ["meta"]
    ),
    {
      style: "html"
    },
    "04.01"
  );
});

// ==============================
// EDGE CASES
// ==============================

test("05.02 - input is plain object, replacement is string", t => {
  t.deepEqual(
    get(
      {
        style: "html"
      },
      "style",
      "meta"
    ),
    {
      style: "meta"
    },
    "05.02"
  );
});

// ==============================
// THROWS
// ==============================

test("06.01 - wrong type of second argument", t => {
  // throw pinning:
  const error1 = t.throws(() => {
    get(
      {
        style: "html"
      },
      1,
      ["meta"]
    );
  });
  t.regex(error1.message, /THROW_ID_04/g, "06.01.01");
});

test("06.02 - input is plain object, replacement is unrecognised (is a function)", t => {
  function f() {
    return "zzz";
  }
  t.notThrows(() => {
    get(
      {
        style: "html"
      },
      "style",
      f
    );
  });
});

test("06.03 - one of the whatToFind array values is a sneaky non-string", t => {
  const error2 = t.throws(() => {
    get(
      {
        style: "html"
      },
      ["style", 1],
      ["meta"]
    );
  });
  t.regex(error2.message, /THROW_ID_03/);
});

test("06.04 - one of the replacement array values is a sneaky non-string", t => {
  t.notThrows(() => {
    get(
      {
        style: "html"
      },
      "style",
      ["meta", 1]
    );
  });
});

test("06.05.01 - input present but non-container sort", t => {
  t.deepEqual(get(1, "style", "meta"), 1, "05.05.01");
});

test("06.05.02 - input completely missing", t => {
  const err1 = t.throws(() => {
    get();
  });
  t.regex(err1.message, /THROW_ID_01/g, "06.05.02.01");

  const err2 = t.throws(() => {
    get(null);
  });
  t.regex(err2.message, /THROW_ID_01/g, "06.05.02.02");

  const err3 = t.throws(() => {
    get(undefined);
  });
  t.regex(err3.message, /THROW_ID_01/g, "06.05.02.03");
});

test("06.06 - second argument is completely missing", t => {
  const err1 = t.throws(() => {
    get({
      style: "meta"
    });
  });
  t.regex(err1.message, /THROW_ID_02/g, "06.06.01");

  const err2 = t.throws(() => {
    get(
      {
        style: "meta"
      },
      undefined,
      ["a"]
    );
  });
  t.regex(err2.message, /THROW_ID_02/g, "06.06.02");

  const err3 = t.throws(() => {
    get(
      {
        style: "meta"
      },
      null,
      ["a"]
    );
  });
  t.regex(err3.message, /THROW_ID_02/g, "06.06.03");
});
