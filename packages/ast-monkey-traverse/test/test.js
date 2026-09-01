// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import isEqual from "deep-equal";
import objectPath from "object-path";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { DELETE, traverse } from "../dist/ast-monkey-traverse.esm.js";

const hasOwn = Object.prototype.hasOwnProperty;

function withoutPathSegments(innerObj) {
  let result = { ...innerObj };
  delete result.pathSegments;
  return result;
}

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
      return DELETE;
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
      return DELETE;
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
      return DELETE;
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
      return DELETE;
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

test(`05 - traverse - preserves explicit undefined array entries`, () => {
  let input = ["a", undefined, "b"];

  let actual01 = traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    // we do nothing here
    return current;
  });
  let intended01 = ["a", undefined, "b"];
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
      return DELETE;
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
    gathered.push(withoutPathSegments(innerObj));
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
    gathered.push([key1, val1, withoutPathSegments(internalObj)]);
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
    gathered.push([key1, val1, withoutPathSegments(internalObj)]);
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
    gathered.push([key1, val1, withoutPathSegments(internalObj)]);
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
    gathered.push([key1, val1, withoutPathSegments(internalObj)]);
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
    gathered.push([key1, val1, withoutPathSegments(internalObj)]);
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
      return current === "drop" ? DELETE : current;
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

test("24 - sparse holes and explicit undefined entries are preserved", () => {
  let failures = [];

  for (let length = 1; length <= 6; length += 1) {
    for (let mask = 0; mask < 2 ** length; mask += 1) {
      let input = new Array(length);
      let expected = new Array(length);
      let expectedVisits = [];
      for (let index = 0; index < length; index += 1) {
        if (mask & (1 << index)) {
          input[index] = `v${index}`;
          expected[index] = `v${index}`;
          expectedVisits.push([`v${index}`, `${index}`]);
        } else if (index % 2 === 0) {
          input[index] = undefined;
          expected[index] = undefined;
          expectedVisits.push([undefined, `${index}`]);
        }
      }

      let visited = [];
      let actual = traverse(input, (value, _unused, innerObj) => {
        visited.push([value, innerObj.path]);
        return value;
      });
      if (!isEqual(actual, expected) || !isEqual(visited, expectedVisits)) {
        failures.push({
          actual,
          expected,
          expectedVisits,
          length,
          mask,
          visited,
        });
      }
    }
  }

  equal(failures, [], "24.01");

  let visited = [];
  let mixed = new Array(6);
  mixed[0] = undefined;
  mixed[1] = "a";
  mixed[2] = Number.NaN;
  mixed[3] = "b";
  mixed[5] = "c";
  let actual = traverse(mixed, (value, _unused, innerObj) => {
    visited.push([value, innerObj.path]);
    return value;
  });

  equal(actual, mixed, "24.02");
  equal(
    visited,
    [
      [undefined, "0"],
      ["a", "1"],
      [Number.NaN, "2"],
      ["b", "3"],
      ["c", "5"],
    ],
    "24.03",
  );
});

test("25 - parent snapshots are isolated between callbacks", () => {
  let input = { a: { x: 1 }, b: { y: 2 }, c: 3 };
  let parents = [];
  let nestedParents = [];
  let actual = traverse(input, (key, value, innerObj) => {
    if (innerObj.depth === 0) {
      parents.push(innerObj.parent);
      nestedParents.push(innerObj.parent.b);
      if (key === "a") {
        innerObj.parent.added = true;
        innerObj.parent.b.y = 99;
        delete innerObj.parent.c;
        Object.defineProperty(innerObj.parent, "defined", {
          enumerable: true,
          value: true,
        });
        Object.setPrototypeOf(innerObj.parent, { polluted: true });
      }
    }
    return value;
  });

  equal(actual, input, "25.01");
  equal(input, { a: { x: 1 }, b: { y: 2 }, c: 3 }, "25.02");
  equal(parents[1], { a: { x: 1 }, b: { y: 2 }, c: 3 }, "25.03");
  equal(parents[2], { a: { x: 1 }, b: { y: 2 }, c: 3 }, "25.04");
  not.ok(parents[0] === parents[1], "25.05");
  not.ok(parents[1] === parents[2], "25.06");
  not.ok(nestedParents[0] === nestedParents[1], "25.07");
  not.ok(nestedParents[1] === nestedParents[2], "25.08");
  not.ok(parents[0] === input, "25.09");
  not.ok(nestedParents[0] === input.b, "25.10");

  let arrayParents = [];
  let arrayActual = traverse([[1], [2]], (value, _unused, innerObj) => {
    if (innerObj.depth === 0) {
      arrayParents.push(innerObj.parent);
      if (innerObj.path === "0") {
        innerObj.parent[1][0] = 99;
        innerObj.parent.push([3]);
      }
    }
    return value;
  });

  equal(arrayActual, [[1], [2]], "25.11");
  equal(arrayParents[1], [[1], [2]], "25.12");
  not.ok(arrayParents[0] === arrayParents[1], "25.13");
  not.ok(arrayParents[0][1] === arrayParents[1][1], "25.14");
});

