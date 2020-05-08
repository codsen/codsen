import tap from "tap";
import {
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------
// all throws
// -----------------------------------------------------------------------------

tap.test("01 - find - throws when there's no input", (t) => {
  t.throws(() => {
    find();
  }, /THROW_ID_02/g);
  t.throws(() => {
    find(null, {});
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("02 - get -  throws when there's no input", (t) => {
  t.throws(() => {
    get();
  }, /THROW_ID_06/g);
  t.throws(() => {
    get(null, {});
  }, /THROW_ID_06/g);
  t.end();
});

tap.test("03 - set -  throws when there's no input", (t) => {
  t.throws(() => {
    set();
  }, /THROW_ID_12/g);
  t.throws(() => {
    set(null, {});
  }, /THROW_ID_12/g);
  t.end();
});

tap.test("04 - drop - throws when there's no input", (t) => {
  t.throws(() => {
    drop();
  }, /THROW_ID_19/g);
  t.throws(() => {
    drop(null, {});
  }, /THROW_ID_19/g);
  t.end();
});

tap.test("05 - get/set - throws when opts.index is missing", (t) => {
  t.throws(() => {
    get(defaultInput);
  }, /THROW_ID_07/g);
  t.throws(() => {
    get(defaultInput, { a: "a" });
  }, /THROW_ID_08/g);
  t.throws(() => {
    set(defaultInput);
  }, /THROW_ID_13/g);
  t.throws(() => {
    set(defaultInput, { a: "a" });
  }, /THROW_ID_14/g);
  t.end();
});

tap.test(
  "06 - get/set/drop - throws when opts.index is not a natural number (both string or number)",
  (t) => {
    t.throws(() => {
      get(defaultInput, { index: "1.5" });
    }, /THROW_ID_11/g);
    t.throws(() => {
      get(defaultInput, { index: 1.5 });
    }, /THROW_ID_11/g);
    t.throws(() => {
      set(defaultInput, { index: "1.5", val: "zzz" });
    }, /THROW_ID_17/g);
    t.throws(() => {
      set(defaultInput, { index: 1.5, val: "zzz" });
    }, /THROW_ID_17/g);
    t.throws(() => {
      drop(defaultInput, { index: "1.5" });
    }, /THROW_ID_23/g);
    t.throws(() => {
      drop(defaultInput, { index: 1.5 });
    }, /THROW_ID_23/g);
    t.end();
  }
);

tap.test("07 - set - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    set(defaultInput, { index: "3" });
  }, /THROW_ID_14/g);
  t.end();
});

tap.test("08 - find - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    find(defaultInput, { index: "3" });
  }, /THROW_ID_03/g);
  t.throws(() => {
    find(defaultInput, { index: 3 });
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("09 - del - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    del(defaultInput, { index: "3" });
  }, /THROW_ID_28/g);
  t.throws(() => {
    del(defaultInput, { index: 3 });
  }, /THROW_ID_28/g);
  t.end();
});

tap.test("10 - drop - throws when there's no index", (t) => {
  t.throws(() => {
    drop(["a"], "a");
  }, /THROW_ID_20/g);
  t.throws(() => {
    drop({ a: "a" }, { b: "b" });
  }, /THROW_ID_21/g);
  t.end();
});

// -----------------------------------------------------------------------------
// find
// -----------------------------------------------------------------------------

tap.test("11.pt1 - finds by key in a simple object #1", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const intended = [
    {
      index: 1,
      key: "a",
      val: {
        b: "c",
      },
      path: [1],
    },
  ];
  t.same(find(input, { key: "a", val: undefined }), intended, "11.01");

  // absence of the second arg:
  t.same(find(input, { key: "a" }), intended, "11.02");

  // null would mean actual null being there (which is not), so it's not going to find any:
  t.same(
    find(input, { key: "a", val: null }),
    null, // <---- !!!! null means no findings !!!!
    "11.03"
  );
  t.end();
});

