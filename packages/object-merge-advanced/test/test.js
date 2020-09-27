/* eslint max-len:0 */

import tap from "tap";
import clone from "lodash.clonedeep";
import mergeAdvanced from "../dist/object-merge-advanced.esm";
// import equal from "deep-equal");

//
//                           ____
//          massive hammer  |    |
//        O=================|    |
//          upon all bugs   |____|
//
//                         .=O=.

// !!! There should be two (or more) tests in each, with input args swapped, in order to
// guarantee that there are no sneaky things happening when argument order is backwards

// ==============================
// Edge cases
// ==============================

tap.test("01 - missing second arg", (t) => {
  t.strictSame(
    mergeAdvanced({
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
    mergeAdvanced(undefined, {
      a: "a",
    }),
    {
      a: "a",
    },
    "02.01"
  );
  t.strictSame(
    mergeAdvanced(null, {
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
    mergeAdvanced();
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("04 - various, mixed", (t) => {
  t.strictSame(mergeAdvanced(null, null), null, "04.01");
  t.strictSame(mergeAdvanced(undefined, undefined), undefined, "04.02");
  t.strictSame(mergeAdvanced(true, false), true, "04.03");
  t.strictSame(mergeAdvanced(["a"], ["b"]), ["a", "b"], "04.04");
  t.strictSame(mergeAdvanced([], []), [], "04.05");
  t.end();
});

tap.test("05 - third arg is not a plain object - throws", (t) => {
  t.throws(() => {
    mergeAdvanced({ a: "a" }, { b: "b" }, "c");
  }, /THROW_ID_02/g);
  t.end();
});

// ==============================
// Input argument mutation
// ==============================

tap.test("06 - testing for mutation of the input args", (t) => {
  const obj1 = {
    a: "a",
    b: "b",
  };
  const originalObj1 = clone(obj1);
  const obj2 = {
    c: "c",
    d: "d",
  };
  mergeAdvanced(obj1, obj2);
  t.strictSame(obj1, originalObj1, "06");
  t.end();
});

// ================================================
// does not introduce non-unique values into arrays
// ================================================

tap.test("07 - arrays, checking against dupes being added", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "07.01"
  );
  t.strictSame(
    mergeAdvanced(
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
    "07.02"
  );
  t.end();
});

// ================================================
// does not introduce non-unique values into arrays
// ================================================

tap.test(
  "08 - merges objects within arrays if keyset and position within array matches",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "08"
    );
    t.end();
  }
);

tap.test(
  "09 - concats instead if objects within arrays are in a wrong order",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "09"
    );
    t.end();
  }
);

tap.test(
  "10 - concats instead if objects within arrays are in a wrong order",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - merges objects within arrays, key sets are a subset of one another",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "11"
    );
    t.end();
  }
);

tap.test(
  "12 - merges objects within arrays, subset and no match, mixed case",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "12"
    );
    t.end();
  }
);

tap.test("13 - opts.mergeObjectsOnlyWhenKeysetMatches", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "13.01 - mergeObjectsOnlyWhenKeysetMatches = default"
  );
  t.strictSame(
    mergeAdvanced(
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
    "13.02 - mergeObjectsOnlyWhenKeysetMatches = true"
  );
  t.strictSame(
    mergeAdvanced(
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
    "13.03 - mergeObjectsOnlyWhenKeysetMatches = false"
  );
  t.end();
});

tap.test("14 - README example: opts.mergeObjectsOnlyWhenKeysetMatches", (t) => {
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
    mergeAdvanced(obj1, obj2),
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
    "14.01"
  );

  t.strictSame(
    mergeAdvanced(obj1, obj2, { mergeObjectsOnlyWhenKeysetMatches: false }),
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
    "14.02"
  );

  t.end();
});

// ==============================
// 06. Real world tests
// ==============================

tap.test("15 - real world use case", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "15"
  );
  t.end();
});

tap.test("16 - real world use case, mini", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "16"
  );
  t.end();
});

// ==============================
// 07. Merging arrays
// ==============================

tap.test("17 - merges two arrays of equal length", (t) => {
  t.strictSame(
    mergeAdvanced(["a", "b", "c"], ["d", "e", "f"]),
    ["a", "d", "b", "e", "c", "f"],
    "17"
  );
  t.end();
});

tap.test("18 - merges two arrays of different length", (t) => {
  t.strictSame(
    mergeAdvanced(["a", "b", "c", "d"], ["e", "f"]),
    ["a", "e", "b", "f", "c", "d"],
    "18.01"
  );
  t.strictSame(
    mergeAdvanced(["a", "b"], ["d", "e", "f", "g"]),
    ["a", "d", "b", "e", "f", "g"],
    "18.02"
  );
  t.end();
});

