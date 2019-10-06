import test from "ava";
import compare from "../dist/ast-compare.esm";
import {
  existy,
  isObj,
  isStr,
  isNum,
  isBool,
  isNull,
  isBlank,
  isTheTypeLegit
} from "../dist/util.esm";

const f = () => "zzz";
const f2 = () => "yyy";

// (input, objToDelete, strictOrNot)

// ===========
// Precautions
// ===========

test("01.01 - both inputs missing", t => {
  t.throws(() => {
    compare();
  });
  t.throws(() => {
    compare(undefined, undefined, { verboseWhenMismatches: true });
  });
});

test("01.02 - second input missing", t => {
  t.throws(() => {
    compare({ a: "a" });
  });
  t.throws(() => {
    compare({ a: "a" }, undefined, { verboseWhenMismatches: true });
  });
});

test("01.03 - first input missing", t => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  });
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  });
});

test("01.04 - null as input", t => {
  t.throws(() => {
    compare(undefined, { a: "a" });
  });
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  });
});

test("01.05 - falsey inputs", t => {
  t.throws(() => {
    compare(null, undefined);
  });
  t.throws(() => {
    compare(null, undefined, { verboseWhenMismatches: true });
  });
});

test("01.06 - undefined in a second-level depth", t => {
  t.throws(() => {
    compare(
      {
        a: "a",
        b: {
          c: "c"
        }
      },
      {
        a: "a",
        b: undefined
      }
    );
  });
  t.throws(() => {
    compare(
      {
        a: "a",
        b: {
          c: "c"
        }
      },
      {
        a: "a",
        b: undefined
      },
      {
        hungryForWhitespace: true
      }
    );
  });
  t.throws(() => {
    compare(
      {
        a: "a",
        b: {
          c: "c"
        }
      },
      {
        a: "a",
        b: undefined
      },
      {
        verboseWhenMismatches: true
      }
    );
  });
  t.throws(() => {
    compare(
      {
        a: "a",
        b: {
          c: "c"
        }
      },
      {
        a: "a",
        b: undefined
      },
      {
        hungryForWhitespace: true,
        verboseWhenMismatches: true
      }
    );
  });
});

test("01.07 - wrong types of input args", t => {
  t.throws(() => {
    compare(undefined, { a: "a" }, { verboseWhenMismatches: true });
  });
  t.throws(() => {
    compare({ a: f }, { a: "a" }, { verboseWhenMismatches: true });
  });
});

// =============
// Obj - Simples
// =============

test("02.01 - simple plain objects", t => {
  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" }),
    true,
    "02.01.01"
  );
  t.deepEqual(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }),
    false,
    "02.01.02"
  );
  t.not(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", c: "3" },
      { verboseWhenMismatches: true }
    ),
    true,
    "02.01.03"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true }
    ),
    false,
    "02.01.04"
  );
  t.not(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    true,
    "02.01.05"
  );
  t.deepEqual(
    compare({ a: "1", b: "2" }, { a: "1", b: "2" }, { matchStrictly: true }),
    true,
    "02.01.06"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "02.01.07 - matchStrictly trumps hungryForWhitespace if key count does not match"
  );
  t.not(
    compare(
      { a: "1", b: "2", c: "\n\n\n" },
      { a: "1", b: "2" },
      {
        matchStrictly: true,
        hungryForWhitespace: true,
        verboseWhenMismatches: true
      }
    ),
    true,
    "02.01.08 - matchStrictly trumps hungryForWhitespace if key count does not match"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "02.01.09 - keys match exactly, different white space matched"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "02.01.10 - keys match exactly, white space matches to empty string"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "" },
      { a: "1", b: "\t\t\t \n\n\n" },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    true,
    "02.01.11 - keys match exactly, empty string matches to white space"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: true }
    ),
    false,
    "02.01.12 - keys match exactly, string does not match to empty string"
  );
  t.not(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "     " },
      {
        matchStrictly: true,
        hungryForWhitespace: true,
        verboseWhenMismatches: true
      }
    ),
    true,
    "02.01.13 - keys match exactly, string does not match to empty string"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      { matchStrictly: true, hungryForWhitespace: false }
    ),
    false,
    "02.01.14 - keys match exactly, different white space matched"
  );
  t.not(
    compare(
      { a: "1", b: "\t\t\t \n\n\n" },
      { a: "1", b: "     " },
      {
        matchStrictly: true,
        hungryForWhitespace: false,
        verboseWhenMismatches: true
      }
    ),
    true,
    "02.01.15 - keys match exactly, different white space matched"
  );
});

test("02.02 - comparison of empty plain objects", t => {
  t.deepEqual(compare({}, { a: "1", b: "2" }), false, "02.02.01");
  t.deepEqual(
    compare({}, { a: "1", b: "2" }, { hungryForWhitespace: true }),
    false,
    "02.02.02"
  );
  t.deepEqual(
    compare({}, { a: "1", b: "2" }, { matchStrictly: true }),
    false,
    "02.02.03"
  );

  t.deepEqual(compare({ a: "1", b: "2", c: "3" }, {}), false, "02.02.04");
  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, {}, { hungryForWhitespace: true }),
    false,
    "02.02.05"
  );
  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, {}, { matchStrictly: true }),
    false,
    "02.02.06"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "3" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "02.02.07"
  );

  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, { a: "\n\n\n" }),
    false,
    "02.02.08"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "02.02.09"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    false,
    "02.02.10"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "02.02.11"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2", c: "3" },
      { a: "\n\n\n" },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "02.02.12"
  );
});

