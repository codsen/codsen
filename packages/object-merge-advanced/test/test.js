/* eslint max-len:0 */

const t = require("tap");
const clone = require("lodash.clonedeep");
const mergeAdvanced = require("../dist/object-merge-advanced.cjs");
// const equal = require("deep-equal");

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

t.test("02.01 - missing second arg", (t) => {
  t.same(
    mergeAdvanced({
      a: "a",
    }),
    {
      a: "a",
    },
    "02.01"
  );
  t.end();
});

t.test("02.02 - missing first arg", (t) => {
  t.same(
    mergeAdvanced(undefined, {
      a: "a",
    }),
    {
      a: "a",
    },
    "02.02.01"
  );
  t.same(
    mergeAdvanced(null, {
      a: "a",
    }),
    {
      a: "a",
    },
    "02.02.02"
  );
  t.end();
});

t.test("02.03 - both args missing - throws", (t) => {
  t.throws(() => {
    mergeAdvanced();
  }, /THROW_ID_01/g);
  t.end();
});

t.test("02.04 - various, mixed", (t) => {
  t.same(mergeAdvanced(null, null), null, "02.04.01");
  t.same(mergeAdvanced(undefined, undefined), undefined, "02.04.02");
  t.same(mergeAdvanced(true, false), true, "02.04.03");
  t.same(mergeAdvanced(["a"], ["b"]), ["a", "b"], "02.04.04");
  t.same(mergeAdvanced([], []), [], "02.04.05");
  t.end();
});

t.test("02.05 - third arg is not a plain object - throws", (t) => {
  t.throws(() => {
    mergeAdvanced({ a: "a" }, { b: "b" }, "c");
  }, /THROW_ID_02/g);
  t.end();
});

// ==============================
// Input argument mutation
// ==============================

t.test("03.01 - testing for mutation of the input args", (t) => {
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
  t.same(obj1, originalObj1);
  t.end();
});

// ================================================
// does not introduce non-unique values into arrays
// ================================================

t.test("04.01 - arrays, checking against dupes being added", (t) => {
  t.same(
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
    "04.01.01"
  );
  t.same(
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
    "04.01.02"
  );
  t.end();
});

// ================================================
// does not introduce non-unique values into arrays
// ================================================

t.test(
  "05.01 - merges objects within arrays if keyset and position within array matches",
  (t) => {
    t.same(
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
      "05.01.01"
    );
    t.end();
  }
);

t.test(
  "05.02 - concats instead if objects within arrays are in a wrong order",
  (t) => {
    t.same(
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
      "05.02"
    );
    t.end();
  }
);

t.test(
  "05.03 - concats instead if objects within arrays are in a wrong order",
  (t) => {
    t.same(
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
      "05.03"
    );
    t.end();
  }
);

t.test(
  "05.04 - merges objects within arrays, key sets are a subset of one another",
  (t) => {
    t.same(
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
      "05.04"
    );
    t.end();
  }
);

t.test(
  "05.05 - merges objects within arrays, subset and no match, mixed case",
  (t) => {
    t.same(
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
      "05.05"
    );
    t.end();
  }
);

t.test("05.06 - opts.mergeObjectsOnlyWhenKeysetMatches", (t) => {
  t.same(
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
    "05.06.01 - mergeObjectsOnlyWhenKeysetMatches = default"
  );
  t.same(
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
    "05.06.02 - mergeObjectsOnlyWhenKeysetMatches = true"
  );
  t.same(
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
    "05.06.03 - mergeObjectsOnlyWhenKeysetMatches = false"
  );
  t.end();
});

t.test(
  "05.07 - README example: opts.mergeObjectsOnlyWhenKeysetMatches",
  (t) => {
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

    t.same(
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
      "05.07.01"
    );

    t.same(
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
      "05.07.02"
    );

    t.end();
  }
);

// ==============================
// 06. Real world tests
// ==============================

t.test("06.01 - real world use case", (t) => {
  t.same(
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
    "06.01"
  );
  t.end();
});

t.test("06.02 - real world use case, mini", (t) => {
  t.same(
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
    "06.02"
  );
  t.end();
});

// ==============================
// 07. Merging arrays
// ==============================

t.test("07.01 - merges two arrays of equal length", (t) => {
  t.same(
    mergeAdvanced(["a", "b", "c"], ["d", "e", "f"]),
    ["a", "d", "b", "e", "c", "f"],
    "07.01"
  );
  t.end();
});

