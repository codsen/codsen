const t = require("tap");
const compare = require("../dist/ast-compare.cjs");
const f = () => "zzz";

// (input, objToDelete, strictOrNot)

// ===========
// Precautions
// ===========

t.test("01.01 - both inputs missing", (t) => {
  t.throws(() => {
    compare();
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

t.test("01.02 - second input missing", (t) => {
  t.throws(() => {
    compare({ a: "a" });
  }, /THROW_ID_02/g);
  t.throws(() => {
    compare({ a: "a" }, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_02/g);
  t.end();
});

t.test("01.03 - first input missing", (t) => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

t.test("01.04 - null as input", (t) => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

t.test("01.05 - falsey inputs", (t) => {
  t.throws(() => {
    compare(null, undefined);
  }, /THROW_ID_02/g);
  t.throws(() => {
    compare(null, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_02/g);
  t.end();
});

// =============
// Obj - Simples
// =============

t.test("02.01 - plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }), true);
  t.end();
});

t.test("02.02 - plain objects", (t) => {
  t.same(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }), false);
  t.end();
});

t.test("02.03 - plain objects", (t) => {
  t.not(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", c: "3" },
      { verboseWhenMismatches: true }
    ),
    true
  );
  t.end();
});

t.test("02.04 - plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true }
    ),
    false
  );
  t.end();
});

t.test("02.05 - plain objects", (t) => {
  t.not(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    true
  );
  t.end();
});

t.test("02.06 - plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2" }, { matchStrictly: true }),
    true
  );
  t.end();
});

t.test("02.07 - plain objects", (t) => {
  // matchStrictly trumps hungryForWhitespace if key count does not match
  t.same(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false
  );
  t.end();
});

t.test("02.08 - plain objects", (t) => {
  // matchStrictly trumps hungryForWhitespace if key count does not match
  t.not(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      {
        matchStrictly: true,
        hungryForWhitespace: true,
        verboseWhenMismatches: true,
      }
    )
  );
  t.end();
});

t.test("02.09 - plain objects - two whitespaces", (t) => {
  // keys match exactly, different white space matched
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true
  );
  t.end();
});

t.test("02.10 - plain objects - whitespace vs empty str", (t) => {
  // keys match exactly, white space matches to empty string
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true
  );
  t.end();
});

t.test("02.11 - plain objects - empty str vs whitespace", (t) => {
  // keys match exactly, empty string matches to white space
  t.same(
    compare(
      { a: "1", b: "" },
      { a: "1", b: "\t\t\t \n\n\n" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true
  );
  t.end();
});

t.test("02.12 - plain objects", (t) => {
  // keys match exactly, string does not match to empty string
  t.same(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false
  );
  t.end();
});

t.test("02.13 - plain objects", (t) => {
  // keys match exactly, string does not match to empty string
  t.not(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      {
        matchStrictly: true,
        hungryForWhitespace: true,
        verboseWhenMismatches: true,
      }
    ),
    true
  );
  t.end();
});

t.test("02.14 - plain objects", (t) => {
  // keys match exactly, different white space matched
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: false }
    ),
    false
  );
  t.end();
});

t.test("02.15 - plain objects", (t) => {
  // keys match exactly, different white space matched
  t.not(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      {
        matchStrictly: true,
        hungryForWhitespace: false,
        verboseWhenMismatches: true,
      }
    ),
    true
  );
  t.end();
});

t.test("02.16 - comparison of empty plain objects", (t) => {
  t.same(compare({}, { a: "1", b: "2" }), false, "02.02.01");
  t.end();
});

t.test("02.17 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, { a: "1", b: "2" }, { hungryForWhitespace: true }),
    false,
    "02.02.02"
  );
  t.end();
});

t.test("02.18 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, { a: "1", b: "2" }, { matchStrictly: true }),
    false,
    "02.02.03"
  );
  t.end();
});

t.test("02.19 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, {}), false, "02.02.04");
  t.end();
});

