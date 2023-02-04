import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

// ==============================
// 1. Adds missing keys
// ==============================

test("01 - filling in missing keys, simple plain object", () => {
  equal(
    fillMissing(
      {
        a: "a",
      },
      {
        a: false,
        b: false,
        c: false,
      }
    ),
    {
      a: "a",
      b: false,
      c: false,
    },
    "01.01"
  );
});

test("02 - filling in missing keys, nested, with arrays", () => {
  equal(
    fillMissing(
      {
        a: "a",
      },
      {
        a: false,
        b: [
          {
            x: "x",
          },
        ],
        c: {
          y: "y",
        },
      }
    ),
    {
      a: "a",
      b: [
        {
          x: "x",
        },
      ],
      c: {
        y: "y",
      },
    },
    "02.01"
  );
  equal(
    fillMissing(
      {
        a: "a",
      },
      {
        a: "z",
        b: [
          {
            x: "x",
          },
        ],
        c: {
          y: "y",
        },
      }
    ),
    {
      a: "a",
      b: [
        {
          x: "x",
        },
      ],
      c: {
        y: "y",
      },
    },
    "02.02"
  );
});

test("03 - multiple values, sorting as well", () => {
  equal(
    fillMissing(
      {
        b: "b",
        a: "a",
      },
      {
        a: false,
        b: false,
        c: false,
      }
    ),
    {
      a: "a",
      b: "b",
      c: false,
    },
    "03.01"
  );
});