t.test("07.02 - merges two arrays of different length", (t) => {
  t.same(
    mergeAdvanced(["a", "b", "c", "d"], ["e", "f"]),
    ["a", "e", "b", "f", "c", "d"],
    "07.02.01"
  );
  t.same(
    mergeAdvanced(["a", "b"], ["d", "e", "f", "g"]),
    ["a", "d", "b", "e", "f", "g"],
    "07.02.02"
  );
  t.end();
});

t.test("07.03 - merges non-empty array with an empty array", (t) => {
  t.same(
    mergeAdvanced(["a", "b", "c", "d"], []),
    ["a", "b", "c", "d"],
    "07.03.01"
  );
  t.same(
    mergeAdvanced([], ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "07.03.02"
  );
  t.same(
    mergeAdvanced(["a", "b", "c", "d"], {}),
    ["a", "b", "c", "d"],
    "07.03.03"
  );
  t.same(
    mergeAdvanced({}, ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "07.03.04"
  );
  t.same(
    mergeAdvanced(["a", "b", "c", "d"], ""),
    ["a", "b", "c", "d"],
    "07.03.05"
  );
  t.same(
    mergeAdvanced("", ["d", "e", "f", "g"]),
    ["d", "e", "f", "g"],
    "07.03.06"
  );
  t.end();
});

// ==============================
// 08. Merging arrays
// ==============================

t.test("08.01 - arrays in objects", (t) => {
  t.same(
    mergeAdvanced({ a: ["b", "c"] }, { d: ["e", "f"] }),
    {
      a: ["b", "c"],
      d: ["e", "f"],
    },
    "08.01"
  );
  t.end();
});

t.test("08.02 - arrays in objects, deeper", (t) => {
  t.same(
    mergeAdvanced({ a: ["b", "c"] }, { a: ["e", "f"] }),
    {
      a: ["b", "e", "c", "f"],
    },
    "08.02"
  );
  t.end();
});

t.test("08.03 - objects in arrays in objects", (t) => {
  t.same(
    mergeAdvanced({ a: [{ b: "b" }] }, { a: [{ c: "c" }] }),
    {
      a: [{ b: "b" }, { c: "c" }],
    },
    "08.03"
  );
  t.end();
});

t.test("08.04 - objects in arrays in objects", (t) => {
  t.same(
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
    "08.04.01 - default"
  );
  t.same(
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
    "08.04.02 - arrays with strings merged into empty arrays"
  );
  t.end();
});

// ==============================
// 09. Various
// ==============================

t.test("09.01 - empty string vs boolean #58", (t) => {
  t.same(mergeAdvanced("", true), "", "09.01.01");
  t.same(mergeAdvanced(true, ""), "", "09.01.02");
  t.end();
});

t.test("09.02 - empty string vs undefined #59", (t) => {
  t.same(mergeAdvanced("", null), "", "09.02.01");
  t.same(mergeAdvanced(null, ""), "", "09.02.02");
  t.end();
});

t.test("09.03 - empty string vs undefined #60", (t) => {
  t.same(mergeAdvanced("", undefined), "", "09.03.01");
  t.same(mergeAdvanced(undefined, ""), "", "09.03.02");
  t.end();
});

t.test("09.04 - number - #81-90", (t) => {
  t.same(mergeAdvanced(1, ["a"]), ["a"], "09.04.01");
  t.same(mergeAdvanced(["a"], 1), ["a"], "09.04.02");
  t.same(mergeAdvanced(1, "a"), "a", "09.04.03");
  t.same(mergeAdvanced("a", 1), "a", "09.04.04");
  t.same(mergeAdvanced([], 1), 1, "09.04.05");
  t.same(mergeAdvanced(1, []), 1, "09.04.06");
  t.end();
});

t.test("09.05 - empty string vs undefined #60", (t) => {
  t.same(mergeAdvanced("", undefined), "", "09.05.01");
  t.same(mergeAdvanced(undefined, ""), "", "09.05.02");
  t.end();
});

// ==============================
// 10. opts.ignoreKeys
// ==============================

t.test(
  "10.01 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - basic cases",
  (t) => {
    t.same(
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
      "10.01.01 - #1, forward"
    );
    t.same(
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
      "10.01.02 - #1, backward"
    );
    t.same(
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
      "10.01.03 - #2, forward, ignoreKeys as array"
    );
    t.same(
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
      "10.01.04 - #2, backward, ignoreKeys as array"
    );
    //
    // more array vs. array clashes:
    //
    t.same(
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
      "10.01.05"
    );
    t.end();
  }
);

t.test(
  "10.02 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - multiple keys ignored, multiple merged",
  (t) => {
    t.same(
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
      "10.02"
    );
    t.end();
  }
);

t.test(
  "10.03 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - wildcards",
  (t) => {
    t.same(
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
      "10.03"
    );
    t.end();
  }
);

t.test(
  "10.04 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys - wildcard, but not found",
  (t) => {
    t.same(
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
      "10.04"
    );
    t.end();
  }
);

// ==============================
// 11. opts.hardMergeKeys
// ==============================

t.test("11.01 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys", (t) => {
  t.same(
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
    "11.01.01 - default behaviour"
  );
  t.same(
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
    "11.01.02 - hardMergeKeys only"
  );
  t.same(
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
    "11.01.03 - hardMergeKeys and ignoreKeys, both"
  );
  t.same(
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
    "11.01.04 - hardMergeKeys and ignoreKeys both at once, both as strings"
  );
  t.end();
});

t.test(
  "11.02 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys and opts.ignoreKeys together",
  (t) => {
    t.same(
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
      "11.02.01"
    );
    t.end();
  }
);

t.test("11.03 - case #10", (t) => {
  t.same(mergeAdvanced(["a"], undefined), ["a"], "11.03.01 - default");
  t.same(
    mergeAdvanced({ a: ["a"] }, { a: undefined }),
    { a: ["a"] },
    "11.03.02.1 - default, objects"
  );
  t.same(
    mergeAdvanced({ a: undefined }, { a: ["a"] }),
    { a: ["a"] },
    "11.03.02.2 - 11.03.02 opposite order (same res.)"
  );
  t.same(
    mergeAdvanced({ a: ["a"] }, { a: undefined }, { hardMergeKeys: "*" }),
    { a: undefined },
    "11.03.03 - hard merge"
  );
  t.end();
});

t.test("11.04 - case #91", (t) => {
  t.same(
    mergeAdvanced({ a: undefined }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "11.04.01 - useless hardMergeKeys setting"
  );
  t.same(
    mergeAdvanced({ a: undefined }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: undefined },
    "11.04.02 - checkin the ignores glob"
  );
  t.end();
});

t.test("11.05 - case #81", (t) => {
  t.same(
    mergeAdvanced({ a: null }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "11.05.01 - useless hardMergeKeys setting"
  );
  t.same(
    mergeAdvanced({ a: null }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: null },
    "11.05.01 - checkin the ignores glob"
  );
  t.end();
});

t.test("11.06 - case #9 (mirror to #81)", (t) => {
  t.same(
    mergeAdvanced({ a: ["a"] }, { a: null }, { hardMergeKeys: "*" }),
    { a: null },
    "11.06.01 - useless hardMergeKeys setting"
  );
  t.end();
});

t.test("11.07 - case #8 and its mirror, #71", (t) => {
  t.same(
    mergeAdvanced({ a: ["a"] }, { a: true }, { hardMergeKeys: "*" }),
    { a: true },
    "11.07.01 - #8"
  );
  t.same(
    mergeAdvanced({ a: true }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: true },
    "11.07.01 - #71"
  );
  t.end();
});

t.test("11.08 - case #7 and its mirror, #61", (t) => {
  t.same(
    mergeAdvanced({ a: ["a"] }, { a: 1 }, { hardMergeKeys: "*" }),
    { a: 1 },
    "11.08.01 - #7"
  );
  t.same(
    mergeAdvanced({ a: 1 }, { a: ["a"] }, { ignoreKeys: "*" }),
    { a: 1 },
    "11.08.02 - #61"
  );
  t.same(
    mergeAdvanced({ a: 1 }, { a: ["a"] }, { hardMergeKeys: "*" }),
    { a: ["a"] },
    "11.08.03 - #7 redundant hardMerge setting"
  );
  t.end();
});

t.test(
  "11.09 - #27 and its mirror #63 - full obj vs number + hardMerge/ignore",
  (t) => {
    t.same(
      mergeAdvanced({ a: { b: "c" } }, { a: 1 }, { hardMergeKeys: "*" }),
      { a: 1 },
      "11.09.01 - #27"
    );
    t.same(
      mergeAdvanced({ a: 1 }, { a: { b: "c" } }, { ignoreKeys: "*" }),
      { a: 1 },
      "11.09.01 - #63"
    );
    t.end();
  }
);

t.test("11.10 - #23 two full objects", (t) => {
  t.same(
    mergeAdvanced({ a: { b: "c" } }, { a: { b: "d" } }),
    { a: { b: "d" } },
    "11.10.01 - default behaviour"
  );
  t.same(
    mergeAdvanced({ a: { b: "c" } }, { a: { b: "d" } }, { hardMergeKeys: "*" }),
    { a: { b: "d" } },
    "11.10.02 - redundant setting"
  );
  t.same(
    mergeAdvanced({ a: { b: "c" } }, { a: { b: "d" } }, { ignoreKeys: "*" }),
    { a: { b: "c" } },
    "11.10.03 - checking ignores"
  );
  t.end();
});

// ==================================
// 12. opts.oneToManyArrayObjectMerge
// ==================================

t.test(
  "12.01 - \u001b[33mOPTS\u001b[39m - opts.oneToManyArrayObjectMerge",
  (t) => {
    t.same(
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
      "12.01.01 - default behaviour will merge first keys and leave second key as it is"
    );
    t.same(
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
      "12.01.02 - same as #01, but swapped order of input arguments. Should not differ except for string merge order."
    );
    t.same(
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
      "12.01.03 - one-to-many merge, normal argument order"
    );
    t.same(
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
      "12.01.04 - one-to-many merge, opposite arg. order"
    );
    t.end();
  }
);

t.test(
  "12.02 - \u001b[33mOPTS\u001b[39m - opts.oneToManyArrayObjectMerge - two-to-many does not work",
  (t) => {
    t.same(
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
      "12.02.01 - does not activate when two-to-many found"
    );
    t.end();
  }
);

// ==============================
// 13. throws of all kinds
// ==============================

t.test(
  "13.01 - \u001b[33mOPTS\u001b[39m - third argument is not a plain object",
  (t) => {
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, 1);
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, {});
    });
    t.end();
  }
);