t.test("02.20 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, {}, { hungryForWhitespace: true }),
    false,
    "02.02.05"
  );
  t.end();
});

t.test("02.21 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, {}, { matchStrictly: true }),
    false,
    "02.02.06"
  );
  t.end();
});

t.test("02.22 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "02.02.07"
  );
  t.end();
});

t.test("02.23 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "\n\n\n" }), false);
  t.end();
});

t.test("02.24 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false
  );
  t.end();
});

t.test("02.25 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    false
  );
  t.end();
});

t.test("02.26 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false
  );
  t.end();
});

t.test("02.27 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false
  );
  t.end();
});

t.test("02.28 - comparing two empty plain objects", (t) => {
  t.same(compare({}, {}), true);
  t.end();
});

t.test("02.29 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: false }),
    true
  );
  t.end();
});

t.test("02.30 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: true }),
    true
  );
  t.end();
});

t.test("02.31 - catching row 199 for 100% coverage", (t) => {
  t.same(
    compare(
      { a: { b: [] } },
      { a: { b: {} } },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true
  );
  t.end();
});

t.test("02.32 - sneaky similarity", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false
  );
  t.end();
});

t.test("02.33 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }), false);
  t.end();
});

t.test("02.34 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false
  );
  t.end();
});

t.test("02.35 - big object has one element extra", (t) => {
  t.same(compare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }), true);
  t.end();
});

t.test("02.37 - small object has one element extra", (t) => {
  t.same(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }), false);
  t.end();
});

t.test(
  "02.38 - object values are arrays, one has a string, another has none",
  (t) => {
    t.same(
      compare(
        {
          key: ["a"],
        },
        {
          key: [],
        }
      ),
      false
    );
    t.end();
  }
);

t.test("02.39 - comparison of empty plain objects", (t) => {
  // relying on default
  t.not(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      {
        verboseWhenMismatches: true,
      }
    )
  );
  t.end();
});

t.test("02.40 - comparison of empty plain objects", (t) => {
  // same, default hardcoded
  t.same(
    compare(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false
  );
  t.end();
});

t.test(
  "02.41 - comparison of empty plain objects - hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        {
          key: ["a"],
        },
        {
          key: [],
        },
        { hungryForWhitespace: true, matchStrictly: false }
      ),
      true
    );
    t.end();
  }
);

t.test(
  "02.42 - comparison of empty plain objects - same, default hardcoded",
  (t) => {
    t.same(
      compare(
        {
          key: ["a"],
        },
        {
          key: [],
        },
        { hungryForWhitespace: false, matchStrictly: true }
      ),
      false
    );
    t.end();
  }
);

t.test(
  "02.43 - comparison of empty plain objects - matchStrictly trump hungryForWhitespace",
  (t) => {
    // matchStrictly trump hungryForWhitespace - element count is uneven hence a falsey result
    t.same(
      compare(
        {
          key: ["a"],
        },
        {
          key: [],
        },
        { hungryForWhitespace: true, matchStrictly: true }
      ),
      false
    );
    t.end();
  }
);

t.test("02.44 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false
  );
  t.end();
});

t.test("02.45 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false
  );
  t.end();
});

t.test("02.46 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true
  );
  t.end();
});

t.test("02.47 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true
  );
  t.end();
});

t.test("02.48 - Boolean and numeric values", (t) => {
  // control - booleans and numbers as obj values
  t.same(compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }), true);
  t.end();
});

t.test("02.49 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, f);
  }, /THROW_ID_04/g);
  t.end();
});

t.test("02.50 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare(f, { a: false, b: 2, c: "3" });
  }, /THROW_ID_03/g);
  t.end();
});

t.test("02.51 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }, f);
  }, /THROW_ID_05/g);
  t.end();
});

t.test("02.52 - s is zero length, b is empty - defaults", (t) => {
  t.same(compare({ a: "\n\n\n   \t\t\t", b: "2" }, { a: "", b: "2" }), false);
  t.end();
});

