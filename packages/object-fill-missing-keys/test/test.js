const t = require("tap");
const fillMissingKeys = require("../dist/object-fill-missing-keys.cjs");

// ==============================
// 1. Adds missing keys
// ==============================

t.test("01.01 - filling in missing keys, simple plain object", t => {
  t.same(
    fillMissingKeys(
      {
        a: "a"
      },
      {
        a: false,
        b: false,
        c: false
      }
    ),
    {
      a: "a",
      b: false,
      c: false
    },
    "01.01"
  );
  t.end();
});

t.test("01.02 - filling in missing keys, nested, with arrays", t => {
  t.same(
    fillMissingKeys(
      {
        a: "a"
      },
      {
        a: false,
        b: [
          {
            x: "x"
          }
        ],
        c: {
          y: "y"
        }
      }
    ),
    {
      a: "a",
      b: [
        {
          x: "x"
        }
      ],
      c: {
        y: "y"
      }
    },
    "01.02.01"
  );
  t.same(
    fillMissingKeys(
      {
        a: "a"
      },
      {
        a: "z",
        b: [
          {
            x: "x"
          }
        ],
        c: {
          y: "y"
        }
      }
    ),
    {
      a: "a",
      b: [
        {
          x: "x"
        }
      ],
      c: {
        y: "y"
      }
    },
    "01.02.02"
  );
  t.end();
});

t.test("01.03 - multiple values, sorting as well", t => {
  t.same(
    fillMissingKeys(
      {
        b: "b",
        a: "a"
      },
      {
        a: false,
        b: false,
        c: false
      }
    ),
    {
      a: "a",
      b: "b",
      c: false
    },
    "01.03"
  );
  t.end();
});

t.test(
  "01.04 - nested arrays as values (array in schema overwrites Boolean)",
  t => {
    t.same(
      fillMissingKeys(
        {
          a: false
        },
        {
          a: [
            {
              b: false
            }
          ]
        }
      ),
      {
        a: [
          {
            b: false
          }
        ]
      },
      "01.04"
    );
    t.end();
  }
);

t.test("01.05 - more complex nested arrays", t => {
  t.same(
    fillMissingKeys(
      {
        c: "c"
      },
      {
        a: false,
        b: [
          {
            x: false,
            y: false
          }
        ],
        c: false
      }
    ),
    {
      a: false,
      b: [
        {
          x: false,
          y: false
        }
      ],
      c: "c"
    },
    "01.05"
  );
  t.end();
});

t.test("01.06 - ridiculously deep nesting", t => {
  t.same(
    fillMissingKeys(
      {
        a: false
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
                                                k: false
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
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
                                              k: false
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "01.06"
  );
  t.end();
});

t.test(
  "01.07 - cheeky case, custom placeholder on schema has value null",
  t => {
    t.same(
      fillMissingKeys(
        {
          d: null
        },
        {
          a: null,
          b: null,
          c: null
        }
      ),
      {
        a: null,
        b: null,
        c: null,
        d: null
      },
      "01.07"
    );
    t.end();
  }
);

// ==============================
// 2. Normalises array contents
// ==============================

t.test("02.01 - array one level-deep", t => {
  t.same(
    fillMissingKeys(
      {
        a: [
          {
            b: "b"
          },
          {
            c: "c"
          },
          {
            d: "d"
          },
          {
            e: "e"
          }
        ]
      },
      {
        a: [
          {
            b: false,
            c: false,
            d: false,
            e: false
          }
        ]
      }
    ),
    {
      a: [
        {
          b: "b",
          c: false,
          d: false,
          e: false
        },
        {
          b: false,
          c: "c",
          d: false,
          e: false
        },
        {
          b: false,
          c: false,
          d: "d",
          e: false
        },
        {
          b: false,
          c: false,
          d: false,
          e: "e"
        }
      ]
    },
    "02.01"
  );
  t.end();
});

t.test("02.02 - multiple levels of nested arrays", t => {
  t.same(
    fillMissingKeys(
      {
        c: "c"
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
                key8: false
              }
            ]
          }
        ],
        c: false
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
              key8: false
            }
          ]
        }
      ],
      c: "c"
    },
    "02.02"
  );
  t.end();
});