t.test(
  "13.02 - \u001b[33mOPTS\u001b[39m - opts.ignoreKeys type checks work",
  (t) => {
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: 1 });
    });
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: true });
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: "" });
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: [""] });
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { ignoreKeys: [] });
    });
    t.end();
  }
);

t.test(
  "13.03 - \u001b[33mOPTS\u001b[39m - opts.hardMergeKeys type checks work",
  (t) => {
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: 1 });
    });
    t.throws(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: true });
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: "" });
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: [""] });
    });
    t.doesNotThrow(() => {
      mergeAdvanced({ a: "a" }, { b: "b" }, { hardMergeKeys: [] });
    });
    t.end();
  }
);

// ==============================
// 14. ad-hoc
// ==============================

t.test("14.01 - objects within arrays", (t) => {
  t.same(
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
    "14.01.01 - default behaviour"
  );
  t.same(
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
    "14.01.02.01 - customising opts.mergeObjectsOnlyWhenKeysetMatches - one way"
  );
  t.same(
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
    "14.01.02.02 - customising opts.mergeObjectsOnlyWhenKeysetMatches - other way (swapped args of 14.01.02.01)"
  );

  // setting the glob is the same as setting opts.hardMergeEverything to true
  t.same(
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
    "14.01.03.01 - hardMergeKeys: * in per-key settings is the same as global flag"
  );

  // setting the glob is the same as setting opts.ignoreEverything to true
  t.same(
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
    "14.01.03.02 - ignoreKeys: * in per-key settings is the same as global flag"
  );
  t.same(
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
    "14.01.04 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge"
  );
  t.same(
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
    "14.01.05 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge"
  );
  t.end();
});