tap.test("12.pt2 - finds by key in a simple object, with glob", (t) => {
  const input = {
    a1: {
      b1: "c1",
    },
    a2: {
      b2: "c2",
    },
    z1: {
      x1: "y1",
    },
  };
  const intended = [
    {
      index: 1,
      key: "a1",
      val: {
        b1: "c1",
      },
      path: [1],
    },
    {
      index: 3,
      key: "a2",
      val: {
        b2: "c2",
      },
      path: [3],
    },
  ];
  t.same(find(input, { key: "a*", val: undefined }), intended, "12.01");

  // absence of the second arg:
  t.same(find(input, { key: "a*" }), intended, "12.02");

  // null would mean actual null being there (which is not), so it's not going to find any:
  t.same(
    find(input, { key: "a*", val: null }),
    null, // <---- !!!! null means no findings !!!!
    "12.03"
  );
  t.end();
});

tap.test("13.pt1 - finds by key in a simple object #2", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const intended = [
    {
      index: 2,
      key: "b",
      val: "c",
      path: [1, 2],
    },
  ];
  // second arg hardcoded null - won't find any because input has no null's:
  t.same(find(input, { key: "b", val: null }), null, "13.01");

  // absence of the second arg:
  t.same(find(input, { key: "b" }), intended, "13.02");

  // second arg hardcoded undefined:
  t.same(find(input, { key: "b", val: undefined }), intended, "13.03");
  t.end();
});

tap.test("14.pt2 - finds by key in a simple object, with glob", (t) => {
  const input = {
    a: {
      b1: "c1",
      b2: "c2",
      z: "y",
    },
  };
  const intended = [
    {
      index: 2,
      key: "b1",
      val: "c1",
      path: [1, 2],
    },
    {
      index: 3,
      key: "b2",
      val: "c2",
      path: [1, 3],
    },
  ];
  // second arg hardcoded null - won't find any because input has no null's:
  t.same(find(input, { key: "b*", val: null }), null, "14.01");

  // absence of the second arg:
  t.same(find(input, { key: "b*" }), intended, "14.02");

  // second arg hardcoded undefined:
  t.same(find(input, { key: "b*", val: undefined }), intended, "14.03");
  t.end();
});

tap.test("15.pt1 - does not find by key in a simple object", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = "z";
  const actual = find(input, { key });
  const intended = null;

  t.same(actual, intended, "15");
  t.end();
});

tap.test("16.pt2 - does not find by key in a simple object, with glob", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = "z*";
  const actual = find(input, { key });
  const intended = null;

  t.same(actual, intended, "16");
  t.end();
});

tap.test("17.pt1 - finds by key in simple arrays #1", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "a";
  const actual = find(input, { key });
  const intended = [
    {
      index: 1,
      key: "a",
      val: undefined,
      path: [1],
    },
  ];
  t.same(actual, intended, "17");
  t.end();
});

tap.test("18.pt2 - finds by key in simple arrays, with glob", (t) => {
  const input = ["a", "azzz", [["b"], "c"]];
  const key = "a*";
  const actual = find(input, { key });
  const intended = [
    {
      index: 1,
      key: "a",
      val: undefined,
      path: [1],
    },
    {
      index: 2,
      key: "azzz",
      val: undefined,
      path: [2],
    },
  ];
  t.same(actual, intended, "18");
  t.end();
});

tap.test("19.pt1 - finds by key in simple arrays #2", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "b";
  const actual = find(input, { key });
  const intended = [
    {
      index: 4,
      key: "b",
      val: undefined,
      path: [2, 3, 4],
    },
  ];
  t.same(actual, intended, "19");
  t.end();
});

tap.test("20.pt2 - finds by key in simple arrays, with globs", (t) => {
  const input = ["a", [["zzz", "b", "bbb"], "c"]];
  const key = "b*";
  const actual = find(input, { key });
  const intended = [
    {
      index: 5,
      key: "b",
      val: undefined,
      path: [2, 3, 5],
    },
    {
      index: 6,
      key: "bbb",
      val: undefined,
      path: [2, 3, 6],
    },
  ];
  t.same(actual, intended, "20");
  t.end();
});

