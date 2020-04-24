import tap from "tap";
import pMap from "p-map";
import {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  noNewKeysSync,
  findUnusedSync,
  sortAllObjectsSync,
} from "../dist/json-comb-core.esm";

function prepArraySync(arr) {
  const keySet = getKeysetSync(arr);
  return arr.map((obj) => enforceKeysetSync(obj, keySet));
}

function prepArray(arr) {
  return getKeyset(arr).then((keySet) =>
    pMap(arr, (obj) => enforceKeyset(obj, keySet))
  );
}

function makePromise(arr) {
  return arr.map((el) => Promise.resolve(el));
}

// -----------------------------------------------------------------------------
// 01. getKeysetSync()
// -----------------------------------------------------------------------------

tap.test("01.01 - getKeysetSync() - throws when there's no input", (t) => {
  t.throws(() => {
    getKeysetSync();
  });
  t.end();
});

tap.test("01.02 - getKeysetSync() - throws when input is not an array", (t) => {
  t.throws(() => {
    getKeysetSync("aa");
  });
  t.end();
});

tap.test("01.03 - getKeysetSync() - throws when input array is empty", (t) => {
  t.throws(() => {
    getKeysetSync([]);
  });
  t.end();
});

tap.test(
  "01.04 - getKeysetSync() - throws when input array contains not only plain objects",
  (t) => {
    t.throws(() => {
      getKeysetSync([
        {
          a: "a",
          b: "b",
        },
        {
          a: "a",
        },
        "zzzz",
      ]);
    });
    t.end();
  }
);

tap.test(
  "01.05 - getKeysetSync() - calculates - three objects - default placeholder",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: "a",
          b: "c",
          c: {
            d: "d",
            e: "e",
          },
        },
        {
          a: "a",
        },
        {
          c: {
            f: "f",
          },
        },
      ]),
      {
        a: false,
        b: false,
        c: {
          d: false,
          e: false,
          f: false,
        },
      },
      "01.05"
    );
    t.end();
  }
);

tap.test(
  "01.06 - getKeysetSync() - calculates - three objects - custom placeholder",
  (t) => {
    t.same(
      getKeysetSync(
        [
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ],
        { placeholder: true }
      ),
      {
        a: true,
        b: true,
        c: {
          d: true,
          e: true,
          f: true,
        },
      },
      "01.06.01"
    );
    t.same(
      getKeysetSync(
        [
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ],
        { placeholder: "" }
      ),
      {
        a: "",
        b: "",
        c: {
          d: "",
          e: "",
          f: "",
        },
      },
      "01.06.02"
    );
    t.same(
      getKeysetSync(
        [
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ],
        { placeholder: { a: "a" } }
      ),
      {
        a: { a: "a" },
        b: { a: "a" },
        c: {
          d: { a: "a" },
          e: { a: "a" },
          f: { a: "a" },
        },
      },
      "01.06.03"
    );
    t.end();
  }
);

tap.test(
  "01.07 - getKeysetSync() - settings argument is not a plain object - throws",
  (t) => {
    t.throws(() => {
      getKeysetSync([{ a: "a" }, { b: "b" }], "zzz");
    }, /THROW_ID_24/);
    t.end();
  }
);

tap.test("01.08 - getKeysetSync() - multiple levels of nested arrays", (t) => {
  t.same(
    getKeysetSync([
      {
        key2: [
          {
            key5: "val5",
            key4: "val4",
            key6: [
              {
                key8: "val8",
              },
              {
                key7: "val7",
              },
            ],
          },
        ],
        key1: "val1",
      },
      {
        key1: false,
        key3: "val3",
      },
    ]),
    {
      key1: false,
      key2: [
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
      key3: false,
    },
    "01.08"
  );
  t.end();
});

tap.test(
  "01.09 - getKeysetSync() - objects that are directly in values",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: {
            b: "c",
            d: "e",
          },
          k: "l",
        },
        {
          a: {
            f: "g",
            b: "c",
            h: "i",
          },
          m: "n",
        },
      ]),
      {
        a: {
          b: false,
          d: false,
          f: false,
          h: false,
        },
        k: false,
        m: false,
      },
      "01.09.01"
    );
    t.same(
      getKeysetSync([
        {
          a: {
            f: "g",
            b: "c",
            h: "i",
          },
          m: "n",
        },
        {
          a: {
            b: "c",
            d: "e",
          },
          k: "l",
        },
      ]),
      {
        a: {
          b: false,
          d: false,
          f: false,
          h: false,
        },
        k: false,
        m: false,
      },
      "01.09.02"
    );
    t.end();
  }
);

tap.test(
  "01.10 - getKeysetSync() - deeper level arrays containing only strings",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          a: false,
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      "01.10.01"
    );
    t.end();
  }
);

tap.test(
  "01.11 - getKeysetSync() - deeper level array with string vs false",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          a: false,
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      "01.11 - if arrays contain any strings, result is empty array"
    );
    t.end();
  }
);

tap.test(
  "01.12 - getKeysetSync() - two deeper level arrays with strings",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          b: {
            c: {
              d: ["eee", "fff", "ggg"],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      "01.12 - if arrays contain any strings, result is empty array"
    );
    t.end();
  }
);

tap.test(
  "01.13 - getKeysetSync() - two deeper level arrays with mixed contents",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          b: {
            c: {
              d: [{ a: "zzz" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ a: false }],
          },
        },
      },
      "01.13 - plain object vs string"
    );
    t.end();
  }
);

