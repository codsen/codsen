const t = require("tap");
const setAllValuesTo = require("../dist/object-set-all-values-to.cjs");

// ==============================
// Normal assignments with default value, false
// ==============================

t.test("01.01 - input simple plain object, default", (t) => {
  t.same(
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
    "01.01"
  );
  t.end();
});

t.test("01.02 - two level nested plain object, default", (t) => {
  t.same(
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
    "01.02"
  );
  t.end();
});

t.test("01.03 - topmost level input is array, default", (t) => {
  t.same(
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
    "01.03"
  );
  t.end();
});

t.test("01.04 - many levels of nested arrays, default", (t) => {
  t.same(
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
    "01.04"
  );
  t.end();
});

t.test("01.05 - array-object-array-object, default", (t) => {
  t.same(
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
    "01.05"
  );
  t.end();
});

t.test("01.06 - array has array which has object, default", (t) => {
  t.same(
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
    "01.06"
  );
  t.end();
});

t.test("01.07 - object has object value, default", (t) => {
  t.same(
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
    "01.07"
  );
  t.end();
});

t.test("01.08 - input is object with only values — arrays, default", (t) => {
  t.same(
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
    "01.08"
  );
  t.end();
});

t.test("01.09 - ops within an array, default", (t) => {
  t.same(
    setAllValuesTo([["a", { b: "b" }, "c"]]),
    [["a", { b: false }, "c"]],
    "01.09"
  );
  t.end();
});

t.test("01.10 - lots of empty things, default", (t) => {
  t.same(
    setAllValuesTo([{}, {}, {}, { a: "a" }, {}]),
    [{}, {}, {}, { a: false }, {}],
    "01.10"
  );
  t.end();
});

// ==============================
// Custom value assignments
// ==============================

t.test("02.01 - input simple plain object, assigning a string", (t) => {
  t.same(
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
    "02.01"
  );
  t.end();
});

t.test("02.02 - input simple plain object, assigning a plain object", (t) => {
  t.same(
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
    "02.02"
  );
  t.end();
});

t.test("02.03 - input simple plain object, assigning an array", (t) => {
  t.same(
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
    "02.03"
  );
  t.end();
});

t.test("02.04 - input simple plain object, assigning a null", (t) => {
  t.same(
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
    "02.04"
  );
  t.end();
});

t.test("02.05 - input simple plain object, assigning a Boolean true", (t) => {
  t.same(
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
    "02.05"
  );
  t.end();
});

t.test("02.06 - input simple plain object, assigning a function", (t) => {
  function f() {
    return 1;
  }
  t.same(
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
    "02.06"
  );
  t.end();
});

t.test("02.07 - input simple plain object, assigning a plain object", (t) => {
  t.same(
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
    "02.07"
  );
  t.end();
});

// ==============================
// Edge cases
// ==============================

t.test("03.01 - input is string, default value", (t) => {
  t.same(setAllValuesTo("nothing"), "nothing", "03.01");
  t.end();
});

t.test("03.02 - input is string, value provided", (t) => {
  t.same(setAllValuesTo("nothing", "something"), "nothing", "03.02");
  t.end();
});

t.test("03.03 - input is missing but value provided", (t) => {
  t.same(setAllValuesTo(undefined, "a"), undefined, "03.04");
  t.end();
});

// ==============================
// Input arg mutation
// ==============================

t.test("04.01 - does not mutate input args", (t) => {
  const inp = {
    a: "a",
    b: "b",
  };
  const dummyResult = setAllValuesTo(inp);
  t.pass(dummyResult);
  t.same(
    inp,
    {
      a: "a",
      b: "b",
    },
    "04.01"
  );
  t.end();
});
