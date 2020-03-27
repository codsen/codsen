const t = require("tap");
// const isEqual = require("lodash.isequal");
// const objectPath = require("object-path");
const traverse = require("../dist/ast-monkey-traverse-with-lookahead.cjs");

// -----------------------------------------------------------------------------
// traverse
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 0`,
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
  `01.02 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 1`,
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

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      1 // <---------------- ! lookahead
    );
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [],
          },
        ],
        // ===================
      ],
      "01.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 2`,
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

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      2 // <---------------- ! lookahead
    );
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [],
          },
        ],
        // ===================
      ],
      "01.03"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 3`,
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

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      3
    );
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [],
          },
        ],
        // ===================
      ],
      "01.04"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 5`,
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

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      5
    );
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [],
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
  `01.06 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 6`,
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

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      6
    );
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [],
          },
        ],
        // ===================
      ],
      "01.06"
    );
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${35}m${`traverse`}\u001b[${39}m`} - traverses array of objects, lookahead === 99`,
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

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      99
    );
    // console.log(
    //   `- 01.07 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [
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
            ],
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
            next: [],
          },
        ],
        // ===================
      ],
      "01.07"
    );
    t.end();
  }
);

// 02. arrays
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${31}m${`arrays`}\u001b[${39}m`} - traverses and pings all the holes in arrays`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];

    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 02.01 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [],
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
            next: [],
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
            next: [],
          },
        ],
      ],
      "02.01"
    );
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${31}m${`arrays`}\u001b[${39}m`} - traverses and pings all the holes in arrays, lookahead = 1`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      1
    );
    // console.log(
    //   `- 02.02 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [
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
            ],
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
            next: [
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
            next: [],
          },
        ],
      ],
      "02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${31}m${`arrays`}\u001b[${39}m`} - traverses and pings all the holes in arrays, lookahead = 2`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      2
    );
    // console.log(
    //   `- 02.03 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [
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
            next: [
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
            next: [],
          },
        ],
      ],
      "02.03"
    );
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${31}m${`arrays`}\u001b[${39}m`} - traverses and pings all the holes in arrays, lookahead = 3`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      3
    );
    // console.log(
    //   `- 02.04 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [
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
            next: [
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
            next: [],
          },
        ],
      ],
      "02.04"
    );
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${31}m${`arrays`}\u001b[${39}m`} - traverses and pings all the holes in arrays, lookahead = 4`,
  (t) => {
    const input = ["a", undefined, "b"];
    const gathered = [];

    traverse(
      input,
      (key1, val1, innerObj) => {
        gathered.push([key1, val1, innerObj]);
      },
      3
    );
    // console.log(
    //   `- 02.04 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [
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
            next: [
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
            next: [],
          },
        ],
      ],
      "02.04"
    );
    t.end();
  }
);

// 03. objects-only
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`objects`}\u001b[${39}m`} - traverses plain objects`,
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
            next: [],
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
            next: [],
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
            next: [],
          },
        ],
        // ===================
      ],
      "03.01"
    );
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`objects`}\u001b[${39}m`} - object key's value is an array`,
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
          },
        ],
      ],
      "03.02"
    );
    t.end();
  }
);

// 04. more complex AST
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${32}m${`complex`}\u001b[${39}m`} - only traversal, #2`,
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
    //   `- 04.01 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
          },
        ],
        // ===================
      ],
      "04.01"
    );
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${32}m${`complex`}\u001b[${39}m`} - only traversal, #3`,
  (t) => {
    const input = ["1", "2", { a: "3" }];
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    });
    // console.log(
    //   `- 04.02 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
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
            next: [],
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
            next: [],
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
            next: [],
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
            next: [],
          },
        ],
      ],
      "04.02"
    );
    t.end();
  }
);

// 05. stopping the traversal upon request
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${36}m${`stopping`}\u001b[${39}m`} - objects - a reference traversal`,
  (t) => {
    const input = { a: "1", b: { c: "2" } };
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      return current;
    });
    t.same(gathered, ["a", "b", "b.c"], "05.01");
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${36}m${`stopping`}\u001b[${39}m`} - objects - after "b"`,
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
    t.same(gathered, ["a", "b"], "05.02");
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${36}m${`stopping`}\u001b[${39}m`} - arrays - a reference traversal`,
  (t) => {
    const input = ["a", ["b", "c"]];
    const gathered = [];
    traverse(input, (key1, val1, innerObj) => {
      const current = val1 !== undefined ? val1 : key1;
      gathered.push(innerObj.path);
      return current;
    });
    t.same(gathered, ["0", "1", "1.0", "1.1"], "05.03");
    t.end();
  }
);

t.test(
  `05.04 - ${`\u001b[${36}m${`stopping`}\u001b[${39}m`} - arrays - after "b"`,
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
    t.same(gathered, ["0", "1"], "05.04");
    t.end();
  }
);
