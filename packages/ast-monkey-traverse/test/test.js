// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import isEqual from "deep-equal";
import objectPath from "object-path";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

// -----------------------------------------------------------------------------
// traverse
// -----------------------------------------------------------------------------

test(`01 - traverse - use traverse to delete one key from an array`, () => {
  let input = [
    {
      a: "b",
    },
    {
      c: "d",
    },
    {
      e: "f",
    },
  ];
  let actual01 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { a: "b" })) {
      return NaN;
    }
    return current;
  });
  let intended01 = [
    {
      c: "d",
    },
    {
      e: "f",
    },
  ];
  equal(actual01, intended01, "01.01");

  let actual02 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { c: "d" })) {
      return NaN;
    }
    return current;
  });
  let intended02 = [
    {
      a: "b",
    },
    {
      e: "f",
    },
  ];
  equal(actual02, intended02, "01.02");

  let actual03 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { e: "f" })) {
      return NaN;
    }
    return current;
  });
  let intended03 = [
    {
      a: "b",
    },
    {
      c: "d",
    },
  ];
  equal(actual03, intended03, "01.03");
});

test(`02 - traverse - more deletion from arrays`, () => {
  let input = [
    {
      a: "b",
    },
    {
      a: "b",
    },
    {
      c: "d",
    },
  ];

  let actual01 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { a: "b" })) {
      return NaN;
    }
    return current;
  });
  let intended01 = [
    {
      c: "d",
    },
  ];
  equal(actual01, intended01, "02.01");
});

test(`03 - traverse - use traverse, passing null, write over values`, () => {
  let input = [
    {
      a: "b",
    },
    {
      a: "b",
    },
    {
      c: "d",
    },
  ];

  let actual01 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    if (current === "b") {
      return null;
    }
    return current;
  });
  let intended01 = [
    {
      a: null,
    },
    {
      a: null,
    },
    {
      c: "d",
    },
  ];
  equal(actual01, intended01, "03.01");
});

test(`04 - traverse - use traverse, passing undefined, write over values`, () => {
  let input = [
    {
      a: "b",
    },
    {
      a: "b",
    },
    {
      c: "d",
    },
  ];

  let actual01 = traverse(input, (...args) => {
    let [key1, val1] = args;
    let current = val1 !== undefined ? val1 : key1;
    if (current === "b") {
      return;
    }
    return current;
  });
  let intended01 = [
    {
      a: undefined,
    },
    {
      a: undefined,
    },
    {
      c: "d",
    },
  ];
  equal(actual01, intended01, "04.01");
});

test(`05 - traverse - traverse automatically patches up holes in arrays`, () => {
  let input = ["a", undefined, "b"];

  let actual01 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    // we do nothing here
    return current;
  });
  let intended01 = ["a", "b"];
  equal(actual01, intended01, "05.01");
});

test(`06 - traverse - delete key-value pair from plain object in root`, () => {
  let input = {
    a: "a",
    b: "b",
    c: "c",
  };

  let actual = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    if (current === "a") {
      return NaN;
    }
    return current;
  });
  let intended = {
    b: "b",
    c: "c",
  };

  equal(actual, intended, "06.01");
});

test(`07 - traverse - only traversal, #1`, () => {
  let input = {
    a: ["1", "2", "3"],
  };
  let actual = traverse(input, (key1, val1, innerObj) => {
    let current = val1 !== undefined ? val1 : key1;
    equal(current, objectPath.get(input, innerObj.path), "07.01");
    return current;
  });
  ok(actual, "07.01");
});

test(`08 - traverse - only traversal, #2`, () => {
  let input = {
    a: {
      b: {
        c: "c_val",
        d: "d_val",
        e: "e_val",
      },
      f: {
        g: {
          h: ["1", "2", "3"],
          i: [
            "4",
            "5",
            {
              j: "k",
            },
          ],
          l: ["7", "8", "9"],
        },
      },
    },
  };
  let gathered = [];
  let actual = traverse(input, (key1, val1, innerObj) => {
    let current = val1 !== undefined ? val1 : key1;
    equal(current, objectPath.get(input, innerObj.path), "08.01");
    gathered.push(current);
    return current;
  });
  ok(actual, "08.01");
});

test(`09 - traverse - only traversal, #3`, () => {
  let input = ["1", "2", { a: "3" }];
  let actual = traverse(input, (key1, val1, innerObj) => {
    let current = val1 !== undefined ? val1 : key1;
    equal(current, objectPath.get(input, innerObj.path), "09.01");
    return current;
  });
  ok(actual, "09.01");
});