t.test(
  "02.53 - s is zero length, b is empty - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        { a: "\n\n\n   \t\t\t", b: "2" },
        { a: "", b: "2" },
        { hungryForWhitespace: true }
      ),
      true
    );
    t.end();
  }
);

t.test(
  "02.54 - s is zero length, b is empty - opts.hungryForWhitespace",
  (t) => {
    // no keys array vs array with all empty vales
    t.same(compare([{ a: "\n\n\n" }], {}, { hungryForWhitespace: true }), true);
    t.end();
  }
);

// 03. matching empty arrays
// -----------------------------------------------------------------------------

t.test("03.01 - matching empty arrays - blank vs. normal - defaults", (t) => {
  t.same(compare({ a: "1", b: "2", c: 3 }, {}), false);
  t.end();
});

t.test("03.02 - matching empty arrays - blank vs. empty - defaults", (t) => {
  t.same(compare({ a: "\n\n", b: "\t", c: "   " }, {}), false);
  t.end();
});

t.test(
  "03.03 - matching empty arrays - blank vs. normal - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare({ a: "1", b: "2", c: 3 }, {}, { hungryForWhitespace: true }),
      false
    );
    t.end();
  }
);

t.test(
  "03.04 - matching empty arrays - blank vs. empty - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        { a: "\n\n", b: "\t", c: "   " },
        {},
        { hungryForWhitespace: true }
      ),
      true
    );
    t.end();
  }
);

t.test(
  "03.05 - matching empty arrays - blank vs. normal - opts.matchStrictly",
  (t) => {
    t.same(
      compare({ a: "1", b: "2", c: 3 }, {}, { matchStrictly: true }),
      false
    );
    t.end();
  }
);

t.test(
  "03.06 - matching empty arrays - blank vs. empty - opts.matchStrictly",
  (t) => {
    t.same(
      compare({ a: "\n\n", b: "\t", c: "   " }, {}, { matchStrictly: true }),
      false,
      "03.12.06"
    );
    t.end();
  }
);

t.test("03.07 - matching empty arrays - blank vs. normal - both opts", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: 3 },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false
  );
  t.end();
});

t.test("03.08 - matching empty arrays - blank vs. empty - both opts", (t) => {
  t.same(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true
  );
  t.end();
});

// =============
// Arr - simples
// =============

t.test("04.01 - simple arrays with strings", (t) => {
  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "04.01.01"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "04.01.02"
  );

  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "04.01.03"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "04.01.04"
  );
  t.not(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
      verboseWhenMismatches: true,
    }),
    true,
    "04.01.05"
  );

  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "04.01.06"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "04.01.07"
  );

  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "04.01.08"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "04.01.09"
  );
  t.not(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
      verboseWhenMismatches: true,
    }),
    true,
    "04.01.10"
  );
  t.end();
});

t.test("04.02 - simple arrays with plain objects", (t) => {
  t.same(
    compare([{ a: "1" }, { b: "2" }, { c: "3" }], [{ a: "1" }, { b: "2" }]),
    true,
    "04.02.01"
  );
  t.same(
    compare([{ a: "1" }, { b: "2" }], [{ a: "1" }, { b: "2" }, { c: "3" }]),
    false,
    "04.02.02"
  );
  t.end();
});

t.test("04.03 - arrays, nested with strings and objects", (t) => {
  t.same(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "04.03.01"
  );
  t.same(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "04.03.02"
  );
  t.end();
});

