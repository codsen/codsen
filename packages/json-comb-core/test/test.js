import { test } from "uvu";
import { equal, ok, throws, not, unreachable } from "uvu/assert";
import pMap from "p-map";

import {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  noNewKeysSync,
  findUnusedSync,
  sortAllObjectsSync,
} from "../dist/json-comb-core.esm.js";

function prepArraySync(arr) {
  let keySet = getKeysetSync(arr);
  return arr.map((obj) => enforceKeysetSync(obj, keySet));
}

function prepArray(arr) {
  return getKeyset(arr).then((keySet) =>
    pMap(arr, (obj) => enforceKeyset(obj, keySet)),
  );
}

function makePromise(arr) {
  return arr.map((el) => Promise.resolve(el));
}

// -----------------------------------------------------------------------------
// 01. getKeysetSync()
// -----------------------------------------------------------------------------

test("01 - getKeysetSync() - throws when there's no input", () => {
  throws(
    () => {
      getKeysetSync();
    },
    "01.01",
    "01.01",
  );
});

test("02 - getKeysetSync() - throws when input is not an array", () => {
  throws(
    () => {
      getKeysetSync("aa");
    },
    "02.01",
    "02.01",
  );
});

test("03 - getKeysetSync() - throws when input array is empty", () => {
  throws(
    () => {
      getKeysetSync([]);
    },
    "03.01",
    "03.01",
  );
});

test("04 - getKeysetSync() - throws when input array contains not only plain objects", () => {
  throws(
    () => {
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
    },
    "04.01",
    "04.01",
  );
});

test("05 - getKeysetSync() - calculates - three objects - default placeholder", () => {
  equal(
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
    "05.01",
  );
});

test("06 - getKeysetSync() - calculates - three objects - custom placeholder", () => {
  equal(
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
      { placeholder: true },
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
    "06.01",
  );
  equal(
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
      { placeholder: "" },
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
    "06.02",
  );
  equal(
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
      { placeholder: { a: "a" } },
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
    "06.03",
  );
});

test("07 - getKeysetSync() - settings argument is not a plain object - throws", () => {
  throws(
    () => {
      getKeysetSync([{ a: "a" }, { b: "b" }], "zzz");
    },
    /THROW_ID_24/,
    "07.01",
  );
});

test("08 - getKeysetSync() - multiple levels of nested arrays", () => {
  equal(
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
    "08.01",
  );
});

test("09 - getKeysetSync() - objects that are directly in values", () => {
  equal(
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
    "09.01",
  );
  equal(
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
    "09.02",
  );
});

test("10 - getKeysetSync() - deeper level arrays containing only strings", () => {
  equal(
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
    "10.01",
  );
});

test("11 - getKeysetSync() - deeper level array with string vs false", () => {
  equal(
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
    "11.01",
  );
});

test("12 - getKeysetSync() - two deeper level arrays with strings", () => {
  equal(
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
    "12.01",
  );
});

test("13 - getKeysetSync() - two deeper level arrays with mixed contents", () => {
  equal(
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
    "13.01",
  );
});

test("14 - getKeysetSync() - two deeper level arrays with plain objects", () => {
  equal(
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
    "14.01",
  );
  equal(
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
    "14.02",
  );
  equal(
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
    "14.03",
  );
  equal(
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
    "14.04",
  );
});

// -----------------------------------------------------------------------------
// 02. enforceKeysetSync()
// -----------------------------------------------------------------------------

test("15 - enforceKeysetSync() - enforces a simple schema", () => {
  let schema = getKeysetSync([
    {
      a: "aaa",
      b: "bbb",
    },
    {
      a: "ccc",
    },
  ]);
  equal(
    enforceKeysetSync(
      {
        a: "ccc",
      },
      schema,
    ),
    {
      a: "ccc",
      b: false,
    },
    "15.01",
  );
});

test("16 - enforceKeysetSync() - enforces a more complex schema", () => {
  let obj1 = {
    b: [
      {
        c: "ccc",
        d: "ddd",
      },
    ],
    a: "aaa",
  };
  let obj2 = {
    a: "ccc",
    e: "eee",
  };
  let obj3 = {
    a: "zzz",
  };
  let schema = getKeysetSync([obj1, obj2, obj3]);
  equal(
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
    "16.01",
  );
  equal(
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
    "16.02",
  );
  equal(
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
    "16.03",
  );
  equal(
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
    "16.04",
  );
});

