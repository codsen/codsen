import tap from "tap";
import objectPath from "object-path";
import get from "../dist/ast-get-values-by-key.esm";

// ==============================
// GET
// ==============================

tap.test("01 - just a plain object", (t) => {
  const source = {
    tag: "html",
  };

  t.same(
    get(source, "tag"),
    [
      {
        val: "html",
        path: "tag",
      },
    ],
    "01.01"
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.equal(objectPath.get(source, "tag"), "html", "01.02");

  t.same(
    get(
      {
        Tag: "html",
      },
      "tag"
    ),
    [],
    "01.03"
  );
  t.end();
});

tap.test("02 - single plain object within array", (t) => {
  const source = [
    {
      tag: "html",
    },
  ];
  t.same(
    get(source, "tag"),
    [
      {
        val: "html",
        path: "0.tag",
      },
    ],
    "02.01"
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.equal(objectPath.get(source, "0.tag"), "html", "02.02");
  t.end();
});

tap.test("03 - string in array as result", (t) => {
  const source = {
    tag: ["html"],
  };
  const res = [
    {
      val: ["html"],
      path: "tag",
    },
  ];
  t.same(get(source, "tag"), res, "03.01");
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.same(objectPath.get(source, "tag"), ["html"], "03.02");
  t.end();
});

tap.test("04 - two strings as result", (t) => {
  t.same(
    get(
      [
        {
          tag: "html1",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: "html2",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
      ],
      "tag"
    ),
    [
      {
        val: "html1",
        path: "0.tag",
      },
      { val: "html2", path: "1.tag" },
    ],
    "04"
  );
  t.end();
});

tap.test("05 - query by key, returns mixed results", (t) => {
  t.same(
    get(
      [
        {
          tag: ["html1"],
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: { html2: "html2" },
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: "html3",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
      ],
      "tag"
    ),
    [
      { val: ["html1"], path: "0.tag" },
      { val: { html2: "html2" }, path: "1.tag" },
      { val: "html3", path: "2.tag" },
    ],
    "05"
  );
  t.end();
});

tap.test("06 - deep tree", (t) => {
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
                            tag: "html",
                          },
                        },
                      },
                    ],
                  },
                },
                "whatnot",
              ],
            },
          },
          "also here too",
        ],
      },
    },
  ];
  const retrievedPath = "0.a.b.0.c.d.0.e.f.0.g.h.tag";
  t.same(get(source, "tag"), [{ val: "html", path: retrievedPath }], "06.01");

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.equal(objectPath.get(source, retrievedPath), "html", "06.02");
  t.end();
});

tap.test("07 - query returns an array", (t) => {
  t.same(
    get(
      [
        {
          tag: ["z"],
        },
      ],
      "tag"
    ),
    [{ val: ["z"], path: "0.tag" }],
    "07"
  );
  t.end();
});

tap.test("08 - query returns a string", (t) => {
  t.same(
    get(
      [
        {
          tag: "z",
        },
      ],
      "tag"
    ),
    [{ val: "z", path: "0.tag" }],
    "08"
  );
  t.end();
});