tap.test(
  "01.14 - getKeysetSync() - two deeper level arrays with plain objects",
  (t) => {
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: [{ a: "aaa" }],
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
        {
          b: {
            c: {
              d: false,
            },
          },
        },
        {
          b: {
            c: false,
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ a: false, b: false, c: false }],
          },
        },
      },
      "01.14.01 - object vs object"
    );
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: [],
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ b: false, c: false }],
          },
        },
      },
      "01.14.02 - object vs object"
    );
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: false,
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ b: false, c: false }],
          },
        },
      },
      "01.14.03 - object vs object"
    );
    t.same(
      getKeysetSync([
        {
          a: false,
          b: {
            c: {
              d: "text",
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ b: false, c: false }],
          },
        },
      },
      "01.14.04 - object vs object"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. enforceKeysetSync()
// -----------------------------------------------------------------------------

tap.test("02.01 - enforceKeysetSync() - enforces a simple schema", (t) => {
  const schema = getKeysetSync([
    {
      a: "aaa",
      b: "bbb",
    },
    {
      a: "ccc",
    },
  ]);
  t.same(
    enforceKeysetSync(
      {
        a: "ccc",
      },
      schema
    ),
    {
      a: "ccc",
      b: false,
    },
    "02.01"
  );
  t.end();
});

tap.test(
  "02.02 - enforceKeysetSync() - enforces a more complex schema",
  (t) => {
    const obj1 = {
      b: [
        {
          c: "ccc",
          d: "ddd",
        },
      ],
      a: "aaa",
    };
    const obj2 = {
      a: "ccc",
      e: "eee",
    };
    const obj3 = {
      a: "zzz",
    };
    const schema = getKeysetSync([obj1, obj2, obj3]);
    t.same(
      schema,
      {
        a: false,
        b: [
          {
            c: false,
            d: false,
          },
        ],
        e: false,
      },
      "02.02 - .getKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj1, schema),
      {
        a: "aaa",
        b: [
          {
            c: "ccc",
            d: "ddd",
          },
        ],
        e: false,
      },
      "02.02.01 - .enforceKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj2, schema),
      {
        a: "ccc",
        b: [
          {
            c: false,
            d: false,
          },
        ],
        e: "eee",
      },
      "02.02.02 - .enforceKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj3, schema),
      {
        a: "zzz",
        b: [
          {
            c: false,
            d: false,
          },
        ],
        e: false,
      },
      "02.02.03 - .enforceKeysetSync"
    );
    t.end();
  }
);

tap.test(
  "02.03 - enforceKeysetSync() - enforces a schema involving arrays",
  (t) => {
    const obj1 = {
      a: [
        {
          b: "b",
        },
      ],
    };
    const obj2 = {
      a: false,
    };
    const schema = getKeysetSync([obj1, obj2]);
    t.same(
      schema,
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "02.03 - .getKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj1, schema),
      {
        a: [
          {
            b: "b",
          },
        ],
      },
      "02.03.01 - .enforceKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj2, schema),
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "02.03.02 - .enforceKeysetSync"
    );
    t.end();
  }
);

tap.test("02.04 - enforceKeysetSync() - another set involving arrays", (t) => {
  t.same(
    prepArraySync([
      {
        c: "c val",
      },
      {
        b: [
          {
            b2: "b2 val",
            b1: "b1 val",
          },
        ],
        a: "a val",
      },
    ]),
    [
      {
        a: false,
        b: [
          {
            b1: false,
            b2: false,
          },
        ],
        c: "c val",
      },
      {
        a: "a val",
        b: [
          {
            b1: "b1 val",
            b2: "b2 val",
          },
        ],
        c: false,
      },
    ],
    "02.04"
  );
  t.end();
});

tap.test("02.05 - enforceKeysetSync() - deep-nested arrays", (t) => {
  t.same(
    prepArraySync([
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
                                    h: "h",
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
      {
        a: "zzz",
      },
    ]),
    [
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
                                    h: "h",
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
                                    h: false,
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
    "02.05"
  );
  t.end();
});

tap.test(
  "02.06 - enforceKeysetSync() - enforces a schema involving arrays",
  (t) => {
    const obj1 = {
      a: [
        {
          b: "b",
        },
      ],
    };
    const obj2 = {
      a: "a",
    };
    const schema = getKeysetSync([obj1, obj2]);
    t.same(
      schema,
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "02.06.01 - .getKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj1, schema),
      {
        a: [
          {
            b: "b",
          },
        ],
      },
      "02.06.02 - .enforceKeysetSync"
    );
    t.same(
      enforceKeysetSync(obj2, schema),
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "02.06.03 - .enforceKeysetSync"
    );
    t.end();
  }
);

tap.test(
  "02.07 - enforceKeysetSync() - multiple objects within an array",
  (t) => {
    t.same(
      prepArraySync([
        {
          a: "a",
        },
        {
          a: [
            {
              d: "d",
            },
            {
              c: "c",
            },
            {
              a: "a",
            },
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
              a: false,
              b: false,
              c: false,
              d: false,
            },
          ],
        },
        {
          a: [
            {
              a: false,
              b: false,
              c: false,
              d: "d",
            },
            {
              a: false,
              b: false,
              c: "c",
              d: false,
            },
            {
              a: "a",
              b: false,
              c: false,
              d: false,
            },
            {
              a: false,
              b: "b",
              c: false,
              d: false,
            },
          ],
        },
      ],
      "02.07"
    );
    t.end();
  }
);

tap.test("02.08 - enforceKeysetSync() - multiple levels of arrays", (t) => {
  const obj1 = {
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
  };
  const obj2 = {
    c: "ccc",
    a: false,
  };
  t.same(
    prepArraySync([obj1, obj2]),
    [
      {
        a: "aaa",
        b: [
          {
            c: "ccc",
            d: "ddd",
            e: [
              {
                f: "fff",
                g: false,
              },
              {
                f: false,
                g: "ggg",
              },
            ],
          },
        ],
        c: false,
      },
      {
        a: false,
        b: [
          {
            c: false,
            d: false,
            e: [
              {
                f: false,
                g: false,
              },
            ],
          },
        ],
        c: "ccc",
      },
    ],
    "02.08"
  );
  t.end();
});

tap.test("02.09 - enforceKeysetSync() - array vs string clashes", (t) => {
  t.same(
    prepArraySync([
      {
        a: "aaa",
      },
      {
        a: [
          {
            b: "bbb",
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
      {
        a: [
          {
            b: "bbb",
          },
        ],
      },
    ],
    "02.09"
  );
  t.end();
});

tap.test("02.10 - enforceKeysetSync() - all inputs missing - throws", (t) => {
  t.throws(() => {
    enforceKeysetSync();
  });
  t.end();
});

tap.test(
  "02.11 - enforceKeysetSync() - second input arg missing - throws",
  (t) => {
    t.throws(() => {
      enforceKeysetSync({ a: "a" });
    });
    t.end();
  }
);

tap.test(
  "02.12 - enforceKeysetSync() - second input arg is not a plain obj - throws",
  (t) => {
    t.throws(() => {
      enforceKeysetSync({ a: "a" }, "zzz");
    });
    t.end();
  }
);

tap.test(
  "02.13 - enforceKeysetSync() - first input arg is not a plain obj - throws",
  (t) => {
    t.throws(() => {
      enforceKeysetSync("zzz", "zzz");
    });
    t.end();
  }
);

tap.test("02.14 - enforceKeysetSync() - array over empty array", (t) => {
  const obj1 = {
    a: [
      {
        d: "d",
      },
      {
        e: "e",
      },
    ],
    c: "c",
  };
  const obj2 = {
    a: [],
    b: "b",
  };
  const schema = getKeysetSync([obj1, obj2]);
  t.same(
    schema,
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: false,
      c: false,
    },
    "02.14.01"
  );
  t.same(
    enforceKeysetSync(obj1, schema),
    {
      a: [
        {
          d: "d",
          e: false,
        },
        {
          d: false,
          e: "e",
        },
      ],
      b: false,
      c: "c",
    },
    "02.14.02"
  );
  t.same(
    enforceKeysetSync(obj2, schema),
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
    "02.14.03"
  );
  t.end();
});

tap.test("02.15.01 - enforceKeysetSync() - opts", (t) => {
  const schema = getKeysetSync([
    {
      a: "aaa",
      b: { c: "ccc" },
    },
    {
      a: "ddd",
      b: false,
    },
  ]);
  t.same(
    enforceKeysetSync(
      {
        a: "zzz",
        b: false,
      },
      schema,
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["b"],
      }
    ),
    {
      a: "zzz",
      b: false,
    },
    "02.15.01"
  );
  t.end();
});

tap.test("02.15.02 - enforceKeysetSync() - opts", (t) => {
  const schema = getKeysetSync([
    {
      a: "aaa",
      b: { c: "ccc" },
    },
    {
      a: "ddd",
      b: false,
    },
  ]);
  t.same(
    enforceKeysetSync(
      {
        a: "zzz",
      },
      schema,
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["b"],
      }
    ),
    {
      a: "zzz",
      b: false,
    },
    "02.15.02 - opts-targeted key is absent"
  );
  t.end();
});

tap.test("02.15.03 - enforceKeysetSync() - opts off", (t) => {
  const schema = getKeysetSync([
    {
      a: "aaa",
      b: { c: "ccc" },
    },
    {
      a: "ddd",
      b: false,
    },
  ]);
  t.same(
    enforceKeysetSync(
      {
        a: "zzz",
      },
      schema,
      {
        doNotFillThesePathsIfTheyContainPlaceholders: [],
      }
    ),
    {
      a: "zzz",
      b: { c: false },
    },
    "02.15.03"
  );
  t.end();
});

tap.test(
  "02.16 - enforceKeysetSync() - opts.doNotFillThesePathsIfTheyContainPlaceholders is wrong",
  (t) => {
    t.throws(() => {
      enforceKeysetSync(
        { a: "a" },
        { a: "a", b: "b" },
        { doNotFillThesePathsIfTheyContainPlaceholders: 1 }
      );
    });
    t.throws(() => {
      enforceKeysetSync(
        { a: "a" },
        { a: "a", b: "b" },
        { doNotFillThesePathsIfTheyContainPlaceholders: [1] }
      );
    });
    t.end();
  }
);

tap.test("02.17 - enforceKeysetSync() - opts.useNullAsExplicitFalse", (t) => {
  const schema = getKeysetSync([
    {
      a: "aaa",
      b: "bbb",
    },
    {
      a: {
        c: "ccc",
      },
    },
  ]);
  t.same(
    enforceKeysetSync(
      {
        a: null,
      },
      schema
    ),
    {
      a: null,
      b: false,
    },
    "02.17.01 - default behaviour"
  );
  t.same(
    enforceKeysetSync(
      {
        a: null,
      },
      schema,
      { useNullAsExplicitFalse: false }
    ),
    {
      a: {
        c: false,
      },
      b: false,
    },
    "02.17.02 - off via opts"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 03. guards against input arg mutation
// -----------------------------------------------------------------------------

tap.test(
  "03.01 - enforceKeysetSync() - does not mutate the input args",
  (t) => {
    const obj1 = {
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
    };
    const obj2 = {
      c: "ccc",
      a: false,
    };
    const dummyResult = enforceKeysetSync(obj2, getKeysetSync([obj1, obj2]));
    t.pass(dummyResult); // necessary to avoid unused vars
    t.same(
      obj2,
      {
        c: "ccc",
        a: false,
      },
      "03.01"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 04. noNewKeysSync()
// -----------------------------------------------------------------------------

tap.test("04.01 - noNewKeysSync() - BAU", (t) => {
  t.same(
    noNewKeysSync(
      {
        a: "a",
        c: "c",
      },
      {
        a: "aaa",
        b: "bbb",
        c: "ccc",
      }
    ),
    [],
    "04.01.01 - no new keys"
  );
  t.same(
    noNewKeysSync(
      {
        a: "a",
        b: "b",
        c: "c",
      },
      {
        a: "aaa",
        c: "ccc",
      }
    ),
    ["b"],
    "04.01.02 - new key, b"
  );
  t.end();
});

tap.test(
  "04.02 - noNewKeysSync() - objects within arrays within objects",
  (t) => {
    t.same(
      noNewKeysSync(
        {
          z: [
            {
              a: "a",
              b: "b",
              c: "c",
            },
            {
              a: false,
              b: false,
              c: "c",
            },
          ],
        },
        {
          z: [
            {
              a: "a",
              b: "b",
              c: "c",
            },
            {
              a: false,
              b: false,
              c: "c",
            },
          ],
        }
      ),
      [],
      "04.02.01 - same key set, just values differ"
    );
    t.same(
      noNewKeysSync(
        {
          z: [
            {
              a: "a",
              b: "b",
            },
            {
              a: false,
              b: false,
            },
          ],
        },
        {
          z: [
            {
              a: "a",
              b: "b",
              c: "c",
            },
            {
              a: false,
              b: false,
              c: "c",
            },
          ],
        }
      ),
      [],
      "04.02.02 - less keys"
    );
    t.same(
      noNewKeysSync(
        {
          z: [
            {
              a: "a",
              b: "b",
              c: "c",
            },
            {
              a: false,
              b: false,
              c: "c",
            },
          ],
        },
        {
          z: [
            {
              a: "a",
              b: "b",
            },
            {
              a: false,
              b: false,
            },
          ],
        }
      ),
      ["z[0].c", "z[1].c"],
      "04.02.03 - key c"
    );
    t.end();
  }
);

tap.test("04.03 - noNewKeysSync() - various throws", (t) => {
  t.throws(() => {
    noNewKeysSync();
  }, /THROW_ID_51/g);
  t.throws(() => {
    noNewKeysSync({ a: "a" });
  }, /THROW_ID_52/g);
  t.throws(() => {
    noNewKeysSync(1, { a: "a" });
  }, /THROW_ID_53/g);
  t.throws(() => {
    noNewKeysSync(["a"], ["a"]);
  }, /THROW_ID_53/g);
  t.throws(() => {
    noNewKeysSync({ a: "a" }, 1);
  }, /THROW_ID_54/g);
  t.end();
});

// -----------------------------------------------------------------------------
// 05. findUnusedSync()
// -----------------------------------------------------------------------------

tap.test("05.01 - findUnusedSync() - single-level plain objects", (t) => {
  t.same(
    findUnusedSync([
      {
        a: false,
        b: "bbb1",
        c: false,
      },
      {
        a: "aaa",
        b: "bbb2",
        c: false,
      },
    ]),
    ["c"],
    "05.01.01 - running on defaults"
  );
  t.same(
    findUnusedSync([
      {
        a: false,
        b: "bbb1",
        c: false,
      },
      {
        a: "aaa",
        b: "bbb2",
        c: false,
      },
      {},
    ]),
    ["c"],
    "05.01.02 - not normalised is fine as well"
  );
  t.end();
});

tap.test("05.02 - findUnusedSync() - multiple-level plain objects", (t) => {
  t.same(
    findUnusedSync([
      {
        a: [
          {
            k: false,
            l: false,
            m: false,
          },
          {
            k: "k",
            l: false,
            m: "m",
          },
        ],
        b: "bbb1",
        c: false,
      },
      {
        a: [
          {
            k: "k",
            l: false,
            m: "m",
          },
          {
            k: "k",
            l: false,
            m: "m",
          },
        ],
        b: "bbb2",
        c: false,
      },
    ]),
    ["c", "a[0].l"],
    "05.02.01 - multiple levels, two objects, two unused keys, defaults"
  );
  t.same(
    findUnusedSync([
      {
        a: [
          {
            k: false,
            l: false,
            m: false,
          },
          {
            k: "k",
            l: false,
            m: "m",
          },
        ],
        b: "bbb1",
        c: false,
      },
      {
        a: [
          {
            k: "k",
            l: false,
            m: "m",
          },
          {
            k: "k",
            l: false,
            m: "m",
          },
        ],
        b: "bbb2",
        c: false,
      },
      { b: false },
      { c: false },
    ]),
    ["c", "a[0].l"],
    "05.02.02 - not normalised, see third and fourth args, not normalised objects"
  );
  t.end();
});

tap.test("05.03 - findUnusedSync() - double-nested arrays", (t) => {
  t.same(
    findUnusedSync([
      {
        a: [
          [
            {
              k: false,
              l: false,
              m: false,
            },
            {
              k: "k",
              l: false,
              m: "m",
            },
          ],
        ],
        b: "bbb1",
        c: false,
      },
      {
        a: [
          [
            {
              k: false,
              l: "l",
              m: "m",
            },
            {
              k: false,
              l: "l",
              m: "m",
            },
          ],
        ],
        b: "bbb2",
        c: false,
      },
    ]),
    ["c", "a[0][0].l", "a[0][1].k"],
    "05.03.01"
  );
  t.same(
    findUnusedSync([
      {
        a: [
          [
            {
              k: false,
              l: false,
              m: false,
            },
            {
              k: "k",
              l: false,
              m: "m",
            },
          ],
        ],
        b: "bbb1",
        c: false,
      },
      {
        a: [
          [
            {
              k: false,
              l: "l",
              m: "m",
            },
            {
              k: false,
              l: "l",
              m: "m",
            },
          ],
        ],
        b: "bbb2",
        c: false,
      },
      {
        a: false,
      },
    ]),
    ["c", "a[0][0].l", "a[0][1].k"],
    "05.03.02 - value false vs values as arrays - in the context of unused-ness"
  );
  t.end();
});

tap.test("05.04 - findUnusedSync() - works on empty arrays", (t) => {
  t.same(findUnusedSync([]), [], "05.04.01");
  t.same(findUnusedSync([{}]), [], "05.04.02");
  t.same(findUnusedSync([{}, {}]), [], "05.04.03");
  t.end();
});

tap.test("05.05 - findUnusedSync() - various throws", (t) => {
  t.throws(() => {
    findUnusedSync(1, { placeholder: false });
  });
  t.doesNotThrow(() => {
    findUnusedSync([1, 2, 3]);
  });
  t.throws(() => {
    findUnusedSync([{ a: "a" }, { a: "b" }], 1);
  });
  t.end();
});

tap.test(
  "05.06 - findUnusedSync() - case of empty array within an array",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: [[]],
          b: "bbb1",
          c: false,
        },
        {
          a: [[]],
          b: "bbb2",
          c: false,
        },
      ]),
      ["c"],
      "05.06.01 - normal"
    );
    t.same(
      findUnusedSync([
        {
          a: [[]],
          b: "bbb1",
          c: false,
        },
        {
          a: [[]],
          b: "bbb2",
          c: false,
        },
        {},
        {},
      ]),
      ["c"],
      "05.06.02 - not normalised"
    );
    t.end();
  }
);

tap.test(
  "05.07 - findUnusedSync() - case of empty array within an array",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: [[]],
          b: "bbb1",
          c: false,
        },
      ]),
      [],
      "05.07.01 - normalised"
    );
    t.same(
      findUnusedSync([
        {
          a: [[]],
          b: "bbb1",
          c: false,
        },
        {},
        { a: false },
      ]),
      ["c"],
      "05.07.02 - not normalised. Now that there are three inputs (even two of them empty-ish) result is the key c"
    );
    t.end();
  }
);