t.test("04.04 - comparing empty arrays (variations)", (t) => {
  t.same(compare([], []), true, "04.04.01");
  t.same(compare([{}], [{}]), true, "04.04.02");
  t.same(compare([{}, {}], [{}]), true, "04.04.03");
  t.same(compare([{}], [{}, {}]), false, "04.04.04");
  t.same(compare([{ a: [] }, {}, []], [{ a: [] }]), true, "04.04.05");
  t.same(compare([], [], { hungryForWhitespace: true }), true, "04.04.06");
  t.same(compare([{}], [{}], { hungryForWhitespace: true }), true, "04.04.07");
  t.same(
    compare([{}, {}], [{}], { hungryForWhitespace: true }),
    true,
    "04.04.08"
  );
  t.same(
    compare([{}], [{}, {}], { hungryForWhitespace: true }),
    true,
    "04.04.09"
  );
  t.same(
    compare([{ a: [] }, {}, []], [{ a: [] }], { hungryForWhitespace: true }),
    true,
    "04.04.10"
  );
  t.end();
});

t.test("04.05 - empty arrays within obj key values", (t) => {
  t.same(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      }
    ),
    false,
    "04.05.01"
  );
  t.same(
    compare(
      {
        a: {
          b: "b",
        },
      },
      {
        a: [],
      }
    ),
    false,
    "04.05.02"
  );
  t.same(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
      { hungryForWhitespace: true }
    ),
    false,
    "04.05.03"
  );
  t.not(
    compare(
      {
        a: [],
      },
      {
        a: {
          b: "b",
        },
      },
      { hungryForWhitespace: true, verboseWhenMismatches: true }
    ),
    true,
    "04.05.04"
  );
  t.same(
    compare(
      {
        a: {
          b: "b",
        },
      },
      {
        a: [],
      },
      { hungryForWhitespace: true }
    ),
    false,
    "04.05.05"
  );
  t.end();
});

t.test("04.06 - empty arrays vs empty objects", (t) => {
  t.same(
    compare(
      {
        a: [],
      },
      {
        a: {},
      }
    ),
    false,
    "04.06.01"
  );
  t.same(
    compare(
      {
        a: {},
      },
      {
        a: [],
      }
    ),
    false,
    "04.06.02"
  );
  t.same(
    compare(
      {
        a: [],
      },
      {
        a: {},
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.03"
  );
  t.same(
    compare(
      {
        a: {},
      },
      {
        a: [],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.04"
  );
  t.same(
    compare(
      {
        a: {
          b: [],
        },
        x: "y",
      },
      {
        a: {
          b: {},
        },
        x: "y",
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.05"
  );
  t.same(
    compare(
      {
        a: {
          b: {},
        },
        x: "y",
      },
      {
        a: {
          b: [],
        },
        x: "y",
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.06"
  );
  t.end();
});

t.test("04.07 - empty arrays vs empty strings", (t) => {
  t.same(
    compare(
      {
        a: [],
      },
      {
        a: "",
      }
    ),
    false,
    "04.07.01"
  );
  t.same(
    compare(
      {
        a: "",
      },
      {
        a: [],
      }
    ),
    false,
    "04.07.02"
  );
  t.same(
    compare(
      {
        a: [],
      },
      {
        a: "",
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.07.03"
  );
  t.same(
    compare(
      {
        a: "",
      },
      {
        a: [],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.07.04"
  );
  t.end();
});

t.test("04.08 - two arrays, matches middle, string within", (t) => {
  t.same(compare(["a", "b", "c", "d", "e"], ["b", "c", "d"]), true, "04.08.01");
  t.same(
    compare(["b", "c", "d"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.01 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["b", "c", "e"]), true, "04.08.02");
  t.same(
    compare(["b", "c", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.02 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["a", "b", "c"]), true, "04.08.03");
  t.same(
    compare(["a", "b", "c"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.03 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["c", "d", "e"]), true, "04.08.04");
  t.same(
    compare(["c", "d", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.04 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["e"]), true, "04.08.05");
  t.same(compare(["e"], ["a", "b", "c", "d", "e"]), false, "04.08.05 opposite");
  t.end();
});

t.test("04.09 - two arrays, matches middle, objects within", (t) => {
  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { d: "d" }]
    ),
    true,
    "04.09.01"
  );
  t.same(
    compare(
      [{ b: "b" }, { c: "c" }, { d: "d" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.01 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { e: "e" }]
    ),
    true,
    "04.09.02"
  );
  t.same(
    compare(
      [{ b: "b" }, { c: "c" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.02 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }]
    ),
    true,
    "04.09.03"
  );
  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.03 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ c: "c" }, { d: "d" }, { e: "e" }]
    ),
    true,
    "04.09.04"
  );
  t.same(
    compare(
      [{ c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.04 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ e: "e" }]
    ),
    true,
    "04.09.05"
  );
  t.same(
    compare(
      [{ e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.05 opposite"
  );

  t.same(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
      ]
    ),
    true,
    "04.09.06"
  );
  t.same(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [
        { c2: "c2", c1: "c1" },
        { d2: "d2", d1: "d1" },
      ]
    ),
    true,
    "04.09.07"
  );
  t.same(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d2: "d2" },
        { e: "e" },
      ],
      [
        { c2: "c2", c1: "c1" },
        { d2: "d2", d1: "d1" },
      ]
    ),
    false,
    "04.09.08"
  );
  t.same(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [{ c1: "c1" }, { d2: "d2" }]
    ),
    true,
    "04.09.09"
  );
  t.same(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" },
      ],
      [{ d2: "d2" }, { c1: "c1" }]
    ),
    false,
    "04.09.10"
  );
  t.end();
});

t.test("04.10 - two arrays, one empty, string within", (t) => {
  t.same(compare(["a", "b", "c"], []), false, "04.10.01");
  t.not(
    compare(["a", "b", "c"], [], { verboseWhenMismatches: true }),
    true,
    "04.10.02"
  );
  t.same(
    compare(["a", "b", "c"], [], { hungryForWhitespace: true }),
    true,
    "04.10.03"
  );
  t.end();
});

// =======
// Strings
// =======

t.test("05.01 - simple strings", (t) => {
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "05.01.01"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "05.01.02"
  );

  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "05.01.03"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "05.01.04"
  );

  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    true,
    "05.01.05"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "05.01.06"
  );

  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "05.01.07"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "05.01.08"
  );
  t.end();
});