test("17 - enforceKeysetSync() - enforces a schema involving arrays", () => {
  let obj1 = {
    a: [
      {
        b: "b",
      },
    ],
  };
  let obj2 = {
    a: false,
  };
  let schema = getKeysetSync([obj1, obj2]);
  equal(
    schema,
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "17.01",
  );
  equal(
    enforceKeysetSync(obj1, schema),
    {
      a: [
        {
          b: "b",
        },
      ],
    },
    "17.02",
  );
  equal(
    enforceKeysetSync(obj2, schema),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "17.03",
  );
});

test("18 - enforceKeysetSync() - another set involving arrays", () => {
  equal(
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
    "18.01",
  );
});

test("19 - enforceKeysetSync() - deep-nested arrays", () => {
  equal(
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
    "19.01",
  );
});

test("20 - enforceKeysetSync() - enforces a schema involving arrays", () => {
  let obj1 = {
    a: [
      {
        b: "b",
      },
    ],
  };
  let obj2 = {
    a: "a",
  };
  let schema = getKeysetSync([obj1, obj2]);
  equal(
    schema,
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "20.01",
  );
  equal(
    enforceKeysetSync(obj1, schema),
    {
      a: [
        {
          b: "b",
        },
      ],
    },
    "20.02",
  );
  equal(
    enforceKeysetSync(obj2, schema),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "20.03",
  );
});

test("21 - enforceKeysetSync() - multiple objects within an array", () => {
  equal(
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
    "21.01",
  );
});

test("22 - enforceKeysetSync() - multiple levels of arrays", () => {
  let obj1 = {
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
  let obj2 = {
    c: "ccc",
    a: false,
  };
  equal(
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
    "22.01",
  );
});

test("23 - enforceKeysetSync() - array vs string clashes", () => {
  equal(
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
    "23.01",
  );
});

test("24 - enforceKeysetSync() - all inputs missing - throws", () => {
  throws(
    () => {
      enforceKeysetSync();
    },
    "24.01",
    "24.01",
  );
});

test("25 - enforceKeysetSync() - second input arg missing - throws", () => {
  throws(
    () => {
      enforceKeysetSync({ a: "a" });
    },
    "25.01",
    "25.01",
  );
});

test("26 - enforceKeysetSync() - second input arg is not a plain obj - throws", () => {
  throws(
    () => {
      enforceKeysetSync({ a: "a" }, "zzz");
    },
    "26.01",
    "26.01",
  );
});

test("27 - enforceKeysetSync() - first input arg is not a plain obj - throws", () => {
  throws(
    () => {
      enforceKeysetSync("zzz", "zzz");
    },
    "27.01",
    "27.01",
  );
});

test("28 - enforceKeysetSync() - array over empty array", () => {
  let obj1 = {
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
  let obj2 = {
    a: [],
    b: "b",
  };
  let schema = getKeysetSync([obj1, obj2]);
  equal(
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
    "28.01",
  );
  equal(
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
    "28.02",
  );
  equal(
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
    "28.03",
  );
});

test("29 - enforceKeysetSync() - opts", () => {
  let schema = getKeysetSync([
    {
      a: "aaa",
      b: { c: "ccc" },
    },
    {
      a: "ddd",
      b: false,
    },
  ]);
  equal(
    enforceKeysetSync(
      {
        a: "zzz",
        b: false,
      },
      schema,
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["b"],
      },
    ),
    {
      a: "zzz",
      b: false,
    },
    "29.01",
  );
});

test("30 - enforceKeysetSync() - opts", () => {
  let schema = getKeysetSync([
    {
      a: "aaa",
      b: { c: "ccc" },
    },
    {
      a: "ddd",
      b: false,
    },
  ]);
  equal(
    enforceKeysetSync(
      {
        a: "zzz",
      },
      schema,
      {
        doNotFillThesePathsIfTheyContainPlaceholders: ["b"],
      },
    ),
    {
      a: "zzz",
      b: false,
    },
    "30.01",
  );
});

test("31 - enforceKeysetSync() - opts off", () => {
  let schema = getKeysetSync([
    {
      a: "aaa",
      b: { c: "ccc" },
    },
    {
      a: "ddd",
      b: false,
    },
  ]);
  equal(
    enforceKeysetSync(
      {
        a: "zzz",
      },
      schema,
      {
        doNotFillThesePathsIfTheyContainPlaceholders: [],
      },
    ),
    {
      a: "zzz",
      b: { c: false },
    },
    "31.01",
  );
});

test("32 - enforceKeysetSync() - opts.doNotFillThesePathsIfTheyContainPlaceholders is wrong", () => {
  throws(
    () => {
      enforceKeysetSync(
        { a: "a" },
        { a: "a", b: "b" },
        { doNotFillThesePathsIfTheyContainPlaceholders: 1 },
      );
    },
    "32.01",
    "32.01",
  );
  throws(
    () => {
      enforceKeysetSync(
        { a: "a" },
        { a: "a", b: "b" },
        { doNotFillThesePathsIfTheyContainPlaceholders: [1] },
      );
    },
    "32.02",
    "32.02",
  );
});

test("33 - enforceKeysetSync() - opts.useNullAsExplicitFalse", () => {
  let schema = getKeysetSync([
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
  equal(
    enforceKeysetSync(
      {
        a: null,
      },
      schema,
    ),
    {
      a: null,
      b: false,
    },
    "33.01",
  );
  equal(
    enforceKeysetSync(
      {
        a: null,
      },
      schema,
      { useNullAsExplicitFalse: false },
    ),
    {
      a: {
        c: false,
      },
      b: false,
    },
    "33.02",
  );
});

// -----------------------------------------------------------------------------
// 03. guards against input arg mutation
// -----------------------------------------------------------------------------

test("34 - enforceKeysetSync() - does not mutate the input args", () => {
  let obj1 = {
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
  let obj2 = {
    c: "ccc",
    a: false,
  };
  let dummyResult = enforceKeysetSync(obj2, getKeysetSync([obj1, obj2]));
  ok(dummyResult, "34.01"); // necessary to avoid unused vars
  equal(
    obj2,
    {
      c: "ccc",
      a: false,
    },
    "34.02",
  );
});

// -----------------------------------------------------------------------------
// 04. noNewKeysSync()
// -----------------------------------------------------------------------------

test("35 - noNewKeysSync() - BAU", () => {
  equal(
    noNewKeysSync(
      {
        a: "a",
        c: "c",
      },
      {
        a: "aaa",
        b: "bbb",
        c: "ccc",
      },
    ),
    [],
    "35.01",
  );
  equal(
    noNewKeysSync(
      {
        a: "a",
        b: "b",
        c: "c",
      },
      {
        a: "aaa",
        c: "ccc",
      },
    ),
    ["b"],
    "35.02",
  );
});

test("36 - noNewKeysSync() - objects within arrays within objects", () => {
  equal(
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
      },
    ),
    [],
    "36.01",
  );
  equal(
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
      },
    ),
    [],
    "36.02",
  );
  equal(
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
      },
    ),
    ["z[0].c", "z[1].c"],
    "36.03",
  );
});