test("26 - in-place container edits update later parent snapshots", () => {
  let objectParent;
  let objectActual = traverse(
    { a: { nested: { z: 2 }, remove: true, x: 1 }, b: 0 },
    (key, value, innerObj) => {
      if (key === "a") {
        void innerObj.parent;
        value.x = 1;
        value.x = 9;
        value.nested.z = 8;
        value.added = true;
        delete value.remove;
        delete value.absent;
        Object.defineProperty(value, "defined", {
          configurable: true,
          enumerable: true,
          value: "yes",
          writable: true,
        });
        Object.defineProperty(value, "computed", {
          configurable: true,
          enumerable: true,
          get: () => "getter",
        });
        Object.setPrototypeOf(value, null);
        Object.setPrototypeOf(value, Object.prototype);
      } else if (key === "b" && innerObj.depth === 0) {
        objectParent = innerObj.parent;
      }
      return value !== undefined ? value : key;
    },
  );
  let expectedObject = {
    a: {
      added: true,
      computed: "getter",
      defined: "yes",
      nested: { z: 8 },
      x: 9,
    },
    b: 0,
  };

  equal(objectActual, expectedObject, "26.01");
  equal(objectParent, expectedObject, "26.02");

  let arrayParent;
  let arrayActual = traverse(
    { a: [1, { x: 2 }], b: 0 },
    (key, value, innerObj) => {
      if (key === "a") {
        void innerObj.parent;
        value.push(3);
        value[1].x = 9;
        value.splice(0, 1);
      } else if (key === "b" && innerObj.depth === 0) {
        arrayParent = innerObj.parent;
      }
      return value !== undefined ? value : key;
    },
  );
  let expectedArray = { a: [{ x: 9 }, 3], b: 0 };

  equal(arrayActual, expectedArray, "26.03");
  equal(arrayParent, expectedArray, "26.04");
});

test("27 - own proto data keys remain data and are traversed", () => {
  let input = JSON.parse(
    '{"__proto__":{"marker":true,"constructor":{"prototype":"nested"}},"constructor":{"prototype":{"__proto__":"data"}},"prototype":"root"}',
  );
  let paths = [];
  let actual = traverse(input, (key, value, innerObj) => {
    paths.push(innerObj.path);
    return value !== undefined ? value : key;
  });

  equal(JSON.stringify(actual), JSON.stringify(input), "27.01");
  equal(
    paths,
    [
      "__proto__",
      "__proto__.marker",
      "__proto__.constructor",
      "__proto__.constructor.prototype",
      "constructor",
      "constructor.prototype",
      "constructor.prototype.__proto__",
      "prototype",
    ],
    "27.02",
  );
  equal(Object.hasOwn(actual, "__proto__"), true, "27.03");
  equal(
    Object.hasOwn(actual.constructor.prototype, "__proto__"),
    true,
    "27.04",
  );
  is(Object.getPrototypeOf(actual), Object.prototype, "27.05");
  is(
    Object.getPrototypeOf(
      Object.getOwnPropertyDescriptor(actual, "__proto__").value,
    ),
    Object.prototype,
    "27.06",
  );
  is(
    Object.getPrototypeOf(actual.constructor.prototype),
    Object.prototype,
    "27.07",
  );
  equal(Object.prototype.marker, undefined, "27.08");
});