// 02. stopping the traversal upon request
// -----------------------------------------------------------------------------

test(`10 - stopping - objects - a reference traversal`, () => {
  let input = { a: "1", b: { c: "2" } };
  let gathered = [];
  traverse(input, (key1, val1, innerObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push(innerObj);
    return current;
  });
  equal(
    gathered,
    [
      {
        depth: 0,
        path: "a",
        topmostKey: "a",
        parent: {
          a: "1",
          b: {
            c: "2",
          },
        },
        parentType: "object",
        parentKey: null,
      },
      {
        depth: 0,
        path: "b",
        topmostKey: "b",
        parent: {
          a: "1",
          b: {
            c: "2",
          },
        },
        parentType: "object",
        parentKey: null,
      },
      {
        depth: 1,
        path: "b.c",
        topmostKey: "b",
        parent: {
          c: "2",
        },
        parentType: "object",
        parentKey: "b",
      },
    ],
    "10.01",
  );
});

test(`11 - stopping - objects - after "b"`, () => {
  let input = { a: "1", b: { c: "2" } };
  let gathered = [];
  traverse(input, (key1, val1, innerObj, stop) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push(innerObj.path);
    if (innerObj.path === "b") {
      stop.now = true;
    }
    return current;
  });
  equal(gathered, ["a", "b"], "11.01");
});

test(`12 - stopping - arrays - a reference traversal`, () => {
  let input = ["a", ["b", "c"]];
  let gathered = [];
  traverse(input, (key1, val1, innerObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push(innerObj.path);
    return current;
  });
  equal(gathered, ["0", "1", "1.0", "1.1"], "12.01");
});

test(`13 - stopping - arrays - after "b"`, () => {
  let input = ["a", ["b", "c"]];
  let gathered = [];
  traverse(input, (key1, val1, innerObj, stop) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push(innerObj.path);
    if (innerObj.path === "1") {
      stop.now = true;
    }
    return current;
  });
  equal(gathered, ["0", "1"], "13.01");
});

// 03. traversal reporting
// -----------------------------------------------------------------------------

test(`14 - traverse - array of objects, just traversing`, () => {
  let input = [
    {
      a: "b",
    },
    {
      c: "d",
    },
    {
      e: "f",
    },
  ];
  let gathered = [];
  traverse(input, (key1, val1, internalObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push([key1, val1, internalObj]);
    return current;
  });
  equal(
    gathered,
    [
      // ===================
      [
        {
          a: "b",
        },
        undefined,
        {
          depth: 0,
          path: "0",
          parent: [
            {
              a: "b",
            },
            {
              c: "d",
            },
            {
              e: "f",
            },
          ],
          parentType: "array",
          parentKey: null,
        },
      ],
      // ===================
      [
        "a",
        "b",
        {
          depth: 1,
          path: "0.a",
          parent: {
            a: "b",
          },
          parentType: "object",
          parentKey: "0",
        },
      ],
      // ===================
      [
        {
          c: "d",
        },
        undefined,
        {
          depth: 0,
          path: "1",
          parent: [
            {
              a: "b",
            },
            {
              c: "d",
            },
            {
              e: "f",
            },
          ],
          parentType: "array",
          parentKey: null,
        },
      ],
      // ===================
      [
        "c",
        "d",
        {
          depth: 1,
          path: "1.c",
          parent: {
            c: "d",
          },
          parentType: "object",
          parentKey: "1",
        },
      ],
      // ===================
      [
        {
          e: "f",
        },
        undefined,
        {
          depth: 0,
          path: "2",
          parent: [
            {
              a: "b",
            },
            {
              c: "d",
            },
            {
              e: "f",
            },
          ],
          parentType: "array",
          parentKey: null,
        },
      ],
      // ===================
      [
        "e",
        "f",
        {
          depth: 1,
          path: "2.e",
          parent: {
            e: "f",
          },
          parentType: "object",
          parentKey: "2",
        },
      ],
      // ===================
    ],
    "14.01",
  );
});

test(`15 - traverse - traversal continues after the hole`, () => {
  let input = {
    a: "k",
    b: "l",
    c: "m",
  };
  let gathered = [];
  traverse(input, (key1, val1, internalObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push([key1, val1, internalObj]);
    return current;
  });
  equal(
    gathered,
    [
      [
        "a",
        "k",
        {
          depth: 0,
          path: "a",
          topmostKey: "a",
          parent: {
            a: "k",
            b: "l",
            c: "m",
          },
          parentType: "object",
          parentKey: null,
        },
      ],
      [
        "b",
        "l",
        {
          depth: 0,
          path: "b",
          topmostKey: "b",
          parent: {
            a: "k",
            b: "l",
            c: "m",
          },
          parentType: "object",
          parentKey: null,
        },
      ],
      [
        "c",
        "m",
        {
          depth: 0,
          path: "c",
          topmostKey: "c",
          parent: {
            a: "k",
            b: "l",
            c: "m",
          },
          parentType: "object",
          parentKey: null,
        },
      ],
    ],
    "15.01",
  );
});

