import tap from "tap";
import compare from "../dist/ast-compare.esm";

const f = () => "zzz";

// (input, objToDelete, strictOrNot)

// ===========
// Precautions
// ===========

tap.test("01 - both inputs missing", (t) => {
  t.throws(() => {
    compare();
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("02 - second input missing", (t) => {
  t.throws(() => {
    compare({ a: "a" });
  }, /THROW_ID_02/g);
  t.throws(() => {
    compare({ a: "a" }, undefined, { verboseWhenMismatches: true });
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("03 - first input missing", (t) => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("04 - null as input", (t) => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  }, /THROW_ID_01/g);
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("05 - falsey inputs", (t) => {
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

tap.test("06 - plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }), true, "06");
  t.end();
});

tap.test("07 - plain objects", (t) => {
  t.same(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }), false, "07");
  t.end();
});

tap.test("08 - plain objects", (t) => {
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

tap.test("09 - plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true }
    ),
    false,
    "09"
  );
  t.end();
});

tap.test("10 - plain objects", (t) => {
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

tap.test("11 - plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2" }, { matchStrictly: true }),
    true,
    "11"
  );
  t.end();
});

tap.test("12 - plain objects", (t) => {
  // matchStrictly trumps hungryForWhitespace if key count does not match
  t.same(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "12"
  );
  t.end();
});

tap.test("13 - plain objects", (t) => {
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

tap.test("14 - plain objects - two whitespaces", (t) => {
  // keys match exactly, different white space matched
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "14"
  );
  t.end();
});

tap.test("15 - plain objects - whitespace vs empty str", (t) => {
  // keys match exactly, white space matches to empty string
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "15"
  );
  t.end();
});

tap.test("16 - plain objects - empty str vs whitespace", (t) => {
  // keys match exactly, empty string matches to white space
  t.same(
    compare(
      { a: "1", b: "" },
      { a: "1", b: "\t\t\t \n\n\n" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "16"
  );
  t.end();
});

tap.test("17 - plain objects", (t) => {
  // keys match exactly, string does not match to empty string
  t.same(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "17"
  );
  t.end();
});

tap.test("18 - plain objects", (t) => {
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

tap.test("19 - plain objects", (t) => {
  // keys match exactly, different white space matched
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: false }
    ),
    false,
    "19"
  );
  t.end();
});

tap.test("20 - plain objects", (t) => {
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

tap.test("21 - comparison of empty plain objects", (t) => {
  t.same(compare({}, { a: "1", b: "2" }), false, "21");
  t.end();
});

tap.test("22 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, { a: "1", b: "2" }, { hungryForWhitespace: true }),
    false,
    "22"
  );
  t.end();
});

tap.test("23 - comparison of empty plain objects", (t) => {
  t.same(compare({}, { a: "1", b: "2" }, { matchStrictly: true }), false, "23");
  t.end();
});

tap.test("24 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, {}), false, "24");
  t.end();
});

tap.test("25 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, {}, { hungryForWhitespace: true }),
    false,
    "25"
  );
  t.end();
});

tap.test("26 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, {}, { matchStrictly: true }),
    false,
    "26"
  );
  t.end();
});

tap.test("27 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "27"
  );
  t.end();
});

tap.test("28 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "\n\n\n" }), false, "28");
  t.end();
});

tap.test("29 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "29"
  );
  t.end();
});

tap.test("30 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    false,
    "30"
  );
  t.end();
});

tap.test("31 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "31"
  );
  t.end();
});

tap.test("32 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "32"
  );
  t.end();
});

tap.test("33 - comparing two empty plain objects", (t) => {
  t.same(compare({}, {}), true, "33");
  t.end();
});

tap.test("34 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: false }),
    true,
    "34"
  );
  t.end();
});

tap.test("35 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "35"
  );
  t.end();
});

tap.test("36 - catching row 199 for 100% coverage", (t) => {
  t.same(
    compare(
      { a: { b: [] } },
      { a: { b: {} } },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "36"
  );
  t.end();
});

tap.test("37 - sneaky similarity", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "37"
  );
  t.end();
});

tap.test("38 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "38"
  );
  t.end();
});

tap.test("39 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "39"
  );
  t.end();
});

tap.test("40 - big object has one element extra", (t) => {
  t.same(compare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }), true, "40");
  t.end();
});

tap.test("41 - small object has one element extra", (t) => {
  t.same(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }), false, "41");
  t.end();
});