test("28 - path segments and parent keys preserve exact keys", () => {
  let input = {
    "a.b": { c: 1 },
    a: { b: { c: 2 } },
    "": { c: 3 },
    0: { x: 4 },
    array: [{ "": 5 }],
  };
  let records = [];
  let currentValues = [];
  let resolvedValues = [];

  let actual = traverse(input, (key, value, innerObj) => {
    let current = value !== undefined ? value : key;
    records.push({
      parentKey: innerObj.parentKey,
      path: innerObj.path,
      pathSegments: innerObj.pathSegments,
    });
    currentValues.push(current);
    resolvedValues.push(objectPath.get(input, innerObj.pathSegments));
    return current;
  });

  equal(actual, input, "28.01");
  equal(currentValues, resolvedValues, "28.02");
  equal(
    records,
    [
      { parentKey: null, path: "0", pathSegments: ["0"] },
      { parentKey: "0", path: "0.x", pathSegments: ["0", "x"] },
      { parentKey: null, path: "a.b", pathSegments: ["a.b"] },
      { parentKey: "a.b", path: "a.b.c", pathSegments: ["a.b", "c"] },
      { parentKey: null, path: "a", pathSegments: ["a"] },
      { parentKey: "a", path: "a.b", pathSegments: ["a", "b"] },
      { parentKey: "b", path: "a.b.c", pathSegments: ["a", "b", "c"] },
      { parentKey: null, path: "", pathSegments: [""] },
      { parentKey: "", path: "c", pathSegments: ["", "c"] },
      { parentKey: null, path: "array", pathSegments: ["array"] },
      {
        parentKey: "array",
        path: "array.0",
        pathSegments: ["array", "0"],
      },
      {
        parentKey: "0",
        path: "array.0.",
        pathSegments: ["array", "0", ""],
      },
    ],
    "28.03",
  );
});

test("29 - unsupported graphs and property models fail early", () => {
  let selfCycle = {};
  selfCycle.self = selfCycle;
  let shared = { value: 1 };
  let symbolObject = { value: 1 };
  symbolObject[Symbol("extra")] = 2;
  let nonEnumerableObject = {};
  Object.defineProperty(nonEnumerableObject, "hidden", { value: 1 });
  let getterCalls = 0;
  let accessorObject = {};
  Object.defineProperty(accessorObject, "computed", {
    enumerable: true,
    get: () => {
      getterCalls += 1;
      return 1;
    },
  });
  let extraArray = [];
  extraArray.extra = true;
  let symbolArray = [];
  symbolArray[Symbol("extra")] = true;
  let nonEnumerableArray = [1];
  Object.defineProperty(nonEnumerableArray, "0", {
    enumerable: false,
    value: 1,
  });
  let accessorArrayCalls = 0;
  let accessorArray = [1];
  Object.defineProperty(accessorArray, "0", {
    enumerable: true,
    get: () => {
      accessorArrayCalls += 1;
      return 1;
    },
  });
  let customArray = [1];
  Object.setPrototypeOf(customArray, {});
  class CustomValue {
    value = 1;
  }

  let invalidInputs = [
    () => 1,
    selfCycle,
    { a: shared, b: shared },
    new Date(0),
    new Map([["a", 1]]),
    new Set([1]),
    new CustomValue(),
    Object.assign(Object.create(null), { value: 1 }),
    { value: () => 1 },
    { value: Symbol("unsupported") },
    { value: 1n },
    symbolObject,
    nonEnumerableObject,
    accessorObject,
    extraArray,
    symbolArray,
    nonEnumerableArray,
    accessorArray,
    customArray,
  ];
  let callbackCalls = 0;

  invalidInputs.forEach((input, index) => {
    throws(
      () => {
        traverse(input, () => {
          callbackCalls += 1;
          return undefined;
        });
      },
      /THROW_ID_02/,
      `29.${`${index + 1}`.padStart(2, "0")}`,
    );
  });

  equal(callbackCalls, 0, "29.20");
  equal(getterCalls, 0, "29.21");
  equal(accessorArrayCalls, 0, "29.22");

  let visited = [];
  Object.defineProperty(Object.prototype, "inheritedTraversalProbe", {
    configurable: true,
    enumerable: true,
    value: "ignore",
  });
  try {
    let actual = traverse({ own: 1 }, (key, value) => {
      visited.push(key);
      return value;
    });
    equal(Object.keys(actual), ["own"], "29.23");
    equal(actual.own, 1, "29.24");
  } finally {
    delete Object.prototype.inheritedTraversalProbe;
  }
  equal(visited, ["own"], "29.25");
});

