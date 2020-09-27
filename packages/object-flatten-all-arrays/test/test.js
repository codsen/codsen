import tap from "tap";
import flattenAllArrays from "../dist/object-flatten-all-arrays.esm";

// ==========
// Normal use
// ==========

tap.test("01 - simple plain object, one array", (t) => {
  t.strictSame(
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
    "01"
  );
  t.end();
});

tap.test("02 - simple plain object, two arrays", (t) => {
  t.strictSame(
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
    "02"
  );
  t.end();
});

tap.test("03 - nested simple plain object, one array", (t) => {
  t.strictSame(
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
    "03"
  );
  t.end();
});

tap.test("04 - nested objects", (t) => {
  t.strictSame(
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
    "04"
  );
  t.end();
});

tap.test("05 - multiple nested arrays", (t) => {
  t.strictSame(
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
    "05"
  );
  t.end();
});

tap.test("06 - array contents are not of the same type", (t) => {
  t.strictSame(
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
    "06.01 - default"
  );
  t.strictSame(
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
    "06.02 - opts.flattenArraysContainingStringsToBeEmpty"
  );
  t.end();
});

tap.test("07 - multiple types in an array #1", (t) => {
  t.strictSame(
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
    "07"
  );
  t.end();
});

tap.test("08 - multiple types in an array #2", (t) => {
  t.strictSame(
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
    "08"
  );
  t.end();
});

tap.test("09 - simple array, two ojects", (t) => {
  t.strictSame(
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
    "09"
  );
  t.end();
});

tap.test("10 - simple array, two nested ojects", (t) => {
  t.strictSame(
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
    "10"
  );
  t.end();
});

tap.test("11 - array, mix of ojects, arrays and strings", (t) => {
  t.strictSame(
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
    "11.01 - default"
  );
  t.strictSame(
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
    "11.02 - opts"
  );
  t.end();
});

tap.test("12 - arrays within objects, strings as elements", (t) => {
  t.strictSame(
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
    "12.01 - default"
  );
  t.strictSame(
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
    "12.02 - opts"
  );
  t.end();
});

// ==========
// Edge cases
// ==========

tap.test("13 - empty object as input", (t) => {
  t.strictSame(flattenAllArrays({}), {}, "13");
  t.end();
});

tap.test("14 - empty array as input", (t) => {
  t.strictSame(flattenAllArrays([]), [], "14");
  t.end();
});

tap.test("15 - empty string as input", (t) => {
  t.strictSame(flattenAllArrays(""), "", "15");
  t.end();
});

tap.test("16 - null as input", (t) => {
  t.strictSame(flattenAllArrays(null), null, "16");
  t.end();
});

tap.test("17 - undefined as input", (t) => {
  t.strictSame(flattenAllArrays(undefined), undefined, "17");
  t.end();
});

tap.test("18 - nothing in the input", (t) => {
  t.strictSame(flattenAllArrays(), undefined, "18");
  t.end();
});

// ==========================
// Does not mutate input args
// ==========================

tap.test("19 - does not mutate input args", (t) => {
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
  t.strictSame(
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
    "19.01"
  );
  t.end();
});
