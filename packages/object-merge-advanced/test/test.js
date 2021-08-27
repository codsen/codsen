/* eslint max-len:0 */

import tap from "tap";
import clone from "lodash.clonedeep";
import { mergeAdvanced as m } from "../dist/object-merge-advanced.esm.js";
import { mergeAdvanced } from "./util.js";

// There should be two (or more) tests in each, with input args swapped, in order to
// guarantee that there are no sneaky things happening when argument order is backwards

// ==============================
// Edge cases
// ==============================

tap.test("01 - missing second arg", (t) => {
  t.strictSame(
    m({
      a: "a",
    }),
    {
      a: "a",
    },
    "01"
  );
  t.end();
});

tap.test("02 - missing first arg", (t) => {
  t.strictSame(
    m(undefined, {
      a: "a",
    }),
    {
      a: "a",
    },
    "02.01"
  );
  t.strictSame(
    m(null, {
      a: "a",
    }),
    {
      a: "a",
    },
    "02.02"
  );
  t.end();
});

tap.test("03 - both args missing - throws", (t) => {
  t.throws(() => {
    m();
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("04", (t) => {
  t.strictSame(mergeAdvanced(t, null, null), null, "04");
  t.end();
});

tap.test("05", (t) => {
  t.strictSame(mergeAdvanced(t, undefined, undefined), undefined, "05");
  t.end();
});

tap.test("06", (t) => {
  t.strictSame(mergeAdvanced(t, true, false), true, "06");
  t.end();
});

tap.test("07", (t) => {
  t.strictSame(m(["a"], ["b"]), ["a", "b"], "07");
  t.end();
});

tap.test("08", (t) => {
  const returnsAlwaysFirstOne = (i1) => i1;
  t.strictSame(m(["a"], ["b"], { cb: returnsAlwaysFirstOne }), ["a"], "08");
  t.end();
});

tap.test("09", (t) => {
  const returnsAlwaysSecondOne = (_i1, i2) => i2;
  t.strictSame(m(["a"], ["b"], { cb: returnsAlwaysSecondOne }), ["b"], "09");
  t.end();
});

tap.test("10", (t) => {
  t.strictSame(mergeAdvanced(t, [], []), [], "10");
  t.end();
});

// ==============================
// Input argument mutation
// ==============================

tap.test("11 - testing for mutation of the input args", (t) => {
  const obj1 = {
    a: "a",
    b: "b",
  };
  const originalObj1 = clone(obj1);
  const obj2 = {
    c: "c",
    d: "d",
  };
  m(obj1, obj2);
  t.strictSame(obj1, originalObj1, "11");
  t.end();
});

// ================================================
// does not introduce non-unique values into arrays
// ================================================

tap.test("12 - arrays, checking against dupes being added", (t) => {
  t.strictSame(
    m(
      {
        b: "b",
        a: [
          {
            x1: "x1",
            x2: "x2",
            x3: "x3",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      },
      {
        a: [
          {
            x1: "x1",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      }
    ),
    {
      a: [
        {
          x1: "x1",
          x2: "x2",
          x3: "x3",
        },
        {
          y1: "y1",
          y2: "y2",
        },
      ],
      b: "b",
    },
    "12"
  );
  t.end();
});

tap.test("13 - array merging + cb", (t) => {
  const returnsAlwaysFirstOne = (i1) => i1;
  t.strictSame(
    m(
      {
        b: "b",
        a: [
          {
            x1: "x1",
            x2: "x2",
            x3: "x3",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      },
      {
        a: [
          {
            x1: "x1",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      },
      {
        cb: returnsAlwaysFirstOne,
      }
    ),
    {
      b: "b",
      a: [
        {
          x1: "x1",
          x2: "x2",
          x3: "x3",
        },
        {
          y1: "y1",
          y2: "y2",
        },
      ],
    },
    "13"
  );
  t.end();
});

tap.test("14 - array merging + cb", (t) => {
  const returnsAlwaysSecondOne = (_i1, i2) => i2;
  t.strictSame(
    m(
      {
        b: "b",
        a: [
          {
            x1: "x1",
            x2: "x2",
            x3: "x3",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      },
      {
        a: [
          {
            x1: "x1",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      },
      {
        cb: returnsAlwaysSecondOne,
      }
    ),
    {
      a: [
        {
          x1: "x1",
        },
        {
          y1: "y1",
          y2: "y2",
        },
      ],
    },
    "14"
  );
  t.end();
});

tap.test("15 - arrays, checking against dupes being added", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            x1: "x1",
            x2: "x2",
            x3: "x3",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
        b: "b",
      },
      {
        a: [
          {
            x1: "x1",
          },
          {
            y1: "y1",
            y2: "y2",
          },
        ],
      }
    ),
    {
      a: [
        {
          x1: "x1",
          x2: "x2",
          x3: "x3",
        },
        {
          y1: "y1",
          y2: "y2",
        },
      ],
      b: "b",
    },
    "15"
  );
  t.end();
});

// ================================================
// does not introduce non-unique values into arrays
// ================================================

tap.test(
  "16 - merges objects within arrays if keyset and position within array matches",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              b: "b1",
              c: "c1",
            },
            {
              x: "x1",
              y: "y1",
            },
          ],
        },
        {
          a: [
            {
              b: "b2",
              c: "c2",
            },
            {
              x: "x2",
              y: "y2",
            },
          ],
        }
      ),
      {
        a: [
          {
            b: "b2",
            c: "c2",
          },
          {
            x: "x2",
            y: "y2",
          },
        ],
      },
      "16"
    );
    t.end();
  }
);

tap.test(
  "17 - concats instead if objects within arrays are in a wrong order",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              x: "x1",
              y: "y1",
            },
            {
              b: "b1",
              c: "c1",
            },
          ],
        },
        {
          a: [
            {
              b: "b2",
              c: "c2",
            },
            {
              x: "x2",
              y: "y2",
            },
          ],
        }
      ),
      {
        a: [
          {
            x: "x1",
            y: "y1",
          },
          {
            b: "b2",
            c: "c2",
          },
          {
            b: "b1",
            c: "c1",
          },
          {
            x: "x2",
            y: "y2",
          },
        ],
      },
      "17"
    );
    t.end();
  }
);