tap.test(
  "42 - object values are arrays, one has a string, another has none",
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
      false,
      "42"
    );
    t.end();
  }
);

tap.test("43 - comparison of empty plain objects", (t) => {
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

tap.test("44 - comparison of empty plain objects", (t) => {
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
    false,
    "44"
  );
  t.end();
});

tap.test(
  "45 - comparison of empty plain objects - hungryForWhitespace",
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
      true,
      "45"
    );
    t.end();
  }
);

tap.test(
  "46 - comparison of empty plain objects - same, default hardcoded",
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
      false,
      "46"
    );
    t.end();
  }
);

tap.test(
  "47 - comparison of empty plain objects - matchStrictly trump hungryForWhitespace",
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
      false,
      "47"
    );
    t.end();
  }
);

tap.test("48 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "48"
  );
  t.end();
});

tap.test("49 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "49"
  );
  t.end();
});

tap.test("50 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true,
    "50"
  );
  t.end();
});

tap.test("51 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "51"
  );
  t.end();
});

tap.test("52 - Boolean and numeric values", (t) => {
  // control - booleans and numbers as obj values
  t.same(compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }), true, "52");
  t.end();
});

tap.test("53 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, f);
  }, /THROW_ID_04/g);
  t.end();
});

tap.test("54 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare(f, { a: false, b: 2, c: "3" });
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("55 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }, f);
  }, /THROW_ID_05/g);
  t.end();
});

tap.test("56 - s is zero length, b is empty - defaults", (t) => {
  t.same(
    compare({ a: "\n\n\n   \t\t\t", b: "2" }, { a: "", b: "2" }),
    false,
    "56"
  );
  t.end();
});

tap.test(
  "57 - s is zero length, b is empty - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        { a: "\n\n\n   \t\t\t", b: "2" },
        { a: "", b: "2" },
        { hungryForWhitespace: true }
      ),
      true,
      "57"
    );
    t.end();
  }
);

tap.test(
  "58 - s is zero length, b is empty - opts.hungryForWhitespace",
  (t) => {
    // no keys array vs array with all empty vales
    t.same(
      compare([{ a: "\n\n\n" }], {}, { hungryForWhitespace: true }),
      true,
      "58"
    );
    t.end();
  }
);

// 03. matching empty arrays
// -----------------------------------------------------------------------------

tap.test("59 - matching empty arrays - blank vs. normal - defaults", (t) => {
  t.same(compare({ a: "1", b: "2", c: 3 }, {}), false, "59");
  t.end();
});

tap.test("60 - matching empty arrays - blank vs. empty - defaults", (t) => {
  t.same(compare({ a: "\n\n", b: "\t", c: "   " }, {}), false, "60");
  t.end();
});

tap.test(
  "61 - matching empty arrays - blank vs. normal - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare({ a: "1", b: "2", c: 3 }, {}, { hungryForWhitespace: true }),
      false,
      "61"
    );
    t.end();
  }
);

tap.test(
  "62 - matching empty arrays - blank vs. empty - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        { a: "\n\n", b: "\t", c: "   " },
        {},
        { hungryForWhitespace: true }
      ),
      true,
      "62"
    );
    t.end();
  }
);

tap.test(
  "63 - matching empty arrays - blank vs. normal - opts.matchStrictly",
  (t) => {
    t.same(
      compare({ a: "1", b: "2", c: 3 }, {}, { matchStrictly: true }),
      false,
      "63"
    );
    t.end();
  }
);

tap.test(
  "64 - matching empty arrays - blank vs. empty - opts.matchStrictly",
  (t) => {
    t.same(
      compare({ a: "\n\n", b: "\t", c: "   " }, {}, { matchStrictly: true }),
      false,
      "64"
    );
    t.end();
  }
);

tap.test("65 - matching empty arrays - blank vs. normal - both opts", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: 3 },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "65"
  );
  t.end();
});

tap.test("66 - matching empty arrays - blank vs. empty - both opts", (t) => {
  t.same(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "66"
  );
  t.end();
});

// =============
// Arr - simples
// =============