// ==============================
// 3. String vs array clashes
// ==============================

t.test("03.01 - string vs array clash", t => {
  t.same(
    fillMissingKeys(
      {
        a: "a"
      },
      {
        a: [
          {
            b: false
          }
        ]
      }
    ),
    {
      a: [
        {
          b: false
        }
      ]
    },
    "03.01"
  );
  t.end();
});

t.test("03.02 - string vs object clash", t => {
  t.same(
    fillMissingKeys(
      {
        a: "a"
      },
      {
        a: {
          b: false
        }
      }
    ),
    {
      a: {
        b: false
      }
    },
    "03.02"
  );
  t.end();
});

t.test("03.03 - object vs array clash", t => {
  t.same(
    fillMissingKeys(
      {
        a: {
          c: "ccc"
        }
      },
      {
        a: [
          {
            b: false
          }
        ]
      }
    ),
    {
      a: [
        {
          b: false
        }
      ]
    },
    "03.03"
  );
  t.end();
});

t.test("03.04 - array vs empty array", t => {
  t.same(
    fillMissingKeys(
      {
        a: [],
        b: "b"
      },
      {
        a: [
          {
            d: false,
            e: false
          }
        ],
        b: false,
        c: false
      }
    ),
    {
      a: [
        {
          d: false,
          e: false
        }
      ],
      b: "b",
      c: false
    },
    "03.04"
  );
  t.end();
});

t.test("03.05 - array vs string", t => {
  t.same(
    fillMissingKeys(
      {
        a: "a",
        b: "b"
      },
      {
        a: [
          {
            d: false,
            e: false
          }
        ],
        b: false,
        c: false
      }
    ),
    {
      a: [
        {
          d: false,
          e: false
        }
      ],
      b: "b",
      c: false
    },
    "03.05"
  );
  t.end();
});

t.test("03.06 - array vs bool", t => {
  t.same(
    fillMissingKeys(
      {
        a: true,
        b: "b"
      },
      {
        a: [
          {
            d: false,
            e: false
          }
        ],
        b: false,
        c: false
      }
    ),
    {
      a: [
        {
          d: false,
          e: false
        }
      ],
      b: "b",
      c: false
    },
    "03.06"
  );
  t.end();
});

t.test("03.06 - multiple levels of nested arrays #1", t => {
  t.same(
    fillMissingKeys(
      {
        a: false,
        c: "c"
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
                b5: false
              }
            ]
          }
        ],
        c: false
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
              b5: false
            }
          ]
        }
      ],
      c: "c"
    },
    "03.06"
  );
  t.end();
});

t.test("03.07 - multiple levels of nested arrays #2", t => {
  t.same(
    fillMissingKeys(
      {
        b: [
          {
            b1: "val1",
            b2: "val2",
            b3: [
              {
                b4: "val4"
              },
              {
                b5: "val5"
              }
            ]
          }
        ]
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
                b5: false
              }
            ]
          }
        ],
        c: false
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
              b5: false
            },
            {
              b4: false,
              b5: "val5"
            }
          ]
        }
      ],
      c: false
    },
    "03.07"
  );
  t.end();
});

// ==============================
// 4. Contingencies
// ==============================

t.test("04.01 - number as input", t => {
  t.throws(() => {
    fillMissingKeys(1, {
      a: {
        b: false
      }
    });
  }, /THROW_ID_02/g);
  t.end();
});

t.test("04.02 - boolean as input", t => {
  t.throws(() => {
    fillMissingKeys(true, {
      a: {
        b: false
      }
    });
  }, /THROW_ID_02/g);
  t.end();
});

