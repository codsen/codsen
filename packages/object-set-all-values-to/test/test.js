import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

// ==============================
// Normal assignments with default value, false
// ==============================

test("01 - input simple plain object, default", () => {
  equal(
    setAllValuesTo({
      a: "a",
      b: "b",
      c: "c",
      d: "d",
    }),
    {
      a: false,
      b: false,
      c: false,
      d: false,
    },
    "01"
  );
});

test("02 - two level nested plain object, default", () => {
  equal(
    setAllValuesTo({
      a: "a",
      b: "b",
      c: "c",
      d: [
        {
          e: "e",
          f: "f",
        },
      ],
    }),
    {
      a: false,
      b: false,
      c: false,
      d: [
        {
          e: false,
          f: false,
        },
      ],
    },
    "02"
  );
});

test("03 - topmost level input is array, default", () => {
  equal(
    setAllValuesTo([
      {
        a: "a",
        b: "b",
        c: "c",
        d: [
          {
            e: "e",
            f: "f",
          },
        ],
      },
    ]),
    [
      {
        a: false,
        b: false,
        c: false,
        d: [
          {
            e: false,
            f: false,
          },
        ],
      },
    ],
    "03"
  );
});

test("04 - many levels of nested arrays, default", () => {
  equal(
    setAllValuesTo([
      [
        [
          [
            [
              [
                [
                  [
                    [
                      [
                        [
                          [
                            [
                              [
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
                                                  c: "c",
                                                  d: [
                                                    {
                                                      e: "e",
                                                      f: "f",
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
                                ],
                              ],
                            ],
                          ],
                        ],
                      ],
                    ],
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
                    [
                      [
                        [
                          [
                            [
                              [
                                [
                                  [
                                    [
                                      [
                                        [
                                          [
                                            [
                                              [
                                                {
                                                  a: false,
                                                  b: false,
                                                  c: false,
                                                  d: [
                                                    {
                                                      e: false,
                                                      f: false,
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
                                ],
                              ],
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    ],
    "04"
  );
});

test("05 - array-object-array-object, default", () => {
  equal(
    setAllValuesTo([
      {
        a: [
          {
            b: "b",
          },
        ],
      },
    ]),
    [
      {
        a: [
          {
            b: false,
          },
        ],
      },
    ],
    "05"
  );
});

test("06 - array has array which has object, default", () => {
  equal(
    setAllValuesTo([
      [
        {
          a: "a",
        },
        {
          b: "b",
        },
      ],
      {
        c: "c",
        d: [{ e: "e" }],
      },
    ]),
    [
      [
        {
          a: false,
        },
        {
          b: false,
        },
      ],
      {
        c: false,
        d: [{ e: false }],
      },
    ],
    "06"
  );
});

test("07 - object has object value, default", () => {
  equal(
    setAllValuesTo({
      a: {
        b: {
          c: {
            d: [
              {
                e: "e",
              },
            ],
          },
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: [
              {
                e: false,
              },
            ],
          },
        },
      },
    },
    "07"
  );
});

test("08 - input is object with only values — arrays, default", () => {
  equal(
    setAllValuesTo({
      a: ["a"],
      b: ["b"],
      c: ["c"],
      d: ["d"],
    }),
    {
      a: ["a"],
      b: ["b"],
      c: ["c"],
      d: ["d"],
    },
    "08"
  );
});

test("09 - ops within an array, default", () => {
  equal(
    setAllValuesTo([["a", { b: "b" }, "c"]]),
    [["a", { b: false }, "c"]],
    "09"
  );
});

test("10 - lots of empty things, default", () => {
  equal(
    setAllValuesTo([{}, {}, {}, { a: "a" }, {}]),
    [{}, {}, {}, { a: false }, {}],
    "10"
  );
});

// ==============================
// Custom value assignments
// ==============================

test("11 - input simple plain object, assigning a string", () => {
  equal(
    setAllValuesTo(
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      "x"
    ),
    {
      a: "x",
      b: "x",
      c: "x",
      d: "x",
    },
    "11"
  );
});

test("12 - input simple plain object, assigning a plain object", () => {
  equal(
    setAllValuesTo(
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      { x: "x" }
    ),
    {
      a: { x: "x" },
      b: { x: "x" },
      c: { x: "x" },
      d: { x: "x" },
    },
    "12"
  );
});

test("13 - input simple plain object, assigning an array", () => {
  equal(
    setAllValuesTo(
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      ["z", "y"]
    ),
    {
      a: ["z", "y"],
      b: ["z", "y"],
      c: ["z", "y"],
      d: ["z", "y"],
    },
    "13"
  );
});

test("14 - input simple plain object, assigning a null", () => {
  equal(
    setAllValuesTo(
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      null
    ),
    {
      a: null,
      b: null,
      c: null,
      d: null,
    },
    "14"
  );
});

test("15 - input simple plain object, assigning a Boolean true", () => {
  equal(
    setAllValuesTo(
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      true
    ),
    {
      a: true,
      b: true,
      c: true,
      d: true,
    },
    "15"
  );
});

test("16 - input simple plain object, assigning a function", () => {
  function f() {
    return 1;
  }
  equal(
    setAllValuesTo(
      [
        [
          {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
          },
        ],
        { x: "x" },
      ],
      f
    ),
    [
      [
        {
          a: f,
          b: f,
          c: f,
          d: f,
        },
      ],
      { x: f },
    ],
    "16"
  );
});

test("17 - input simple plain object, assigning a plain object", () => {
  equal(
    setAllValuesTo(
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
      {
        a: "a",
      }
    ),
    {
      a: { a: "a" },
      b: { a: "a" },
      c: { a: "a" },
      d: { a: "a" },
    },
    "17"
  );
});

// ==============================
// Edge cases
// ==============================

test("18 - input is string, default value", () => {
  equal(setAllValuesTo("nothing"), "nothing", "18");
});

test("19 - input is string, value provided", () => {
  equal(setAllValuesTo("nothing", "something"), "nothing", "19");
});

test("20 - input is missing but value provided", () => {
  equal(setAllValuesTo(undefined, "a"), undefined, "20");
});

// ==============================
// Input arg mutation
// ==============================

test("21 - does not mutate input args", () => {
  let inp = {
    a: "a",
    b: "b",
  };
  let dummyResult = setAllValuesTo(inp);
  ok(dummyResult);
  equal(
    inp,
    {
      a: "a",
      b: "b",
    },
    "21.01"
  );
});

test.run();