tap.test("21.pt1 - finds by key in simple arrays #3", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "c";
  const actual = find(input, { key, val: undefined });
  const intended = [
    {
      index: 5,
      key: "c",
      val: undefined,
      path: [2, 5],
    },
  ];
  t.same(actual, intended, "21");
  t.end();
});

tap.test("22.pt2 - finds by key in simple arrays, with glob", (t) => {
  const input = ["apples", [["hackles"], "crackles"]];
  const key = "*ackles";
  const actual = find(input, { key, val: undefined });
  const intended = [
    {
      index: 4,
      key: "hackles",
      val: undefined,
      path: [2, 3, 4],
    },
    {
      index: 5,
      key: "crackles",
      val: undefined,
      path: [2, 5],
    },
  ];
  t.same(actual, intended, "22");
  t.end();
});

tap.test("23.pt1 - does not find by key in simple arrays", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "d";
  const actual = find(input, { key });
  const intended = null;
  t.same(actual, intended, "23");
  t.end();
});

tap.test("24.pt2 - does not find by key in simple arrays, with globs", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "lexicographer*";
  const actual = find(input, { key });
  const intended = null;
  t.same(actual, intended, "24");
  t.end();
});

tap.test("25 - finds by key in simple arrays #3", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "c";
  const actual = find(input, { key });
  const intended = [
    {
      index: 5,
      key: "c",
      val: undefined,
      path: [2, 5],
    },
  ];
  t.same(actual, intended, "25");
  t.end();
});

tap.test("26 - finds by value in a simple object - string", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = null;
  const val = "c";
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: "c",
      path: [1, 2],
    },
  ];
  t.same(actual, intended, "26");
  t.end();
});

tap.test("27.pt1 - finds by value in a simple object - object", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = null;
  const val = { b: "c" };
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 1,
      key: "a",
      val: { b: "c" },
      path: [1],
    },
  ];
  t.same(actual, intended, "27");
  t.end();
});

tap.test(
  "28.pt2 - finds by value in a simple object - object, with globs",
  (t) => {
    const input = {
      a: {
        b: "c1",
      },
      k: {
        b: "c2",
      },
      z: {
        x: "y",
      },
    };
    const key = null;
    const val = { b: "c*" };
    const actual = find(input, { key, val });
    const intended = [
      {
        index: 1,
        key: "a",
        val: { b: "c1" },
        path: [1],
      },
      {
        index: 3,
        key: "k",
        val: { b: "c2" },
        path: [3],
      },
    ];
    t.same(actual, intended, "28");
    t.end();
  }
);

tap.test("29 - finds by value in a simple object - array", (t) => {
  const input = {
    a: {
      b: ["c"],
    },
  };
  const key = null;
  const val = ["c"];
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: ["c"],
      path: [1, 2],
    },
  ];
  t.same(actual, intended, "29");
  t.end();
});

tap.test("30 - finds by value in a simple object - empty array", (t) => {
  const input = {
    a: {
      b: [],
      c: [],
    },
  };
  const key = null;
  const val = [];
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: [],
      path: [1, 2],
    },
    {
      index: 3,
      key: "c",
      val: [],
      path: [1, 3],
    },
  ];
  t.same(actual, intended, "30");
  t.end();
});

tap.test("31 - finds by value in a simple object - empty object", (t) => {
  const input = {
    a: {
      b: {},
      c: {},
    },
  };
  const key = null;
  const val = {};
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: {},
      path: [1, 2],
    },
    {
      index: 3,
      key: "c",
      val: {},
      path: [1, 3],
    },
  ];
  t.same(actual, intended, "31");
  t.end();
});

tap.test(
  "32 - finds multiple nested keys by key and value in mixed #1",
  (t) => {
    const input = {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: "e" },
    };
    const key = "c";
    const val = { d: "e" };
    const actual = find(input, { key, val });
    const intended = [
      {
        index: 4,
        key: "c",
        val: {
          d: "e",
        },
        path: [1, 2, 3, 4],
      },
      {
        index: 6,
        key: "c",
        val: {
          d: "e",
        },
        path: [6],
      },
    ];
    t.same(actual, intended, "32");
    t.end();
  }
);

