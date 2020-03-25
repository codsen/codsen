const t = require("tap");
const flattenAllArrays = require("../dist/object-flatten-all-arrays.cjs");

// ==========
// Normal use
// ==========

t.test("01.01 - simple plain object, one array", (t) => {
  t.same(
    flattenAllArrays({
      d: "d",
      b: "b",
      a: "a",
      c: [
        {
          b: "b",
          a: "a",
        },
        {
          d: "d",
          c: "c",
        },
      ],
    }),
    {
      a: "a",
      b: "b",
      c: [
        {
          a: "a",
          b: "b",
          c: "c",
          d: "d",
        },
      ],
      d: "d",
    },
    "01.01"
  );
  t.end();
});

t.test("01.02 - simple plain object, two arrays", (t) => {
  t.same(
    flattenAllArrays({
      d: "d",
      b: [
        {
          b: "b",
        },
        {
          a: "a",
        },
        {
          c: "c",
        },
      ],
      a: "a",
      c: [
        {
          d: "d",
          c: "c",
        },
        {
          b: "b",
          a: "a",
        },
      ],
    }),
    {
      d: "d",
      b: [
        {
          a: "a",
          b: "b",
          c: "c",
        },
      ],
      a: "a",
      c: [
        {
          a: "a",
          b: "b",
          c: "c",
          d: "d",
        },
      ],
    },
    "01.02"
  );
  t.end();
});

t.test("01.03 - nested simple plain object, one array", (t) => {
  t.same(
    flattenAllArrays([
      {
        d: "d",
        b: "b",
        a: "a",
        c: [
          {
            b: "b",
            a: "a",
          },
          {
            d: "d",
            c: "c",
          },
        ],
      },
    ]),
    [
      {
        a: "a",
        b: "b",
        c: [
          {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
          },
        ],
        d: "d",
      },
    ],
    "01.03"
  );
  t.end();
});

t.test("01.04 - nested objects", (t) => {
  t.same(
    flattenAllArrays([
      "z1",
      {
        b: "b",
        a: "a",
      },
      {
        d: "d",
        c: "c",
      },
      "z2",
    ]),
    [
      "z1",
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      "z2",
    ],
    "01.04"
  );
  t.end();
});