t.test("05.02 - strings compared and fails", (t) => {
  t.same(compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "05.02.01");
  t.not(
    compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"], { verboseWhenMismatches: true }),
    true,
    "05.02.02"
  );
  t.end();
});

t.test("05.03 - strings in arrays compared, positive", (t) => {
  t.same(compare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "05.03");
  t.end();
});

t.test(
  "05.04 - string against empty array or empty string within an array",
  (t) => {
    t.same(compare(["aaaaa\nbbbbb"], []), false, "05.04.01");
    t.same(
      compare(["aaaaa\nbbbbb"], [], { hungryForWhitespace: true }),
      true,
      "05.04.02"
    );
    t.same(
      compare(["aaaaa\nbbbbb"], ["\n\n\n"], { hungryForWhitespace: true }),
      true,
      "05.04.03"
    );
    t.same(
      compare(["aaaaa\nbbbbb", "\t\t\t \n\n\n", "   "], ["\n\n\n"], {
        hungryForWhitespace: true,
      }),
      true,
      "05.04.04"
    );
    t.end();
  }
);

t.test("05.05 - string vs empty space", (t) => {
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "05.05.01"
  );
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "05.05.02"
  );
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "05.05.03"
  );
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "05.05.04"
  );
  t.end();
});

t.test("05.06 - empty space vs different empty space", (t) => {
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "05.06.01"
  );
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "05.06.02"
  );
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "05.06.03"
  );
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "05.06.04"
  );
  t.end();
});

t.test("05.07 - two arrays, one empty", (t) => {
  t.same(
    compare(["\t\t\t\t\t\t      \n\n\n    \t\t\t"], []),
    false,
    "05.07.01 - in root, defaults"
  );
  t.same(
    compare(
      { a: ["\t\t\t\t\t\t      \n\n\n    \t\t\t"] },
      { a: [] },
      { hungryForWhitespace: true }
    ),
    true,
    "05.07.02 - in root, defaults"
  );
  t.same(
    compare([], ["\t\t\t\t\t\t      \n\n\n    \t\t\t"], {
      hungryForWhitespace: true,
    }),
    true,
    "05.07.03 - in root, defaults, opposite from #2"
  );
  t.end();
});