test("02.03 - comparing two empty plain objects", t => {
  t.deepEqual(compare({}, {}), true, "02.03.01");
  t.deepEqual(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: false }),
    true,
    "02.03.02"
  );
  t.deepEqual(
    compare({}, {}, { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "02.03.03"
  );
});

test("02.04 - catching row 199 for 100% coverage", t => {
  t.deepEqual(
    compare(
      { a: { b: [] } },
      { a: { b: {} } },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "02.04.01"
  );
});

test("02.05 - sneaky similarity", t => {
  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: ["3"] }),
    false,
    "02.05.01"
  );
  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: 3 }),
    false,
    "02.05.02"
  );
  t.deepEqual(
    compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2", c: { d: "3" } }),
    false,
    "02.05.03"
  );
});

test("02.06 - big object has one element extra", t => {
  t.deepEqual(
    compare({ a: "1", b: "2", c: 3 }, { a: "1", b: "2" }),
    true,
    "02.06"
  );
});

test("02.07 - small object has one element extra", t => {
  t.deepEqual(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: 3 }),
    false,
    "02.07"
  );
});

test("02.08 - object values are arrays, one has a string, another has none", t => {
  t.deepEqual(
    compare(
      {
        key: ["a"]
      },
      {
        key: []
      }
    ),
    false,
    "02.08.01 - relying on default"
  );
  t.not(
    compare(
      {
        key: ["a"]
      },
      {
        key: []
      },
      {
        verboseWhenMismatches: true
      }
    ),
    true,
    "02.08.02 - relying on default"
  );
  t.deepEqual(
    compare(
      {
        key: ["a"]
      },
      {
        key: []
      },
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "02.08.03 - same, default hardcoded"
  );
  t.deepEqual(
    compare(
      {
        key: ["a"]
      },
      {
        key: []
      },
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true,
    "02.08.04 - hungryForWhitespace"
  );
  t.deepEqual(
    compare(
      {
        key: ["a"]
      },
      {
        key: []
      },
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "02.08.05 - same, default hardcoded"
  );
  t.deepEqual(
    compare(
      {
        key: ["a"]
      },
      {
        key: []
      },
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "02.08.06 - matchStrictly trump hungryForWhitespace - element count is uneven hence a falsey result"
  );
});

test("02.09 - empty object with keys vs object with no keys", t => {
  t.deepEqual(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: false }
    ),
    false,
    "02.09.01"
  );
  t.deepEqual(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: false, matchStrictly: true }
    ),
    false,
    "02.09.02"
  );
  t.deepEqual(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: false }
    ),
    true,
    "02.09.03"
  );
  t.deepEqual(
    compare(
      { a: "\n" },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "02.09.04"
  );
});

test("02.10 - Boolean and numeric values", t => {
  t.deepEqual(
    compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }),
    true,
    "02.10.01 - control - booleans and numbers as obj values"
  );
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, f);
  });
  t.throws(() => {
    compare(f, { a: false, b: 2, c: "3" });
  });
  t.throws(() => {
    compare({ a: false, b: 2, c: "3" }, { a: false, b: 2 }, f);
  });
});

test("02.11 - s is zero length, b is empty", t => {
  t.deepEqual(
    compare({ a: "\n\n\n   \t\t\t", b: "2" }, { a: "", b: "2" }),
    false,
    "02.11.01 - defaults"
  );
  t.deepEqual(
    compare(
      { a: "\n\n\n   \t\t\t", b: "2" },
      { a: "", b: "2" },
      { hungryForWhitespace: true }
    ),
    true,
    "02.11.02 - opts.hungryForWhitespace"
  );
  t.deepEqual(
    compare([{ a: "\n\n\n" }], {}, { hungryForWhitespace: true }),
    true,
    "02.11.03 - opts.hungryForWhitespace, no keys array vs array with all empty vales"
  );
});

test("02.12 - matching empty arrays", t => {
  t.deepEqual(
    compare({ a: "1", b: "2", c: 3 }, {}),
    false,
    "02.12.01 - blank vs. normal - defaults"
  );
  t.deepEqual(
    compare({ a: "\n\n", b: "\t", c: "   " }, {}),
    false,
    "02.12.02 - blank vs. empty - defaults"
  );

  t.deepEqual(
    compare({ a: "1", b: "2", c: 3 }, {}, { hungryForWhitespace: true }),
    false,
    "02.12.03 - blank vs. normal - opts.hungryForWhitespace"
  );
  t.deepEqual(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true }
    ),
    true,
    "02.12.04 - blank vs. empty - opts.hungryForWhitespace"
  );

  t.deepEqual(
    compare({ a: "1", b: "2", c: 3 }, {}, { matchStrictly: true }),
    false,
    "02.12.05 - blank vs. normal - opts.matchStrictly"
  );
  t.deepEqual(
    compare({ a: "\n\n", b: "\t", c: "   " }, {}, { matchStrictly: true }),
    false,
    "02.12.06 - blank vs. empty - opts.matchStrictly"
  );

  t.deepEqual(
    compare(
      { a: "1", b: "2", c: 3 },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "02.12.07 - blank vs. normal - both opts"
  );
  t.deepEqual(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "02.12.08 - blank vs. empty - both opts"
  );
});