t.test("04.03 - null as input", t => {
  t.throws(() => {
    fillMissingKeys(null, {
      a: {
        b: false
      }
    });
  }, /THROW_ID_02/g);
  t.end();
});

t.test("04.04 - both args missing (as in hardcoded undefined)", t => {
  t.throws(() => {
    fillMissingKeys(undefined, undefined);
  }, /THROW_ID_02/g);
  t.end();
});

t.test("04.05 - both args completely missing", t => {
  t.throws(() => {
    fillMissingKeys();
  }, /THROW_ID_01/g);
  t.end();
});

t.test("04.06 - second arg is not a plain object", t => {
  t.throws(() => {
    fillMissingKeys({ a: "b" }, 1);
  }, /THROW_ID_03/g);
  t.end();
});

t.test("04.07 - opts is not a plain object", t => {
  t.throws(() => {
    fillMissingKeys({ a: "c" }, { a: "b" }, 1);
  }, /THROW_ID_04/g);
  t.doesNotThrow(() => {
    fillMissingKeys({ a: "c" }, { a: "b" }, null);
  });
  t.end();
});

t.test("04.08 - opts.doNotFillThesePathsIfTheyContainPlaceholders", t => {
  t.throws(() => {
    fillMissingKeys(
      { a: "c" },
      { a: "b" },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", 1]
      }
    );
  }, /THROW_ID_06/g);
  t.throws(() => {
    fillMissingKeys({ a: "c" }, [{ a: "b" }], {
      doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", { a: 1 }]
    });
  }, /THROW_ID_03/g);
  t.throws(() => {
    fillMissingKeys(
      { a: "c" },
      { a: "b" },
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["aa.aaa", { a: 1 }]
      }
    );
  }, /THROW_ID_06/g);
  t.end();
});

// ================================
// 5. Input arg mutation prevention
// ================================

t.test("05.01 - does not mutate the input args", t => {
  const testObj = {
    a: "a"
  };
  const tempRes = fillMissingKeys(testObj, {
    a: false,
    b: false,
    c: false
  });
  t.pass(tempRes); // dummy
  t.same(
    testObj,
    {
      a: "a"
    },
    "05.01"
  ); // real deal
  t.end();
});

// ========================================================
// 6. opts.doNotFillThesePathsIfTheyContainPlaceholders
// ========================================================

