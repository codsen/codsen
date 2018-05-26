import test from "ava";
import nnk from "../dist/object-no-new-keys.esm";

// ==========
// 01. B.A.U.
// ==========

test("01.01 - first level keys", t => {
  t.deepEqual(
    nnk(
      {
        a: "a",
        b: "b",
        c: "c"
      },
      {
        c: "z"
      }
    ),
    ["a", "b"],
    "01.01"
  );
});

test("01.02 - two level object", t => {
  t.deepEqual(
    nnk(
      {
        a: {
          b: "b",
          c: "c"
        },
        x: "y"
      },
      {
        a: {
          c: "z"
        }
      }
    ),
    ["a.b", "x"],
    "01.02"
  );
});

test("01.03 - object does not even exist on a reference", t => {
  t.deepEqual(
    nnk(
      {
        a: {
          b: "b",
          c: "c"
        },
        x: "y"
      },
      {
        a: "z"
      }
    ),
    ["a.b", "a.c", "x"],
    "01.03"
  );
});

test("01.04 - same as 01.03 but deeper levels", t => {
  t.deepEqual(
    nnk(
      {
        a: {
          b: {
            c: {
              d: "d",
              e: "e"
            }
          }
        }
      },
      {
        a: {
          b: {
            c: "c"
          }
        }
      }
    ),
    ["a.b.c.d", "a.b.c.e"],
    "01.04"
  );
});

// ====================
// 02. Involving arrays
// ====================

test("02.01 - objects within arrays", t => {
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa"
          }
        ]
      },
      {
        a: [
          {
            b: "bbb"
          }
        ]
      }
    ),
    ["a[0].d"],
    "02.01.01 - basic"
  );
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff"
          },
          {
            c: "aaa",
            k: "kkk"
          }
        ],
        x: "x"
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc"
          },
          {
            b: "yyy",
            c: "zzz"
          }
        ]
      }
    ),
    ["a[0].d", "a[0].f", "a[1].k", "x"],
    "02.01.02 - proper"
  );
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff"
          },
          {
            c: "aaa",
            k: "kkk"
          }
        ],
        x: "x"
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc"
          }
        ]
      }
    ),
    ["a[0].d", "a[0].f", "a[1].k", "x"],
    "02.01.03 - array in the reference has lesser number of elements (default, MODE #2)"
  );
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff"
          },
          {
            c: "aaa",
            k: "kkk"
          }
        ],
        x: "x"
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc"
          }
        ]
      },
      { mode: 1 }
    ),
    ["a[0].d", "a[0].f", "a[1].c", "a[1].k", "x"],
    "02.01.04 - MODE #1 - array in the reference has lesser number of elements"
  );
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff"
          },
          {
            c: "aaa",
            k: "kkk"
          }
        ],
        x: "x"
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc"
          }
        ]
      },
      { mode: "1" }
    ),
    ["a[0].d", "a[0].f", "a[1].c", "a[1].k", "x"],
    "02.01.05 - same as #4, but with mode identifier as string"
  );
});

test("02.02 - other cases", t => {
  t.deepEqual(
    nnk(
      [
        {
          b: "aaa",
          d: "aaa"
        }
      ],
      "a"
    ),
    ["[0]"],
    "02.02.01"
  );
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa"
          }
        ]
      },
      { a: "a" }
    ),
    ["a[0]"],
    "02.02.02"
  );
  t.deepEqual(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa"
          }
        ]
      },
      { a: ["a"] }
    ),
    ["a[0].b", "a[0].d"],
    "02.02.03"
  );
});

// ========================================
// 03. Different type inputs, strange cases
// ========================================

test("03.01 - array vs ..., can be inner recursion situation", t => {
  t.deepEqual(
    nnk(["a", "b", "c"]),
    ["[0]", "[1]", "[2]"],
    "03.01.01 - array vs undefined"
  );
  t.deepEqual(
    nnk(["a", "b", "c"], "zzz"),
    ["[0]", "[1]", "[2]"],
    "03.01.02 - array vs string"
  );
  t.deepEqual(
    nnk(["a", "b", "c"], { z: "zzz" }),
    ["[0]", "[1]", "[2]"],
    "03.01.03 - array vs plain object"
  );
  t.deepEqual(
    nnk(
      [
        {
          b: "aaa",
          d: "aaa"
        }
      ],
      ["a"]
    ),
    ["[0].b", "[0].d"],
    "02.02.04"
  );
});

test("03.02 - plain object vs ..., can be inner recursion situation", t => {
  t.deepEqual(
    nnk({
      a: "a",
      b: "b",
      c: "c"
    }),
    ["a", "b", "c"],
    "03.02.01 - object vs undefined"
  );
  t.deepEqual(
    nnk(
      {
        a: "a",
        b: "b",
        c: "c"
      },
      ["a"]
    ),
    ["a", "b", "c"],
    "03.02.02 - object vs array"
  );
});

test("03.03 - more complex plain object vs ...", t => {
  t.deepEqual(
    nnk({
      a: "a",
      b: ["b"],
      c: {
        d: "d"
      }
    }),
    ["a", "b", "c"],
    "03.03.01 - vs undefined (deeper levels won't be traversed if parents are not matching)"
  );
  t.deepEqual(
    nnk(
      {
        a: "a",
        b: ["b"],
        c: {
          d: "d"
        }
      },
      {}
    ),
    ["a", "b", "c"],
    "03.03.02 - vs empty object"
  );
});

test("03.04 - more complex plain object vs ...", t => {
  t.deepEqual(nnk("a", "b"), [], "03.04");
});

// ==========
// 04. Throws
// ==========

test("04.01 - mode.opts customised to a wrong type - throws", t => {
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, { mode: "z" });
  });
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, { mode: 1.5 });
  });
});

test("04.02 - mode is given as integer - throws", t => {
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, 1);
  });
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, 2);
  });
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, 2.5);
  });
});

test("04.03 - check-types-mini will throw if rogue options key is given", t => {
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, { aaa: 1 });
  });
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, { aaa: 1, mode: 1 });
  });
  t.notThrows(() => {
    nnk({ a: "a" }, { b: "b" }, { mode: 1 });
  });
});