test(`16 - traverse - traversal continues after the hole`, () => {
  let input = {
    a: ["1", "2", "3"],
  };
  let gathered = [];
  traverse(input, (key1, val1, internalObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push([key1, val1, internalObj]);
    return current;
  });
  equal(
    gathered,
    [
      [
        "a",
        ["1", "2", "3"],
        {
          depth: 0,
          path: "a",
          topmostKey: "a",
          parent: {
            a: ["1", "2", "3"],
          },
          parentType: "object",
          parentKey: null,
        },
      ],
      [
        "1",
        undefined,
        {
          depth: 1,
          path: "a.0",
          topmostKey: "a",
          parent: ["1", "2", "3"],
          parentType: "array",
          parentKey: "a",
        },
      ],
      [
        "2",
        undefined,
        {
          depth: 1,
          path: "a.1",
          topmostKey: "a",
          parent: ["1", "2", "3"],
          parentType: "array",
          parentKey: "a",
        },
      ],
      [
        "3",
        undefined,
        {
          depth: 1,
          path: "a.2",
          topmostKey: "a",
          parent: ["1", "2", "3"],
          parentType: "array",
          parentKey: "a",
        },
      ],
    ],
    "16.01",
  );
});

test(`17 - traverse - more complex AST`, () => {
  let input = {
    a: {
      b: {
        c: "c_val",
        d: "d_val",
        e: "e_val",
      },
      f: {
        g: {
          h: ["1", "2", "3"],
          i: [
            "4",
            "5",
            {
              j: "k",
            },
          ],
          l: ["7", "8", "9"],
        },
      },
    },
  };
  let gathered = [];
  traverse(input, (key1, val1, internalObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push([key1, val1, internalObj]);
    return current;
  });
  equal(
    gathered,
    [
      // ===================
      [
        "a",
        {
          b: {
            c: "c_val",
            d: "d_val",
            e: "e_val",
          },
          f: {
            g: {
              h: ["1", "2", "3"],
              i: [
                "4",
                "5",
                {
                  j: "k",
                },
              ],
              l: ["7", "8", "9"],
            },
          },
        },
        {
          depth: 0,
          path: "a",
          topmostKey: "a",
          parentKey: null,
          parent: {
            a: {
              b: {
                c: "c_val",
                d: "d_val",
                e: "e_val",
              },
              f: {
                g: {
                  h: ["1", "2", "3"],
                  i: [
                    "4",
                    "5",
                    {
                      j: "k",
                    },
                  ],
                  l: ["7", "8", "9"],
                },
              },
            },
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "b",
        {
          c: "c_val",
          d: "d_val",
          e: "e_val",
        },
        {
          depth: 1,
          path: "a.b",
          topmostKey: "a",
          parentKey: "a",
          parent: {
            b: {
              c: "c_val",
              d: "d_val",
              e: "e_val",
            },
            f: {
              g: {
                h: ["1", "2", "3"],
                i: [
                  "4",
                  "5",
                  {
                    j: "k",
                  },
                ],
                l: ["7", "8", "9"],
              },
            },
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "c",
        "c_val",
        {
          depth: 2,
          path: "a.b.c",
          topmostKey: "a",
          parentKey: "b",
          parent: {
            c: "c_val",
            d: "d_val",
            e: "e_val",
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "d",
        "d_val",
        {
          depth: 2,
          path: "a.b.d",
          topmostKey: "a",
          parentKey: "b",
          parent: {
            c: "c_val",
            d: "d_val",
            e: "e_val",
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "e",
        "e_val",
        {
          depth: 2,
          path: "a.b.e",
          topmostKey: "a",
          parentKey: "b",
          parent: {
            c: "c_val",
            d: "d_val",
            e: "e_val",
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "f",
        {
          g: {
            h: ["1", "2", "3"],
            i: [
              "4",
              "5",
              {
                j: "k",
              },
            ],
            l: ["7", "8", "9"],
          },
        },
        {
          depth: 1,
          path: "a.f",
          topmostKey: "a",
          parentKey: "a",
          parent: {
            b: {
              c: "c_val",
              d: "d_val",
              e: "e_val",
            },
            f: {
              g: {
                h: ["1", "2", "3"],
                i: [
                  "4",
                  "5",
                  {
                    j: "k",
                  },
                ],
                l: ["7", "8", "9"],
              },
            },
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "g",
        {
          h: ["1", "2", "3"],
          i: [
            "4",
            "5",
            {
              j: "k",
            },
          ],
          l: ["7", "8", "9"],
        },
        {
          depth: 2,
          path: "a.f.g",
          topmostKey: "a",
          parentKey: "f",
          parent: {
            g: {
              h: ["1", "2", "3"],
              i: [
                "4",
                "5",
                {
                  j: "k",
                },
              ],
              l: ["7", "8", "9"],
            },
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "h",
        ["1", "2", "3"],
        {
          depth: 3,
          path: "a.f.g.h",
          topmostKey: "a",
          parentKey: "g",
          parent: {
            h: ["1", "2", "3"],
            i: [
              "4",
              "5",
              {
                j: "k",
              },
            ],
            l: ["7", "8", "9"],
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "1",
        undefined,
        {
          depth: 4,
          path: "a.f.g.h.0",
          topmostKey: "a",
          parentKey: "h",
          parent: ["1", "2", "3"],
          parentType: "array",
        },
      ],
      // ===================
      [
        "2",
        undefined,
        {
          depth: 4,
          path: "a.f.g.h.1",
          topmostKey: "a",
          parentKey: "h",
          parent: ["1", "2", "3"],
          parentType: "array",
        },
      ],
      // ===================
      [
        "3",
        undefined,
        {
          depth: 4,
          path: "a.f.g.h.2",
          topmostKey: "a",
          parentKey: "h",
          parent: ["1", "2", "3"],
          parentType: "array",
        },
      ],
      // ===================
      [
        "i",
        [
          "4",
          "5",
          {
            j: "k",
          },
        ],
        {
          depth: 3,
          path: "a.f.g.i",
          topmostKey: "a",
          parentKey: "g",
          parent: {
            h: ["1", "2", "3"],
            i: [
              "4",
              "5",
              {
                j: "k",
              },
            ],
            l: ["7", "8", "9"],
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "4",
        undefined,
        {
          depth: 4,
          path: "a.f.g.i.0",
          topmostKey: "a",
          parentKey: "i",
          parent: [
            "4",
            "5",
            {
              j: "k",
            },
          ],
          parentType: "array",
        },
      ],
      // ===================
      [
        "5",
        undefined,
        {
          depth: 4,
          path: "a.f.g.i.1",
          topmostKey: "a",
          parentKey: "i",
          parent: [
            "4",
            "5",
            {
              j: "k",
            },
          ],
          parentType: "array",
        },
      ],
      // ===================
      [
        {
          j: "k",
        },
        undefined,
        {
          depth: 4,
          path: "a.f.g.i.2",
          topmostKey: "a",
          parentKey: "i",
          parent: [
            "4",
            "5",
            {
              j: "k",
            },
          ],
          parentType: "array",
        },
      ],
      // ===================
      [
        "j",
        "k",
        {
          depth: 5,
          path: "a.f.g.i.2.j",
          topmostKey: "a",
          parentKey: "2",
          parent: {
            j: "k",
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "l",
        ["7", "8", "9"],
        {
          depth: 3,
          path: "a.f.g.l",
          topmostKey: "a",
          parentKey: "g",
          parent: {
            h: ["1", "2", "3"],
            i: [
              "4",
              "5",
              {
                j: "k",
              },
            ],
            l: ["7", "8", "9"],
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        "7",
        undefined,
        {
          depth: 4,
          path: "a.f.g.l.0",
          topmostKey: "a",
          parentKey: "l",
          parent: ["7", "8", "9"],
          parentType: "array",
        },
      ],
      // ===================
      [
        "8",
        undefined,
        {
          depth: 4,
          path: "a.f.g.l.1",
          topmostKey: "a",
          parentKey: "l",
          parent: ["7", "8", "9"],
          parentType: "array",
        },
      ],
      // ===================
      [
        "9",
        undefined,
        {
          depth: 4,
          path: "a.f.g.l.2",
          topmostKey: "a",
          parentKey: "l",
          parent: ["7", "8", "9"],
          parentType: "array",
        },
      ],
      // ===================
    ],
    "17.01",
  );
});

test(`18 - traverse - more traversal`, () => {
  let input = ["1", "2", { a: "3" }];
  let gathered = [];
  traverse(input, (key1, val1, internalObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push([key1, val1, internalObj]);
    return current;
  });
  equal(
    gathered,
    [
      [
        "1",
        undefined,
        {
          depth: 0,
          path: "0",
          parent: [
            "1",
            "2",
            {
              a: "3",
            },
          ],
          parentType: "array",
          parentKey: null,
        },
      ],
      [
        "2",
        undefined,
        {
          depth: 0,
          path: "1",
          parent: [
            "1",
            "2",
            {
              a: "3",
            },
          ],
          parentType: "array",
          parentKey: null,
        },
      ],
      [
        {
          a: "3",
        },
        undefined,
        {
          depth: 0,
          path: "2",
          parent: [
            "1",
            "2",
            {
              a: "3",
            },
          ],
          parentType: "array",
          parentKey: null,
        },
      ],
      [
        "a",
        "3",
        {
          depth: 1,
          path: "2.a",
          parent: {
            a: "3",
          },
          parentType: "object",
          parentKey: "2",
        },
      ],
    ],
    "18.01",
  );
});

test(`19 - input and callback-owned values remain immutable`, () => {
  let input = { a: { b: "c" } };
  let replacement = { nested: { value: 1 } };
  let actual = traverse(input, (key, value) => {
    if (key === "a") {
      return replacement;
    }
    return value === undefined ? key : value;
  });

  equal(input, { a: { b: "c" } }, "19.01");
  equal(replacement, { nested: { value: 1 } }, "19.02");
  equal(actual, { a: { nested: { value: 1 } } }, "19.03");
  throws(() => traverse(input), /THROW_ID_01/, "19.04");
});

test(`20 - parent snapshot drops a key deleted from an earlier sibling`, () => {
  let gathered = [];
  let actual = traverse(
    { a: "drop", b: "keep", c: "keep" },
    (key1, val1, innerObj) => {
      let current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.parent);
      return current === "drop" ? Number.NaN : current;
    },
  );

  equal(actual, { b: "keep", c: "keep" }, "20.01");
  equal(gathered[0], { a: "drop", b: "keep", c: "keep" }, "20.02");
  // "a" is gone by the time "b" and "c" are visited
  equal(gathered[1], { b: "keep", c: "keep" }, "20.03");
  equal(gathered[2], { b: "keep", c: "keep" }, "20.04");
});

test(`21 - parent snapshot reflects an edit made deep under an earlier sibling`, () => {
  let gathered = [];
  let actual = traverse({ a: { z: 1 }, b: 2 }, (key1, val1, innerObj) => {
    gathered.push(innerObj.parent);
    if (key1 === "z") {
      return 99;
    }
    return val1 !== undefined ? val1 : key1;
  });

  equal(actual, { a: { z: 99 }, b: 2 }, "21.01");
  equal(gathered[0], { a: { z: 1 }, b: 2 }, "21.02");
  equal(gathered[1], { z: 1 }, "21.03");
  // "b" comes after "a"'s subtree was rewritten, so its snapshot shows that
  equal(gathered[2], { a: { z: 99 }, b: 2 }, "21.04");
});

test(`22 - array element replaced with a fresh object`, () => {
  let replacement = { swapped: true };
  let gathered = [];
  let actual = traverse(["x", "y"], (key1, val1, innerObj) => {
    gathered.push(innerObj.parent);
    if (key1 === "x") {
      return replacement;
    }
    return val1 !== undefined ? val1 : key1;
  });

  equal(actual, [{ swapped: true }, "y"], "22.01");
  // the replacement is cloned in, not adopted by reference
  equal(replacement, { swapped: true }, "22.02");
  not.ok(actual[0] === replacement, "22.03");
  equal(gathered[0], ["x", "y"], "22.04");
  equal(gathered[1], { swapped: true }, "22.05");
  equal(gathered[2], [{ swapped: true }, "y"], "22.06");
});

test(`23 - parent snapshot picks up a scalar rewritten in an earlier sibling`, () => {
  let gathered = [];
  let actual = traverse({ a: 1, b: 2, c: 3 }, (key1, val1, innerObj) => {
    let current = val1 !== undefined ? val1 : key1;
    gathered.push(innerObj.parent);
    return typeof current === "number" ? current * 10 : current;
  });

  equal(actual, { a: 10, b: 20, c: 30 }, "23.01");
  equal(gathered[0], { a: 1, b: 2, c: 3 }, "23.02");
  // each snapshot carries the rewrites the siblings before it received
  equal(gathered[1], { a: 10, b: 2, c: 3 }, "23.03");
  equal(gathered[2], { a: 10, b: 20, c: 3 }, "23.04");
});

test.run();