test("30 - a depth-10000 unary tree is stack-safe", () => {
  let depthLimit = 10_000;
  let input = {};
  let cursor = input;
  for (let depth = 0; depth < depthLimit; depth += 1) {
    cursor.next = {};
    cursor = cursor.next;
  }

  let callbackCount = 0;
  let finalMetadata;
  let actual = traverse(input, (_key, value, innerObj) => {
    callbackCount += 1;
    if (innerObj.depth === depthLimit - 1) {
      finalMetadata = {
        path: innerObj.path,
        pathSegments: innerObj.pathSegments,
      };
    }
    return value;
  });

  equal(callbackCount, depthLimit, "30.01");
  equal(finalMetadata.pathSegments.length, depthLimit, "30.02");
  equal(finalMetadata.path.split(".").length, depthLimit, "30.03");
  cursor = actual;
  let outputDepth = 0;
  while (cursor.next) {
    outputDepth += 1;
    cursor = cursor.next;
  }
  equal(outputDepth, depthLimit, "30.04");
});

test("31 - a wide transforming traversal visits each slot once", () => {
  let widthLimit = 10_000;
  let input = {};
  for (let index = 0; index < widthLimit; index += 1) {
    input[`k${index}`] = index;
  }

  let callbackCount = 0;
  let actual = traverse(input, (_key, value) => {
    callbackCount += 1;
    return value + 1;
  });

  equal(callbackCount, widthLimit, "31.01");
  equal(Object.keys(actual).length, widthLimit, "31.02");
  equal(actual.k0, 1, "31.03");
  equal(actual[`k${widthLimit - 1}`], widthLimit, "31.04");
});

test("32 - a balanced traversal retains pre-order and exact node counts", () => {
  let depthLimit = 12;
  let input = {};
  let level = [input];
  for (let depth = 0; depth < depthLimit; depth += 1) {
    let nextLevel = [];
    for (let parent of level) {
      parent.left = {};
      parent.right = {};
      nextLevel.push(parent.left, parent.right);
    }
    level = nextLevel;
  }

  let callbackCount = 0;
  let firstPaths = [];
  traverse(input, (_key, value, innerObj) => {
    callbackCount += 1;
    if (firstPaths.length < 5) {
      firstPaths.push(innerObj.path);
    }
    return value;
  });

  equal(callbackCount, 2 ** (depthLimit + 1) - 2, "32.01");
  equal(
    firstPaths,
    [
      "left",
      "left.left",
      "left.left.left",
      "left.left.left.left",
      "left.left.left.left.left",
    ],
    "32.02",
  );
});

test("33 - snapshot views support read-only reflection", () => {
  let reflected = false;
  let actual = traverse({ a: [1], b: 2 }, (key, value, innerObj) => {
    if (key === "a") {
      ok("a" in innerObj.parent, "33.01");
      not.ok("missing" in innerObj.parent, "33.02");
      ok("toString" in innerObj.parent, "33.03");
      equal(
        Object.getOwnPropertyDescriptor(innerObj.parent, "missing"),
        undefined,
        "33.04",
      );
      let nested = innerObj.parent.a;
      is(nested, innerObj.parent.a, "33.05");
      equal(nested.length, 1, "33.06");
      equal(
        Object.getOwnPropertyDescriptor(nested, "length").value,
        1,
        "33.07",
      );
      ok(Symbol.iterator in nested, "33.08");
      equal(Object.keys(nested), ["0"], "33.09");
      equal([...nested], [1], "33.10");
      reflected = true;
    }
    return value !== undefined ? value : key;
  });

  equal(actual, { a: [1], b: 2 }, "33.11");
  equal(reflected, true, "33.12");
  equal(
    traverse(1, () => 2),
    1,
    "33.13",
  );
  equal(
    traverse(null, () => 2),
    null,
    "33.14",
  );
});

