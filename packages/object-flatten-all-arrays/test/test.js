import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

// ==========
// Normal use
// ==========

test("01 - simple plain object, one array", () => {
  equal(
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
});

test("02 - simple plain object, two arrays", () => {
  equal(
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
    "02.01"
  );
});

test("03 - nested simple plain object, one array", () => {
  equal(
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
    "03.01"
  );
});

test("04 - nested objects", () => {
  equal(
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
    "04.01"
  );
});

test("05 - multiple nested arrays", () => {
  equal(
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
    "05.01"
  );
});

test("06 - array contents are not of the same type", () => {
  equal(
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
    "06.01"
  );
  equal(
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
    "06.02"
  );
});

test("07 - multiple types in an array #1", () => {
  equal(
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
    "07.01"
  );
});

test("08 - multiple types in an array #2", () => {
  equal(
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
    "08.01"
  );
});

test("09 - simple array, two ojects", () => {
  equal(
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
    "09.01"
  );
});

test("10 - simple array, two nested ojects", () => {
  equal(
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
    "10.01"
  );
});

test("11 - array, mix of ojects, arrays and strings", () => {
  equal(
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
    "11.01"
  );
  equal(
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
    "11.02"
  );
});

test("12 - arrays within objects, strings as elements", () => {
  equal(
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
    "12.01"
  );
  equal(
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
    "12.02"
  );
});

// ==========
// Edge cases
// ==========

test("13 - empty object as input", () => {
  equal(flattenAllArrays({}), {}, "13.01");
});

test("14 - empty array as input", () => {
  equal(flattenAllArrays([]), [], "14.01");
});

test("15 - empty string as input", () => {
  equal(flattenAllArrays(""), "", "15.01");
});

test("16 - null as input", () => {
  equal(flattenAllArrays(null), null, "16.01");
});

test("17 - undefined as input", () => {
  equal(flattenAllArrays(undefined), undefined, "17.01");
});

test("18 - nothing in the input", () => {
  equal(flattenAllArrays(), undefined, "18.01");
});

// ==========================
// Does not mutate input args
// ==========================

test("19 - does not mutate input args", () => {
  let obj = {
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
  let unneededResult = flattenAllArrays(obj);
  ok(unneededResult, "19.01");
  equal(
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
    "19.02"
  );
});

test.run();
