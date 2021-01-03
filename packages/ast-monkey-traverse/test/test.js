import tap from "tap";
import isEqual from "lodash.isequal";
import objectPath from "object-path";
import { traverse } from "../dist/ast-monkey-traverse.esm";

// -----------------------------------------------------------------------------
// traverse
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - use traverse to delete one key from an array`,
  (t) => {
    const input = [
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
    const actual01 = traverse(input, (key1, val1) => {
      const current = val1 !== undefined ? val1 : key1;
      if (isEqual(current, { a: "b" })) {
        return NaN;
      }
      return current;
    });
    const intended01 = [
      {
        c: "d",
      },
      {
        e: "f",
      },
    ];
    t.strictSame(actual01, intended01, "01.01");

    const actual02 = traverse(input, (key1, val1) => {
      const current = val1 !== undefined ? val1 : key1;
      if (isEqual(current, { c: "d" })) {
        return NaN;
      }
      return current;
    });
    const intended02 = [
      {
        a: "b",
      },
      {
        e: "f",
      },
    ];
    t.strictSame(actual02, intended02, "01.02");

    const actual03 = traverse(input, (key1, val1) => {
      const current = val1 !== undefined ? val1 : key1;
      if (isEqual(current, { e: "f" })) {
        return NaN;
      }
      return current;
    });
    const intended03 = [
      {
        a: "b",
      },
      {
        c: "d",
      },
    ];
    t.strictSame(actual03, intended03, "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - more deletion from arrays`,
  (t) => {
    const input = [
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

    const actual01 = traverse(input, (key1, val1) => {
      // console.log('\n\n------\n')
      // console.log('key = ' + JSON.stringify(key, null, 4))
      // console.log('val = ' + JSON.stringify(val, null, 4))
      const current = val1 !== undefined ? val1 : key1;
      if (isEqual(current, { a: "b" })) {
        return NaN;
      }
      return current;
    });
    const intended01 = [
      {
        c: "d",
      },
    ];
    t.strictSame(actual01, intended01, "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - use traverse, passing null, write over values`,
  (t) => {
    const input = [
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

    const actual01 = traverse(input, (key1, val1) => {
      // console.log('\n\n------\n')
      // console.log('key = ' + JSON.stringify(key, null, 4))
      // console.log('val = ' + JSON.stringify(val, null, 4))
      const current = val1 !== undefined ? val1 : key1;
      if (current === "b") {
        return null;
      }
      return current;
    });
    const intended01 = [
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
    t.strictSame(actual01, intended01, "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traverse automatically patches up holes in arrays`,
  (t) => {
    const input = ["a", undefined, "b"];

    const actual01 = traverse(input, (key1, val1) => {
      // console.log('\n\n------\n')
      // console.log('key = ' + JSON.stringify(key, null, 4))
      // console.log('val = ' + JSON.stringify(val, null, 4))
      const current = val1 !== undefined ? val1 : key1;
      // we do nothing here
      return current;
    });
    const intended01 = ["a", "b"];
    t.strictSame(actual01, intended01, "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - delete key-value pair from plain object in root`,
  (t) => {
    const input = {
      a: "a",
      b: "b",
      c: "c",
    };

    const actual = traverse(input, (key1, val1) => {
      const current = val1 !== undefined ? val1 : key1;
      if (current === "a") {
        return NaN;
      }
      return current;
    });
    const intended = {
      b: "b",
      c: "c",
    };

    t.strictSame(actual, intended, "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - only traversal, #1`,
  (t) => {
    const input = {
      a: ["1", "2", "3"],
    };
    const actual = traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      t.strictSame(
        current,
        objectPath.get(input, innerObj.path),
        innerObj.path
      );
      return current;
    });
    t.pass(actual);
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - only traversal, #2`,
  (t) => {
    const input = {
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
    const gathered = [];
    const actual = traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      t.strictSame(
        current,
        objectPath.get(input, innerObj.path),
        innerObj.path
      );
      gathered.push(current);
      return current;
    });
    t.pass(actual);
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - only traversal, #3`,
  (t) => {
    const input = ["1", "2", { a: "3" }];
    const actual = traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      t.strictSame(
        current,
        objectPath.get(input, innerObj.path),
        innerObj.path
      );
      return current;
    });
    t.pass(actual);
    t.end();
  }
);

// 02. stopping the traversal upon request
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - objects - a reference traversal`,
  (t) => {
    const input = { a: "1", b: { c: "2" } };
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj);
      return current;
    });
    t.strictSame(
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
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - objects - after "b"`,
  (t) => {
    const input = { a: "1", b: { c: "2" } };
    const gathered = [];
    traverse(input, (key1, val1, innerObj, stop) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      if (innerObj.path === "b") {
        // eslint-disable-next-line no-param-reassign
        stop.now = true;
      }
      return current;
    });
    t.strictSame(gathered, ["a", "b"], "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - arrays - a reference traversal`,
  (t) => {
    const input = ["a", ["b", "c"]];
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      return current;
    });
    t.strictSame(gathered, ["0", "1", "1.0", "1.1"], "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - arrays - after "b"`,
  (t) => {
    const input = ["a", ["b", "c"]];
    const gathered = [];
    traverse(input, (key1, val1, innerObj, stop) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      if (innerObj.path === "1") {
        // eslint-disable-next-line no-param-reassign
        stop.now = true;
      }
      return current;
    });
    t.strictSame(gathered, ["0", "1"], "12");
    t.end();
  }
);

// 03. traversal reporting
// -----------------------------------------------------------------------------

tap.test(
  `13 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - array of objects, just traversing`,
  (t) => {
    const input = [
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
    const gathered = [];
    traverse(input, (key1, val1, internalObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push([key1, val1, internalObj]);
      return current;
    });
    // console.log(
    //   `359 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    t.strictSame(
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
      "13"
    );
    t.end();
  }
);

tap.todo(
  `14 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traversal continues after the hole`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];
    traverse(input, (key1, val1, internalObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push([key1, val1, internalObj]);
      return current;
    });
    // console.log(
    //   `495 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    t.strictSame(
      gathered,
      [
        [
          "a",
          undefined,
          {
            depth: 0,
            path: "0",
            parent: ["a", undefined, "b"],
            parentType: "array",
            parentKey: null,
          },
        ],
        [
          "b",
          undefined,
          {
            depth: 0,
            path: "1",
            parent: ["a", undefined, "b"],
            parentType: "array",
            parentKey: null,
          },
        ],
      ],
      "14"
    );
    t.end();
  }
);

tap.todo(
  `15 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traversal continues after the hole, deeper`,
  (t) => {
    const input = [{ a: "b" }, undefined, { x: "y" }];
    t.pass(input);
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traversal continues after the hole`,
  (t) => {
    const input = {
      a: "k",
      b: "l",
      c: "m",
    };
    const gathered = [];
    traverse(input, (key1, val1, internalObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push([key1, val1, internalObj]);
      return current;
    });
    // console.log(
    //   `555 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    t.strictSame(
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
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traversal continues after the hole`,
  (t) => {
    const input = {
      a: ["1", "2", "3"],
    };
    const gathered = [];
    traverse(input, (key1, val1, internalObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push([key1, val1, internalObj]);
      return current;
    });
    // console.log(
    //   `629 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    t.strictSame(
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
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - more complex AST`,
  (t) => {
    const input = {
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
    const gathered = [];
    traverse(input, (key1, val1, internalObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push([key1, val1, internalObj]);
      return current;
    });
    // console.log(
    //   `723 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    t.strictSame(
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
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - more traversal`,
  (t) => {
    const input = ["1", "2", { a: "3" }];
    const gathered = [];
    traverse(input, (key1, val1, internalObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push([key1, val1, internalObj]);
      return current;
    });
    // console.log(
    //   `1177 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    t.strictSame(
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
      "19"
    );
    t.end();
  }
);