tap.test(
  "05.08 - findUnusedSync() - objects containing objects (2 in total)",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
          },
          b: "bbb1",
          c: false,
        },
        {
          a: {
            x: false,
            y: "z",
          },
          b: "bbb2",
          c: false,
        },
      ]),
      ["c", "a.x"],
      "05.08.01"
    );
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
          },
          b: "bbb1",
          c: false,
          d: {
            y: "y",
            x: false,
          },
          e: false,
        },
        {
          a: {
            x: false,
            y: "z",
          },
          b: "bbb2",
          c: false,
          d: {
            y: "y",
            x: false,
          },
          e: false,
        },
      ]),
      ["c", "e", "a.x", "d.x"],
      "05.08.02"
    );
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
          },
          b: "bbb1",
          c: false,
          d: {
            y: "y",
            x: false,
          },
          e: false,
        },
        {
          a: {
            x: false,
            y: "z",
          },
          b: "bbb2",
          c: false,
          d: {
            y: "y",
            x: false,
          },
          e: false,
        },
        { c: false },
      ]),
      ["c", "e", "a.x", "d.x"],
      "05.08.03 - not normalised"
    );
    t.end();
  }
);

tap.test(
  "05.09 - findUnusedSync() - objects containing objects (3 in total)",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
            k: {
              l: false,
              m: "zzz",
            },
          },
          b: "bbb1",
          c: false,
        },
        {
          a: {
            x: false,
            y: "z",
            k: {
              l: false,
              m: "yyy",
            },
          },
          b: "bbb2",
          c: false,
        },
      ]),
      ["c", "a.x", "a.k.l"],
      "05.09.01 - normalised, on default placeholder"
    );
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
            k: {
              l: false,
              m: "zzz",
            },
          },
          b: "bbb1",
          c: false,
        },
        {
          a: {
            x: false,
            y: "z",
            k: {
              l: false,
              m: "yyy",
            },
          },
          b: "bbb2",
          c: false,
        },
        {},
        { c: false },
      ]),
      ["c", "a.x", "a.k.l"],
      "05.09.02 - not normalised, on default placeholder"
    );
    t.end();
  }
);