tap.test("19 - merges non-empty array with an empty array", (t) => {
  t.strictSame(
    mergeAdvanced(["a", "b", "c", "d"], []),
    ["a", "b", "c", "d"],
    "19.01"
  );
  t.strictSame(
    mergeAdvanced([], ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "19.02"
  );
  t.strictSame(
    mergeAdvanced(["a", "b", "c", "d"], {}),
    ["a", "b", "c", "d"],
    "19.03"
  );
  t.strictSame(
    mergeAdvanced({}, ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "19.04"
  );
  t.strictSame(
    mergeAdvanced(["a", "b", "c", "d"], ""),
    ["a", "b", "c", "d"],
    "19.05"
  );
  t.strictSame(
    mergeAdvanced("", ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "19.06"
  );
  t.end();
});

// ==============================
// 08. Merging arrays
// ==============================

tap.test("20 - arrays in objects", (t) => {
  t.strictSame(
    mergeAdvanced({ a: ["b", "c"] }, { d: ["e", "f"] }),
    {
      a: ["b", "c"],
      d: ["e", "f"],
    },
    "20"
  );
  t.end();
});

tap.test("21 - arrays in objects, deeper", (t) => {
  t.strictSame(
    mergeAdvanced({ a: ["b", "c"] }, { a: ["e", "f"] }),
    {
      a: ["b", "e", "c", "f"],
    },
    "21"
  );
  t.end();
});

tap.test("22 - objects in arrays in objects", (t) => {
  t.strictSame(
    mergeAdvanced({ a: [{ b: "b" }] }, { a: [{ c: "c" }] }),
    {
      a: [{ b: "b" }, { c: "c" }],
    },
    "22"
  );
  t.end();
});

tap.test("23 - objects in arrays in objects", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "23.01 - default"
  );
  t.strictSame(
    mergeAdvanced(
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
    "23.02 - arrays with strings merged into empty arrays"
  );
  t.end();
});

// ==============================
// 09. Various
// ==============================

tap.test("24 - empty string vs boolean #58", (t) => {
  t.strictSame(mergeAdvanced("", true), "", "24.01");
  t.strictSame(mergeAdvanced(true, ""), "", "24.02");
  t.end();
});

tap.test("25 - empty string vs undefined #59", (t) => {
  t.strictSame(mergeAdvanced("", null), "", "25.01");
  t.strictSame(mergeAdvanced(null, ""), "", "25.02");
  t.end();
});

tap.test("26 - empty string vs undefined #60", (t) => {
  t.strictSame(mergeAdvanced("", undefined), "", "26.01");
  t.strictSame(mergeAdvanced(undefined, ""), "", "26.02");
  t.end();
});

tap.test("27 - number - #81-90", (t) => {
  t.strictSame(mergeAdvanced(1, ["a"]), ["a"], "27.01");
  t.strictSame(mergeAdvanced(["a"], 1), ["a"], "27.02");
  t.strictSame(mergeAdvanced(1, "a"), "a", "27.03");
  t.strictSame(mergeAdvanced("a", 1), "a", "27.04");
  t.strictSame(mergeAdvanced([], 1), 1, "27.05");
  t.strictSame(mergeAdvanced(1, []), 1, "27.06");
  t.end();
});

tap.test("28 - empty string vs undefined #60", (t) => {
  t.strictSame(mergeAdvanced("", undefined), "", "28.01");
  t.strictSame(mergeAdvanced(undefined, ""), "", "28.02");
  t.end();
});

// ==============================
// 10. opts.ignoreKeys
// ==============================

tap.test(
  "29 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - basic cases",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "29.01 - #1, forward"
    );
    t.strictSame(
      mergeAdvanced(
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
      "29.02 - #1, backward"
    );
    t.strictSame(
      mergeAdvanced(
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
      "29.03 - #2, forward, ignoreKeys as array"
    );
    t.strictSame(
      mergeAdvanced(
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
      "29.04 - #2, backward, ignoreKeys as array"
    );
    //
    // more array vs. array clashes:
    //
    t.strictSame(
      mergeAdvanced(
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
      "29.05"
    );
    t.end();
  }
);

tap.test(
  "30 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - multiple keys ignored, multiple merged",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "30"
    );
    t.end();
  }
);

tap.test("31 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - wildcards", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "31"
  );
  t.end();
});

tap.test(
  "32 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - wildcard, but not found",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "32"
    );
    t.end();
  }
);