tap.test(
  "18 - concats instead if objects within arrays are in a wrong order",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              b: "b1",
              c: "c1",
            },
            {
              n: "n1",
              m: "m1",
            },
            {
              x: "x1",
              y: "y1",
            },
          ],
        },
        {
          a: [
            {
              b: "b2",
              c: "c2",
            },
            {
              x: "x2",
              y: "y2",
            },
          ],
        }
      ),
      {
        a: [
          {
            b: "b2",
            c: "c2",
          },
          {
            n: "n1",
            m: "m1",
          },
          {
            x: "x2",
            y: "y2",
          },
          {
            x: "x1",
            y: "y1",
          },
        ],
      },
      "18"
    );
    t.end();
  }
);

tap.test(
  "19 - merges objects within arrays, key sets are a subset of one another",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              b: "b1",
            },
            {
              x: "x1",
              y: "y1",
            },
          ],
        },
        {
          a: [
            {
              b: "b2",
              c: "c2",
            },
            {
              x: "x2",
            },
          ],
        }
      ),
      {
        a: [
          {
            b: "b2",
            c: "c2",
          },
          {
            x: "x2",
            y: "y1",
          },
        ],
      },
      "19"
    );
    t.end();
  }
);

tap.test(
  "20 - merges objects within arrays, subset and no match, mixed case",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              c: "c1",
            },
            {
              x: "x1",
              y: "y1",
            },
          ],
        },
        {
          a: [
            {
              b: "b2",
              c: "c2",
            },
            {
              m: "m3",
              n: "n3",
            },
          ],
        }
      ),
      {
        a: [
          {
            b: "b2",
            c: "c2",
          },
          {
            x: "x1",
            y: "y1",
          },
          {
            m: "m3",
            n: "n3",
          },
        ],
      },
      "20"
    );
    t.end();
  }
);

tap.test("21 - opts.mergeObjectsOnlyWhenKeysetMatches", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            a: "a",
            b: "b",
          },
          {
            c: "c",
            d: "d",
          },
        ],
      },
      {
        a: [
          {
            k: "k",
            l: "l",
          },
          {
            m: "m",
            n: "n",
          },
        ],
      }
    ),
    {
      a: [
        {
          a: "a",
          b: "b",
        },
        {
          k: "k",
          l: "l",
        },
        {
          c: "c",
          d: "d",
        },
        {
          m: "m",
          n: "n",
        },
      ],
    },
    "21.01 - mergeObjectsOnlyWhenKeysetMatches = default"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            a: "a",
            b: "b",
          },
          {
            c: "c",
            d: "d",
          },
        ],
      },
      {
        a: [
          {
            k: "k",
            l: "l",
          },
          {
            m: "m",
            n: "n",
          },
        ],
      },
      {
        mergeObjectsOnlyWhenKeysetMatches: true,
      }
    ),
    {
      a: [
        {
          a: "a",
          b: "b",
        },
        {
          k: "k",
          l: "l",
        },
        {
          c: "c",
          d: "d",
        },
        {
          m: "m",
          n: "n",
        },
      ],
    },
    "21.02 - mergeObjectsOnlyWhenKeysetMatches = true"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            a: "a",
            b: "b",
          },
          {
            c: "c",
            d: "d",
          },
        ],
      },
      {
        a: [
          {
            k: "k",
            l: "l",
          },
          {
            m: "m",
            n: "n",
          },
        ],
      },
      {
        mergeObjectsOnlyWhenKeysetMatches: false,
      }
    ),
    {
      a: [
        {
          a: "a",
          k: "k",
          b: "b",
          l: "l",
        },
        {
          c: "c",
          m: "m",
          d: "d",
          n: "n",
        },
      ],
    },
    "21.03 - mergeObjectsOnlyWhenKeysetMatches = false"
  );
  t.end();
});