test("37 - noNewKeysSync() - various throws", () => {
  throws(
    () => {
      noNewKeysSync();
    },
    /THROW_ID_51/g,
    "37.01",
  );
  throws(
    () => {
      noNewKeysSync({ a: "a" });
    },
    /THROW_ID_52/g,
    "37.02",
  );
  throws(
    () => {
      noNewKeysSync(1, { a: "a" });
    },
    /THROW_ID_53/g,
    "37.03",
  );
  throws(
    () => {
      noNewKeysSync(["a"], ["a"]);
    },
    /THROW_ID_53/g,
    "37.04",
  );
  throws(
    () => {
      noNewKeysSync({ a: "a" }, 1);
    },
    /THROW_ID_54/g,
    "37.05",
  );
});

// -----------------------------------------------------------------------------
// 05. findUnusedSync()
// -----------------------------------------------------------------------------

test("38 - findUnusedSync() - single-level plain objects", () => {
  equal(
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
    "38.01",
  );
  equal(
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
    "38.02",
  );
});

test("39 - findUnusedSync() - multiple-level plain objects", () => {
  equal(
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
    "39.01",
  );
  equal(
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
    "39.02",
  );
});

test("40 - findUnusedSync() - double-nested arrays", () => {
  equal(
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
    "40.01",
  );
  equal(
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
    "40.02",
  );
});

test("41 - findUnusedSync() - works on empty arrays", () => {
  equal(findUnusedSync([]), [], "41.01");
  equal(findUnusedSync([{}]), [], "41.02");
  equal(findUnusedSync([{}, {}]), [], "41.03");
});