tap.test("09 - query returns array with two objects", (t) => {
  const source = [
    {
      tag: [
        {
          a: "a",
          b: "b",
        },
        {
          c: "c",
          d: "d",
        },
      ],
    },
  ];
  const retrievedValue = [
    {
      a: "a",
      b: "b",
    },
    {
      c: "c",
      d: "d",
    },
  ];
  t.same(
    get(source, "tag"),
    [
      {
        val: retrievedValue,
        path: "0.tag",
      },
    ],
    "09.01"
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.same(objectPath.get(source, "0.tag"), retrievedValue, "09.02");
  t.end();
});

// ==============================
// GET WITH NO RESULTS
// ==============================

tap.test("10 - no results query", (t) => {
  t.same(
    get(
      {
        style: "html",
      },
      "tag"
    ),
    [],
    "10"
  );
  t.end();
});

// ==============================
// SET
// ==============================

tap.test("11 - string replaced", (t) => {
  t.same(
    get(
      {
        tag: "html",
      },
      "tag",
      ["style"]
    ),
    {
      tag: "style",
    },
    "11"
  );
  t.end();
});

tap.test("12 - string within array replaced", (t) => {
  t.same(
    get(
      {
        tag: ["html"],
      },
      "tag",
      [["style"]]
    ),
    {
      tag: ["style"],
    },
    "12"
  );
  t.end();
});

tap.test("13 - value is object and is replaced", (t) => {
  t.same(
    get(
      {
        tag: {
          a: "b",
        },
      },
      "tag",
      [
        {
          c: "d",
        },
      ]
    ),
    {
      tag: {
        c: "d",
      },
    },
    "13"
  );
  t.end();
});

tap.test("14 - two objects replaced", (t) => {
  t.same(
    get(
      [
        {
          tag: {
            a: "b",
          },
        },
        {
          tag: {
            x: "y",
          },
        },
      ],
      "tag",
      [
        {
          c: "d",
        },
        {
          m: "n",
        },
      ]
    ),
    [
      {
        tag: {
          c: "d",
        },
      },
      {
        tag: {
          m: "n",
        },
      },
    ],
    "14"
  );
  t.end();
});

tap.test("15 - simple edit", (t) => {
  t.same(
    get(
      [
        {
          tag: "html1",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: "html2",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
      ],
      "tag",
      ["html3", "html4"]
    ),
    [
      {
        tag: "html3",
        attrs: {
          lang: "en",
        },
        content: ["\n"],
      },
      {
        tag: "html4",
        attrs: {
          lang: "en",
        },
        content: ["\n"],
      },
    ],
    "15"
  );
  t.end();
});

tap.test("16 - replaced to an empty string", (t) => {
  t.same(
    get(
      {
        tag: "html",
      },
      "tag",
      ""
    ),
    {
      tag: "",
    },
    "16 - empty string given as a replacement"
  );
  t.end();
});

tap.test("17 - not enough replacement values given", (t) => {
  t.same(
    get(
      {
        meta: [
          {
            tag: "no1",
          },
          {
            tag: "no2",
          },
          {
            tag: "no3",
          },
        ],
      },
      "tag",
      ["", ""]
    ),
    {
      meta: [
        {
          tag: "",
        },
        {
          tag: "",
        },
        {
          tag: "no3",
        },
      ],
    },
    "17 - still works"
  );
  t.end();
});

// ==============================
// SET WITH NO RESULTS
// ==============================

tap.test("18 - no results replacement", (t) => {
  t.same(
    get(
      {
        style: "html",
      },
      "tag",
      ["meta"]
    ),
    {
      style: "html",
    },
    "18"
  );
  t.end();
});

// ==============================
// EDGE CASES
// ==============================

tap.test("19 - input is plain object, replacement is string", (t) => {
  t.same(
    get(
      {
        style: "html",
      },
      "style",
      "meta"
    ),
    {
      style: "meta",
    },
    "19"
  );
  t.end();
});

// ==============================
// THROWS
// ==============================

tap.test("20 - wrong type of second argument", (t) => {
  // throw pinning:
  const error1 = t.throws(() => {
    get(
      {
        style: "html",
      },
      1,
      ["meta"]
    );
  });
  t.match(error1.message, /THROW_ID_04/g, "20");
  t.end();
});

tap.test(
  "21 - input is plain object, replacement is unrecognised (is a function)",
  (t) => {
    function f() {
      return "zzz";
    }
    t.doesNotThrow(() => {
      get(
        {
          style: "html",
        },
        "style",
        f
      );
    }, "21");
    t.end();
  }
);

tap.test(
  "22 - one of the whatToFind array values is a sneaky non-string",
  (t) => {
    t.throws(() => {
      get(
        {
          style: "html",
        },
        ["style", 1],
        ["meta"]
      );
    }, /THROW_ID_03/g);
    t.end();
  }
);

tap.test(
  "23 - one of the replacement array values is a sneaky non-string",
  (t) => {
    t.doesNotThrow(() => {
      get(
        {
          style: "html",
        },
        "style",
        ["meta", 1]
      );
    }, "23");
    t.end();
  }
);

tap.test("24 - input present but non-container sort", (t) => {
  t.same(get(1, "style", "meta"), 1, "24");
  t.end();
});

tap.test("25 - input completely missing", (t) => {
  t.throws(() => {
    get();
  }, /THROW_ID_01/g);

  t.throws(() => {
    get(null);
  }, /THROW_ID_01/g);

  t.throws(() => {
    get(undefined);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("26 - second argument is completely missing", (t) => {
  t.throws(() => {
    get({
      style: "meta",
    });
  }, /THROW_ID_02/g);

  t.throws(() => {
    get(
      {
        style: "meta",
      },
      undefined,
      ["a"]
    );
  }, /THROW_ID_02/g);

  t.throws(() => {
    get(
      {
        style: "meta",
      },
      null,
      ["a"]
    );
  }, /THROW_ID_02/g);
  t.end();
});