// ============
// Obj - Nested
// ============

test("03.01 - simple nested plain objects", t => {
  t.deepEqual(
    compare({ a: { d: "4" }, b: "2", c: "3" }, { a: { d: "4" }, b: "2" }),
    true,
    "03.01"
  );
});

test("03.02 - simple nested plain objects + array wrapper", t => {
  t.deepEqual(
    compare({ a: [{ d: "4" }], b: "2", c: "3" }, { a: [{ d: "4" }], b: "2" }),
    true,
    "03.02"
  );
});

test("03.03 - simple nested plain objects, won't find", t => {
  t.deepEqual(
    compare({ a: { d: "4" }, b: "2" }, { a: { d: "4" }, b: "2", c: "3" }),
    false,
    "03.03"
  );
});

test("03.04 - simple nested plain objects + array wrapper, won't find", t => {
  t.deepEqual(
    compare({ a: [{ d: "4" }], b: "2" }, { a: [{ d: "4" }], b: "2", c: "3" }),
    false,
    "03.04"
  );
});

test("03.05 - obj, multiple nested levels, bigObj has more", t => {
  t.deepEqual(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }] } } } }
    ),
    true,
    "03.05"
  );
});

test("03.06 - obj, multiple nested levels, equal", t => {
  t.deepEqual(
    compare(
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    true,
    "03.06"
  );
});

test("03.07 - obj, multiple nested levels, smallObj has more", t => {
  t.deepEqual(
    compare(
      { a: { b: { c: { d: [{ e: "1" }] } } } },
      { a: { b: { c: { d: [{ e: "1" }, { f: "2" }] } } } }
    ),
    false,
    "03.07"
  );
});

test("03.08 - obj, deeper level doesn't match", t => {
  t.deepEqual(compare({ a: { b: "c" } }, { a: { b: "d" } }), false, "03.08");
});

test("03.09 - empty string and empty nested object", t => {
  t.deepEqual(
    compare("", {
      key2: [],
      key3: [""]
    }),
    false,
    "03.09.01 - defaults"
  );
  t.deepEqual(
    compare(
      "",
      {
        key2: [],
        key3: [""]
      },
      {
        hungryForWhitespace: true
      }
    ),
    true,
    "03.09.02 - hungryForWhitespace"
  );
  t.deepEqual(
    compare(
      "",
      {
        key2: [],
        key3: [""]
      },
      {
        matchStrictly: true
      }
    ),
    false,
    "03.09.03 - matchStrictly"
  );
  t.deepEqual(
    compare(
      "",
      {
        key2: [],
        key3: [""]
      },
      {
        hungryForWhitespace: true,
        matchStrictly: true
      }
    ),
    false,
    "03.09.04 - hungryForWhitespace + matchStrictly"
  );
  t.deepEqual(
    compare(
      "",
      {},
      {
        hungryForWhitespace: true,
        matchStrictly: true
      }
    ),
    true,
    "03.09.04 - hungryForWhitespace + matchStrictly"
  );
});

test("03.10 - multiple keys", t => {
  t.deepEqual(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4"
      },
      {
        key2: [],
        key3: []
      }
    ),
    false,
    "03.10.01"
  );
  t.deepEqual(
    compare(
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4"
      },
      {
        key2: [],
        key3: []
      },
      {
        hungryForWhitespace: true
      }
    ),
    false,
    "03.10.02"
  );
});

// =============
// Arr - simples
// =============

test("04.01 - simple arrays with strings", t => {
  t.deepEqual(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: false
    }),
    true,
    "04.01.01"
  );
  t.deepEqual(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: false
    }),
    false,
    "04.01.02"
  );

  t.deepEqual(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: false,
      hungryForWhitespace: true
    }),
    true,
    "04.01.03"
  );
  t.deepEqual(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true
    }),
    false,
    "04.01.04"
  );
  t.not(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: false,
      hungryForWhitespace: true,
      verboseWhenMismatches: true
    }),
    true,
    "04.01.05"
  );

  t.deepEqual(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: false
    }),
    false,
    "04.01.06"
  );
  t.deepEqual(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: false
    }),
    false,
    "04.01.07"
  );

  t.deepEqual(
    compare(["a", "b", "c"], ["a", "b"], {
      matchStrictly: true,
      hungryForWhitespace: true
    }),
    false,
    "04.01.08"
  );
  t.deepEqual(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true
    }),
    false,
    "04.01.09"
  );
  t.not(
    compare(["a", "b"], ["a", "b", "c"], {
      matchStrictly: true,
      hungryForWhitespace: true,
      verboseWhenMismatches: true
    }),
    true,
    "04.01.10"
  );
});