test("42 - findUnusedSync() - various throws", () => {
  throws(
    () => {
      findUnusedSync(1, { placeholder: false });
    },
    "42.01",
    "42.01",
  );
  not.throws(() => {
    findUnusedSync([1, 2, 3]);
  }, "42.02");
  throws(
    () => {
      findUnusedSync([{ a: "a" }, { a: "b" }], 1);
    },
    "42.03",
    "42.02",
  );
});

test("43 - findUnusedSync() - case of empty array within an array", () => {
  equal(
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
    "43.01",
  );
  equal(
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
    "43.02",
  );
});

test("44 - findUnusedSync() - case of empty array within an array", () => {
  equal(
    findUnusedSync([
      {
        a: [[]],
        b: "bbb1",
        c: false,
      },
    ]),
    [],
    "44.01",
  );
  equal(
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
    "44.02",
  );
});

test("45 - findUnusedSync() - objects containing objects (2 in total)", () => {
  equal(
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
    "45.01",
  );
  equal(
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
    "45.02",
  );
  equal(
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
    "45.03",
  );
});

test("46 - findUnusedSync() - objects containing objects (3 in total)", () => {
  equal(
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
    "46.01",
  );
  equal(
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
    "46.02",
  );
});

test("47 - findUnusedSync() - objects containing objects, mixed with arrays", () => {
  equal(
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
    "47.01",
  );
  equal(
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
    "47.02",
  );
  equal(
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
    "47.03",
  );
});

test("48 - findUnusedSync() - array contents are not objects/arrays", () => {
  equal(findUnusedSync([false, false, false]), [], "48.01");
  equal(findUnusedSync(["zzz", "zzz", "zzz"]), [], "48.02");
  equal(findUnusedSync([{}, {}, {}]), [], "48.03");
});

test("49 - findUnusedSync() - array > single object > array > unused inside", () => {
  equal(
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
    "49.01",
  );
  equal(
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
    "49.02",
  );
});

test("50 - findUnusedSync() - simple case of not normalised input", () => {
  equal(
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
    "50.01",
  );
});

test("51 - findUnusedSync() - opts.comments", () => {
  equal(
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
    "51.01",
  );
  equal(
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
      { comments: "zzz" },
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "51.02",
  );
  equal(
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
      { comments: false },
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "51.03",
  );
  equal(
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
      { comments: 0 },
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "51.04",
  );
  equal(
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
      { comments: null },
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "51.05",
  );
  equal(
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
      { comments: undefined },
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "51.06",
  );
  equal(
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
      { comments: "" },
    ),
    ["b__comment__this_is_a_comment_for_key_b", "c"],
    "51.07",
  );
});

// -----------------------------------------------------------------------------
// 06. sortAllObjectsSync()
// -----------------------------------------------------------------------------

test("52 - sortAllObjectsSync() - plain object", () => {
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
  not.equal(JSON.stringify(original), JSON.stringify(sorted), "52.01"); // control
  equal(
    JSON.stringify(sortAllObjectsSync(original)),
    JSON.stringify(sorted),
    "52.01",
  ); // test
});

test("53 - sortAllObjectsSync() - non-sortable input types", () => {
  equal(sortAllObjectsSync(null), null, "53.01");
  equal(sortAllObjectsSync(1), 1, "53.02");
  equal(sortAllObjectsSync("zzz"), "zzz", "53.03");
  equal(sortAllObjectsSync(undefined), undefined, "53.04");
  let f = (a) => a;
  equal(sortAllObjectsSync(f), f, "53.05");
});

test("54 - sortAllObjectsSync() - object-array-object", () => {
  equal(
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
    "54.01",
  );
});

test("55 - sortAllObjectsSync() - object very deep", () => {
  equal(
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
    "55.01",
  );
});

test("56 - sortAllObjectsSync() - nested case", () => {
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
  not.equal(JSON.stringify(original), JSON.stringify(sorted), "56.01"); // control
  equal(
    JSON.stringify(sortAllObjectsSync(original)),
    JSON.stringify(sorted),
    "56.01",
  );
});

test("57 - sortAllObjectsSync() - nested case", () => {
  let original = {
    lastRan: 6,
    lastPublished: 5,
    "1.1.10": 2,
    "1.1.9": 1,
    "1.2.1": 4,
    "1.2.0": 3,
  };
  let res = `{
  "1.1.9": 1,
  "1.1.10": 2,
  "1.2.0": 3,
  "1.2.1": 4,
  "lastPublished": 5,
  "lastRan": 6
}`;

  equal(JSON.stringify(sortAllObjectsSync(original), null, 2), res, "57.01");
});