// ==============================
// 11. opts.hardMergeKeys
// ==============================

tap.test("33 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "33.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
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
    "33.02 - hardMergeKeys only"
  );
  t.strictSame(
    mergeAdvanced(
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
    "33.03 - hardMergeKeys and ignoreKeys, both"
  );
  t.strictSame(
    mergeAdvanced(
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
    "33.04 - hardMergeKeys and ignoreKeys both at once, both as strings"
  );
  t.end();
});

tap.test(
  "34 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys and opts.ignoreKeys together",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "34"
    );
    t.end();
  }
);

tap.test("35 - case #10", (t) => {
  t.strictSame(mergeAdvanced(["a"], undefined), ["a"], "35.01 - default");
  t.strictSame(
    mergeAdvanced({ a: ["a"] }, { a: undefined }),
    { a: ["a"] },
    "35.02 - default, objects"
  );
  t.strictSame(
    mergeAdvanced({ a: undefined }, { a: ["a"] }),
    { a: ["a"] },
    "35.03 - 11.03.02 opposite order (same res.)"
  );
  t.strictSame(
    mergeAdvanced({ a: ["a"] }, { a: undefined }, { hardMergeKeys: "*" }),
    { a: undefined },
    "35.04 - hard merge"
  );
  t.end();
});

tap.test("36 - case #91", (t) => {
  t.strictSame(
    mergeAdvanced({ a: undefined }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "36.01 - useless hardMergeKeys setting"
  );
  t.strictSame(
    mergeAdvanced({ a: undefined }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: undefined },
    "36.02 - checkin the ignores glob"
  );
  t.end();
});

tap.test("37 - case #81", (t) => {
  t.strictSame(
    mergeAdvanced({ a: null }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "37.01 - useless hardMergeKeys setting"
  );
  t.strictSame(
    mergeAdvanced({ a: null }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: null },
    "37.02 - checkin the ignores glob"
  );
  t.end();
});

tap.test("38 - case #9 (mirror to #81)", (t) => {
  t.strictSame(
    mergeAdvanced({ a: ["a"] }, { a: null }, { hardMergeKeys: "*" }),
    { a: null },
    "38 - useless hardMergeKeys setting"
  );
  t.end();
});

tap.test("39 - case #8 and its mirror, #71", (t) => {
  t.strictSame(
    mergeAdvanced({ a: ["a"] }, { a: true }, { hardMergeKeys: "*" }),
    { a: true },
    "39.01 - #8"
  );
  t.strictSame(
    mergeAdvanced({ a: true }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: true },
    "39.02 - #71"
  );
  t.end();
});

tap.test("40 - case #7 and its mirror, #61", (t) => {
  t.strictSame(
    mergeAdvanced({ a: ["a"] }, { a: 1 }, { hardMergeKeys: "*" }),
    { a: 1 },
    "40.01 - #7"
  );
  t.strictSame(
    mergeAdvanced({ a: 1 }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: 1 },
    "40.02 - #61"
  );
  t.strictSame(
    mergeAdvanced({ a: 1 }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "40.03 - #7 redundant hardMerge setting"
  );
  t.end();
});

tap.test(
  "41 - #27 and its mirror #63 - full obj vs number + hardMerge/ignore",
  (t) => {
    t.strictSame(
      mergeAdvanced({ a: { b: "c" } }, { a: 1 }, { hardMergeKeys: "*" }),
      { a: 1 },
      "41.01 - #27"
    );
    t.strictSame(
      mergeAdvanced({ a: 1 }, { a: { b: "c" } }, { ignoreKeys: "*" }),
      { a: 1 },
      "41.02 - #63"
    );
    t.end();
  }
);

tap.test("42 - #23 two full objects", (t) => {
  t.strictSame(
    mergeAdvanced({ a: { b: "c" } }, { a: { b: "d" } }),
    { a: { b: "d" } },
    "42.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced({ a: { b: "c" } }, { a: { b: "d" } }, { hardMergeKeys: "*" }),
    { a: { b: "d" } },
    "42.02 - redundant setting"
  );
  t.strictSame(
    mergeAdvanced({ a: { b: "c" } }, { a: { b: "d" } }, { ignoreKeys: "*" }),
    { a: { b: "c" } },
    "42.03 - checking ignores"
  );
  t.end();
});

// ==================================
// 12. opts.oneToManyArrayObjectMerge
// ==================================

tap.test(
  "43 - \u001b[33mOPTS\u001b[39m - opts.oneToManyArrayObjectMerge",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "43.01 - default behaviour will merge first keys and leave second key as it is"
    );
    t.strictSame(
      mergeAdvanced(
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
      "43.02 - same as #01, but swapped order of input arguments. Should not differ except for string merge order."
    );
    t.strictSame(
      mergeAdvanced(
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
      "43.03 - one-to-many merge, normal argument order"
    );
    t.strictSame(
      mergeAdvanced(
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
      "43.04 - one-to-many merge, opposite arg. order"
    );
    t.end();
  }
);

tap.test(
  "44 - \u001b[33mOPTS\u001b[39m - opts.oneToManyArrayObjectMerge - two-to-many does not work",
  (t) => {
    t.strictSame(
      mergeAdvanced(
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
      "44 - does not activate when two-to-many found"
    );
    t.end();
  }
);

// ==============================
// 13. throws of all kinds
// ==============================

tap.test(
  "45 - \u001b[33mOPTS\u001b[39m - third argument is not a plain object",
  (t) => {
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, 1);
    }, "45.01");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, {});
    }, "45.02");
    t.end();
  }
);