test("04.02 - simple arrays with plain objects", t => {
  t.deepEqual(
    compare([{ a: "1" }, { b: "2" }, { c: "3" }], [{ a: "1" }, { b: "2" }]),
    true,
    "04.02.01"
  );
  t.deepEqual(
    compare([{ a: "1" }, { b: "2" }], [{ a: "1" }, { b: "2" }, { c: "3" }]),
    false,
    "04.02.02"
  );
});

test("04.03 - arrays, nested with strings and objects", t => {
  t.deepEqual(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]]
    ),
    true,
    "04.03.01"
  );
  t.deepEqual(
    compare(
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3" }] }]],
      [{ a: "1" }, [{ b: "2" }, { c: [{ d: "3", e: "4" }] }], "yo"]
    ),
    false,
    "04.03.02"
  );
});

test("04.04 - comparing empty arrays (variations)", t => {
  t.deepEqual(compare([], []), true, "04.04.01");
  t.deepEqual(compare([{}], [{}]), true, "04.04.02");
  t.deepEqual(compare([{}, {}], [{}]), true, "04.04.03");
  t.deepEqual(compare([{}], [{}, {}]), false, "04.04.04");
  t.deepEqual(compare([{ a: [] }, {}, []], [{ a: [] }]), true, "04.04.05");
  t.deepEqual(compare([], [], { hungryForWhitespace: true }), true, "04.04.06");
  t.deepEqual(
    compare([{}], [{}], { hungryForWhitespace: true }),
    true,
    "04.04.07"
  );
  t.deepEqual(
    compare([{}, {}], [{}], { hungryForWhitespace: true }),
    true,
    "04.04.08"
  );
  t.deepEqual(
    compare([{}], [{}, {}], { hungryForWhitespace: true }),
    true,
    "04.04.09"
  );
  t.deepEqual(
    compare([{ a: [] }, {}, []], [{ a: [] }], { hungryForWhitespace: true }),
    true,
    "04.04.10"
  );
});

test("04.05 - empty arrays within obj key values", t => {
  t.deepEqual(
    compare(
      {
        a: []
      },
      {
        a: {
          b: "b"
        }
      }
    ),
    false,
    "04.05.01"
  );
  t.deepEqual(
    compare(
      {
        a: {
          b: "b"
        }
      },
      {
        a: []
      }
    ),
    false,
    "04.05.02"
  );
  t.deepEqual(
    compare(
      {
        a: []
      },
      {
        a: {
          b: "b"
        }
      },
      { hungryForWhitespace: true }
    ),
    false,
    "04.05.03"
  );
  t.not(
    compare(
      {
        a: []
      },
      {
        a: {
          b: "b"
        }
      },
      { hungryForWhitespace: true, verboseWhenMismatches: true }
    ),
    true,
    "04.05.04"
  );
  t.deepEqual(
    compare(
      {
        a: {
          b: "b"
        }
      },
      {
        a: []
      },
      { hungryForWhitespace: true }
    ),
    false,
    "04.05.05"
  );
});