test("34 - callback replacements must stay inside the tree model", () => {
  let cyclic = {};
  cyclic.self = cyclic;
  let shared = {};
  let customArray = [1];
  Object.setPrototypeOf(customArray, {});
  let symbolArray = [1];
  symbolArray[Symbol("extra")] = 2;
  let extraArray = [1];
  extraArray.extra = 2;
  let hiddenArray = [1];
  Object.defineProperty(hiddenArray, "0", { enumerable: false, value: 1 });
  let customObject = Object.create(null);
  customObject.value = 1;
  let symbolObject = { value: 1 };
  symbolObject[Symbol("extra")] = 2;
  let hiddenObject = {};
  Object.defineProperty(hiddenObject, "value", {
    enumerable: false,
    value: 1,
  });
  let replacements = [
    customArray,
    symbolArray,
    extraArray,
    hiddenArray,
    customObject,
    symbolObject,
    hiddenObject,
    cyclic,
    { a: shared, b: shared },
    new Date(0),
    () => 1,
  ];

  replacements.forEach((replacement, index) => {
    throws(
      () => traverse({ value: 1 }, () => replacement),
      /THROW_ID_02/,
      `34.${`${index + 1}`.padStart(2, "0")}`,
    );
  });
});

test("35 - array snapshots preserve holes and track callback deletion", () => {
  let input = new Array(5);
  input[0] = "a";
  input[2] = "b";
  input[3] = "drop";
  input[4] = "c";
  let parents = [];
  let actual = traverse(input, (value, _unused, innerObj) => {
    parents.push(innerObj.parent);
    return value === "drop" ? DELETE : value;
  });

  let intended = new Array(4);
  intended[0] = "a";
  intended[2] = "b";
  intended[3] = "c";
  equal(actual, intended, "35.01");
  let initial = new Array(5);
  initial[0] = "a";
  initial[2] = "b";
  initial[3] = "drop";
  initial[4] = "c";
  equal(parents[0], initial, "35.02");
  equal(parents[1], initial, "35.03");
  equal(parents[2], initial, "35.04");
  equal(parents[3], intended, "35.05");
});

test("36 - deep array metadata remains lazy and complete", () => {
  let depthLimit = 101;
  let input = [];
  let cursor = input;
  for (let depth = 0; depth < depthLimit; depth += 1) {
    cursor[0] = [];
    cursor = cursor[0];
  }

  let finalMetadata;
  traverse(input, (value, _unused, innerObj) => {
    if (innerObj.depth === depthLimit - 1) {
      finalMetadata = {
        parent: innerObj.parent,
        parentType: innerObj.parentType,
        path: innerObj.path,
        pathSegments: innerObj.pathSegments,
        topmostKey: innerObj.topmostKey,
      };
    }
    return value;
  });

  equal(finalMetadata.parent, [[]], "36.01");
  equal(finalMetadata.parentType, "array", "36.02");
  equal(finalMetadata.pathSegments.length, depthLimit, "36.03");
  equal(finalMetadata.path.split(".").length, depthLimit, "36.04");
  equal(finalMetadata.topmostKey, undefined, "36.05");
  equal(
    Object.getOwnPropertyDescriptor(finalMetadata.parent, Symbol.iterator),
    undefined,
    "36.06",
  );
});

test("37 - callback replacements preserve signed zero", () => {
  let negative = traverse([0], () => -0);
  let positive = traverse([-0], () => 0);

  equal(Object.is(negative[0], -0), true, "37.01");
  equal(Object.is(positive[0], 0), true, "37.02");
});

test("38 - deleting before a trailing hole updates snapshots", () => {
  let input = new Array(2);
  input[0] = "drop";
  let parent;
  let actual = traverse(input, (_value, _unused, innerObj) => {
    parent = innerObj.parent;
    return DELETE;
  });

  equal(actual.length, 1, "38.01");
  equal(hasOwn.call(actual, 0), false, "38.02");
  equal(parent.length, 2, "38.03");
  equal(parent[0], "drop", "38.04");
  equal(hasOwn.call(parent, 1), false, "38.05");
});

test.run();