tap.test("67 - simple arrays with strings", (t) => {
  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "67.01"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "67.02"
  );

  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "67.03"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "67.04"
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
    "67.05"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "67.06"
  );

  t.same(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "67.07"
  );
  t.same(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "67.08"
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

tap.test("68 - simple arrays with plain objects", (t) => {
  t.same(
    compare([{ a: "1" }, { b: "2" }, { c: "3" }], [{ a: "1" }, { b: "2" }]),
    true,
    "68.01"
  );
  t.same(
    compare([{ a: "1" }, { b: "2" }], [{ a: "1" }, { b: "2" }, { c: "3" }]),
    false,
    "68.02"
  );
  t.end();
});

tap.test("69 - arrays, nested with strings and objects", (t) => {
  t.same(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "69.01"
  );
  t.same(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "69.02"
  );
  t.end();
});

tap.test("70 - comparing empty arrays (variations)", (t) => {
  t.same(compare([], []), true, "70.01");
  t.same(compare([{}], [{}]), true, "70.02");
  t.same(compare([{}, {}], [{}]), true, "70.03");
  t.same(compare([{}], [{}, {}]), false, "70.04");
  t.same(compare([{ a: [] }, {}, []], [{ a: [] }]), true, "70.05");
  t.same(compare([], [], { hungryForWhitespace: true }), true, "70.06");
  t.same(compare([{}], [{}], { hungryForWhitespace: true }), true, "70.07");
  t.same(compare([{}, {}], [{}], { hungryForWhitespace: true }), true, "70.08");
  t.same(compare([{}], [{}, {}], { hungryForWhitespace: true }), true, "70.09");
  t.same(
    compare([{ a: [] }, {}, []], [{ a: [] }], { hungryForWhitespace: true }),
    true,
    "70.10"
  );
  t.end();
});

tap.test("71 - empty arrays within obj key values", (t) => {
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
    "71.01"
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
    "71.02"
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
    "71.03"
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
    "71.04"
  );
  t.end();
});

tap.test("72 - empty arrays vs empty objects", (t) => {
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
    "72.01"
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
    "72.02"
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
    "72.03"
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
    "72.04"
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
    "72.05"
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
    "72.06"
  );
  t.end();
});

tap.test("73 - empty arrays vs empty strings", (t) => {
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
    "73.01"
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
    "73.02"
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
    "73.03"
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
    "73.04"
  );
  t.end();
});

tap.test("74 - two arrays, matches middle, string within", (t) => {
  t.same(compare(["a", "b", "c", "d", "e"], ["b", "c", "d"]), true, "74.01");
  t.same(
    compare(["b", "c", "d"], ["a", "b", "c", "d", "e"]),
    false,
    "74.02 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["b", "c", "e"]), true, "74.03");
  t.same(
    compare(["b", "c", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "74.04 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["a", "b", "c"]), true, "74.05");
  t.same(
    compare(["a", "b", "c"], ["a", "b", "c", "d", "e"]),
    false,
    "74.06 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["c", "d", "e"]), true, "74.07");
  t.same(
    compare(["c", "d", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "74.08 opposite"
  );

  t.same(compare(["a", "b", "c", "d", "e"], ["e"]), true, "74.09");
  t.same(compare(["e"], ["a", "b", "c", "d", "e"]), false, "74.10 opposite");
  t.end();
});

tap.test("75 - two arrays, matches middle, objects within", (t) => {
  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { d: "d" }]
    ),
    true,
    "75.01"
  );
  t.same(
    compare(
      [{ b: "b" }, { c: "c" }, { d: "d" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "75.02 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { e: "e" }]
    ),
    true,
    "75.03"
  );
  t.same(
    compare(
      [{ b: "b" }, { c: "c" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "75.04 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }]
    ),
    true,
    "75.05"
  );
  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "75.06 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ c: "c" }, { d: "d" }, { e: "e" }]
    ),
    true,
    "75.07"
  );
  t.same(
    compare(
      [{ c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "75.08 opposite"
  );

  t.same(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ e: "e" }]
    ),
    true,
    "75.09"
  );
  t.same(
    compare(
      [{ e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "75.10 opposite"
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
    "75.11"
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
    "75.12"
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
    "75.13"
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
    "75.14"
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
    "75.15"
  );
  t.end();
});

tap.test("76 - two arrays, one empty, string within", (t) => {
  t.same(compare(["a", "b", "c"], []), false, "76.01");
  t.not(
    compare(["a", "b", "c"], [], { verboseWhenMismatches: true }),
    true,
    "04.10.02"
  );
  t.same(
    compare(["a", "b", "c"], [], { hungryForWhitespace: true }),
    true,
    "76.02"
  );
  t.end();
});

// =======
// Strings
// =======

tap.test("77 - simple strings", (t) => {
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "77.01"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "77.02"
  );

  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "77.03"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "77.04"
  );

  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    true,
    "77.05"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "77.06"
  );

  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "77.07"
  );
  t.same(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "77.08"
  );
  t.end();
});

tap.test("78 - strings compared and fails", (t) => {
  t.same(compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "78.01");
  t.not(
    compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"], { verboseWhenMismatches: true }),
    true,
    "05.02.02"
  );
  t.end();
});

tap.test("79 - strings in arrays compared, positive", (t) => {
  t.same(compare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "79");
  t.end();
});

tap.test(
  "80 - string against empty array or empty string within an array",
  (t) => {
    t.same(compare(["aaaaa\nbbbbb"], []), false, "80.01");
    t.same(
      compare(["aaaaa\nbbbbb"], [], { hungryForWhitespace: true }),
      true,
      "80.02"
    );
    t.same(
      compare(["aaaaa\nbbbbb"], ["\n\n\n"], { hungryForWhitespace: true }),
      true,
      "80.03"
    );
    t.same(
      compare(["aaaaa\nbbbbb", "\t\t\t \n\n\n", "   "], ["\n\n\n"], {
        hungryForWhitespace: true,
      }),
      true,
      "80.04"
    );
    t.end();
  }
);

tap.test("81 - string vs empty space", (t) => {
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "81.01"
  );
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "81.02"
  );
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "81.03"
  );
  t.same(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "81.04"
  );
  t.end();
});

tap.test("82 - empty space vs different empty space", (t) => {
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "82.01"
  );
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "82.02"
  );
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "82.03"
  );
  t.same(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "82.04"
  );
  t.end();
});