tap.test("22 - README example: opts.mergeObjectsOnlyWhenKeysetMatches", (t) => {
  const obj1 = {
    a: [
      {
        a: "a",
        b: "b",
        yyyy: "yyyy",
      },
    ],
  };

  const obj2 = {
    a: [
      {
        xxxx: "xxxx",
        b: "b",
        c: "c",
      },
    ],
  };

  t.strictSame(
    mergeAdvanced(t, obj1, obj2),
    {
      a: [
        {
          a: "a",
          b: "b",
          yyyy: "yyyy",
        },
        {
          xxxx: "xxxx",
          b: "b",
          c: "c",
        },
      ],
    },
    "22.01"
  );

  t.strictSame(
    mergeAdvanced(t, obj1, obj2, { mergeObjectsOnlyWhenKeysetMatches: false }),
    {
      a: [
        {
          a: "a",
          b: "b",
          yyyy: "yyyy",
          xxxx: "xxxx",
          c: "c",
        },
      ],
    },
    "22.02"
  );

  t.end();
});

// ==============================
// 06. Real world tests
// ==============================

tap.test("23 - real world use case", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "b",
            c: false,
            d: [
              {
                e: false,
                f: false,
              },
            ],
          },
        ],
        g: false,
        h: [
          {
            i: "i",
          },
        ],
        j: "j",
      },
      {
        a: [
          {
            b: {
              b2: "b2",
            },
            c: false,
            d: [
              {
                e: false,
                f: false,
              },
            ],
          },
        ],
        g: false,
        h: [
          {
            i: "i",
          },
        ],
        j: "j",
      }
    ),
    {
      a: [
        {
          b: {
            b2: "b2",
          },
          c: false,
          d: [
            {
              e: false,
              f: false,
            },
          ],
        },
      ],
      g: false,
      h: [
        {
          i: "i",
        },
      ],
      j: "j",
    },
    "23"
  );
  t.end();
});

tap.test("24 - real world use case, mini", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "b",
            d: [
              {
                f: false,
              },
            ],
          },
        ],
      },
      {
        a: [
          {
            b: {
              b2: "b2",
            },
            d: [
              {
                f: false,
              },
            ],
          },
        ],
      }
    ),
    {
      a: [
        {
          b: {
            b2: "b2",
          },
          d: [
            {
              f: false,
            },
          ],
        },
      ],
    },
    "24"
  );
  t.end();
});

// ==============================
// 07. Merging arrays
// ==============================

tap.test("25 - merges two arrays of equal length", (t) => {
  t.strictSame(
    mergeAdvanced(t, ["a", "b", "c"], ["d", "e", "f"]),
    ["a", "d", "b", "e", "c", "f"],
    "25"
  );
  t.end();
});

tap.test("26 - merges two arrays of different length", (t) => {
  t.strictSame(
    mergeAdvanced(t, ["a", "b", "c", "d"], ["e", "f"]),
    ["a", "e", "b", "f", "c", "d"],
    "26.01"
  );
  t.strictSame(
    mergeAdvanced(t, ["a", "b"], ["d", "e", "f", "g"]),
    ["a", "d", "b", "e", "f", "g"],
    "26.02"
  );
  t.end();
});

tap.test("27 - merges non-empty array with an empty array", (t) => {
  t.strictSame(
    mergeAdvanced(t, ["a", "b", "c", "d"], []),
    ["a", "b", "c", "d"],
    "27.01"
  );
  t.strictSame(
    mergeAdvanced(t, [], ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "27.02"
  );
  t.strictSame(
    mergeAdvanced(t, ["a", "b", "c", "d"], {}),
    ["a", "b", "c", "d"],
    "27.03"
  );
  t.strictSame(
    mergeAdvanced(t, {}, ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "27.04"
  );
  t.strictSame(
    mergeAdvanced(t, ["a", "b", "c", "d"], ""),
    ["a", "b", "c", "d"],
    "27.05"
  );
  t.strictSame(
    mergeAdvanced(t, "", ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "27.06"
  );
  t.end();
});

// ==============================
// 08. Merging arrays
// ==============================

tap.test("28 - arrays in objects", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: ["b", "c"] }, { d: ["e", "f"] }),
    {
      a: ["b", "c"],
      d: ["e", "f"],
    },
    "28"
  );
  t.end();
});

tap.test("29 - arrays in objects, deeper", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: ["b", "c"] }, { a: ["e", "f"] }),
    {
      a: ["b", "e", "c", "f"],
    },
    "29"
  );
  t.end();
});

tap.test("30 - objects in arrays in objects", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: [{ b: "b" }] }, { a: [{ c: "c" }] }),
    {
      a: [{ b: "b" }, { c: "c" }],
    },
    "30"
  );
  t.end();
});

tap.test("31 - objects in arrays in objects", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [{ b: "b", c: ["d1"] }],
      },
      {
        a: [{ b: "d", c: ["d2"] }],
      }
    ),
    {
      a: [{ b: "d", c: ["d1", "d2"] }],
    },
    "31.01 - default"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [{ b: "b", c: ["d1"] }],
      },
      {
        a: [{ b: "d", c: ["d2"] }],
      },
      {
        mergeArraysContainingStringsToBeEmpty: true,
      }
    ),
    {
      a: [{ b: "d", c: [] }],
    },
    "31.02 - arrays with strings merged into empty arrays"
  );
  t.end();
});

// ==============================
// 09. Various
// ==============================

tap.test("32 - empty string vs boolean #58", (t) => {
  t.strictSame(mergeAdvanced(t, "", true), "", "32.01");
  t.strictSame(mergeAdvanced(t, true, ""), "", "32.02");
  t.end();
});

