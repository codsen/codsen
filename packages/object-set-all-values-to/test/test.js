import tap from "tap";
import setAllValuesTo from "../dist/object-set-all-values-to.esm";

// ==============================
// Normal assignments with default value, false
// ==============================

tap.test("01 - input simple plain object, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("02 - two level nested plain object, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("03 - topmost level input is array, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("04 - many levels of nested arrays, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("05 - array-object-array-object, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("06 - array has array which has object, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("07 - object has object value, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("08 - input is object with only values — arrays, default", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("09 - ops within an array, default", (t) => {
  t.strictSame(
    setAllValuesTo([["a", { b: "b" }, "c"]]),
    [["a", { b: false }, "c"]],
    "09"
  );
  t.end();
});

tap.test("10 - lots of empty things, default", (t) => {
  t.strictSame(
    setAllValuesTo([{}, {}, {}, { a: "a" }, {}]),
    [{}, {}, {}, { a: false }, {}],
    "10"
  );
  t.end();
});

// ==============================
// Custom value assignments
// ==============================

tap.test("11 - input simple plain object, assigning a string", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("12 - input simple plain object, assigning a plain object", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("13 - input simple plain object, assigning an array", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("14 - input simple plain object, assigning a null", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("15 - input simple plain object, assigning a Boolean true", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("16 - input simple plain object, assigning a function", (t) => {
  function f() {
    return 1;
  }
  t.strictSame(
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
  t.end();
});

tap.test("17 - input simple plain object, assigning a plain object", (t) => {
  t.strictSame(
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
  t.end();
});

// ==============================
// Edge cases
// ==============================

tap.test("18 - input is string, default value", (t) => {
  t.strictSame(setAllValuesTo("nothing"), "nothing", "18");
  t.end();
});

tap.test("19 - input is string, value provided", (t) => {
  t.strictSame(setAllValuesTo("nothing", "something"), "nothing", "19");
  t.end();
});

tap.test("20 - input is missing but value provided", (t) => {
  t.strictSame(setAllValuesTo(undefined, "a"), undefined, "20");
  t.end();
});

// ==============================
// Input arg mutation
// ==============================

tap.test("21 - does not mutate input args", (t) => {
  const inp = {
    a: "a",
    b: "b",
  };
  const dummyResult = setAllValuesTo(inp);
  t.pass(dummyResult);
  t.strictSame(
    inp,
    {
      a: "a",
      b: "b",
    },
    "21.01"
  );
  t.end();
});