test("04.06 - empty arrays vs empty objects", t => {
  t.deepEqual(
    compare(
      {
        a: []
      },
      {
        a: {}
      }
    ),
    false,
    "04.06.01"
  );
  t.deepEqual(
    compare(
      {
        a: {}
      },
      {
        a: []
      }
    ),
    false,
    "04.06.02"
  );
  t.deepEqual(
    compare(
      {
        a: []
      },
      {
        a: {}
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.03"
  );
  t.deepEqual(
    compare(
      {
        a: {}
      },
      {
        a: []
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.04"
  );
  t.deepEqual(
    compare(
      {
        a: {
          b: []
        },
        x: "y"
      },
      {
        a: {
          b: {}
        },
        x: "y"
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.05"
  );
  t.deepEqual(
    compare(
      {
        a: {
          b: {}
        },
        x: "y"
      },
      {
        a: {
          b: []
        },
        x: "y"
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.06.06"
  );
});

test("04.07 - empty arrays vs empty strings", t => {
  t.deepEqual(
    compare(
      {
        a: []
      },
      {
        a: ""
      }
    ),
    false,
    "04.07.01"
  );
  t.deepEqual(
    compare(
      {
        a: ""
      },
      {
        a: []
      }
    ),
    false,
    "04.07.02"
  );
  t.deepEqual(
    compare(
      {
        a: []
      },
      {
        a: ""
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.07.03"
  );
  t.deepEqual(
    compare(
      {
        a: ""
      },
      {
        a: []
      },
      { hungryForWhitespace: true }
    ),
    true,
    "04.07.04"
  );
});

test("04.08 - two arrays, matches middle, string within", t => {
  t.deepEqual(
    compare(["a", "b", "c", "d", "e"], ["b", "c", "d"]),
    true,
    "04.08.01"
  );
  t.deepEqual(
    compare(["b", "c", "d"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.01 opposite"
  );

  t.deepEqual(
    compare(["a", "b", "c", "d", "e"], ["b", "c", "e"]),
    true,
    "04.08.02"
  );
  t.deepEqual(
    compare(["b", "c", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.02 opposite"
  );

  t.deepEqual(
    compare(["a", "b", "c", "d", "e"], ["a", "b", "c"]),
    true,
    "04.08.03"
  );
  t.deepEqual(
    compare(["a", "b", "c"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.03 opposite"
  );

  t.deepEqual(
    compare(["a", "b", "c", "d", "e"], ["c", "d", "e"]),
    true,
    "04.08.04"
  );
  t.deepEqual(
    compare(["c", "d", "e"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.04 opposite"
  );

  t.deepEqual(compare(["a", "b", "c", "d", "e"], ["e"]), true, "04.08.05");
  t.deepEqual(
    compare(["e"], ["a", "b", "c", "d", "e"]),
    false,
    "04.08.05 opposite"
  );
});

test("04.09 - two arrays, matches middle, objects within", t => {
  t.deepEqual(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { d: "d" }]
    ),
    true,
    "04.09.01"
  );
  t.deepEqual(
    compare(
      [{ b: "b" }, { c: "c" }, { d: "d" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.01 opposite"
  );

  t.deepEqual(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ b: "b" }, { c: "c" }, { e: "e" }]
    ),
    true,
    "04.09.02"
  );
  t.deepEqual(
    compare(
      [{ b: "b" }, { c: "c" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.02 opposite"
  );

  t.deepEqual(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }]
    ),
    true,
    "04.09.03"
  );
  t.deepEqual(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.03 opposite"
  );

  t.deepEqual(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ c: "c" }, { d: "d" }, { e: "e" }]
    ),
    true,
    "04.09.04"
  );
  t.deepEqual(
    compare(
      [{ c: "c" }, { d: "d" }, { e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.04 opposite"
  );

  t.deepEqual(
    compare(
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }],
      [{ e: "e" }]
    ),
    true,
    "04.09.05"
  );
  t.deepEqual(
    compare(
      [{ e: "e" }],
      [{ a: "a" }, { b: "b" }, { c: "c" }, { d: "d" }, { e: "e" }]
    ),
    false,
    "04.09.05 opposite"
  );

  t.deepEqual(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" }
      ],
      [{ c1: "c1", c2: "c2" }, { d1: "d1", d2: "d2" }]
    ),
    true,
    "04.09.06"
  );
  t.deepEqual(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" }
      ],
      [{ c2: "c2", c1: "c1" }, { d2: "d2", d1: "d1" }]
    ),
    true,
    "04.09.07"
  );
  t.deepEqual(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d2: "d2" },
        { e: "e" }
      ],
      [{ c2: "c2", c1: "c1" }, { d2: "d2", d1: "d1" }]
    ),
    false,
    "04.09.08"
  );
  t.deepEqual(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" }
      ],
      [{ c1: "c1" }, { d2: "d2" }]
    ),
    true,
    "04.09.09"
  );
  t.deepEqual(
    compare(
      [
        { a: "a" },
        { b: "b" },
        { c1: "c1", c2: "c2" },
        { d1: "d1", d2: "d2" },
        { e: "e" }
      ],
      [{ d2: "d2" }, { c1: "c1" }]
    ),
    false,
    "04.09.10"
  );
});

test("04.10 - two arrays, one empty, string within", t => {
  t.deepEqual(compare(["a", "b", "c"], []), false, "04.10.01");
  t.not(
    compare(["a", "b", "c"], [], { verboseWhenMismatches: true }),
    true,
    "04.10.02"
  );
  t.deepEqual(
    compare(["a", "b", "c"], [], { hungryForWhitespace: true }),
    true,
    "04.10.03"
  );
});

// =======
// Strings
// =======

test("05.01 - simple strings", t => {
  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: false
    }),
    true,
    "05.01.01"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: false
    }),
    false,
    "05.01.02"
  );

  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: true
    }),
    true,
    "05.01.03"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: true
    }),
    false,
    "05.01.04"
  );

  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: false
    }),
    true,
    "05.01.05"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: false
    }),
    false,
    "05.01.06"
  );

  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: true
    }),
    true,
    "05.01.07"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: true
    }),
    false,
    "05.01.08"
  );
});

test("05.02 - strings compared and fails", t => {
  t.deepEqual(compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "05.02.01");
  t.not(
    compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"], { verboseWhenMismatches: true }),
    true,
    "05.02.02"
  );
});

test("05.03 - strings in arrays compared, positive", t => {
  t.deepEqual(compare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "05.03");
});

test("05.04 - string against empty array or empty string within an array", t => {
  t.deepEqual(compare(["aaaaa\nbbbbb"], []), false, "05.04.01");
  t.deepEqual(
    compare(["aaaaa\nbbbbb"], [], { hungryForWhitespace: true }),
    true,
    "05.04.02"
  );
  t.deepEqual(
    compare(["aaaaa\nbbbbb"], ["\n\n\n"], { hungryForWhitespace: true }),
    true,
    "05.04.03"
  );
  t.deepEqual(
    compare(["aaaaa\nbbbbb", "\t\t\t \n\n\n", "   "], ["\n\n\n"], {
      hungryForWhitespace: true
    }),
    true,
    "05.04.04"
  );
});

