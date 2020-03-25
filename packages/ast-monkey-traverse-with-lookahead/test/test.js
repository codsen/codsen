const t = require("tap");
// const isEqual = require("lodash.isequal");
// const objectPath = require("object-path");
const traverse = require("../dist/ast-monkey-traverse-with-lookahead.cjs");

// -----------------------------------------------------------------------------
// traverse
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traverses array of objects`,
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

    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 01.01 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );

    t.same(
      gathered,
      [
        // ===================
        [
          {
            a: "b",
          },
          null,
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
          },
        ],
        // ===================
        [
          {
            c: "d",
          },
          null,
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
          },
        ],
        // ===================
        [
          {
            e: "f",
          },
          null,
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
          },
        ],
        // ===================
      ],
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traverses and pings all the holes in arrays`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];

    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 01.02 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );

    t.same(
      gathered,
      [
        [
          "a",
          null,
          {
            depth: 0,
            path: "0",
            parent: ["a", undefined, "b"],
            parentType: "array",
          },
        ],
        [
          undefined,
          null,
          {
            depth: 0,
            path: "1",
            parent: ["a", undefined, "b"],
            parentType: "array",
          },
        ],
        [
          "b",
          null,
          {
            depth: 0,
            path: "2",
            parent: ["a", null, "b"],
            parentType: "array",
          },
        ],
      ],
      "01.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - traverses plain objects`,
  (t) => {
    const input = {
      a: "k",
      b: "l",
      c: "m",
    };
    const gathered = [];

    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 01.03 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );

    t.same(
      gathered,
      [
        // ===================
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
          },
        ],
        // ===================
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
          },
        ],
        // ===================
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
          },
        ],
        // ===================
      ],
      "03.04"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - object key's value is an array`,
  (t) => {
    const input = {
      a: ["1", "2", "3"],
    };
    const gathered = [];

    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 01.04 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );

    t.same(
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
          },
        ],
        [
          "1",
          null,
          {
            depth: 1,
            path: "a.0",
            topmostKey: "a",
            parent: ["1", "2", "3"],
            parentType: "array",
          },
        ],
        [
          "2",
          null,
          {
            depth: 1,
            path: "a.1",
            topmostKey: "a",
            parent: ["1", "2", "3"],
            parentType: "array",
          },
        ],
        [
          "3",
          null,
          {
            depth: 1,
            path: "a.2",
            topmostKey: "a",
            parent: ["1", "2", "3"],
            parentType: "array",
          },
        ],
      ],
      "01.04"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - only traversal, #2`,
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
    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 01.05 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );

    t.same(
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
          null,
          {
            depth: 4,
            path: "a.f.g.h.0",
            topmostKey: "a",
            parent: ["1", "2", "3"],
            parentType: "array",
          },
        ],
        // ===================
        [
          "2",
          null,
          {
            depth: 4,
            path: "a.f.g.h.1",
            topmostKey: "a",
            parent: ["1", "2", "3"],
            parentType: "array",
          },
        ],
        // ===================
        [
          "3",
          null,
          {
            depth: 4,
            path: "a.f.g.h.2",
            topmostKey: "a",
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
          null,
          {
            depth: 4,
            path: "a.f.g.i.0",
            topmostKey: "a",
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
          null,
          {
            depth: 4,
            path: "a.f.g.i.1",
            topmostKey: "a",
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
          null,
          {
            depth: 4,
            path: "a.f.g.i.2",
            topmostKey: "a",
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
          null,
          {
            depth: 4,
            path: "a.f.g.l.0",
            topmostKey: "a",
            parent: ["7", "8", "9"],
            parentType: "array",
          },
        ],
        // ===================
        [
          "8",
          null,
          {
            depth: 4,
            path: "a.f.g.l.1",
            topmostKey: "a",
            parent: ["7", "8", "9"],
            parentType: "array",
          },
        ],
        // ===================
        [
          "9",
          null,
          {
            depth: 4,
            path: "a.f.g.l.2",
            topmostKey: "a",
            parent: ["7", "8", "9"],
            parentType: "array",
          },
        ],
        // ===================
      ],
      "01.05"
    );
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${36}m${`traverse`}\u001b[${39}m`} - only traversal, #3`,
  (t) => {
    const input = ["1", "2", { a: "3" }];
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 01.06 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );

    t.same(
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
          },
        ],
      ],
      "03.07"
    );
    t.end();
  }
);

// 02. stopping the traversal upon request
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - objects - a reference traversal`,
  (t) => {
    const input = { a: "1", b: { c: "2" } };
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      return current;
    });
    t.same(gathered, ["a", "b", "b.c"]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - objects - after "b"`,
  (t) => {
    const input = { a: "1", b: { c: "2" } };
    const gathered = [];
    traverse(input, (key1, val1, innerObj, stop) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      if (innerObj.path === "b") {
        stop.now = true;
      }
      return current;
    });
    t.same(gathered, ["a", "b"]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - arrays - a reference traversal`,
  (t) => {
    const input = ["a", ["b", "c"]];
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      return current;
    });
    t.same(gathered, ["0", "1", "1.0", "1.1"]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${31}m${`stopping`}\u001b[${39}m`} - arrays - after "b"`,
  (t) => {
    const input = ["a", ["b", "c"]];
    const gathered = [];
    traverse(input, (key1, val1, innerObj, stop) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      if (innerObj.path === "1") {
        stop.now = true;
      }
      return current;
    });
    t.same(gathered, ["0", "1"]);
    t.end();
  }
);
