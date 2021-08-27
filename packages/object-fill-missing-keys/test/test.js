import tap from "tap";
import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

// ==============================
// 1. Adds missing keys
// ==============================

tap.test("01 - filling in missing keys, simple plain object", (t) => {
  t.strictSame(
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
    "01"
  );
  t.end();
});

tap.test("02 - filling in missing keys, nested, with arrays", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("03 - multiple values, sorting as well", (t) => {
  t.strictSame(
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
    "03"
  );
  t.end();
});

tap.test(
  "04 - nested arrays as values (array in schema overwrites Boolean)",
  (t) => {
    t.strictSame(
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
      "04"
    );
    t.end();
  }
);

tap.test("05 - more complex nested arrays", (t) => {
  t.strictSame(
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
    "05"
  );
  t.end();
});

tap.test("06 - ridiculously deep nesting", (t) => {
  t.strictSame(
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
    "06"
  );
  t.end();
});

tap.test(
  "07 - cheeky case, custom placeholder on schema has value null",
  (t) => {
    t.strictSame(
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
      "07"
    );
    t.end();
  }
);

// ==============================
// 2. Normalises array contents
// ==============================

tap.test("08 - array one level-deep", (t) => {
  t.strictSame(
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
    "08"
  );
  t.end();
});

tap.test("09 - multiple levels of nested arrays", (t) => {
  t.strictSame(
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
    "09"
  );
  t.end();
});

// ==============================
// 3. String vs array clashes
// ==============================

tap.test("10 - string vs array clash", (t) => {
  t.strictSame(
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
    "10"
  );
  t.end();
});

tap.test("11 - string vs object clash", (t) => {
  t.strictSame(
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
    "11"
  );
  t.end();
});

tap.test("12 - object vs array clash", (t) => {
  t.strictSame(
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
    "12"
  );
  t.end();
});

tap.test("13 - array vs empty array", (t) => {
  t.strictSame(
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
    "13"
  );
  t.end();
});

tap.test("14 - array vs string", (t) => {
  t.strictSame(
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
    "14"
  );
  t.end();
});

tap.test("15 - array vs bool", (t) => {
  t.strictSame(
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
    "15"
  );
  t.end();
});

tap.test("16 - multiple levels of nested arrays #1", (t) => {
  t.strictSame(
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
    "16"
  );
  t.end();
});

tap.test("17 - multiple levels of nested arrays #2", (t) => {
  t.strictSame(
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
    "17"
  );
  t.end();
});

// ==============================
// 4. Contingencies
// ==============================

tap.test("18 - number as input", (t) => {
  t.throws(() => {
    fillMissing(1, {
      a: {
        b: false,
      },
    });
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("19 - boolean as input", (t) => {
  t.throws(() => {
    fillMissing(true, {
      a: {
        b: false,
      },
    });
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("20 - null as input", (t) => {
  t.throws(() => {
    fillMissing(null, {
      a: {
        b: false,
      },
    });
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("21 - both args missing (as in hardcoded undefined)", (t) => {
  t.throws(() => {
    fillMissing(undefined, undefined);
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("22 - both args completely missing", (t) => {
  t.throws(() => {
    fillMissing();
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("23 - second arg is not a plain object", (t) => {
  t.throws(() => {
    fillMissing({ a: "b" }, 1);
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("24 - opts is not a plain object", (t) => {
  t.throws(() => {
    fillMissing({ a: "c" }, { a: "b" }, 1);
  }, /THROW_ID_04/g);
  t.doesNotThrow(() => {
    fillMissing({ a: "c" }, { a: "b" }, null);
  }, "24.02");
  t.end();
});

tap.test("25 - opts.doNotFillThesePathsIfTheyContainPlaceholders", (t) => {
  t.throws(() => {
    fillMissing(
      { a: "c" },
      { a: "b" },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", 1],
      }
    );
  }, /THROW_ID_06/g);
  t.throws(() => {
    fillMissing({ a: "c" }, [{ a: "b" }], {
      doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", { a: 1 }],
    });
  }, /THROW_ID_03/g);
  t.throws(() => {
    fillMissing(
      { a: "c" },
      { a: "b" },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", { a: 1 }],
      }
    );
  }, /THROW_ID_06/g);
  t.end();
});

// ================================
// 5. Input arg mutation prevention
// ================================

tap.test("26 - does not mutate the input args", (t) => {
  const testObj = {
    a: "a",
  };
  const tempRes = fillMissing(testObj, {
    a: false,
    b: false,
    c: false,
  });
  t.pass(tempRes); // dummy
  t.strictSame(
    testObj,
    {
      a: "a",
    },
    "26.01"
  ); // real deal
  t.end();
});

// ========================================================
// 6. opts.doNotFillThesePathsIfTheyContainPlaceholders
// ========================================================

tap.test(
  "27 - some keys filled, some ignored because they have placeholders-only",
  (t) => {
    // baseline behaviour

    t.strictSame(
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
      "27.01 - default behaviour - keys are added"
    );

    t.strictSame(
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
      "27.02 - opts.doNotFillThesePathsIfTheyContainPlaceholders"
    );

    t.strictSame(
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
      "27.03 - triggering the normalisation when it's off from opts"
    );

    t.strictSame(
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
      "27.04 - key in given path is missing completely"
    );

    t.strictSame(
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
    t.strictSame(
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
          doNotFillThesePathsIfTheyContainPlaceholders: [
            "lalala",
            "a.b",
            "a.x",
          ],
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
    t.strictSame(
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
          doNotFillThesePathsIfTheyContainPlaceholders: [
            "lalala",
            "a.b",
            "a.x",
          ],
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
    t.end();
  }
);

// ========================================================
// 7. opts.useNullAsExplicitFalse
// ========================================================

tap.test("28 - opts.useNullAsExplicitFalse - case #1", (t) => {
  t.strictSame(
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

  t.strictSame(
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
  t.end();
});

tap.test("29 - opts.useNullAsExplicitFalse - case #2", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("30 - opts.useNullAsExplicitFalse - case #3", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});