tap.test(
  "33 - finds multiple nested keys by key and value in mixed #2",
  (t) => {
    const input = {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: ["d"] },
    };
    // ---------------------------
    t.same(
      find(input, { key: "d", val: null }),
      null,
      "33.01 - Null is a valid value! It's not found in the input!"
    );
    // ---------------------------
    t.same(
      find(input, { key: "d", val: undefined }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "33.02 - hardcoded undefined as a value"
    );
    // ---------------------------
    t.same(
      find(input, { key: "d" }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "33.03 - default behaviour, val is not hardcoded - should be the same as null"
    );
    // ---------------------------
    // arrays only:
    t.same(
      find(input, { key: "d", only: "arrays" }),
      [
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "33.04 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // objects only:
    t.same(
      find(input, { key: "d", only: "objects" }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
      ],
      "33.05 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // any:
    t.same(
      find(input, { key: "d", only: "whatever" }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "33.06 - finds only array instances and omits object-ones"
    );
    t.end();
  }
);

tap.test(
  "34 - like 02.15, but with sneaky objects where values are null, tricking the algorithm",
  (t) => {
    const input = {
      a: { b: [{ c: { d: null } }] },
      c: { d: ["d"] },
    };
    // ---------------------------
    t.same(
      find(input, { key: "d", val: undefined }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "34.01 - default behaviour, val is hardcoded `undefined`"
    );
    // ---------------------------
    t.same(
      find(input, { key: "d" }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "34.02 - default behaviour, val is not hardcoded - should be the same as null"
    );
    // ---------------------------
    // arrays only:
    t.same(
      find(input, { key: "d", only: "arrays" }),
      [
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "34.03 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // objects only:
    t.same(
      find(input, { key: "d", only: "objects" }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
      ],
      "34.04 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // any:
    t.same(
      find(input, { key: "d", only: "whatever" }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "34.05 - finds only array instances and omits object-ones"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// get
// -----------------------------------------------------------------------------

tap.test("35 - gets from a simple object #1", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const index = 1;
  const actual = get(input, { index });
  const intended = {
    a: { b: "c" },
  };
  t.same(actual, intended, "35");
  t.end();
});

tap.test("36 - gets from a simple object #2", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const index = 2;
  const actual = get(input, { index });
  const intended = {
    b: "c",
  };
  t.same(actual, intended, "36");
  t.end();
});

tap.test("37 - gets from a simple object #3", (t) => {
  const input = {
    a: {
      b: ["c"],
    },
  };
  const index = 3;
  const actual = get(input, { index });
  const intended = "c";
  t.same(actual, intended, "37");
  t.end();
});

tap.test("38 - does not get", (t) => {
  const input = {
    a: {
      b: ["c"],
    },
  };
  const index = 4;
  const actual = get(input, { index });
  const intended = null;
  t.same(actual, intended, "38");
  t.end();
});

tap.test("39 - gets from a simple array", (t) => {
  const input = ["a", [["b"], "c"]];
  const index = 4;
  const actual = get(input, { index });
  const intended = "b";
  t.same(actual, intended, "39");
  t.end();
});

tap.test("40 - gets from mixed nested things, index string", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "7";
  const actual = get(input, { index });
  const intended = {
    g: ["h"],
  };

  t.same(actual, intended, "40");
  t.end();
});

tap.test("41 - gets from a simple object, index is string", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const index = "2";
  const actual = get(input, { index });
  const intended = {
    b: "c",
  };
  t.same(actual, intended, "41");
  t.end();
});

tap.test("42 - index is real number as string - throws", (t) => {
  t.throws(() => {
    get(
      {
        a: {
          b: "c",
        },
      },
      {
        index: "2.1",
      }
    );
  }, /THROW_ID_11/g);
  t.end();
});

// -----------------------------------------------------------------------------
// set
// -----------------------------------------------------------------------------

tap.test("43 - sets in mixed nested things #1", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "7";
  const val = "zzz";
  const actual = set(input, { index, val });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: "zzz" },
  };

  t.same(actual, intended, "43");
  t.end();
});

tap.test("44 - sets in mixed nested things #2", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "8";
  const val = "zzz";
  const actual = set(input, { index, val });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  t.same(actual, intended, "44");
  t.end();
});

tap.test("45 - does not set", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "99";
  const val = "zzz";
  const actual = set(input, { index, val });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  t.same(actual, intended, "45");
  t.end();
});

tap.test("46 - sets when only key given instead, index as string", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "8";
  const key = "zzz";
  const actual = set(input, { index, key });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  t.same(actual, intended, "46");
  t.end();
});

tap.test("47 - sets when only key given, numeric index", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = 8;
  const key = "zzz";
  const actual = set(input, { index, key });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["zzz"] },
  };

  t.same(actual, intended, "47");
  t.end();
});

tap.test("48 - throws when inputs are wrong", (t) => {
  t.throws(() => {
    set(
      { a: "a", b: ["c"] },
      {
        index: "1",
      }
    );
  }, /THROW_ID_14/g);
  t.throws(() => {
    set(
      { a: "a" },
      {
        val: "a",
      }
    );
  }, /THROW_ID_15/g);
  t.throws(() => {
    set(
      { a: "a" },
      {
        val: "a",
        index: "a",
      }
    );
  }, /THROW_ID_17/g);
  t.throws(() => {
    set(
      { a: "a", b: ["c"] },
      {
        val: "a",
        index: 1.5,
      }
    );
  }, /THROW_ID_17/g);
  t.end();
});

// -----------------------------------------------------------------------------
// drop
// -----------------------------------------------------------------------------

tap.test("49 - drops in mixed things #1 - index string", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "8";
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: [] },
  };

  t.same(actual, intended, "49");
  t.end();
});