test("05.05 - string vs empty space", t => {
  t.deepEqual(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false
    }),
    false,
    "05.05.01"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true
    }),
    false,
    "05.05.02"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false
    }),
    false,
    "05.05.03"
  );
  t.deepEqual(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true
    }),
    false,
    "05.05.04"
  );
});

test("05.06 - empty space vs different empty space", t => {
  t.deepEqual(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false
    }),
    false,
    "05.06.01"
  );
  t.deepEqual(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true
    }),
    true,
    "05.06.02"
  );
  t.deepEqual(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false
    }),
    false,
    "05.06.03"
  );
  t.deepEqual(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true
    }),
    true,
    "05.06.04"
  );
});

test("05.07 - two arrays, one empty", t => {
  t.deepEqual(
    compare(["\t\t\t\t\t\t      \n\n\n    \t\t\t"], []),
    false,
    "05.07.01 - in root, defaults"
  );
  t.deepEqual(
    compare(
      { a: ["\t\t\t\t\t\t      \n\n\n    \t\t\t"] },
      { a: [] },
      { hungryForWhitespace: true }
    ),
    true,
    "05.07.02 - in root, defaults"
  );
  t.deepEqual(
    compare([], ["\t\t\t\t\t\t      \n\n\n    \t\t\t"], {
      hungryForWhitespace: true
    }),
    true,
    "05.07.03 - in root, defaults, opposite from #2"
  );
});

test("05.08 - opts.matchStrictly", t => {
  t.deepEqual(
    compare(
      { a: "a" },
      {},
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    false,
    "05.08.01 - key count mismatch"
  );
  t.deepEqual(
    typeof compare(
      {},
      { a: "a" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    "string",
    "05.08.01 - key count mismatch"
  );
});

// ======
// Random
// ======

test("06.01 - null vs null", t => {
  t.deepEqual(compare(null, null), true, "06.01.01");
});

test("06.02 - real-life #1", t => {
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: [".w2"]
      },
      {
        type: "rule",
        selectors: []
      }
    ),
    false,
    "06.02.01"
  );
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: [".w2"]
      },
      {
        type: "rule",
        selectors: []
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.02.02"
  );
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: [".w2"]
      },
      {
        type: "rule",
        selectors: ["\n\n\n     \t\t\t   \n\n\n"]
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.02.03"
  );
});

test("06.03 - real-life #2", t => {
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: []
      },
      {
        type: "rule",
        selectors: []
      }
    ),
    true,
    "06.03.01"
  );
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: []
      },
      {
        type: "rule",
        selectors: []
      },
      {
        hungryForWhitespace: false
      }
    ),
    true,
    "06.03.02"
  );
});

test("06.05 - function as input", t => {
  t.throws(() => {
    compare(f, f);
  });
});

test("06.06 - sneaky function within object literal", t => {
  t.throws(() => {
    compare({ a: f }, { a: f2 });
  });
});

test("06.07 - another sneaky function within object literal", t => {
  t.throws(() => {
    compare({ a: f2 }, { a: f2 });
  });
});

test("06.08 - real-life #3", t => {
  t.deepEqual(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: []
        }
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
                              column: 80
                            },
                            end: {
                              line: 1,
                              column: 106
                            }
                          }
                        }
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61
                        },
                        end: {
                          line: 1,
                          column: 108
                        }
                      }
                    }
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30
                    },
                    end: {
                      line: 1,
                      column: 111
                    }
                  }
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
                              column: 163
                            },
                            end: {
                              line: 1,
                              column: 189
                            }
                          }
                        }
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144
                        },
                        end: {
                          line: 1,
                          column: 191
                        }
                      }
                    }
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113
                    },
                    end: {
                      line: 1,
                      column: 194
                    }
                  }
                }
              ],
              position: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 195
                }
              }
            }
          ],
          parsingErrors: []
        }
      }
    ),
    false,
    "06.08.01"
  );
  t.deepEqual(
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
                              column: 80
                            },
                            end: {
                              line: 1,
                              column: 106
                            }
                          }
                        }
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61
                        },
                        end: {
                          line: 1,
                          column: 108
                        }
                      }
                    }
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30
                    },
                    end: {
                      line: 1,
                      column: 111
                    }
                  }
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
                              column: 163
                            },
                            end: {
                              line: 1,
                              column: 189
                            }
                          }
                        }
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144
                        },
                        end: {
                          line: 1,
                          column: 191
                        }
                      }
                    }
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113
                    },
                    end: {
                      line: 1,
                      column: 194
                    }
                  }
                }
              ],
              position: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 195
                }
              }
            }
          ],
          parsingErrors: []
        }
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: []
        }
      },
      { hungryForWhitespace: false }
    ),
    false,
    "06.08.02"
  );
  t.deepEqual(
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
                              column: 80
                            },
                            end: {
                              line: 1,
                              column: 106
                            }
                          }
                        }
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61
                        },
                        end: {
                          line: 1,
                          column: 108
                        }
                      }
                    }
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30
                    },
                    end: {
                      line: 1,
                      column: 111
                    }
                  }
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
                              column: 163
                            },
                            end: {
                              line: 1,
                              column: 189
                            }
                          }
                        }
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144
                        },
                        end: {
                          line: 1,
                          column: 191
                        }
                      }
                    }
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113
                    },
                    end: {
                      line: 1,
                      column: 194
                    }
                  }
                }
              ],
              position: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 195
                }
              }
            }
          ],
          parsingErrors: []
        }
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: []
        }
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.08.03"
  );
});