t.test("01.05 - multiple nested arrays", (t) => {
  t.same(
    flattenAllArrays([
      [
        [
          [
            [
              [
                [
                  [
                    {
                      d: "d",
                      b: "b",
                      a: "a",
                      c: [
                        {
                          b: "b",
                          a: "a",
                        },
                        {
                          d: "d",
                          c: "c",
                        },
                      ],
                    },
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    ]),
    [
      [
        [
          [
            [
              [
                [
                  [
                    {
                      a: "a",
                      b: "b",
                      c: [
                        {
                          a: "a",
                          b: "b",
                          c: "c",
                          d: "d",
                        },
                      ],
                      d: "d",
                    },
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    ],
    "01.05"
  );
  t.end();
});

t.test("01.06 - array contents are not of the same type", (t) => {
  t.same(
    flattenAllArrays({
      d: "d",
      b: "b",
      a: "a",
      c: [
        {
          b: "b",
          a: "a",
        },
        {
          d: "d",
          c: "c",
        },
        "z",
      ],
    }),
    {
      d: "d",
      b: "b",
      a: "a",
      c: [
        {
          a: "a",
          b: "b",
          c: "c",
          d: "d",
        },
        "z",
      ],
    },
    "01.06.01 - default"
  );
  t.same(
    flattenAllArrays(
      {
        d: "d",
        b: "b",
        a: "a",
        c: [
          {
            b: "b",
            a: "a",
          },
          {
            d: "d",
            c: "c",
          },
          "z",
        ],
      },
      {
        flattenArraysContainingStringsToBeEmpty: true,
      }
    ),
    {
      d: "d",
      b: "b",
      a: "a",
      c: [],
    },
    "01.06.02 - opts.flattenArraysContainingStringsToBeEmpty"
  );
  t.end();
});

t.test("01.07 - multiple types in an array #1", (t) => {
  t.same(
    flattenAllArrays({
      d: "d",
      b: "b",
      a: "a",
      c: [
        [
          "y",
          {
            z: "z",
          },
          {
            x: "x",
          },
        ],
        {
          b: "b",
          a: "a",
        },
        {
          d: "d",
          c: "c",
        },
        "z",
      ],
    }),
    {
      a: "a",
      b: "b",
      c: [
        [
          "y",
          {
            x: "x",
            z: "z",
          },
        ],
        {
          a: "a",
          b: "b",
          c: "c",
          d: "d",
        },
        "z",
      ],
      d: "d",
    },
    "01.07"
  );
  t.end();
});

t.test("01.08 - multiple types in an array #2", (t) => {
  t.same(
    flattenAllArrays({
      b: [
        {
          e: [
            {
              f: "fff",
            },
            {
              g: "ggg",
            },
          ],
          d: "ddd",
          c: "ccc",
        },
      ],
      a: "aaa",
    }),
    {
      b: [
        {
          e: [
            {
              f: "fff",
              g: "ggg",
            },
          ],
          d: "ddd",
          c: "ccc",
        },
      ],
      a: "aaa",
    },
    "01.08"
  );
  t.end();
});

t.test("01.09 - simple array, two ojects", (t) => {
  t.same(
    flattenAllArrays([
      {
        a: "a",
      },
      {
        b: "b",
      },
    ]),
    [
      {
        a: "a",
        b: "b",
      },
    ],
    "01.09"
  );
  t.end();
});

t.test("01.10 - simple array, two nested ojects", (t) => {
  t.same(
    flattenAllArrays([
      {
        a: ["a"],
      },
      {
        b: { b: "b" },
      },
    ]),
    [
      {
        a: ["a"],
        b: { b: "b" },
      },
    ],
    "01.10"
  );
  t.end();
});

t.test("01.11 - array, mix of ojects, arrays and strings", (t) => {
  t.same(
    flattenAllArrays([
      "zzz",
      {
        a: ["a"],
      },
      {
        b: { b: "b" },
      },
      ["yyy"],
    ]),
    [
      "zzz",
      {
        a: ["a"],
        b: { b: "b" },
      },
      ["yyy"],
    ],
    "01.11.01 - default"
  );
  t.same(
    flattenAllArrays(
      [
        "zzz",
        {
          a: ["a"],
        },
        {
          b: { b: "b" },
        },
        ["yyy"],
      ],
      {
        flattenArraysContainingStringsToBeEmpty: true,
      }
    ),
    [],
    "01.11.02 - opts"
  );
  t.end();
});

t.test("01.12 - arrays within objects, strings as elements", (t) => {
  t.same(
    flattenAllArrays({
      a: {
        b: ["c", "d"],
      },
    }),
    {
      a: {
        b: ["c", "d"],
      },
    },
    "01.12.01 - default"
  );
  t.same(
    flattenAllArrays(
      {
        a: {
          b: ["c", "d"],
        },
      },
      {
        flattenArraysContainingStringsToBeEmpty: true,
      }
    ),
    {
      a: {
        b: [],
      },
    },
    "01.12.02 - opts"
  );
  t.end();
});

// ==========
// Edge cases
// ==========

t.test("02.01 - empty object as input", (t) => {
  t.same(flattenAllArrays({}), {}, "02.01");
  t.end();
});

t.test("02.02 - empty array as input", (t) => {
  t.same(flattenAllArrays([]), [], "02.02");
  t.end();
});

t.test("02.03 - empty string as input", (t) => {
  t.same(flattenAllArrays(""), "", "02.03");
  t.end();
});

t.test("02.04 - null as input", (t) => {
  t.same(flattenAllArrays(null), null, "02.04");
  t.end();
});

t.test("02.05 - undefined as input", (t) => {
  t.same(flattenAllArrays(undefined), undefined, "02.05");
  t.end();
});

t.test("02.06 - nothing in the input", (t) => {
  t.same(flattenAllArrays(), undefined, "02.06");
  t.end();
});

// ==========================
// Does not mutate input args
// ==========================

t.test("03.01 - does not mutate input args", (t) => {
  const obj = {
    d: "d",
    b: "b",
    a: "a",
    c: [
      {
        b: "b",
        a: "a",
      },
      {
        d: "d",
        c: "c",
      },
    ],
  };
  const unneededResult = flattenAllArrays(obj);
  t.pass(unneededResult);
  t.same(
    obj,
    {
      d: "d",
      b: "b",
      a: "a",
      c: [
        {
          b: "b",
          a: "a",
        },
        {
          d: "d",
          c: "c",
        },
      ],
    },
    "03.01"
  );
  t.end();
});