tap.test("50 - drops in mixed things #2 - index number", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = 7;
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: {},
  };

  t.same(actual, intended, "50");
  t.end();
});

tap.test("51 - does not drop - zero", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "0";
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  t.same(actual, intended, "51");
  t.end();
});

tap.test("52 - does not drop - 99", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };
  const index = "99";
  const actual = drop(input, { index });
  const intended = {
    a: { b: [{ c: { d: "e" } }] },
    f: { g: ["h"] },
  };

  t.same(actual, intended, "52");
  t.end();
});

tap.test(
  "53 - drops in mixed things #3 - index is not a natural number",
  (t) => {
    const input = {
      a: { b: [{ c: { d: "e" } }] },
      f: { g: ["h"] },
    };
    const index = "6.1";
    t.throws(() => {
      drop(input, { index });
    }, /THROW_ID_23/g);
    t.end();
  }
);

// -----------------------------------------------------------------------------
// del
// -----------------------------------------------------------------------------

tap.test("54 - deletes by key, multiple findings", (t) => {
  const input = {
    a: { b: [{ c: { d: "e" } }] },
    c: { d: ["h"] },
  };
  t.same(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "54.01"
  );
  t.same(
    del(input, { key: "c", only: "array" }),
    {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: ["h"] },
    },
    "54.02 - only array"
  );
  t.same(
    del(input, { key: "c", only: "o" }),
    {
      a: { b: [{}] },
    },
    "54.03"
  );
  t.same(
    del(input, { key: "c", only: "whatever" }),
    {
      a: { b: [{}] },
    },
    "54.04"
  );
  t.end();
});

tap.test("55 - deletes by key, multiple findings at the same branch", (t) => {
  const input = {
    a: { b: [{ c: { c: "e" } }] },
    c: { d: ["h"] },
  };
  t.same(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "55"
  );
  t.end();
});

tap.test("56 - can't find any to delete by key", (t) => {
  const input = {
    a: { b: [{ c: { c: "e" } }] },
    c: { d: ["h"] },
  };
  t.same(
    del(input, { key: "zzz" }),
    {
      a: { b: [{ c: { c: "e" } }] },
      c: { d: ["h"] },
    },
    "56"
  );
  t.end();
});