tap.test("33 - empty string vs undefined #59", (t) => {
  t.strictSame(mergeAdvanced(t, "", null), "", "33.01");
  t.strictSame(mergeAdvanced(t, null, ""), "", "33.02");
  t.end();
});

tap.test("34 - empty string vs undefined #60", (t) => {
  t.strictSame(mergeAdvanced(t, "", undefined), "", "34.01");
  t.strictSame(mergeAdvanced(t, undefined, ""), "", "34.02");
  t.end();
});

tap.test("35 - number - #81-90", (t) => {
  t.strictSame(mergeAdvanced(t, 1, ["a"]), ["a"], "35.01");
  t.strictSame(mergeAdvanced(t, ["a"], 1), ["a"], "35.02");
  t.strictSame(mergeAdvanced(t, 1, "a"), "a", "35.03");
  t.strictSame(mergeAdvanced(t, "a", 1), "a", "35.04");
  t.strictSame(mergeAdvanced(t, [], 1), 1, "35.05");
  t.strictSame(mergeAdvanced(t, 1, []), 1, "35.06");
  t.end();
});

tap.test("36 - case #90 cb", (t) => {
  t.strictSame(
    mergeAdvanced(t, [], 1, {
      cb: (inp1) => {
        return inp1;
      },
    }),
    [],
    "36.01"
  );
  t.strictSame(
    mergeAdvanced(t, [], 1, {
      cb: (inp1, inp2) => {
        return inp2;
      },
    }),
    1,
    "36.02"
  );
  t.end();
});

tap.test("37 - empty string vs undefined #60", (t) => {
  t.strictSame(mergeAdvanced(t, "", undefined), "", "37.01");
  t.strictSame(mergeAdvanced(t, undefined, ""), "", "37.02");
  t.end();
});

// ==============================
// 10. opts.ignoreKeys
// ==============================

tap.test(
  "38 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - basic cases",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: "b",
          k: "l",
        },
        {
          a: ["c"],
          m: "n",
        }
      ),
      {
        a: ["c"],
        k: "l",
        m: "n",
      },
      "38.01 - #1, forward"
    );
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: ["c"],
          m: "n",
        },
        {
          a: "b",
          k: "l",
        }
      ),
      {
        a: ["c"],
        k: "l",
        m: "n",
      },
      "38.02 - #1, backward"
    );
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: "b",
          k: "l",
        },
        {
          a: ["c"],
          m: "n",
        },
        {
          ignoreKeys: ["a"],
        }
      ),
      {
        a: "b",
        k: "l",
        m: "n",
      },
      "38.03 - #2, forward, ignoreKeys as array"
    );
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: ["c"],
          m: "n",
        },
        {
          a: "b",
          k: "l",
        },
        {
          ignoreKeys: ["a"],
        }
      ),
      {
        a: ["c"],
        k: "l",
        m: "n",
      },
      "38.04 - #2, backward, ignoreKeys as array"
    );
    //
    // more array vs. array clashes:
    //
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: ["b", "c", "d"],
          k: "l",
        },
        {
          a: ["c", "d", "e"],
          m: "n",
        },
        {
          concatInsteadOfMerging: false,
        }
      ),
      {
        a: ["b", "c", "d", "e"],
        k: "l",
        m: "n",
      },
      "38.05"
    );
    t.end();
  }
);

tap.test(
  "39 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - multiple keys ignored, multiple merged",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: "b",
          d: ["e"],
          k: "l",
          p: 1,
          r: "",
          t: "u",
        },
        {
          a: ["c"],
          d: { f: "g" },
          m: "n",
          p: 2,
          r: "zzz",
          t: ["v"],
        },
        {
          ignoreKeys: ["a", "p", "r"],
        }
      ),
      {
        a: "b",
        d: ["e"],
        k: "l",
        m: "n",
        p: 1,
        r: "",
        t: ["v"],
      },
      "39"
    );
    t.end();
  }
);

tap.test("40 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - wildcards", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        something: "a",
        anything: "b",
        everything: "c",
      },
      {
        something: ["a"],
        anything: ["b"],
        everything: "d",
      },
      {
        ignoreKeys: ["*thing"],
      }
    ),
    {
      something: "a",
      anything: "b",
      everything: "c",
    },
    "40"
  );
  t.end();
});

tap.test(
  "41 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - wildcard, but not found",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          something: "a",
          anything: "b",
          everything: "c",
        },
        {
          something: ["a"],
          anything: ["b"],
          everything: "d",
        },
        {
          ignoreKeys: ["*z*"],
        }
      ),
      {
        something: ["a"],
        anything: ["b"],
        everything: "d",
      },
      "41"
    );
    t.end();
  }
);

// ==============================
// 11. opts.hardMergeKeys
// ==============================