tap.test(
  "05.10 - findUnusedSync() - objects containing objects, mixed with arrays",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
            k: {
              l: false,
              m: "zzz",
              p: {
                r: [
                  {
                    w: false,
                    x: "zzz",
                  },
                  {
                    w: false,
                    x: "zzz",
                  },
                ],
              },
            },
          },
          b: "bbb1",
          c: false,
        },
        {
          a: {
            x: false,
            y: "z",
            k: {
              l: false,
              m: false,
              p: {
                r: [
                  {
                    w: "www",
                    x: false,
                  },
                  {
                    w: "zzz",
                    x: false,
                  },
                ],
              },
            },
          },
          b: "bbb2",
          c: false,
        },
      ]),
      ["c", "a.x", "a.k.l"],
      "05.10.01"
    );
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
            k: {
              l: false,
              m: "zzz",
              p: {
                r: [
                  {
                    w: "xxx",
                    x: false,
                  },
                  {
                    w: "w2",
                    x: false,
                  },
                ],
              },
            },
          },
          b: "bbb1",
          c: false,
        },
        {
          a: {
            x: false,
            y: "z",
            k: {
              l: false,
              m: false,
              p: {
                r: [
                  {
                    w: "www",
                    x: false,
                  },
                  {
                    w: "zzz",
                    x: false,
                  },
                ],
              },
            },
          },
          b: "bbb2",
          c: false,
        },
      ]),
      ["c", "a.x", "a.k.l", "a.k.p.r[0].x"],
      "05.10.02 - even deeper"
    );
    t.same(
      findUnusedSync([
        {
          a: {
            x: false,
            y: "y",
            k: {
              l: false,
              m: "zzz",
              p: {
                r: [
                  {
                    w: "xxx",
                    x: false,
                  },
                  {
                    w: "w2",
                    x: false,
                  },
                ],
              },
            },
          },
          b: "bbb1",
          c: false,
        },
        {
          a: {
            x: false,
            y: "z",
            k: {
              l: false,
              m: false,
              p: {
                r: [
                  {
                    w: "www",
                    x: false,
                  },
                  {
                    w: "zzz",
                    x: false,
                  },
                  {},
                ],
              },
            },
          },
          b: "bbb2",
          c: false,
        },
        {},
      ]),
      ["c", "a.x", "a.k.l", "a.k.p.r[0].x"],
      "05.10.03 - even deeper plus not normalised in deeper levels"
    );
    t.end();
  }
);