tap.test("57 - deletes by value only from mixed", (t) => {
  const input = {
    a: { b: [{ ktjyklrjtyjlkl: { c: "e" } }] },
    dflshgdlfgh: { c: "e" },
  };
  t.same(
    del(input, { val: { c: "e" } }),
    {
      a: { b: [{}] },
    },
    "57"
  );
  t.end();
});

tap.test("58 - deletes by value only from arrays", (t) => {
  const input = ["a", "b", "c", ["a", ["b"], "c"]];
  t.same(del(input, { key: "b" }), ["a", "c", ["a", [], "c"]], "58");
  t.end();
});

tap.test("59 - deletes by key and value from mixed", (t) => {
  const input = {
    a: { b: [{ c: { d: { e: "f" } } }] },
    f: { d: { zzz: "f" } },
  };
  t.same(
    del(input, { key: "d", val: { e: "f" } }),
    {
      a: { b: [{ c: {} }] },
      f: { d: { zzz: "f" } },
    },
    "59"
  );
  t.end();
});

tap.test("60 - does not delete by key and value from arrays", (t) => {
  const input = ["a", "b", "c", ["a", ["b"], "c"]];
  t.same(
    del(input, { key: "b", val: "zzz" }),
    ["a", "b", "c", ["a", ["b"], "c"]],
    "60"
  );
  t.end();
});

tap.test("61 - deletes by key and value from mixed", (t) => {
  const input = {
    a: {
      b: "",
      c: "d",
      e: "f",
    },
  };
  t.same(
    del(input, { key: "b", val: "" }),
    {
      a: {
        c: "d",
        e: "f",
      },
    },
    "61"
  );
  t.end();
});

tap.test("62 - sneaky-one: object keys have values as null", (t) => {
  const input = {
    a: { b: [{ c: null }] },
    c: null,
  };
  t.same(
    del(input, { key: "c" }),
    {
      a: { b: [{}] },
    },
    "62.01"
  );
  t.same(del(input, { key: "c", only: "array" }), input, "62.02 - only array");
  t.same(
    del(input, { key: "c", only: "object" }),
    {
      a: { b: [{}] },
    },
    "62.03"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// arrayFirstOnly
// -----------------------------------------------------------------------------

tap.test("63 - arrayFirstOnly - nested arrays", (t) => {
  const input = {
    a: { b: ["c", "d", "e"] },
    f: ["g", "h"],
  };

  const actual = arrayFirstOnly(input);
  const intended = {
    a: { b: ["c"] },
    f: ["g"],
  };

  t.same(actual, intended, "63");
  t.end();
});

tap.test("64 - arrayFirstOnly - arrays within arrays only, no obj", (t) => {
  const input = [
    ["a", "b", "c"],
    ["d", ["e"]],
  ];
  const actual = arrayFirstOnly(input);
  const intended = [["a"]];

  t.same(actual, intended, "64.01");

  // proof that the input was not mutated:
  t.same(
    input,
    [
      ["a", "b", "c"],
      ["d", ["e"]],
    ],
    "64.02"
  );
  t.end();
});

tap.test("65 - arrayFirstOnly - nested arrays #2", (t) => {
  const input = [
    {
      a: "a",
    },
    {
      b: "b",
    },
  ];
  const actual = arrayFirstOnly(input);
  const intended = [
    {
      a: "a",
    },
  ];

  t.same(actual, intended, "65");
  t.end();
});

tap.test("66 - arrayFirstOnly leaves objects alone", (t) => {
  const input = {
    a: "a",
    b: {
      c: "c",
    },
  };
  const actual = arrayFirstOnly(input);
  const intended = {
    a: "a",
    b: {
      c: "c",
    },
  };

  t.same(actual, intended, "66");
  t.end();
});

tap.test("67 - arrayFirstOnly leaves strings alone", (t) => {
  const input = "zzz";
  const actual = arrayFirstOnly(input);
  const intended = "zzz";

  t.same(actual, intended, "67");
  t.end();
});