tap.test("42 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: "b",
        d: ["e"],
        k: "l",
        p: 1,
        r: "",
        t: { u: "u" },
      },
      {
        a: ["c"],
        d: { f: "g" },
        m: "n",
        p: 2,
        r: "zzz",
        t: "v",
      }
    ),
    {
      a: ["c"],
      d: ["e"],
      k: "l",
      m: "n",
      p: 2,
      r: "zzz",
      t: { u: "u" },
    },
    "42.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: "b",
        d: ["e"],
        k: "l",
        p: 1,
        r: "",
        t: { u: "u" },
      },
      {
        a: ["c"],
        d: { f: "g" },
        m: "n",
        p: 2,
        r: "zzz",
        t: "v",
      },
      {
        hardMergeKeys: ["d", "t"],
      }
    ),
    {
      a: ["c"],
      d: { f: "g" },
      k: "l",
      m: "n",
      p: 2,
      r: "zzz",
      t: "v",
    },
    "42.02 - hardMergeKeys only"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: "b",
        d: ["e"],
        k: "l",
        p: 1,
        r: "",
        t: { u: "u" },
      },
      {
        a: ["c"],
        d: { f: "g" },
        m: "n",
        p: 2,
        r: "zzz",
        t: "v",
      },
      {
        hardMergeKeys: ["d", "t"],
        ignoreKeys: ["a"],
      }
    ),
    {
      a: "b",
      d: { f: "g" },
      k: "l",
      m: "n",
      p: 2,
      r: "zzz",
      t: "v",
    },
    "42.03 - hardMergeKeys and ignoreKeys, both"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: "b",
        d: ["e"],
        k: "l",
        p: 1,
        r: "",
        t: { u: "u" },
      },
      {
        a: ["c"],
        d: { f: "g" },
        m: "n",
        p: 2,
        r: "zzz",
        t: "v",
      },
      {
        hardMergeKeys: "d",
        ignoreKeys: "a",
      }
    ),
    {
      a: "b",
      d: { f: "g" },
      k: "l",
      m: "n",
      p: 2,
      r: "zzz",
      t: { u: "u" },
    },
    "42.04 - hardMergeKeys and ignoreKeys both at once, both as strings"
  );
  t.end();
});

tap.test(
  "43 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys and opts.ignoreKeys together",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          something: ["aaa"],
          anything: ["bbb"],
          everything: { c: "ccc" },
          xxx: ["ddd"],
          yyy: "yyy",
          zzz: "zzz",
        },
        {
          something: "aaa",
          anything: "bbb",
          everything: "ccc",
          xxx: "overwrite",
          yyy: "overwrite",
          zzz: "overwrite",
        },
        {
          hardMergeKeys: ["*thing", "*xx"],
          ignoreKeys: "nonexisting key",
        }
      ),
      {
        something: "aaa",
        anything: "bbb",
        everything: "ccc",
        xxx: "overwrite",
        yyy: "overwrite",
        zzz: "overwrite",
      },
      "43"
    );
    t.end();
  }
);

tap.test("44 - case #10", (t) => {
  t.strictSame(mergeAdvanced(t, ["a"], undefined), ["a"], "44.01 - default");
  t.strictSame(
    mergeAdvanced(t, { a: ["a"] }, { a: undefined }),
    { a: ["a"] },
    "44.02 - default, objects"
  );
  t.strictSame(
    mergeAdvanced(t, { a: undefined }, { a: ["a"] }),
    { a: ["a"] },
    "44.03 - 11.03.02 opposite order (same res.)"
  );
  t.strictSame(
    mergeAdvanced(t, { a: ["a"] }, { a: undefined }, { hardMergeKeys: "*" }),
    { a: undefined },
    "44.04 - hard merge"
  );
  t.end();
});

tap.test("45 - case #91", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: undefined }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "45.01 - useless hardMergeKeys setting"
  );
  t.strictSame(
    mergeAdvanced(t, { a: undefined }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: undefined },
    "45.02 - checkin the ignores glob"
  );
  t.end();
});

tap.test("46 - case #91 cb", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      { a: undefined },
      { a: ["a"] },
      {
        cb: (inp1) => {
          return inp1;
        },
      }
    ),
    { a: undefined },
    "46.01"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      { a: undefined },
      { a: ["a"] },
      {
        cb: (inp1, inp2) => {
          return inp2;
        },
      }
    ),
    { a: ["a"] },
    "46.02"
  );
  t.end();
});

tap.test("47 - case #81", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: null }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "47.01 - useless hardMergeKeys setting"
  );
  t.strictSame(
    mergeAdvanced(t, { a: null }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: null },
    "47.02 - checkin the ignores glob"
  );
  t.end();
});

tap.test("48 - case #9 (mirror to #81)", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: ["a"] }, { a: null }, { hardMergeKeys: "*" }),
    { a: null },
    "48 - useless hardMergeKeys setting"
  );
  t.end();
});

tap.test("49 - case #8 and its mirror, #71", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: ["a"] }, { a: true }, { hardMergeKeys: "*" }),
    { a: true },
    "49.01 - #8"
  );
  t.strictSame(
    mergeAdvanced(t, { a: true }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: true },
    "49.02 - #71"
  );
  t.end();
});

tap.test("50 - case #7 and its mirror, #61", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: ["a"] }, { a: 1 }, { hardMergeKeys: "*" }),
    { a: 1 },
    "50.01 - #7"
  );
  t.strictSame(
    mergeAdvanced(t, { a: 1 }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: 1 },
    "50.02 - #61"
  );
  t.strictSame(
    mergeAdvanced(t, { a: 1 }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "50.03 - #7 redundant hardMerge setting"
  );
  t.end();
});