tap.test(
  "05.11 - findUnusedSync() - array contents are not objects/arrays",
  (t) => {
    t.same(
      findUnusedSync([false, false, false]),
      [],
      "05.11.01 - topmost level, Booleans"
    );
    t.same(
      findUnusedSync(["zzz", "zzz", "zzz"]),
      [],
      "05.11.02 - topmost level, strings"
    );
    t.same(
      findUnusedSync([{}, {}, {}]),
      [],
      "05.11.03 - topmost level, empty plain objects"
    );
    t.end();
  }
);

tap.test(
  "05.12 - findUnusedSync() - array > single object > array > unused inside",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: [
            {
              k: false,
              l: "l1",
            },
            {
              k: false,
              l: "l2",
            },
            {
              k: false,
              l: false,
            },
            {
              k: false,
              l: "l4",
            },
          ],
          b: "b",
        },
      ]),
      ["a[0].k"],
      "05.12.01 - topmost array has a single object"
    );
    t.same(
      findUnusedSync([
        {
          a: [
            {
              k: false,
              l: "l1",
            },
            {
              k: false,
              l: "l2",
            },
            {
              k: false,
              l: false,
            },
            {
              k: false,
              l: "l4",
            },
          ],
          b: "b",
        },
        {
          a: [
            {
              k: false,
              l: "l1",
            },
            {
              k: false,
              l: "l2",
            },
            {
              k: false,
              l: false,
            },
            {
              k: false,
              l: "l4",
            },
          ],
          b: "b",
        },
      ]),
      ["a[0].k"],
      "05.12.02 - topmost array has multiple objects"
    );
    t.end();
  }
);

tap.test(
  "05.13 - findUnusedSync() - simple case of not normalised input",
  (t) => {
    t.same(
      findUnusedSync([
        {
          a: false,
          b: false,
          c: "c",
        },
        {
          a: false,
          b: false,
          c: "c",
        },
        {
          c: "c",
        },
      ]),
      ["a", "b"],
      "05.13 - default placeholder"
    );
    t.end();
  }
);

tap.test("05.14 - findUnusedSync() - opts.comments", (t) => {
  t.same(
    findUnusedSync([
      {
        a: false,
        b: "bbb1",
        b__comment__this_is_a_comment_for_key_b: false,
        c: false,
      },
      {
        a: "aaa",
        b: "bbb2",
        b__comment__this_is_a_comment_for_key_b: false,
        c: false,
      },
    ]),
    ["c"],
    "05.14.01 - defaults recognise the comment substring within the key"
  );
  t.same(
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: "zzz" }
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "05.14.02 - ignores comment fields because they match default value"
  );
  t.same(
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: false }
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "05.14.03 - falsey opts.comments - instruction to turn it off"
  );
  t.same(
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: 0 }
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "05.14.04 - falsey opts.comments - instruction to turn it off"
  );
  t.same(
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: null }
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "05.14.05 - falsey opts.comments - instruction to turn it off"
  );
  t.same(
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: undefined }
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "05.14.06 - falsey opts.comments - instruction to turn it off"
  );
  t.same(
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: "" }
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "05.14.07 - falsey opts.comments - instruction to turn it off"
  );
  t.throws(() => {
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: 1 }
    );
  });
  t.throws(() => {
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: "1" }
    );
  });
  t.throws(() => {
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: true }
    );
  });
  t.throws(() => {
    findUnusedSync(
      [
        {
          a: false,
          b: "bbb1",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: "aaa",
          b: "bbb2",
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: "true" }
    );
  });
  t.end();
});

// -----------------------------------------------------------------------------
// 06. sortAllObjectsSync()
// -----------------------------------------------------------------------------

tap.test("06.01 - sortAllObjectsSync() - plain object", (t) => {
  let original = {
    a: "a",
    c: "c",
    b: "b",
  };
  let sorted = {
    a: "a",
    b: "b",
    c: "c",
  };
  t.notDeepEqual(JSON.stringify(original), JSON.stringify(sorted)); // control
  t.same(
    JSON.stringify(sortAllObjectsSync(original)),
    JSON.stringify(sorted),
    "06.01"
  ); // test
  t.end();
});