// -----------------------------------------------------------------------------
// 07. input arg mutation tests
// -----------------------------------------------------------------------------

/* eslint prefer-const:0 */
// we deliberately use VAR to "allow" mutation. In theory, of course, because it does not happen.

test("58 - does not mutate input args: enforceKeysetSync()", () => {
  let source = {
    a: "a",
  };
  let frozen = {
    a: "a",
  };
  let dummyResult = enforceKeysetSync(source, { a: false, b: false });
  ok(dummyResult, "58.01"); // a mickey assertion to trick the Standard
  equal(JSON.stringify(source), JSON.stringify(frozen), "58.02");
});

test("59 - does not mutate input args: noNewKeysSync()", () => {
  let source = {
    a: "a",
  };
  let frozen = {
    a: "a",
  };
  let dummyResult = noNewKeysSync(source, { a: false, b: false });
  ok(dummyResult, "59.01"); // a mickey assertion to trick ESLint to think it's used
  equal(JSON.stringify(source), JSON.stringify(frozen), "59.02");
});

test("60 - does not mutate input args: sortAllObjectsSync()", () => {
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
  ok(dummyResult, "60.01"); // a mickey assertion to trick ESLint to think it's used
  equal(JSON.stringify(source), JSON.stringify(frozen), "60.02");
});

// -----------------------------------------------------------------------------
// 08. getKeyset()  - async version of getKeysetSync()
// -----------------------------------------------------------------------------

test("61 - getKeyset() - throws when there's no input", () => {
  throws(
    () => {
      getKeyset();
    },
    "61.01",
    "61.01",
  );
});

test("62 - getKeyset() - throws when input is not an array of promises", () => {
  throws(
    () => {
      getKeyset(makePromise("aa"));
    },
    "62.01",
    "62.01",
  );
});

test("63 - getKeyset() - resolves to a rejected promise when input array contains not only plain objects", async () => {
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
    ]),
  )
    .then(() => {
      not.ok("not ok");
    })
    .catch(() => {
      ok("ok");
    });
});

test("64 - getKeyset() - calculates - three objects - default placeholder", async () => {
  equal(
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
      ]),
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
    "64.01",
  );
});

test("65 - getKeyset() - calculates - three objects - custom placeholder", async () => {
  equal(
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
      { placeholder: true },
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
    "65.01",
  );

  equal(
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
      { placeholder: "" },
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
    "65.02",
  );

  equal(
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
      { placeholder: { a: "a" } },
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
    "65.03",
  );
});

test("66 - getKeyset() - settings argument is not a plain object - throws", () => {
  throws(
    () => {
      getKeyset([{ a: "a" }, { b: "b" }], "zzz");
    },
    /THROW_ID_12/,
    "66.01",
  );
});

test("67 - getKeyset() - multiple levels of nested arrays", async () => {
  equal(
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
    "67.01",
  );
});

test("68 - getKeyset() - objects that are directly in values", async () => {
  equal(
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
    "68.01",
  );
  equal(
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
    "68.02",
  );
});

test("69 - getKeyset() - deeper level arrays containing only strings", async () => {
  equal(
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
    "69.01",
  );
});

test("70 - getKeyset() - deeper level array with string vs false", async () => {
  equal(
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
    "70.01",
  );
});

test("71 - getKeyset() - two deeper level arrays with strings", async () => {
  equal(
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
    "71.01",
  );
});

test("72 - getKeyset() - two deeper level arrays with mixed contents", async () => {
  equal(
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
    "72.01",
  );
});

test("73 - getKeyset() - two deeper level arrays with plain objects", async () => {
  equal(
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
    "73.01",
  );
  equal(
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
    "73.02",
  );
  equal(
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
    "73.03",
  );
  equal(
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
    "73.04",
  );
});

// -----------------------------------------------------------------------------
// 09. enforceKeyset()
// -----------------------------------------------------------------------------

test("74 - enforceKeyset() - enforces a simple schema", async () => {
  let schema = await getKeyset([
    {
      a: "aaa",
      b: "bbb",
    },
    {
      a: "ccc",
    },
  ]);
  equal(
    await enforceKeyset(
      {
        a: "ccc",
      },
      schema,
    ),
    {
      a: "ccc",
      b: false,
    },
    "74.01",
  );
});