test("06.09 - real-life #3 reduced case", t => {
  t.deepEqual(
    compare(
      {
        a: "a",
        b: {
          c: [],
          d: []
        }
      },
      {
        a: "a",
        b: {
          c: [
            {
              e: "e"
            }
          ],
          d: []
        }
      }
    ),
    false,
    "06.09.01"
  );
  t.deepEqual(
    compare(
      {
        a: "a",
        b: {
          c: [
            {
              e: "e"
            }
          ],
          d: []
        }
      },
      {
        a: "a",
        b: {
          c: [],
          d: []
        }
      }
    ),
    false,
    "06.09.02"
  );
  t.deepEqual(
    compare(
      {
        a: "a",
        b: {
          c: [],
          d: []
        }
      },
      {
        a: "a",
        b: {
          c: [
            {
              e: "e"
            }
          ],
          d: []
        }
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.09.03"
  );
  t.deepEqual(
    compare(
      {
        a: "a",
        b: {
          c: [
            {
              e: "e"
            }
          ],
          d: []
        }
      },
      {
        a: "a",
        b: {
          c: [],
          d: []
        }
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.09.04"
  );
});

test("06.10 - input args of mismatching type - easy win", t => {
  t.deepEqual(
    compare(
      {
        a: "a"
      },
      "a"
    ),
    false,
    "06.10.01"
  );
  t.deepEqual(
    compare("a", {
      a: "a"
    }),
    false,
    "06.10.02"
  );
  t.deepEqual(
    compare(
      {
        a: "a"
      },
      ["a"]
    ),
    false,
    "06.10.03"
  );
  t.deepEqual(
    compare(["a"], {
      a: "a"
    }),
    false,
    "06.10.04"
  );
  t.deepEqual(
    compare(
      {
        a: "a"
      },
      "a",
      { hungryForWhitespace: true }
    ),
    false,
    "06.10.05"
  );
  t.deepEqual(
    compare(
      "a",
      {
        a: "a"
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.10.06"
  );
  t.deepEqual(
    compare(
      {
        a: "a"
      },
      ["a"],
      { hungryForWhitespace: true }
    ),
    false,
    "06.10.07"
  );
  t.deepEqual(
    compare(
      ["a"],
      {
        a: "a"
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.10.08"
  );
});

// =======================
// Still works overloading
// =======================

test("07.01 - fourth argument doesn't break anything", t => {
  t.deepEqual(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, true),
    false,
    "07.01.01"
  );
  t.deepEqual(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, false),
    false,
    "07.01.02"
  );
});

// ===============
// Just Loose Mode
// ===============

test("08.01 - hungryForWhitespace, empty strings within arrays", t => {
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"]
      },
      {
        type: "rule",
        selectors: []
      }
    ),
    false,
    "08.01.01"
  );
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"]
      },
      {
        type: "rule",
        selectors: []
      },
      {
        hungryForWhitespace: true
      }
    ),
    true,
    "08.01.02"
  );
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: []
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"]
      }
    ),
    false,
    "08.01.03"
  );
  t.deepEqual(
    compare(
      {
        type: "rule",
        selectors: []
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"]
      },
      {
        hungryForWhitespace: true
      }
    ),
    true,
    "08.01.04"
  );
});

// =================
// Wildcard matching
// =================

test("09.01 - wildcards against values within object", t => {
  t.deepEqual(
    compare({ a: "1", b: "2a", c: "3" }, { a: "1", b: "2*" }),
    false,
    "09.01.01 - default"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: false }
    ),
    false,
    "09.01.02 - hardcoded default"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: true }
    ),
    true,
    "09.01.03 - wildcards enabled"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    true,
    "09.01.04 - with letters and wildcards"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    false,
    "09.01.05 - won't match because it's now case-sensitive in wildcards too"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "Z*" },
      { useWildcards: true }
    ),
    true,
    "09.01.06 - won't match because it's now case-sensitive in wildcards too"
  );

  t.deepEqual(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: true }
    ),
    false,
    "09.01.07 - weird"
  );
  t.deepEqual(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: false }
    ),
    false,
    "09.01.08 - weird, false anyway"
  );
});

test("09.02 - wildcards against keys within object", t => {
  t.deepEqual(
    compare({ az: "1", bz: "2a", cz: "3" }, { "a*": "1", "b*": "2*" }),
    false,
    "09.02.01 - default"
  );
  t.deepEqual(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "a*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    true,
    "09.02.02 - wildcards on"
  );
  t.deepEqual(
    compare({ az: "1", bz: "2a", cz: "3" }, { "x*": "1", "b*": "2*" }),
    false,
    "09.02.03 - won't find, despite wildcards, which are turned off"
  );
  t.deepEqual(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "x*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    false,
    "09.02.04 - won't find, despite wildcards, which are turned on"
  );
});