tap.test("06.02 - sortAllObjectsSync() - non-sortable input types", (t) => {
  t.same(sortAllObjectsSync(null), null, "06.02.01");
  t.same(sortAllObjectsSync(1), 1, "06.02.02");
  t.same(sortAllObjectsSync("zzz"), "zzz", "06.02.03");
  t.same(sortAllObjectsSync(undefined), undefined, "06.02.04");
  const f = (a) => a;
  t.same(sortAllObjectsSync(f), f, "06.02.05");
  t.end();
});

tap.test("06.03 - sortAllObjectsSync() - object-array-object", (t) => {
  t.same(
    sortAllObjectsSync({
      a: "a",
      c: [
        {
          m: "m",
          l: "l",
          k: "k",
        },
        {
          s: "s",
          r: "r",
          p: "p",
        },
      ],
      b: "b",
    }),
    {
      a: "a",
      b: "b",
      c: [
        {
          k: "k",
          l: "l",
          m: "m",
        },
        {
          p: "p",
          r: "r",
          s: "s",
        },
      ],
    },
    "06.03"
  );
  t.end();
});

tap.test("06.04 - sortAllObjectsSync() - object very deep", (t) => {
  t.same(
    sortAllObjectsSync({
      a: [
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
                                    b: {
                                      c: [
                                        [
                                          [
                                            [
                                              [
                                                [
                                                  {
                                                    n: "kdjfsjf;j",
                                                    m: "flslfjlsjdf",
                                                  },
                                                ],
                                              ],
                                            ],
                                          ],
                                        ],
                                      ],
                                    },
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
    }),
    {
      a: [
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
                                    b: {
                                      c: [
                                        [
                                          [
                                            [
                                              [
                                                [
                                                  {
                                                    m: "flslfjlsjdf",
                                                    n: "kdjfsjf;j",
                                                  },
                                                ],
                                              ],
                                            ],
                                          ],
                                        ],
                                      ],
                                    },
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
    },
    "06.04"
  );
  t.end();
});

tap.test("06.05 - sortAllObjectsSync() - nested case", (t) => {
  let original = {
    b: "bbb",
    a: [
      {
        z: "fdggdfg",
        m: "gdfgdf",
        a: "asdasd",
      },
    ],
    c: "ccc",
  };
  let sorted = {
    a: [
      {
        a: "asdasd",
        m: "gdfgdf",
        z: "fdggdfg",
      },
    ],
    b: "bbb",
    c: "ccc",
  };
  t.notDeepEqual(JSON.stringify(original), JSON.stringify(sorted), "06.05.01"); // control
  t.same(
    JSON.stringify(sortAllObjectsSync(original)),
    JSON.stringify(sorted),
    "06.05.02"
  );
  t.end();
});

tap.test("06.06 - sortAllObjectsSync() - nested case", (t) => {
  const original = {
    lastRan: 6,
    lastPublished: 5,
    "1.1.10": 2,
    "1.1.9": 1,
    "1.2.1": 4,
    "1.2.0": 3,
  };
  const res = `{
  "1.1.9": 1,
  "1.1.10": 2,
  "1.2.0": 3,
  "1.2.1": 4,
  "lastPublished": 5,
  "lastRan": 6
}`;

  t.equal(JSON.stringify(sortAllObjectsSync(original), null, 2), res);
  t.end();
});

// -----------------------------------------------------------------------------
// 07. input arg mutation tests
// -----------------------------------------------------------------------------

/* eslint prefer-const:0 */
// we deliberately use VAR to "allow" mutation. In theory, of course, because it does not happen.

tap.test("07.01 - does not mutate input args: enforceKeysetSync()", (t) => {
  let source = {
    a: "a",
  };
  let frozen = {
    a: "a",
  };
  let dummyResult = enforceKeysetSync(source, { a: false, b: false });
  t.pass(dummyResult); // a mickey assertion to trick the Standard
  t.equal(JSON.stringify(source), JSON.stringify(frozen));
  t.end();
});

tap.test("07.02 - does not mutate input args: noNewKeysSync()", (t) => {
  let source = {
    a: "a",
  };
  let frozen = {
    a: "a",
  };
  let dummyResult = noNewKeysSync(source, { a: false, b: false });
  t.pass(dummyResult); // a mickey assertion to trick ESLint to think it's used
  t.equal(JSON.stringify(source), JSON.stringify(frozen));
  t.end();
});

tap.test("07.03 - does not mutate input args: sortAllObjectsSync()", (t) => {
  let source = {
    a: "a",
    c: "c",
    b: "b",
  };
  let frozen = {
    a: "a",
    c: "c",
    b: "b",
  };
  let dummyResult = sortAllObjectsSync(source); // let's try to mutate "source"
  t.pass(dummyResult); // a mickey assertion to trick ESLint to think it's used
  t.equal(JSON.stringify(source), JSON.stringify(frozen));
  t.end();
});

// -----------------------------------------------------------------------------
// 08. getKeyset()  - async version of getKeysetSync()
// -----------------------------------------------------------------------------

tap.test("08.01 - getKeyset() - throws when there's no input", (t) => {
  t.throws(() => {
    getKeyset();
  });
  t.end();
});

tap.test(
  "08.02 - getKeyset() - throws when input is not an array of promises",
  (t) => {
    t.throws(() => {
      getKeyset(makePromise("aa"));
    });
    t.end();
  }
);

tap.test(
  "08.03 - getKeyset() - resolves to a rejected promise when input array contains not only plain objects",
  async (t) => {
    await getKeyset(
      makePromise([
        {
          a: "a",
          b: "b",
        },
        {
          a: "a",
        },
        "zzzz", // <----- problem!
      ])
    )
      .then(() => {
        t.fail("not ok");
      })
      .catch(() => {
        t.pass("ok");
      });
    t.end();
  }
);

tap.test(
  "08.04 - getKeyset() - calculates - three objects - default placeholder",
  async (t) => {
    t.same(
      await getKeyset(
        makePromise([
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ])
      ),
      {
        a: false,
        b: false,
        c: {
          d: false,
          e: false,
          f: false,
        },
      },
      "08.04"
    );
    t.end();
  }
);

tap.test(
  "08.05 - getKeyset() - calculates - three objects - custom placeholder",
  async (t) => {
    t.same(
      await getKeyset(
        [
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ],
        { placeholder: true }
      ),
      {
        a: true,
        b: true,
        c: {
          d: true,
          e: true,
          f: true,
        },
      },
      "08.05.01"
    );

    t.same(
      await getKeyset(
        [
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ],
        { placeholder: "" }
      ),
      {
        a: "",
        b: "",
        c: {
          d: "",
          e: "",
          f: "",
        },
      },
      "08.05.02"
    );

    t.same(
      await getKeyset(
        [
          {
            a: "a",
            b: "c",
            c: {
              d: "d",
              e: "e",
            },
          },
          {
            a: "a",
          },
          {
            c: {
              f: "f",
            },
          },
        ],
        { placeholder: { a: "a" } }
      ),
      {
        a: { a: "a" },
        b: { a: "a" },
        c: {
          d: { a: "a" },
          e: { a: "a" },
          f: { a: "a" },
        },
      },
      "08.05.03"
    );
    t.end();
  }
);

tap.test(
  "08.06 - getKeyset() - settings argument is not a plain object - throws",
  (t) => {
    t.throws(() => {
      getKeyset([{ a: "a" }, { b: "b" }], "zzz");
    }, /THROW_ID_12/);
    t.end();
  }
);

tap.test(
  "08.07 - getKeyset() - multiple levels of nested arrays",
  async (t) => {
    t.same(
      await getKeyset([
        {
          key2: [
            {
              key5: "val5",
              key4: "val4",
              key6: [
                {
                  key8: "val8",
                },
                {
                  key7: "val7",
                },
              ],
            },
          ],
          key1: "val1",
        },
        {
          key1: false,
          key3: "val3",
        },
      ]),
      {
        key1: false,
        key2: [
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
        key3: false,
      },
      "08.07"
    );
    t.end();
  }
);

tap.test(
  "08.08 - getKeyset() - objects that are directly in values",
  async (t) => {
    t.same(
      await getKeyset([
        {
          a: {
            b: "c",
            d: "e",
          },
          k: "l",
        },
        {
          a: {
            f: "g",
            b: "c",
            h: "i",
          },
          m: "n",
        },
      ]),
      {
        a: {
          b: false,
          d: false,
          f: false,
          h: false,
        },
        k: false,
        m: false,
      },
      "08.08.01"
    );
    t.same(
      await getKeyset([
        {
          a: {
            f: "g",
            b: "c",
            h: "i",
          },
          m: "n",
        },
        {
          a: {
            b: "c",
            d: "e",
          },
          k: "l",
        },
      ]),
      {
        a: {
          b: false,
          d: false,
          f: false,
          h: false,
        },
        k: false,
        m: false,
      },
      "08.08.02"
    );
    t.end();
  }
);

tap.test(
  "08.09 - getKeyset() - deeper level arrays containing only strings",
  async (t) => {
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          a: false,
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      "08.09"
    );
    t.end();
  }
);

tap.test(
  "08.10 - getKeyset() - deeper level array with string vs false",
  async (t) => {
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          a: false,
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      "08.10 - if arrays contain any strings, result is empty array"
    );
    t.end();
  }
);

tap.test(
  "08.11 - getKeyset() - two deeper level arrays with strings",
  async (t) => {
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          b: {
            c: {
              d: ["eee", "fff", "ggg"],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      "08.11 - if arrays contain any strings, result is empty array"
    );
    t.end();
  }
);

tap.test(
  "08.12 - getKeyset() - two deeper level arrays with mixed contents",
  async (t) => {
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: ["eee"],
            },
          },
        },
        {
          b: {
            c: {
              d: [{ a: "zzz" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ a: false }],
          },
        },
      },
      "08.12 - plain object vs string"
    );
    t.end();
  }
);