test("75 - enforceKeyset() - enforces a more complex schema", async () => {
  let obj1 = {
    b: [
      {
        c: "ccc",
        d: "ddd",
      },
    ],
    a: "aaa",
  };
  let obj2 = {
    a: "ccc",
    e: "eee",
  };
  let obj3 = {
    a: "zzz",
  };
  let schema = await getKeyset([obj1, obj2, obj3]);
  equal(
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
    "75.01",
  );
  equal(
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
    "75.02",
  );
  equal(
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
    "75.03",
  );
  equal(
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
    "75.04",
  );
});

test("76 - enforceKeyset() - enforces a schema involving arrays", async () => {
  let obj1 = {
    a: [
      {
        b: "b",
      },
    ],
  };
  let obj2 = {
    a: false,
  };
  let schema = await getKeyset([obj1, obj2]);
  equal(
    schema,
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "76.01",
  );
  equal(
    await enforceKeyset(obj1, schema),
    {
      a: [
        {
          b: "b",
        },
      ],
    },
    "76.02",
  );
  equal(
    await enforceKeyset(obj2, schema),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "76.03",
  );
});

test("77 - enforceKeyset() - another set involving arrays", async () => {
  equal(
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
      ]),
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
    "77.01",
  );
});

test("78 - enforceKeyset() - deep-nested arrays", async () => {
  equal(
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
    "78.01",
  );
});

test("79 - enforceKeyset() - enforces a schema involving arrays", async () => {
  let obj1 = {
    a: [
      {
        b: "b",
      },
    ],
  };
  let obj2 = {
    a: "a",
  };
  let schema = await getKeyset([obj1, obj2]);
  equal(
    schema,
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "79.01",
  );
  equal(
    await enforceKeyset(obj1, schema),
    {
      a: [
        {
          b: "b",
        },
      ],
    },
    "79.02",
  );
  equal(
    await enforceKeyset(obj2, schema),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "79.03",
  );
});

test("80 - enforceKeyset() - multiple objects within an array", async () => {
  equal(
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
    "80.01",
  );
});

test("81 - enforceKeyset() - multiple levels of arrays", async () => {
  let obj1 = {
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
  let obj2 = {
    c: "ccc",
    a: false,
  };
  equal(
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
    "81.01",
  );
});

test("82 - enforceKeyset() - array vs string clashes", async () => {
  equal(
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
    "82.01",
  );
});

test("83 - enforceKeyset() - all inputs missing - resolves to rejected promise", () => {
  throws(
    () => {
      enforceKeyset();
    },
    /THROW_ID_31/g,
    "83.01",
  );
});

test("84 - enforceKeyset() - second input arg missing - resolves to rejected promise", () => {
  throws(
    () => {
      enforceKeyset({ a: "a" });
    },
    /THROW_ID_32/g,
    "84.01",
  );
});

test("85 - enforceKeyset() - second input arg is not a plain obj - resolves to rejected promise", async () => {
  await enforceKeyset({ a: "a" }, "zzz")
    .then(() => {
      not.ok("not ok");
    })
    .catch(() => {
      ok("ok");
    });
});

test("86 - enforceKeyset() - first input arg is not a plain obj - resolves to rejected promise", async () => {
  await enforceKeyset("zzz", "zzz")
    .then(() => {
      not.ok("not ok");
    })
    .catch(() => {
      ok("ok");
    });
});

test("87 - enforceKeyset() - array over empty array", async () => {
  let obj1 = {
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
  let obj2 = {
    a: [],
    b: "b",
  };
  let schema = await getKeyset([obj1, obj2]);
  equal(
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
    "87.01",
  );
  equal(
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
    "87.02",
  );
  equal(
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
    "87.03",
  );
});

test("88 - enforceKeyset() - wrong opts - resolves to rejected promise", async () => {
  try {
    await enforceKeyset(
      { a: "a" },
      { a: "false", b: "b" },
      { doNotFillThesePathsIfTheyContainPlaceholders: ["a", 1] },
    ).then(() => {
      unreachable("88");
    });
  } catch (error) {
    ok("88");
  }
});

test("89 - enforceKeyset() - opts.useNullAsExplicitFalse", async () => {
  let schema = await getKeyset(
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
    ]),
  );
  equal(
    await enforceKeyset(
      {
        a: null,
      },
      schema,
    ),
    {
      a: null,
      b: false,
    },
    "89.01",
  );
  equal(
    await enforceKeyset(
      {
        a: null,
      },
      schema,
      { useNullAsExplicitFalse: false },
    ),
    {
      a: {
        c: false,
      },
      b: false,
    },
    "89.02",
  );
});

test.run();