tap.test(
  "51 - #27 and its mirror #63 - full obj vs number + hardMerge/ignore",
  (t) => {
    t.strictSame(
      mergeAdvanced(t, { a: { b: "c" } }, { a: 1 }, { hardMergeKeys: "*" }),
      { a: 1 },
      "51.01 - #27"
    );
    t.strictSame(
      mergeAdvanced(t, { a: 1 }, { a: { b: "c" } }, { ignoreKeys: "*" }),
      { a: 1 },
      "51.02 - #63"
    );
    t.end();
  }
);

tap.test("52 - #23 two full objects", (t) => {
  t.strictSame(
    mergeAdvanced(t, { a: { b: "c" } }, { a: { b: "d" } }),
    { a: { b: "d" } },
    "52.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      { a: { b: "c" } },
      { a: { b: "d" } },
      { hardMergeKeys: "*" }
    ),
    { a: { b: "d" } },
    "52.02 - redundant setting"
  );
  t.strictSame(
    mergeAdvanced(t, { a: { b: "c" } }, { a: { b: "d" } }, { ignoreKeys: "*" }),
    { a: { b: "c" } },
    "52.03 - checking ignores"
  );
  t.end();
});

// ==================================
// 12. opts.oneToManyArrayObjectMerge
// ==================================

tap.test(
  "53 - \u001b[33mOPTS\u001b[39m - opts.oneToManyArrayObjectMerge",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              k: false,
              l: false,
              m: "m1",
            },
            {
              k: "k1",
              l: "l1",
              m: false,
            },
          ],
        },
        {
          a: [
            {
              k: "k2",
              l: "l2",
              m: "m2",
            },
          ],
        }
      ),
      {
        a: [
          {
            k: "k2",
            l: "l2",
            m: "m2",
          },
          {
            k: "k1",
            l: "l1",
            m: false,
          },
        ],
      },
      "53.01 - default behaviour will merge first keys and leave second key as it is"
    );
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              k: "k2",
              l: "l2",
              m: "m2",
            },
          ],
        },
        {
          a: [
            {
              k: false,
              l: false,
              m: "m1",
            },
            {
              k: "k1",
              l: "l1",
              m: false,
            },
          ],
        }
      ),
      {
        a: [
          {
            k: "k2",
            l: "l2",
            m: "m1",
          },
          {
            k: "k1",
            l: "l1",
            m: false,
          },
        ],
      },
      "53.02 - same as #01, but swapped order of input arguments. Should not differ except for string merge order."
    );
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              k: false,
              l: false,
              m: "m1",
            },
            {
              k: "k1",
              l: "l1",
              m: false,
            },
          ],
        },
        {
          a: [
            {
              k: "k2",
              l: "l2",
              m: "m2",
            },
          ],
        },
        {
          oneToManyArrayObjectMerge: true,
        }
      ),
      {
        a: [
          {
            k: "k2",
            l: "l2",
            m: "m2",
          },
          {
            k: "k2",
            l: "l2",
            m: "m2",
          },
        ],
      },
      "53.03 - one-to-many merge, normal argument order"
    );
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              k: "k2",
              l: "l2",
              m: "m2",
            },
          ],
        },
        {
          a: [
            {
              k: false,
              l: false,
              m: "m1",
            },
            {
              k: "k1",
              l: "l1",
              m: false,
            },
          ],
        },
        {
          oneToManyArrayObjectMerge: true,
        }
      ),
      {
        a: [
          {
            k: "k2",
            l: "l2",
            m: "m1",
          },
          {
            k: "k1",
            l: "l1",
            m: "m2",
          },
        ],
      },
      "53.04 - one-to-many merge, opposite arg. order"
    );
    t.end();
  }
);

tap.test(
  "54 - \u001b[33mOPTS\u001b[39m - opts.oneToManyArrayObjectMerge - two-to-many does not work",
  (t) => {
    t.strictSame(
      mergeAdvanced(
        t,
        {
          a: [
            {
              k: false,
              l: "l1",
              m: "m1",
            },
            {
              k: "k1",
              l: "l1",
              m: false,
            },
            {
              k: "k1",
              l: false,
              m: "m1",
            },
          ],
        },
        {
          a: [
            {
              k: "k2",
              l: "l2",
              m: "m2",
            },
            {
              k: "k2",
              l: "l2",
              m: "m2",
            },
          ],
        },
        {
          oneToManyArrayObjectMerge: true,
        }
      ),
      {
        a: [
          {
            k: "k2",
            l: "l2",
            m: "m2",
          },
          {
            k: "k2",
            l: "l2",
            m: "m2",
          },
          {
            k: "k1",
            l: false,
            m: "m1",
          },
        ],
      },
      "54 - does not activate when two-to-many found"
    );
    t.end();
  }
);

// ==============================
// 13. throws of all kinds
// ==============================

tap.test(
  "55 - \u001b[33mOPTS\u001b[39m - third argument is not a plain object",
  (t) => {
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, {});
    }, "55");
    t.end();
  }
);

tap.test(
  "56 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys type checks work",
  (t) => {
    t.throws(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { ignoreKeys: 1 });
    }, "56.01");
    t.throws(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { ignoreKeys: true });
    }, "56.02");
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { ignoreKeys: "" });
    }, "56.03");
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { ignoreKeys: [""] });
    }, "56.04");
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { ignoreKeys: [] });
    }, "56.05");
    t.end();
  }
);