t.test("05.08 - opts.matchStrictly", (t) => {
  t.same(
    compare(
      { a: "a" },
      {},
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    false,
    "05.08.01 - key count mismatch"
  );
  t.same(
    typeof compare(
      {},
      { a: "a" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    "string",
    "05.08.01 - key count mismatch"
  );
  t.end();
});

// ======
// Random
// ======

t.test("06.01 - null vs null", (t) => {
  t.same(compare(null, null), true, "06.01.01");
  t.end();
});

t.test("06.02 - real-life #1", (t) => {
  t.same(
    compare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    false,
    "06.02.01"
  );
  t.same(
    compare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: [],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.02.02"
  );
  t.same(
    compare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: ["\n\n\n     \t\t\t   \n\n\n"],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.02.03"
  );
  t.end();
});

t.test("06.03 - real-life #2", (t) => {
  t.same(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    true,
    "06.03.01"
  );
  t.same(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: [],
      },
      {
        hungryForWhitespace: false,
      }
    ),
    true,
    "06.03.02"
  );
  t.end();
});

t.test("06.05 - function as input", (t) => {
  t.throws(() => {
    compare(f, f);
  }, /THROW_ID_03/g);
  t.end();
});

t.test("06.06 - real-life #3", (t) => {
  t.same(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: [],
        },
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "(max-width: 600px)",
              rules: [
                {
                  type: "media",
                  media: "(max-width: 200px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 80,
                            },
                            end: {
                              line: 1,
                              column: 106,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61,
                        },
                        end: {
                          line: 1,
                          column: 108,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30,
                    },
                    end: {
                      line: 1,
                      column: 111,
                    },
                  },
                },
                {
                  type: "media",
                  media: "(max-width: 100px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 163,
                            },
                            end: {
                              line: 1,
                              column: 189,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144,
                        },
                        end: {
                          line: 1,
                          column: 191,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113,
                    },
                    end: {
                      line: 1,
                      column: 194,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 195,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      }
    ),
    false,
    "06.06.01"
  );
  t.same(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "(max-width: 600px)",
              rules: [
                {
                  type: "media",
                  media: "(max-width: 200px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 80,
                            },
                            end: {
                              line: 1,
                              column: 106,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61,
                        },
                        end: {
                          line: 1,
                          column: 108,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30,
                    },
                    end: {
                      line: 1,
                      column: 111,
                    },
                  },
                },
                {
                  type: "media",
                  media: "(max-width: 100px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 163,
                            },
                            end: {
                              line: 1,
                              column: 189,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144,
                        },
                        end: {
                          line: 1,
                          column: 191,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113,
                    },
                    end: {
                      line: 1,
                      column: 194,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 195,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: [],
        },
      },
      { hungryForWhitespace: false }
    ),
    false,
    "06.06.02"
  );
  t.same(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "(max-width: 600px)",
              rules: [
                {
                  type: "media",
                  media: "(max-width: 200px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 80,
                            },
                            end: {
                              line: 1,
                              column: 106,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61,
                        },
                        end: {
                          line: 1,
                          column: 108,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30,
                    },
                    end: {
                      line: 1,
                      column: 111,
                    },
                  },
                },
                {
                  type: "media",
                  media: "(max-width: 100px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 163,
                            },
                            end: {
                              line: 1,
                              column: 189,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144,
                        },
                        end: {
                          line: 1,
                          column: 191,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113,
                    },
                    end: {
                      line: 1,
                      column: 194,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 195,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: [],
        },
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.06.03"
  );
  t.end();
});