test("04 - nested arrays as values (array in schema overwrites Boolean)", () => {
  equal(
    fillMissing(
      {
        a: false,
      },
      {
        a: [
          {
            b: false,
          },
        ],
      }
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "04.01"
  );
});

test("05 - more complex nested arrays", () => {
  equal(
    fillMissing(
      {
        c: "c",
      },
      {
        a: false,
        b: [
          {
            x: false,
            y: false,
          },
        ],
        c: false,
      }
    ),
    {
      a: false,
      b: [
        {
          x: false,
          y: false,
        },
      ],
      c: "c",
    },
    "05.01"
  );
});

test("06 - ridiculously deep nesting", () => {
  equal(
    fillMissing(
      {
        a: false,
      },
      {
        a: [
          {
            b: [
              {
                c: [
                  {
                    d: [
                      {
                        e: [
                          {
                            f: [
                              {
                                g: [
                                  {
                                    h: [
                                      {
                                        i: [
                                          {
                                            j: [
                                              {
                                                k: false,
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    ),
    {
      a: [
        {
          b: [
            {
              c: [
                {
                  d: [
                    {
                      e: [
                        {
                          f: [
                            {
                              g: [
                                {
                                  h: [
                                    {
                                      i: [
                                        {
                                          j: [
                                            {
                                              k: false,
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    "06.01"
  );
});

test("07 - cheeky case, custom placeholder on schema has value null", () => {
  equal(
    fillMissing(
      {
        d: null,
      },
      {
        a: null,
        b: null,
        c: null,
      }
    ),
    {
      a: null,
      b: null,
      c: null,
      d: null,
    },
    "07.01"
  );
});

// ==============================
// 2. Normalises array contents
// ==============================

test("08 - array one level-deep", () => {
  equal(
    fillMissing(
      {
        a: [
          {
            b: "b",
          },
          {
            c: "c",
          },
          {
            d: "d",
          },
          {
            e: "e",
          },
        ],
      },
      {
        a: [
          {
            b: false,
            c: false,
            d: false,
            e: false,
          },
        ],
      }
    ),
    {
      a: [
        {
          b: "b",
          c: false,
          d: false,
          e: false,
        },
        {
          b: false,
          c: "c",
          d: false,
          e: false,
        },
        {
          b: false,
          c: false,
          d: "d",
          e: false,
        },
        {
          b: false,
          c: false,
          d: false,
          e: "e",
        },
      ],
    },
    "08.01"
  );
});

test("09 - multiple levels of nested arrays", () => {
  equal(
    fillMissing(
      {
        c: "c",
      },
      {
        a: false,
        b: [
          {
            key4: false,
            key5: false,
            key6: [
              {
                key7: false,
                key8: false,
              },
            ],
          },
        ],
        c: false,
      }
    ),
    {
      a: false,
      b: [
        {
          key4: false,
          key5: false,
          key6: [
            {
              key7: false,
              key8: false,
            },
          ],
        },
      ],
      c: "c",
    },
    "09.01"
  );
});

// ==============================
// 3. String vs array clashes
// ==============================

test("10 - string vs array clash", () => {
  equal(
    fillMissing(
      {
        a: "a",
      },
      {
        a: [
          {
            b: false,
          },
        ],
      }
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "10.01"
  );
});

test("11 - string vs object clash", () => {
  equal(
    fillMissing(
      {
        a: "a",
      },
      {
        a: {
          b: false,
        },
      }
    ),
    {
      a: {
        b: false,
      },
    },
    "11.01"
  );
});

test("12 - object vs array clash", () => {
  equal(
    fillMissing(
      {
        a: {
          c: "ccc",
        },
      },
      {
        a: [
          {
            b: false,
          },
        ],
      }
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "12.01"
  );
});

test("13 - array vs empty array", () => {
  equal(
    fillMissing(
      {
        a: [],
        b: "b",
      },
      {
        a: [
          {
            d: false,
            e: false,
          },
        ],
        b: false,
        c: false,
      }
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: "b",
      c: false,
    },
    "13.01"
  );
});

test("14 - array vs string", () => {
  equal(
    fillMissing(
      {
        a: "a",
        b: "b",
      },
      {
        a: [
          {
            d: false,
            e: false,
          },
        ],
        b: false,
        c: false,
      }
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: "b",
      c: false,
    },
    "14.01"
  );
});

test("15 - array vs bool", () => {
  equal(
    fillMissing(
      {
        a: true,
        b: "b",
      },
      {
        a: [
          {
            d: false,
            e: false,
          },
        ],
        b: false,
        c: false,
      }
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: "b",
      c: false,
    },
    "15.01"
  );
});

test("16 - multiple levels of nested arrays #1", () => {
  equal(
    fillMissing(
      {
        a: false,
        c: "c",
      },
      {
        a: false,
        b: [
          {
            b1: false,
            b2: false,
            b3: [
              {
                b4: false,
                b5: false,
              },
            ],
          },
        ],
        c: false,
      }
    ),
    {
      a: false,
      b: [
        {
          b1: false,
          b2: false,
          b3: [
            {
              b4: false,
              b5: false,
            },
          ],
        },
      ],
      c: "c",
    },
    "16.01"
  );
});

test("17 - multiple levels of nested arrays #2", () => {
  equal(
    fillMissing(
      {
        b: [
          {
            b1: "val1",
            b2: "val2",
            b3: [
              {
                b4: "val4",
              },
              {
                b5: "val5",
              },
            ],
          },
        ],
      },
      {
        a: false,
        b: [
          {
            b1: false,
            b2: false,
            b3: [
              {
                b4: false,
                b5: false,
              },
            ],
          },
        ],
        c: false,
      }
    ),
    {
      a: false,
      b: [
        {
          b1: "val1",
          b2: "val2",
          b3: [
            {
              b4: "val4",
              b5: false,
            },
            {
              b4: false,
              b5: "val5",
            },
          ],
        },
      ],
      c: false,
    },
    "17.01"
  );
});

// ==============================
// 4. Contingencies
// ==============================

test("18 - number as input", () => {
  throws(
    () => {
      fillMissing(1, {
        a: {
          b: false,
        },
      });
    },
    /THROW_ID_02/g,
    "18.01"
  );
});

test("19 - boolean as input", () => {
  throws(
    () => {
      fillMissing(true, {
        a: {
          b: false,
        },
      });
    },
    /THROW_ID_02/g,
    "19.01"
  );
});

test("20 - null as input", () => {
  throws(
    () => {
      fillMissing(null, {
        a: {
          b: false,
        },
      });
    },
    /THROW_ID_02/g,
    "20.01"
  );
});

test("21 - both args missing (as in hardcoded undefined)", () => {
  throws(
    () => {
      fillMissing(undefined, undefined);
    },
    /THROW_ID_02/g,
    "21.01"
  );
});

test("22 - both args completely missing", () => {
  throws(
    () => {
      fillMissing();
    },
    /THROW_ID_01/g,
    "22.01"
  );
});

test("23 - second arg is not a plain object", () => {
  throws(
    () => {
      fillMissing({ a: "b" }, 1);
    },
    /THROW_ID_03/g,
    "23.01"
  );
});

test("24 - opts is not a plain object", () => {
  throws(
    () => {
      fillMissing({ a: "c" }, { a: "b" }, 1);
    },
    /THROW_ID_04/g,
    "24.01"
  );
  not.throws(() => {
    fillMissing({ a: "c" }, { a: "b" }, null);
  }, "24.02");
});

test("25 - opts.doNotFillThesePathsIfTheyContainPlaceholders", () => {
  throws(
    () => {
      fillMissing(
        { a: "c" },
        { a: "b" },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", 1],
        }
      );
    },
    /THROW_ID_06/g,
    "25.01"
  );
  throws(
    () => {
      fillMissing({ a: "c" }, [{ a: "b" }], {
        doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", { a: 1 }],
      });
    },
    /THROW_ID_03/g,
    "25.02"
  );
  throws(
    () => {
      fillMissing(
        { a: "c" },
        { a: "b" },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", { a: 1 }],
        }
      );
    },
    /THROW_ID_06/g,
    "25.03"
  );
});

// ================================
// 5. Input arg mutation prevention
// ================================

test("26 - does not mutate the input args", () => {
  let testObj = {
    a: "a",
  };
  let tempRes = fillMissing(testObj, {
    a: false,
    b: false,
    c: false,
  });
  ok(tempRes, "26.01"); // dummy
  equal(
    testObj,
    {
      a: "a",
    },
    "26.02"
  ); // real deal
});

// ========================================================
// 6. opts.doNotFillThesePathsIfTheyContainPlaceholders
// ========================================================

test("27 - some keys filled, some ignored because they have placeholders-only", () => {
  // baseline behaviour

  equal(
    fillMissing(
      {
        a: {
          b: false,
          x: "x",
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      }
    ),
    {
      a: {
        b: {
          c: false,
          d: false,
        },
        x: "x",
      },
      z: "z",
    },
    "27.01"
  );

  equal(
    fillMissing(
      {
        a: {
          b: false,
          x: "x",
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
      }
    ),
    {
      a: {
        b: false, // <---------------- observe, the keys were not added because it had a placeholder
        x: "x",
      },
      z: "z",
    },
    "27.02"
  );

  equal(
    fillMissing(
      {
        a: {
          b: true, // <-- not placeholder but lower in data hierarchy (boolean)
          x: "x",
        },
        z: "z",
      },
      {
        a: {
          b: {
            // <-- value of path "a.b" is this object
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
      }
    ),
    {
      a: {
        b: {
          c: false,
          d: false,
        }, // <---------------- observe, the keys were not added because it had a placeholder
        x: "x",
      },
      z: "z",
    },
    "27.03"
  );

  equal(
    fillMissing(
      {
        a: {
          x: "x",
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
      }
    ),
    {
      a: {
        b: false, // <---------------- observe, the keys were not added because it had a placeholder
        x: "x",
      },
      z: "z",
    },
    "27.04"
  );

  equal(
    fillMissing(
      {
        a: "zzz",
        b: false,
      },
      {
        a: false,
        b: { c: false },
      },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["b"],
      }
    ),
    {
      a: "zzz",
      b: false,
    },
    "27.05"
  );

  // will also truncate the already normalised branches if they're on the path:
  equal(
    fillMissing(
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: {
            y: false,
          },
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"],
      }
    ),
    {
      a: {
        b: false,
        x: false,
      },
      z: "z",
    },
    "27.06"
  );

  // will also truncate the already normalised branches if they're on the path:
  equal(
    fillMissing(
      {
        a: {
          b: {
            c: "r",
            d: false,
          },
          x: {
            y: false,
          },
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"],
      }
    ),
    {
      a: {
        b: {
          c: "r",
          d: false,
        },
        x: false,
      },
      z: "z",
    },
    "27.07"
  );
});

// ========================================================
// 7. opts.useNullAsExplicitFalse
// ========================================================

test("28 - opts.useNullAsExplicitFalse - case #1", () => {
  equal(
    fillMissing(
      {
        a: {
          b: null,
          x: "x",
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        useNullAsExplicitFalse: false,
      }
    ),
    {
      a: {
        b: {
          c: false,
          d: false,
        },
        x: "x",
      },
      z: "z",
    },
    "28.01"
  );

  equal(
    fillMissing(
      {
        a: {
          b: null,
          x: "x",
        },
        z: "z",
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: {
        b: null,
        x: "x",
      },
      z: "z",
    },
    "28.02"
  );
});

test("29 - opts.useNullAsExplicitFalse - case #2", () => {
  equal(
    fillMissing(
      {
        a: null,
      },
      {
        a: true,
      },
      {
        useNullAsExplicitFalse: false,
      }
    ),
    {
      a: true,
    },
    "29.01"
  );
  equal(
    fillMissing(
      {
        a: null,
      },
      {
        a: true,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "29.02"
  );
});

test("30 - opts.useNullAsExplicitFalse - case #3", () => {
  equal(
    fillMissing(
      {
        a: null,
      },
      {
        a: ["z"],
      },
      {
        useNullAsExplicitFalse: false,
      }
    ),
    {
      a: ["z"],
    },
    "30.01"
  );
  equal(
    fillMissing(
      {
        a: null,
      },
      {
        a: ["z"],
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "30.02"
  );
});

// https://github.com/codsen/codsen/issues/51
test("31 - case #51", () => {
  equal(
    fillMissing(
      {
        a: false,
      },
      {
        a: true,
      },
      {}
    ),
    {
      a: false,
    },
    "31.01"
  );
  equal(
    fillMissing(
      {
        a: false,
      },
      {
        a: false,
      },
      {}
    ),
    {
      a: false,
    },
    "31.02"
  );
  equal(
    fillMissing(
      {
        a: true,
      },
      {
        a: false,
      },
      {}
    ),
    {
      a: true,
    },
    "31.03"
  );
  equal(
    fillMissing(
      {
        a: true,
      },
      {
        a: true,
      },
      {}
    ),
    {
      a: true,
    },
    "31.04"
  );
});

test.run();