tap.test(
  "57 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys type checks work",
  (t) => {
    t.throws(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { hardMergeKeys: 1 });
    }, "57.01");
    t.throws(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { hardMergeKeys: true });
    }, "57.02");
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { hardMergeKeys: "" });
    }, "57.03");
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { hardMergeKeys: [""] });
    }, "57.04");
    t.doesNotThrow(() => {
      mergeAdvanced(t, { a: "a" }, { b: "b" }, { hardMergeKeys: [] });
    }, "57.05");
    t.end();
  }
);

// ==============================
// 14. ad-hoc
// ==============================

tap.test("58 - objects within arrays", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- this key is unique.
          },
        ],
      },
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- and this key is unique.
          },
        ],
      }
    ),
    {
      a: [
        {
          b: "zzz",
          c: "ccc",
        },
        {
          b: false,
          d: "ddd",
        },
      ],
    },
    "58.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- this key is unique.
          },
        ],
      },
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- and this key is unique.
          },
        ],
      },
      {
        mergeObjectsOnlyWhenKeysetMatches: false,
      }
    ),
    {
      a: [
        {
          b: "zzz",
          c: "ccc",
          d: "ddd",
        },
      ],
    },
    "58.02 - customising opts.mergeObjectsOnlyWhenKeysetMatches - one way"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- this key is unique.
          },
        ],
      },
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- and this key is unique.
          },
        ],
      },
      {
        mergeObjectsOnlyWhenKeysetMatches: false,
      }
    ),
    {
      a: [
        {
          b: "zzz",
          c: "ccc",
          d: "ddd",
        },
      ],
    },
    "58.03 - customising opts.mergeObjectsOnlyWhenKeysetMatches - other way (swapped args of 14.01.02.01)"
  );

  // setting the glob is the same as setting opts.hardMergeEverything to true
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- this key is unique but it doesn't matter
          },
        ],
      },
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- and this key is unique but it doesn't matter
          },
        ],
      },
      {
        hardMergeKeys: "*", // <----- notice it's glob
      }
    ),
    {
      a: [
        // <----- hard merge happens back at "a" key's level, no matter the contents
        {
          b: false,
          d: "ddd",
        },
      ],
    },
    "58.04 - hardMergeKeys: * in per-key settings is the same as global flag"
  );

  // setting the glob is the same as setting opts.ignoreEverything to true
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- this key is unique but it doesn't matter
          },
        ],
      },
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- and this key is unique but it doesn't matter
          },
        ],
      },
      {
        ignoreKeys: "*", // <----- notice it's glob
      }
    ),
    {
      a: [
        // <----- hard merge happens back at "a" key's level, no matter the contents
        {
          b: "zzz",
          c: "ccc",
        },
      ],
    },
    "58.05 - ignoreKeys: * in per-key settings is the same as global flag"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- this key is unique.
          },
        ],
      },
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- and this key is unique.
          },
        ],
      },
      {
        hardMergeKeys: "b", // <----- forcing hard merge on "b"
        mergeObjectsOnlyWhenKeysetMatches: false,
      }
    ),
    {
      a: [
        {
          b: false,
          c: "ccc",
          d: "ddd",
        },
      ],
    },
    "58.06 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: false,
            d: "ddd", // <----- and this key is unique.
          },
        ],
      },
      {
        a: [
          {
            b: "zzz",
            c: "ccc", // <----- this key is unique.
          },
        ],
      },
      {
        hardMergeKeys: "b", // <----- unnecessarily forcing hard merge on "b"
        mergeObjectsOnlyWhenKeysetMatches: false,
      }
    ),
    {
      a: [
        {
          b: "zzz", // it would result in string anyway, without a hard merge.
          c: "ccc",
          d: "ddd",
        },
      ],
    },
    "58.07 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge"
  );
  t.end();
});

// ==============================
// 15. combo of opts.oneToManyArrayObjectMerge and unidirectional merge,
// either opts.ignoreKeys, opts.hardMergeKeys, opts.hardMergeEverything or opts.ignoreEverything
// ==============================

