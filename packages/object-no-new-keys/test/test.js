const t = require("tap");
const nnk = require("../dist/object-no-new-keys.cjs");

// ==========
// 01. B.A.U.
// ==========

t.test("01.01 - first level keys", (t) => {
  t.same(
    nnk(
      {
        a: "a",
        b: "b",
        c: "c",
      },
      {
        c: "z",
      }
    ),
    ["a", "b"],
    "01.01"
  );
  t.end();
});

t.test("01.02 - two level object", (t) => {
  t.same(
    nnk(
      {
        a: {
          b: "b",
          c: "c",
        },
        x: "y",
      },
      {
        a: {
          c: "z",
        },
      }
    ),
    ["a.b", "x"],
    "01.02"
  );
  t.end();
});

t.test("01.03 - object does not even exist on a reference", (t) => {
  t.same(
    nnk(
      {
        a: {
          b: "b",
          c: "c",
        },
        x: "y",
      },
      {
        a: "z",
      }
    ),
    ["a.b", "a.c", "x"],
    "01.03"
  );
  t.end();
});

t.test("01.04 - same as 01.03 but deeper levels", (t) => {
  t.same(
    nnk(
      {
        a: {
          b: {
            c: {
              d: "d",
              e: "e",
            },
          },
        },
      },
      {
        a: {
          b: {
            c: "c",
          },
        },
      }
    ),
    ["a.b.c.d", "a.b.c.e"],
    "01.04"
  );
  t.end();
});

// ====================
// 02. Involving arrays
// ====================

t.test("02.01 - objects within arrays", (t) => {
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
          },
        ],
      },
      {
        a: [
          {
            b: "bbb",
          },
        ],
      }
    ),
    ["a[0].d"],
    "02.01.01 - basic"
  );
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
          {
            b: "yyy",
            c: "zzz",
          },
        ],
      }
    ),
    ["a[0].d", "a[0].f", "a[1].k", "x"],
    "02.01.02 - proper"
  );
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
        ],
      }
    ),
    ["a[0].d", "a[0].f", "a[1].k", "x"],
    "02.01.03 - array in the reference has lesser number of elements (default, MODE #2)"
  );
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
        ],
      },
      { mode: 1 }
    ),
    ["a[0].d", "a[0].f", "a[1].c", "a[1].k", "x"],
    "02.01.04 - MODE #1 - array in the reference has lesser number of elements"
  );
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
        ],
      },
      { mode: "1" }
    ),
    ["a[0].d", "a[0].f", "a[1].c", "a[1].k", "x"],
    "02.01.05 - same as #4, but with mode identifier as string"
  );
  t.end();
});

t.test("02.02 - other cases", (t) => {
  t.same(
    nnk(
      [
        {
          b: "aaa",
          d: "aaa",
        },
      ],
      "a"
    ),
    ["[0]"],
    "02.02.01"
  );
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
          },
        ],
      },
      { a: "a" }
    ),
    ["a[0]"],
    "02.02.02"
  );
  t.same(
    nnk(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
          },
        ],
      },
      { a: ["a"] }
    ),
    ["a[0].b", "a[0].d"],
    "02.02.03"
  );
  t.end();
});

// ========================================
// 03. Different type inputs, strange cases
// ========================================

t.test("03.01 - array vs ..., can be inner recursion situation", (t) => {
  t.same(
    nnk(["a", "b", "c"]),
    ["[0]", "[1]", "[2]"],
    "03.01.01 - array vs undefined"
  );
  t.same(
    nnk(["a", "b", "c"], "zzz"),
    ["[0]", "[1]", "[2]"],
    "03.01.02 - array vs string"
  );
  t.same(
    nnk(["a", "b", "c"], { z: "zzz" }),
    ["[0]", "[1]", "[2]"],
    "03.01.03 - array vs plain object"
  );
  t.same(
    nnk(
      [
        {
          b: "aaa",
          d: "aaa",
        },
      ],
      ["a"]
    ),
    ["[0].b", "[0].d"],
    "02.02.04"
  );
  t.end();
});

t.test("03.02 - plain object vs ..., can be inner recursion situation", (t) => {
  t.same(
    nnk({
      a: "a",
      b: "b",
      c: "c",
    }),
    ["a", "b", "c"],
    "03.02.01 - object vs undefined"
  );
  t.same(
    nnk(
      {
        a: "a",
        b: "b",
        c: "c",
      },
      ["a"]
    ),
    ["a", "b", "c"],
    "03.02.02 - object vs array"
  );
  t.end();
});

t.test(
  "03.03 - more complex plain object vs undefined (deeper levels won't be traversed if parents are not matching)",
  (t) => {
    t.same(
      nnk({
        a: "a",
        b: ["b"],
        c: {
          d: "d",
        },
      }),
      ["a", "b", "c"]
    );
    t.end();
  }
);

t.test("03.04 - more complex plain object vs empty object", (t) => {
  t.same(
    nnk(
      {
        a: "a",
        b: ["b"],
        c: {
          d: "d",
        },
      },
      {}
    ),
    ["a", "b", "c"]
  );
  t.end();
});

t.test("03.05 - string vs string", (t) => {
  t.same(nnk("a", "b"), []);
  t.end();
});

// ==========
// 04. Throws
// ==========

t.test("04.01 - mode.opts customised to a wrong type - throws", (t) => {
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, { mode: "z" });
  }, /THROW_ID_01/);
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, { mode: 1.5 });
  }, /THROW_ID_01/);
  t.end();
});

t.test("04.02 - mode is given as integer - throws", (t) => {
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, 1);
  }, /THROW_ID_02/);
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, 2);
  }, /THROW_ID_02/);
  t.throws(() => {
    nnk({ a: "a" }, { b: "b" }, 2.5);
  }, /THROW_ID_02/);
  t.end();
});