tap.test(
  "46 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys type checks work",
  (t) => {
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: 1 });
    }, "46.01");
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: true });
    }, "46.02");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: "" });
    }, "46.03");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: [""] });
    }, "46.04");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: [] });
    }, "46.05");
    t.end();
  }
);

tap.test(
  "47 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys type checks work",
  (t) => {
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: 1 });
    }, "47.01");
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: true });
    }, "47.02");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: "" });
    }, "47.03");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: [""] });
    }, "47.04");
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: [] });
    }, "47.05");
    t.end();
  }
);

// ==============================
// 14. ad-hoc
// ==============================

tap.test("48 - objects within arrays", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "48.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
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
    "48.02 - customising opts.mergeObjectsOnlyWhenKeysetMatches - one way"
  );
  t.strictSame(
    mergeAdvanced(
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
    "48.03 - customising opts.mergeObjectsOnlyWhenKeysetMatches - other way (swapped args of 14.01.02.01)"
  );

  // setting the glob is the same as setting opts.hardMergeEverything to true
  t.strictSame(
    mergeAdvanced(
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
    "48.04 - hardMergeKeys: * in per-key settings is the same as global flag"
  );

  // setting the glob is the same as setting opts.ignoreEverything to true
  t.strictSame(
    mergeAdvanced(
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
    "48.05 - ignoreKeys: * in per-key settings is the same as global flag"
  );
  t.strictSame(
    mergeAdvanced(
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
    "48.06 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge"
  );
  t.strictSame(
    mergeAdvanced(
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
    "48.07 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge"
  );
  t.end();
});

// ==============================
// 15. combo of opts.oneToManyArrayObjectMerge and unidirectional merge,
// either opts.ignoreKeys, opts.hardMergeKeys, opts.hardMergeEverything or opts.ignoreEverything
// ==============================

tap.test("49 - hard merge on clashing keys only case #1", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "49.01 - default behaviour"
  );
  t.strictSame(
    mergeAdvanced(
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
    "49.02 - one-to-many"
  );

  // PRESS PAUSE HERE.

  // LET'S TEST TYPE CLASHES.

  t.strictSame(
    mergeAdvanced(
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
    "49.03 - one to many, string tries override arrays, against the food chain order"
  );

  // WHAT DO WE DO? HOW CAN WE OVERWRITE LIKE IN 15.01.02 ?

  // LET'S TRY HARD OVERWRITE!

  t.strictSame(
    mergeAdvanced(
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
    "49.04 - hard overwrite, per-key setting"
  );
  t.end();
});

// ==============================
// 16. Object values are arrays and they contain strings.
// We test their various merge cases.
// ==============================

tap.test("50 - values as arrays that contain strings", (t) => {
  t.strictSame(
    mergeAdvanced(
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
    "50.01 - default behaviour, different strings"
  );
  t.strictSame(
    mergeAdvanced(
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
    "50.02 - default behaviour, same string"
  );
  t.strictSame(
    mergeAdvanced(
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
    "50.03 - opts.concatInsteadOfMerging"
  );
  // now the first array goes straight to result, so three "zzz" will come.
  // then second array's "zzz" will be matched as existing and won't be let in.
  t.strictSame(
    mergeAdvanced(
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
    "50.04 - opts.concatInsteadOfMerging pt2."
  );
  t.strictSame(
    mergeAdvanced(
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
    "50.05 - opts.concatInsteadOfMerging + opts.dedupeStringsInArrayValues"
  );
  t.end();
});