tap.test(
  "08.13 - getKeyset() - two deeper level arrays with plain objects",
  async (t) => {
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: [{ a: "aaa" }],
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
        {
          b: {
            c: {
              d: false,
            },
          },
        },
        {
          b: {
            c: false,
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ a: false, b: false, c: false }],
          },
        },
      },
      "08.13.01 - object vs object"
    );
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: [],
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ b: false, c: false }],
          },
        },
      },
      "08.13.02 - object vs object"
    );
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: false,
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ b: false, c: false }],
          },
        },
      },
      "08.13.03 - object vs object"
    );
    t.same(
      await getKeyset([
        {
          a: false,
          b: {
            c: {
              d: "text",
            },
          },
        },
        {
          b: {
            c: {
              d: [{ b: "bbb", c: "ccc" }],
            },
          },
        },
      ]),
      {
        a: false,
        b: {
          c: {
            d: [{ b: false, c: false }],
          },
        },
      },
      "08.13.04 - object vs object"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 09. enforceKeyset()
// -----------------------------------------------------------------------------

tap.test("09.01 - enforceKeyset() - enforces a simple schema", async (t) => {
  const schema = await getKeyset([
    {
      a: "aaa",
      b: "bbb",
    },
    {
      a: "ccc",
    },
  ]);
  t.same(
    await enforceKeyset(
      {
        a: "ccc",
      },
      schema
    ),
    {
      a: "ccc",
      b: false,
    },
    "09.01"
  );
  t.end();
});

tap.test(
  "09.02 - enforceKeyset() - enforces a more complex schema",
  async (t) => {
    const obj1 = {
      b: [
        {
          c: "ccc",
          d: "ddd",
        },
      ],
      a: "aaa",
    };
    const obj2 = {
      a: "ccc",
      e: "eee",
    };
    const obj3 = {
      a: "zzz",
    };
    const schema = await getKeyset([obj1, obj2, obj3]);
    t.same(
      schema,
      {
        a: false,
        b: [
          {
            c: false,
            d: false,
          },
        ],
        e: false,
      },
      "09.02.00 - .getKeyset itself"
    );
    t.same(
      await enforceKeyset(obj1, schema),
      {
        a: "aaa",
        b: [
          {
            c: "ccc",
            d: "ddd",
          },
        ],
        e: false,
      },
      "09.02.01 - .enforceKeyset"
    );
    t.same(
      await enforceKeyset(obj2, schema),
      {
        a: "ccc",
        b: [
          {
            c: false,
            d: false,
          },
        ],
        e: "eee",
      },
      "09.02.02 - .enforceKeyset"
    );
    t.same(
      await enforceKeyset(obj3, schema),
      {
        a: "zzz",
        b: [
          {
            c: false,
            d: false,
          },
        ],
        e: false,
      },
      "09.02.03 - .enforceKeyset"
    );
    t.end();
  }
);

tap.test(
  "09.03 - enforceKeyset() - enforces a schema involving arrays",
  async (t) => {
    const obj1 = {
      a: [
        {
          b: "b",
        },
      ],
    };
    const obj2 = {
      a: false,
    };
    const schema = await getKeyset([obj1, obj2]);
    t.same(
      schema,
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "09.03 - .getKeyset"
    );
    t.same(
      await enforceKeyset(obj1, schema),
      {
        a: [
          {
            b: "b",
          },
        ],
      },
      "09.03.01 - .enforceKeyset"
    );
    t.same(
      await enforceKeyset(obj2, schema),
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "09.03.02 - .enforceKeyset"
    );
    t.end();
  }
);

tap.test(
  "09.04 - enforceKeyset() - another set involving arrays",
  async (t) => {
    t.same(
      await prepArray(
        makePromise([
          {
            c: "c val",
          },
          {
            b: [
              {
                b2: "b2 val",
                b1: "b1 val",
              },
            ],
            a: "a val",
          },
        ])
      ),
      [
        {
          a: false,
          b: [
            {
              b1: false,
              b2: false,
            },
          ],
          c: "c val",
        },
        {
          a: "a val",
          b: [
            {
              b1: "b1 val",
              b2: "b2 val",
            },
          ],
          c: false,
        },
      ],
      "09.04"
    );
    t.end();
  }
);

tap.test("09.05 - enforceKeyset() - deep-nested arrays", async (t) => {
  t.same(
    await prepArray([
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
                                    h: "h",
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
      {
        a: "zzz",
      },
    ]),
    [
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
                                    h: "h",
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
                                    h: false,
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
    "09.05"
  );
  t.end();
});

tap.test(
  "09.06 - enforceKeyset() - enforces a schema involving arrays",
  async (t) => {
    const obj1 = {
      a: [
        {
          b: "b",
        },
      ],
    };
    const obj2 = {
      a: "a",
    };
    const schema = await getKeyset([obj1, obj2]);
    t.same(
      schema,
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "09.06.01 - .getKeyset"
    );
    t.same(
      await enforceKeyset(obj1, schema),
      {
        a: [
          {
            b: "b",
          },
        ],
      },
      "09.06.02 - .enforceKeyset"
    );
    t.same(
      await enforceKeyset(obj2, schema),
      {
        a: [
          {
            b: false,
          },
        ],
      },
      "09.06.03 - .enforceKeyset"
    );
    t.end();
  }
);

tap.test(
  "09.07 - enforceKeyset() - multiple objects within an array",
  async (t) => {
    t.same(
      await prepArray([
        {
          a: "a",
        },
        {
          a: [
            {
              d: "d",
            },
            {
              c: "c",
            },
            {
              a: "a",
            },
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
              a: false,
              b: false,
              c: false,
              d: false,
            },
          ],
        },
        {
          a: [
            {
              a: false,
              b: false,
              c: false,
              d: "d",
            },
            {
              a: false,
              b: false,
              c: "c",
              d: false,
            },
            {
              a: "a",
              b: false,
              c: false,
              d: false,
            },
            {
              a: false,
              b: "b",
              c: false,
              d: false,
            },
          ],
        },
      ],
      "09.07"
    );
    t.end();
  }
);

tap.test("09.08 - enforceKeyset() - multiple levels of arrays", async (t) => {
  const obj1 = {
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
  };
  const obj2 = {
    c: "ccc",
    a: false,
  };
  t.same(
    await prepArray([obj1, obj2]),
    [
      {
        a: "aaa",
        b: [
          {
            c: "ccc",
            d: "ddd",
            e: [
              {
                f: "fff",
                g: false,
              },
              {
                f: false,
                g: "ggg",
              },
            ],
          },
        ],
        c: false,
      },
      {
        a: false,
        b: [
          {
            c: false,
            d: false,
            e: [
              {
                f: false,
                g: false,
              },
            ],
          },
        ],
        c: "ccc",
      },
    ],
    "09.08"
  );
  t.end();
});

tap.test("09.09 - enforceKeyset() - array vs string clashes", async (t) => {
  t.same(
    await prepArray([
      {
        a: "aaa",
      },
      {
        a: [
          {
            b: "bbb",
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
      {
        a: [
          {
            b: "bbb",
          },
        ],
      },
    ],
    "09.09"
  );
  t.end();
});

tap.test(
  "09.10 - enforceKeyset() - all inputs missing - resolves to rejected promise",
  (t) => {
    t.throws(() => {
      enforceKeyset();
    }, /THROW_ID_31/g);
    t.end();
  }
);

tap.test(
  "09.11 - enforceKeyset() - second input arg missing - resolves to rejected promise",
  (t) => {
    t.throws(() => {
      enforceKeyset({ a: "a" });
    }, /THROW_ID_32/g);
    t.end();
  }
);

tap.test(
  "09.12 - enforceKeyset() - second input arg is not a plain obj - resolves to rejected promise",
  async (t) => {
    await enforceKeyset({ a: "a" }, "zzz")
      .then(() => {
        t.fail("not ok");
      })
      .catch(() => {
        t.pass("ok");
      });
    t.end();
  }
);

tap.test(
  "09.13 - enforceKeyset() - first input arg is not a plain obj - resolves to rejected promise",
  async (t) => {
    await enforceKeyset("zzz", "zzz")
      .then(() => {
        t.fail("not ok");
      })
      .catch(() => {
        t.pass("ok");
      });
    t.end();
  }
);

tap.test("09.14 - enforceKeyset() - array over empty array", async (t) => {
  const obj1 = {
    a: [
      {
        d: "d",
      },
      {
        e: "e",
      },
    ],
    c: "c",
  };
  const obj2 = {
    a: [],
    b: "b",
  };
  const schema = await getKeyset([obj1, obj2]);
  t.same(
    schema,
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: false,
      c: false,
    },
    "09.14.01"
  );
  t.same(
    await enforceKeyset(obj1, schema),
    {
      a: [
        {
          d: "d",
          e: false,
        },
        {
          d: false,
          e: "e",
        },
      ],
      b: false,
      c: "c",
    },
    "09.14.02"
  );
  t.same(
    await enforceKeyset(obj2, schema),
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
    "09.14.03"
  );
  t.end();
});

tap.test(
  "09.15 - enforceKeyset() - wrong opts - resolves to rejected promise",
  (t) => {
    t.rejects(async () => {
      await enforceKeyset(
        { a: "a" },
        { a: "false", b: "b" },
        { doNotFillThesePathsIfTheyContainPlaceholders: ["a", 1] }
      );
    });
    t.end();
  }
);

tap.test("09.16 - enforceKeyset() - opts.useNullAsExplicitFalse", async (t) => {
  const schema = await getKeyset(
    makePromise([
      {
        a: "aaa",
        b: "bbb",
      },
      {
        a: {
          c: "ccc",
        },
      },
    ])
  );
  t.same(
    await enforceKeyset(
      {
        a: null,
      },
      schema
    ),
    {
      a: null,
      b: false,
    },
    "09.16.01 - defaults - null is explicit false"
  );
  t.same(
    await enforceKeyset(
      {
        a: null,
      },
      schema,
      { useNullAsExplicitFalse: false }
    ),
    {
      a: {
        c: false,
      },
      b: false,
    },
    "09.16.02 - off via the opts"
  );
  t.end();
});