tap.test("59 - hard merge on clashing keys only case #1", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "888",
            c: "111",
          },
          {
            b: "999",
            c: "222",
          },
        ],
      },
      {
        a: [
          {
            c: "333",
          },
        ],
      }
    ),
    {
      a: [
        {
          b: "888",
          c: "333", // <------ overwrites just this
        },
        {
          b: "999",
          c: "222", // <------ not this
        },
      ],
    },
    "59.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "888",
            c: "111",
          },
          {
            b: "999",
            c: "222",
          },
        ],
      },
      {
        a: [
          {
            c: "333", // <------ imagine this is an override, used in mapping
          },
        ],
      },
      {
        oneToManyArrayObjectMerge: true,
      }
    ),
    {
      a: [
        {
          b: "888",
          c: "333", // <------ gets overwritten as standard
        },
        {
          b: "999",
          c: "333", // <------ BUT ALSO THIS TOO
        },
      ],
    },
    "59.02 - one-to-many"
  );

  // PRESS PAUSE HERE.

  // LET'S TEST TYPE CLASHES.

  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "888",
            c: ["111"], // <------ OOPS! array!
          },
          {
            b: "999",
            c: ["222"], // <------ OOPS! array!
          },
        ],
      },
      {
        a: [
          {
            c: "333", // <------ now it's a string vs array...
          },
        ],
      },
      {
        oneToManyArrayObjectMerge: true,
      }
    ),
    {
      a: [
        {
          b: "888",
          c: ["111"], // <------ nothing happens because array is higher in food chain
        },
        {
          b: "999",
          c: ["222"], // <------ nothing happens because array is higher in food chain
        },
      ],
    },
    "59.03 - one to many, string tries override arrays, against the food chain order"
  );

  // WHAT DO WE DO? HOW CAN WE OVERWRITE LIKE IN 15.01.02 ?

  // LET'S TRY HARD OVERWRITE!

  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: [
          {
            b: "888",
            c: ["111"], // <------ will this get overwritten by '333'?
          },
          {
            b: "999",
            c: ["222"], // <------ will this get overwritten by '333'?
          },
        ],
      },
      {
        a: [
          {
            c: "333",
          },
        ],
      },
      {
        oneToManyArrayObjectMerge: true,
        hardMergeKeys: ["c"], // <------ is this the solution?
      }
    ),
    {
      a: [
        {
          b: "888",
          c: "333",
        },
        {
          b: "999",
          c: "333",
        },
      ],
    },
    "59.04 - hard overwrite, per-key setting"
  );
  t.end();
});

// ==============================
// 16. Object values are arrays and they contain strings.
// We test their various merge cases.
// ==============================

tap.test("60 - values as arrays that contain strings", (t) => {
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: ["a"],
      },
      {
        a: ["b"],
      }
    ),
    {
      a: ["a", "b"],
    },
    "60.01 - default behaviour, different strings"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: ["a"],
      },
      {
        a: ["a"],
      }
    ),
    {
      a: ["a", "a"],
    },
    "60.02 - default behaviour, same string"
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: ["a"],
      },
      {
        a: ["a"],
      },
      {
        concatInsteadOfMerging: false,
      }
    ),
    {
      a: ["a"],
    },
    "60.03 - opts.concatInsteadOfMerging"
  );
  // now the first array goes straight to result, so three "zzz" will come.
  // then second array's "zzz" will be matched as existing and won't be let in.
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: ["zzz", "zzz", "zzz"],
      },
      {
        a: ["zzz"],
      },
      {
        concatInsteadOfMerging: false,
      }
    ),
    {
      a: ["zzz", "zzz", "zzz"],
    },
    "60.04 - opts.concatInsteadOfMerging pt2."
  );
  t.strictSame(
    mergeAdvanced(
      t,
      {
        a: ["bbb", "zzz", "zzz", "bbb", "zzz", "bbb"],
      },
      {
        a: ["zzz", "bbb"],
      },
      {
        concatInsteadOfMerging: false,
        dedupeStringsInArrayValues: true,
      }
    ),
    {
      a: ["bbb", "zzz"],
    },
    "60.05 - opts.concatInsteadOfMerging + opts.dedupeStringsInArrayValues"
  );
  t.end();
});

// ==============================
// 17. Date objects
// ==============================

tap.test("61", (t) => {
  const date1 = new Date(`2020-02-08T12:32:00`);
  const date2 = new Date(`2020-02-10T02:32:00`);
  const o1 = { a: date1 };
  const o2 = { a: date2 };

  const gathered = [];
  t.strictSame(
    mergeAdvanced(t, o1, o2, {
      cb: (obj1, obj2, currRes, infoObj) => {
        gathered.push({
          obj1,
          obj2,
          currRes,
          infoObj,
        });
        return currRes;
      },
    }),
    o2,
    "61.01"
  );
  t.strictSame(
    gathered,
    [
      {
        obj1: date1,
        obj2: date2,
        currRes: date2,
        infoObj: {
          path: "a",
          key: "a",
          type: ["date", "date"],
        },
      },
      {
        obj1: { a: date1 },
        obj2: { a: date2 },
        currRes: { a: date2 },
        infoObj: {
          path: "",
          key: null,
          type: ["object", "object"],
        },
      },
    ],
    "61.02"
  );

  t.strictSame(mergeAdvanced(t, o2, o1), o2, "61.03");
  t.end();
});

tap.test("62", (t) => {
  const o1 = { a: new Date(`2020-02-08T12:32:00`) };
  const o2 = { a: "zzz" };

  t.strictSame(mergeAdvanced(t, o1, o2), o2, "62.01");
  t.strictSame(mergeAdvanced(t, o2, o1), o2, "62.02");
  t.end();
});

tap.test("63", (t) => {
  const o1 = { a: new Date(`2020-02-08T12:32:00`) };
  const o2 = { a: null };

  t.strictSame(mergeAdvanced(t, o1, o2), o1, "63.01");
  t.strictSame(mergeAdvanced(t, o2, o1), o1, "63.02");
  t.end();
});

tap.test("64", (t) => {
  const o1 = { a: new Date(`2020-02-08T12:32:00`) };
  const o2 = { a: { b: "c" } };

  t.strictSame(mergeAdvanced(t, o1, o2), o2, "64.01");
  t.strictSame(mergeAdvanced(t, o2, o1), o2, "64.02");
  t.end();
});