tap.test("83 - two arrays, one empty", (t) => {
  t.same(
    compare(["\t\t\t\t\t\t      \n\n\n    \t\t\t"], []),
    false,
    "83.01 - in root, defaults"
  );
  t.same(
    compare(
      { a: ["\t\t\t\t\t\t      \n\n\n    \t\t\t"] },
      { a: [] },
      { hungryForWhitespace: true }
    ),
    true,
    "83.02 - in root, defaults"
  );
  t.same(
    compare([], ["\t\t\t\t\t\t      \n\n\n    \t\t\t"], {
      hungryForWhitespace: true,
    }),
    true,
    "83.03 - in root, defaults, opposite from #2"
  );
  t.end();
});

tap.test("84 - opts.matchStrictly", (t) => {
  t.same(
    compare(
      { a: "a" },
      {},
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    false,
    "84.01 - key count mismatch"
  );
  t.same(
    typeof compare(
      {},
      { a: "a" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    "string",
    "84.02 - key count mismatch"
  );
  t.end();
});

// ======
// Random
// ======

tap.test("85 - null vs null", (t) => {
  t.same(compare(null, null), true, "85");
  t.end();
});

tap.test("86 - real-life #1", (t) => {
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
    "86.01"
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
    "86.02"
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
    "86.03"
  );
  t.end();
});

tap.test("87 - real-life #2", (t) => {
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
    "87.01"
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
    "87.02"
  );
  t.end();
});

tap.test("88 - function as input", (t) => {
  t.throws(() => {
    compare(f, f);
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("89 - real-life #3", (t) => {
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
    "89.01"
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
    "89.02"
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
    "89.03"
  );
  t.end();
});

tap.test("90 - real-life #3 reduced case", (t) => {
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
    "90.01"
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
    "90.02"
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
    "90.03"
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
    "90.04"
  );
  t.end();
});

tap.test("91 - input args of mismatching type - easy win", (t) => {
  t.same(
    compare(
      {
        a: "a",
      },
      "a"
    ),
    false,
    "91.01"
  );
  t.same(
    compare("a", {
      a: "a",
    }),
    false,
    "91.02"
  );
  t.same(
    compare(
      {
        a: "a",
      },
      ["a"]
    ),
    false,
    "91.03"
  );
  t.same(
    compare(["a"], {
      a: "a",
    }),
    false,
    "91.04"
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
    "91.05"
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
    "91.06"
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
    "91.07"
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
    "91.08"
  );
  t.end();
});

// =======================
// Still works overloading
// =======================

tap.test("92 - fourth argument doesn't break anything", (t) => {
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, true),
    false,
    "92.01"
  );
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, false),
    false,
    "92.02"
  );
  t.end();
});

// ===============
// Just Loose Mode
// ===============

tap.test("93 - hungryForWhitespace, empty strings within arrays", (t) => {
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
    "93.01"
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
    "93.02"
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
    "93.03"
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
    "93.04"
  );
  t.end();
});