// ==============================
// 15. combo of opts.oneToManyArrayObjectMerge and unidirectional merge,
// either opts.ignoreKeys, opts.hardMergeKeys, opts.hardMergeEverything or opts.ignoreEverything
// ==============================

t.test("15.01 - hard merge on clashing keys only case #1", (t) => {
  t.same(
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
    "15.01.01 - default behaviour"
  );
  t.same(
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
    "15.01.02 - one-to-many"
  );

  // PRESS PAUSE HERE.

  // LET'S TEST TYPE CLASHES.

  t.same(
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
    "15.01.03 - one to many, string tries override arrays, against the food chain order"
  );

  // WHAT DO WE DO? HOW CAN WE OVERWRITE LIKE IN 15.01.02 ?

  // LET'S TRY HARD OVERWRITE!

  t.same(
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
    "15.01.04 - hard overwrite, per-key setting"
  );
  t.end();
});

// ==============================
// 16. Object values are arrays and they contain strings.
// We test their various merge cases.
// ==============================

t.test("16.01 - values as arrays that contain strings", (t) => {
  t.same(
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
    "16.01.01 - default behaviour, different strings"
  );
  t.same(
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
    "16.01.02 - default behaviour, same string"
  );
  t.same(
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
    "16.01.03 - opts.concatInsteadOfMerging"
  );
  // now the first array goes straight to result, so three "zzz" will come.
  // then second array's "zzz" will be matched as existing and won't be let in.
  t.same(
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
    "16.01.04 - opts.concatInsteadOfMerging pt2."
  );
  t.same(
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
    "16.01.05 - opts.concatInsteadOfMerging + opts.dedupeStringsInArrayValues"
  );
  t.end();
});