t.test("06.07 - real-life #3 reduced case", (t) => {
  t.same(
    compare(
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      }
    ),
    false,
    "06.07.01"
  );
  t.same(
    compare(
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      }
    ),
    false,
    "06.07.02"
  );
  t.same(
    compare(
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.07.03"
  );
  t.same(
    compare(
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.07.04"
  );
  t.end();
});

t.test("06.08 - input args of mismatching type - easy win", (t) => {
  t.same(
    compare(
      {
        a: "a",
      },
      "a"
    ),
    false,
    "06.08.01"
  );
  t.same(
    compare("a", {
      a: "a",
    }),
    false,
    "06.08.02"
  );
  t.same(
    compare(
      {
        a: "a",
      },
      ["a"]
    ),
    false,
    "06.08.03"
  );
  t.same(
    compare(["a"], {
      a: "a",
    }),
    false,
    "06.08.04"
  );
  t.same(
    compare(
      {
        a: "a",
      },
      "a",
      { hungryForWhitespace: true }
    ),
    false,
    "06.08.05"
  );
  t.same(
    compare(
      "a",
      {
        a: "a",
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.08.06"
  );
  t.same(
    compare(
      {
        a: "a",
      },
      ["a"],
      { hungryForWhitespace: true }
    ),
    false,
    "06.08.07"
  );
  t.same(
    compare(
      ["a"],
      {
        a: "a",
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.08.08"
  );
  t.end();
});

// =======================
// Still works overloading
// =======================

t.test("07.01 - fourth argument doesn't break anything", (t) => {
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, true),
    false,
    "07.01.01"
  );
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, false),
    false,
    "07.01.02"
  );
  t.end();
});

// ===============
// Just Loose Mode
// ===============

t.test("08.01 - hungryForWhitespace, empty strings within arrays", (t) => {
  t.same(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    false,
    "08.01.01"
  );
  t.same(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    true,
    "08.01.02"
  );
  t.same(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      }
    ),
    false,
    "08.01.03"
  );
  t.same(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    true,
    "08.01.04"
  );
  t.end();
});

// =================
// Wildcard matching
// =================

t.test("09.01 - wildcards against values within object", (t) => {
  t.same(
    compare({ a: "1", b: "2a", c: "3" }, { a: "1", b: "2*" }),
    false,
    "09.01.01 - default"
  );
  t.same(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: false }
    ),
    false,
    "09.01.02 - hardcoded default"
  );
  t.same(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: true }
    ),
    true,
    "09.01.03 - wildcards enabled"
  );
  t.same(
    compare(
      { a: "1", b: "za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    true,
    "09.01.04 - with letters and wildcards"
  );
  t.same(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    false,
    "09.01.05 - won't match because it's now case-sensitive in wildcards too"
  );
  t.same(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "Z*" },
      { useWildcards: true }
    ),
    true,
    "09.01.06 - won't match because it's now case-sensitive in wildcards too"
  );

  t.same(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: true }
    ),
    false,
    "09.01.07 - weird"
  );
  t.same(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: false }
    ),
    false,
    "09.01.08 - weird, false anyway"
  );
  t.end();
});

t.test("09.02 - wildcards against keys within object", (t) => {
  t.same(
    compare({ az: "1", bz: "2a", cz: "3" }, { "a*": "1", "b*": "2*" }),
    false,
    "09.02.01 - default"
  );
  t.same(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "a*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    true,
    "09.02.02 - wildcards on"
  );
  t.same(
    compare({ az: "1", bz: "2a", cz: "3" }, { "x*": "1", "b*": "2*" }),
    false,
    "09.02.03 - won't find, despite wildcards, which are turned off"
  );
  t.same(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "x*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    false,
    "09.02.04 - won't find, despite wildcards, which are turned on"
  );
  t.end();
});