// =================
// Wildcard matching
// =================

tap.test("94 - wildcards against values within object", (t) => {
  t.same(
    compare({ a: "1", b: "2a", c: "3" }, { a: "1", b: "2*" }),
    false,
    "94.01 - default"
  );
  t.same(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: false }
    ),
    false,
    "94.02 - hardcoded default"
  );
  t.same(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: true }
    ),
    true,
    "94.03 - wildcards enabled"
  );
  t.same(
    compare(
      { a: "1", b: "za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    true,
    "94.04 - with letters and wildcards"
  );
  t.same(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    false,
    "94.05 - won't match because it's now case-sensitive in wildcards too"
  );
  t.same(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "Z*" },
      { useWildcards: true }
    ),
    true,
    "94.06 - won't match because it's now case-sensitive in wildcards too"
  );

  t.same(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: true }
    ),
    false,
    "94.07 - weird"
  );
  t.same(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: false }
    ),
    false,
    "94.08 - weird, false anyway"
  );
  t.end();
});

tap.test("95 - wildcards against keys within object", (t) => {
  t.same(
    compare({ az: "1", bz: "2a", cz: "3" }, { "a*": "1", "b*": "2*" }),
    false,
    "95.01 - default"
  );
  t.same(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "a*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    true,
    "95.02 - wildcards on"
  );
  t.same(
    compare({ az: "1", bz: "2a", cz: "3" }, { "x*": "1", "b*": "2*" }),
    false,
    "95.03 - won't find, despite wildcards, which are turned off"
  );
  t.same(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "x*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    false,
    "95.04 - won't find, despite wildcards, which are turned on"
  );
  t.end();
});

tap.test("96 - wildcards in deeper levels", (t) => {
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
    "96.01 - default (control), wildcards are turned off"
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
    "96.02 - default (control), wildcards are turned off"
  );
  t.end();
});

tap.test("97 - wildcards in deeper levels within arrays", (t) => {
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
    "97.01"
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
    "97.02"
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
    "97.03"
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
    "97.04"
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
    "97.05"
  );
  t.end();
});

// ============
// Obj - Nested
// ============

tap.test("98 - simple nested plain objects", (t) => {
  t.same(
    compare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "98"
  );
  t.end();
});

tap.test("99 - simple nested plain objects + array wrapper", (t) => {
  t.same(
    compare({ a: [{ d: "4" }], b: "2", c: "3" }, { a: [{ d: "4" }], b: "2" }),
    true,
    "99"
  );
  t.end();
});

tap.test("100 - simple nested plain objects, won't find", (t) => {
  t.same(
    compare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "100"
  );
  t.end();
});

tap.test(
  "101 - simple nested plain objects + array wrapper, won't find",
  (t) => {
    t.same(
      compare({ a: [{ d: "4" }], b: "2" }, { a: [{ d: "4" }], b: "2", c: "3" }),
      false,
      "101"
    );
    t.end();
  }
);

tap.test("102 - obj, multiple nested levels, bigObj has more", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "102"
  );
  t.end();
});

tap.test("103 - obj, multiple nested levels, equal", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "103"
  );
  t.end();
});

tap.test("104 - obj, multiple nested levels, smallObj has more", (t) => {
  t.same(
    compare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "104"
  );
  t.end();
});

tap.test("105 - obj, deeper level doesn't match", (t) => {
  t.same(compare({ a: { b: "c" } }, { a: { b: "d" } }), false, "105");
  t.end();
});

tap.test("106 - empty string and empty nested object - defaults", (t) => {
  t.same(
    compare("", {
      key2: [],
      key3: [""],
    }),
    false,
    "106"
  );
  t.end();
});

tap.test(
  "107 - empty string and empty nested object - hungryForWhitespace",
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
      true,
      "107"
    );
    t.end();
  }
);

tap.test("108 - empty string and empty nested object - matchStrictly", (t) => {
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
    false,
    "108"
  );
  t.end();
});

tap.test(
  "109 - empty string and empty nested object - hungryForWhitespace + matchStrictly",
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
      false,
      "109"
    );
    t.end();
  }
);

tap.test(
  "110 - empty string and empty nested object - hungryForWhitespace + matchStrictly",
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
      true,
      "110"
    );
    t.end();
  }
);

tap.test("111 - multiple keys", (t) => {
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
    false,
    "111"
  );
  t.end();
});

tap.test("112 - multiple keys", (t) => {
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
    false,
    "112"
  );
  t.end();
});