test("09.03 - wildcards in deeper levels", t => {
  t.deepEqual(
    compare(
      {
        a: [
          {
            b: "horn"
          }
        ]
      },
      {
        a: [
          {
            b: "*orn"
          }
        ]
      },
      { useWildcards: false }
    ),
    false,
    "09.03.01 - default (control), wildcards are turned off"
  );
  t.deepEqual(
    compare(
      {
        a: [
          {
            b: "horn"
          }
        ]
      },
      {
        a: [
          {
            b: "*orn"
          }
        ]
      },
      { useWildcards: true }
    ),
    true,
    "09.03.02 - default (control), wildcards are turned off"
  );
});

test("09.04 - wildcards in deeper levels within arrays", t => {
  t.deepEqual(
    compare(
      {
        a: [
          {
            z: "zzz"
          },
          {
            b: "horn"
          }
        ]
      },
      {
        a: [
          {
            b: "*orn"
          }
        ]
      },
      { useWildcards: false }
    ),
    false,
    "09.04.01"
  );
  t.deepEqual(
    compare(
      {
        a: [
          {
            z: "zzz"
          },
          {
            b: "horn"
          }
        ]
      },
      {
        a: [
          {
            b: "*orn"
          }
        ]
      },
      { useWildcards: true }
    ),
    true,
    "09.04.02"
  );
  t.deepEqual(
    compare(
      {
        a: [
          {
            z: "zzz"
          },
          {
            b: "horn"
          }
        ]
      },
      {
        a: [
          {
            b: "ccc"
          }
        ]
      },
      { useWildcards: true }
    ),
    false,
    "09.04.03"
  );
  t.deepEqual(
    compare(
      {
        a: [
          {
            z: "zzz"
          },
          {
            b: "ccc" // <---- !
          }
        ]
      },
      {
        a: [
          {
            "*": "ccc"
          }
        ]
      },
      { useWildcards: false }
    ),
    false,
    "09.04.04"
  );
  t.deepEqual(
    compare(
      {
        a: [
          {
            z: "zzz"
          },
          {
            b: "yyy" // <---- !
          }
        ]
      },
      {
        a: [
          {
            "*": "ccc"
          }
        ]
      },
      { useWildcards: true }
    ),
    true,
    "09.04.05"
  );
});

// ==============
// UTIL
// ==============

test("99.01 - UTIL - isBlank()", t => {
  t.deepEqual(isBlank([]), true, "99.01.01");
  t.deepEqual(isBlank([""]), false, "99.01.02");
  t.deepEqual(isBlank(["a"]), false, "99.01.03");
  t.deepEqual(isBlank({}), true, "99.01.04");
  t.deepEqual(isBlank({ a: "" }), false, "99.01.05");
  t.deepEqual(isBlank(""), true, "99.01.06");
  t.deepEqual(isBlank(null), false, "99.01.07");
  t.deepEqual(isBlank(1), false, "99.01.08");
});

test("99.02 - UTIL - existy()", t => {
  t.deepEqual(existy(), false, "99.02.01");
  t.deepEqual(existy(1), true, "99.02.02");
  t.deepEqual(existy(null), false, "99.02.03");
  t.deepEqual(existy(undefined), false, "99.02.04");
});

test("99.03 - UTIL - isObj()", t => {
  t.deepEqual(isObj(), false, "99.03.01");
  t.deepEqual(isObj(1), false, "99.03.02");
  t.deepEqual(isObj("1"), false, "99.03.03");
  t.deepEqual(isObj({ a: "1" }), true, "99.03.04");
});

test("99.03 - UTIL - isStr()", t => {
  t.deepEqual(isStr(), false, "99.03.01");
  t.deepEqual(isStr(1), false, "99.03.02");
  t.deepEqual(isStr(null), false, "99.03.03");
  t.deepEqual(isStr("null"), true, "99.03.04");
});

test("99.04 - UTIL - isNum()", t => {
  t.deepEqual(isNum(), false, "99.04.01");
  t.deepEqual(isNum(1), true, "99.04.02");
  t.deepEqual(isNum("1"), false, "99.04.03");
  t.deepEqual(isNum(true), false, "99.04.04");
});

test("99.05 - UTIL - isBool()", t => {
  t.deepEqual(isBool(), false, "99.05.01");
  t.deepEqual(isBool(1), false, "99.05.02");
  t.deepEqual(isBool("z"), false, "99.05.03");
  t.deepEqual(isBool(null), false, "99.05.04");
  t.deepEqual(isBool(true), true, "99.05.05");
});

test("99.06 - UTIL - isNull()", t => {
  t.deepEqual(isNull(), false, "99.06.01");
  t.deepEqual(isNull(1), false, "99.06.02");
  t.deepEqual(isNull("a"), false, "99.06.03");
  t.deepEqual(isNull(true), false, "99.06.04");
  t.deepEqual(isNull(null), true, "99.06.05");
});

test("99.07 - UTIL - isTheTypeLegit()", t => {
  t.deepEqual(isTheTypeLegit("a"), true, "99.07.01");
  const z = function y() {
    return "a";
  };
  t.deepEqual(isTheTypeLegit(z), false, "99.07.02");
});