t.test(
  "06.01 - some keys filled, some ignored because they have placeholders-only",
  t => {
    // baseline behaviour

    t.same(
      fillMissingKeys(
        {
          a: {
            b: false,
            x: "x"
          },
          z: "z"
        },
        {
          a: {
            b: {
              c: false,
              d: false
            },
            x: false
          },
          z: false
        }
      ),
      {
        a: {
          b: {
            c: false,
            d: false
          },
          x: "x"
        },
        z: "z"
      },
      "06.01.01 - default behaviour - keys are added"
    );

    t.same(
      fillMissingKeys(
        {
          a: {
            b: false,
            x: "x"
          },
          z: "z"
        },
        {
          a: {
            b: {
              c: false,
              d: false
            },
            x: false
          },
          z: false
        },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"]
        }
      ),
      {
        a: {
          b: false, // <---------------- observe, the keys were not added because it had a placeholder
          x: "x"
        },
        z: "z"
      },
      "06.01.02 - opts.doNotFillThesePathsIfTheyContainPlaceholders"
    );

    t.same(
      fillMissingKeys(
        {
          a: {
            b: true, // <-- not placeholder but lower in data hierarchy (boolean)
            x: "x"
          },
          z: "z"
        },
        {
          a: {
            b: {
              // <-- value of path "a.b" is this object
              c: false,
              d: false
            },
            x: false
          },
          z: false
        },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"]
        }
      ),
      {
        a: {
          b: {
            c: false,
            d: false
          }, // <---------------- observe, the keys were not added because it had a placeholder
          x: "x"
        },
        z: "z"
      },
      "06.01.03 - triggering the normalisation when it's off from opts"
    );

    t.same(
      fillMissingKeys(
        {
          a: {
            x: "x"
          },
          z: "z"
        },
        {
          a: {
            b: {
              c: false,
              d: false
            },
            x: false
          },
          z: false
        },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"]
        }
      ),
      {
        a: {
          b: false, // <---------------- observe, the keys were not added because it had a placeholder
          x: "x"
        },
        z: "z"
      },
      "06.01.04 - key in given path is missing completely"
    );

    t.same(
      fillMissingKeys(
        {
          a: "zzz",
          b: false
        },
        {
          a: false,
          b: { c: false }
        },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["b"]
        }
      ),
      {
        a: "zzz",
        b: false
      },
      "06.01.05"
    );

    // will also truncate the already normalised branches if they're on the path:
    t.same(
      fillMissingKeys(
        {
          a: {
            b: {
              c: false,
              d: false
            },
            x: {
              y: false
            }
          },
          z: "z"
        },
        {
          a: {
            b: {
              c: false,
              d: false
            },
            x: false
          },
          z: false
        },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"]
        }
      ),
      {
        a: {
          b: false,
          x: false
        },
        z: "z"
      },
      "06.01.06"
    );

    // will also truncate the already normalised branches if they're on the path:
    t.same(
      fillMissingKeys(
        {
          a: {
            b: {
              c: "r",
              d: false
            },
            x: {
              y: false
            }
          },
          z: "z"
        },
        {
          a: {
            b: {
              c: false,
              d: false
            },
            x: false
          },
          z: false
        },
        {
          doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"]
        }
      ),
      {
        a: {
          b: {
            c: "r",
            d: false
          },
          x: false
        },
        z: "z"
      },
      "06.01.07"
    );
    t.end();
  }
);

// ========================================================
// 7. opts.useNullAsExplicitFalse
// ========================================================

t.test("07.01 - opts.useNullAsExplicitFalse - case #1", t => {
  t.same(
    fillMissingKeys(
      {
        a: {
          b: null,
          x: "x"
        },
        z: "z"
      },
      {
        a: {
          b: {
            c: false,
            d: false
          },
          x: false
        },
        z: false
      },
      {
        useNullAsExplicitFalse: false
      }
    ),
    {
      a: {
        b: {
          c: false,
          d: false
        },
        x: "x"
      },
      z: "z"
    },
    "07.01.01"
  );

  t.same(
    fillMissingKeys(
      {
        a: {
          b: null,
          x: "x"
        },
        z: "z"
      },
      {
        a: {
          b: {
            c: false,
            d: false
          },
          x: false
        },
        z: false
      },
      {
        useNullAsExplicitFalse: true
      }
    ),
    {
      a: {
        b: null,
        x: "x"
      },
      z: "z"
    },
    "07.01.02"
  );
  t.end();
});

t.test("07.02 - opts.useNullAsExplicitFalse - case #2", t => {
  t.same(
    fillMissingKeys(
      {
        a: null
      },
      {
        a: true
      },
      {
        useNullAsExplicitFalse: false
      }
    ),
    {
      a: true
    },
    "07.02.01"
  );
  t.same(
    fillMissingKeys(
      {
        a: null
      },
      {
        a: true
      },
      {
        useNullAsExplicitFalse: true
      }
    ),
    {
      a: null
    },
    "07.02.02"
  );
  t.end();
});

t.test("07.03 - opts.useNullAsExplicitFalse - case #3", t => {
  t.same(
    fillMissingKeys(
      {
        a: null
      },
      {
        a: ["z"]
      },
      {
        useNullAsExplicitFalse: false
      }
    ),
    {
      a: ["z"]
    },
    "07.03.01"
  );
  t.same(
    fillMissingKeys(
      {
        a: null
      },
      {
        a: ["z"]
      },
      {
        useNullAsExplicitFalse: true
      }
    ),
    {
      a: null
    },
    "07.03.02"
  );
  t.end();
});