t.test("09.03 - wildcards in deeper levels", (t) => {
  t.same(
    compare(
      {
        a: [
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: false }
    ),
    false,
    "09.03.01 - default (control), wildcards are turned off"
  );
  t.same(
    compare(
      {
        a: [
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: true }
    ),
    true,
    "09.03.02 - default (control), wildcards are turned off"
  );
  t.end();
});

t.test("09.04 - wildcards in deeper levels within arrays", (t) => {
  t.same(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: false }
    ),
    false,
    "09.04.01"
  );
  t.same(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: true }
    ),
    true,
    "09.04.02"
  );
  t.same(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "ccc",
          },
        ],
      },
      { useWildcards: true }
    ),
    false,
    "09.04.03"
  );
  t.same(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "ccc", // <---- !
          },
        ],
      },
      {
        a: [
          {
            "*": "ccc",
          },
        ],
      },
      { useWildcards: false }
    ),
    false,
    "09.04.04"
  );
  t.same(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "yyy", // <---- !
          },
        ],
      },
      {
        a: [
          {
            "*": "ccc",
          },
        ],
      },
      { useWildcards: true }
    ),
    true,
    "09.04.05"
  );
  t.end();
});

// ============
// Obj - Nested
// ============

t.test("10.01 - simple nested plain objects", (t) => {
  t.same(
    compare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true
  );
  t.end();
});

t.test("10.02 - simple nested plain objects + array wrapper", (t) => {
  t.same(
    compare({ a: [{ d: "4" }], b: "2", c: "3" }, { a: [{ d: "4" }], b: "2" }),
    true
  );
  t.end();
});

t.test("10.03 - simple nested plain objects, won't find", (t) => {
  t.same(
    compare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false
  );
  t.end();
});

t.test(
  "10.04 - simple nested plain objects + array wrapper, won't find",
  (t) => {
    t.same(
      compare({ a: [{ d: "4" }], b: "2" }, { a: [{ d: "4" }], b: "2", c: "3" }),
      false
    );
    t.end();
  }
);

t.test("10.05 - obj, multiple nested levels, bigObj has more", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true
  );
  t.end();
});

t.test("10.06 - obj, multiple nested levels, equal", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true
  );
  t.end();
});

t.test("10.07 - obj, multiple nested levels, smallObj has more", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false
  );
  t.end();
});

t.test("10.08 - obj, deeper level doesn't match", (t) => {
  t.same(compare({ a: { b: "c" } }, { a: { b: "d" } }), false);
  t.end();
});

t.test("10.09 - empty string and empty nested object - defaults", (t) => {
  t.same(
    compare("", {
      key2: [],
      key3: [""],
    }),
    false
  );
  t.end();
});

t.test(
  "10.10 - empty string and empty nested object - hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        "",
        {
          key2: [],
          key3: [""],
        },
        {
          hungryForWhitespace: true,
        }
      ),
      true
    );
    t.end();
  }
);

t.test("10.11 - empty string and empty nested object - matchStrictly", (t) => {
  t.same(
    compare(
      "",
      {
        key2: [],
        key3: [""],
      },
      {
        matchStrictly: true,
      }
    ),
    false
  );
  t.end();
});

t.test(
  "10.12 - empty string and empty nested object - hungryForWhitespace + matchStrictly",
  (t) => {
    t.same(
      compare(
        "",
        {
          key2: [],
          key3: [""],
        },
        {
          hungryForWhitespace: true,
          matchStrictly: true,
        }
      ),
      false
    );
    t.end();
  }
);

t.test(
  "10.13 - empty string and empty nested object - hungryForWhitespace + matchStrictly",
  (t) => {
    t.same(
      compare(
        "",
        {},
        {
          hungryForWhitespace: true,
          matchStrictly: true,
        }
      ),
      true
    );
    t.end();
  }
);

t.test("10.14 - multiple keys", (t) => {
  t.same(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      {
        key2: [],
        key3: [],
      }
    ),
    false
  );
  t.end();
});

t.test("10.15 - multiple keys", (t) => {
  t.same(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      {
        key2: [],
        key3: [],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    false
  );
  t.end();
});
