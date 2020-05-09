import tap from "tap";
import compare from "../dist/ast-compare.esm";

const f = () => "zzz";

// (input, objToDelete, strictOrNot)

// =============
// Obj - Simples
// =============

tap.test("01 - plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }), true, "01");
  t.end();
});

tap.test("02 - plain objects", (t) => {
  t.same(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }), false, "02");
  t.end();
});

tap.test("03 - plain objects", (t) => {
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

tap.test("04 - plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true }
    ),
    false,
    "04"
  );
  t.end();
});

tap.test("05 - plain objects", (t) => {
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

tap.test("06 - plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2" }, { a: "1", b: "2" }, { matchStrictly: true }),
    true,
    "06"
  );
  t.end();
});

tap.test("07 - plain objects", (t) => {
  // matchStrictly trumps hungryForWhitespace if key count does not match
  t.same(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "07"
  );
  t.end();
});

tap.test("08 - plain objects", (t) => {
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

tap.test("09 - plain objects - two whitespaces", (t) => {
  // keys match exactly, different white space matched
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "09"
  );
  t.end();
});

tap.test("10 - plain objects - whitespace vs empty str", (t) => {
  // keys match exactly, white space matches to empty string
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "10"
  );
  t.end();
});

tap.test("11 - plain objects - empty str vs whitespace", (t) => {
  // keys match exactly, empty string matches to white space
  t.same(
    compare(
      { a: "1", b: "" },
      { a: "1", b: "\t\t\t \n\n\n" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "11"
  );
  t.end();
});

tap.test("12 - plain objects", (t) => {
  // keys match exactly, string does not match to empty string
  t.same(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "12"
  );
  t.end();
});

tap.test("13 - plain objects", (t) => {
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

tap.test("14 - plain objects", (t) => {
  // keys match exactly, different white space matched
  t.same(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: false }
    ),
    false,
    "14"
  );
  t.end();
});

tap.test("15 - plain objects", (t) => {
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

tap.test("16 - comparison of empty plain objects", (t) => {
  t.same(compare({}, { a: "1", b: "2" }), false, "16");
  t.end();
});

tap.test("17 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, { a: "1", b: "2" }, { hungryForWhitespace: true }),
    false,
    "17"
  );
  t.end();
});

tap.test("18 - comparison of empty plain objects", (t) => {
  t.same(compare({}, { a: "1", b: "2" }, { matchStrictly: true }), false, "18");
  t.end();
});

tap.test("19 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, {}), false, "19");
  t.end();
});

tap.test("20 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, {}, { hungryForWhitespace: true }),
    false,
    "20"
  );
  t.end();
});

tap.test("21 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, {}, { matchStrictly: true }),
    false,
    "21"
  );
  t.end();
});

tap.test("22 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "22"
  );
  t.end();
});

tap.test("23 - comparison of empty plain objects", (t) => {
  t.same(compare({ a: "1", b: "2", c: "3" }, { a: "\n\n\n" }), false, "23");
  t.end();
});

tap.test("24 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "24"
  );
  t.end();
});

tap.test("25 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    false,
    "25"
  );
  t.end();
});

tap.test("26 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "26"
  );
  t.end();
});

tap.test("27 - comparison of empty plain objects", (t) => {
  t.same(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "27"
  );
  t.end();
});

tap.test("28 - comparing two empty plain objects", (t) => {
  t.same(compare({}, {}), true, "28");
  t.end();
});

tap.test("29 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: false }),
    true,
    "29"
  );
  t.end();
});

tap.test("30 - comparison of empty plain objects", (t) => {
  t.same(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "30"
  );
  t.end();
});

tap.test("31 - catching row 199 for 100% coverage", (t) => {
  t.same(
    compare(
      { a: { b: [] } },
      { a: { b: {} } },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "31"
  );
  t.end();
});

tap.test("32 - sneaky similarity", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "32"
  );
  t.end();
});

tap.test("33 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "33"
  );
  t.end();
});

tap.test("34 - comparison of empty plain objects", (t) => {
  t.same(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "34"
  );
  t.end();
});

tap.test("35 - big object has one element extra", (t) => {
  t.same(compare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }), true, "35");
  t.end();
});

tap.test("36 - small object has one element extra", (t) => {
  t.same(compare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }), false, "36");
  t.end();
});

tap.test(
  "37 - object values are arrays, one has a string, another has none",
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
      "37"
    );
    t.end();
  }
);

tap.test("38 - comparison of empty plain objects", (t) => {
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

tap.test("39 - comparison of empty plain objects", (t) => {
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
    "39"
  );
  t.end();
});

tap.test(
  "40 - comparison of empty plain objects - hungryForWhitespace",
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
      "40"
    );
    t.end();
  }
);

tap.test(
  "41 - comparison of empty plain objects - same, default hardcoded",
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
      "41"
    );
    t.end();
  }
);

tap.test(
  "42 - comparison of empty plain objects - matchStrictly trump hungryForWhitespace",
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
      "42"
    );
    t.end();
  }
);

tap.test("43 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "43"
  );
  t.end();
});

tap.test("44 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "44"
  );
  t.end();
});

tap.test("45 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true,
    "45"
  );
  t.end();
});

tap.test("46 - empty object with keys vs object with no keys", (t) => {
  t.same(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "46"
  );
  t.end();
});

tap.test("47 - Boolean and numeric values", (t) => {
  // control - booleans and numbers as obj values
  t.same(compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }), true, "47");
  t.end();
});

tap.test("48 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, f);
  }, /THROW_ID_04/g);
  t.end();
});

tap.test("49 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare(f, { a: false, b: 2, c: "3" });
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("50 - Boolean and numeric values", (t) => {
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }, f);
  }, /THROW_ID_05/g);
  t.end();
});

tap.test("51 - s is zero length, b is empty - defaults", (t) => {
  t.same(
    compare({ a: "\n\n\n   \t\t\t", b: "2" }, { a: "", b: "2" }),
    false,
    "51"
  );
  t.end();
});

tap.test(
  "52 - s is zero length, b is empty - opts.hungryForWhitespace",
  (t) => {
    t.same(
      compare(
        { a: "\n\n\n   \t\t\t", b: "2" },
        { a: "", b: "2" },
        { hungryForWhitespace: true }
      ),
      true,
      "52"
    );
    t.end();
  }
);

tap.test(
  "53 - s is zero length, b is empty - opts.hungryForWhitespace",
  (t) => {
    // no keys array vs array with all empty vales
    t.same(
      compare([{ a: "\n\n\n" }], {}, { hungryForWhitespace: true }),
      true,
      "53"
    );
    t.end();
  }
);
