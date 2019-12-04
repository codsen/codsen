const t = require("tap");
const deepContains = require("../dist/ast-deep-contains.cjs");

// 01. basic functionality
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - second is a subset of the first`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      { a: "1", b: "2", c: "3" },
      { a: "1", b: "2" },
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      }
    );

    t.same(
      gathered,
      [
        ["1", "1"],
        ["2", "2"]
      ],
      "01.01.01"
    );
    t.same(errors, [], "01.01.02");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - first is a subset of the second (error)`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      { a: "1", b: "2" },
      { a: "1", b: "2", c: "3" },
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      }
    );

    t.same(
      gathered,
      [
        ["1", "1"],
        ["2", "2"]
      ],
      "01.02.01"
    );
    t.equal(errors.length, 1, "01.02.02");
    t.match(errors[0], /does not have the path "c"/g, "01.02.03");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - types mismatch`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      "z",
      { a: "1", b: "2", c: "3" },
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      }
    );

    t.same(gathered, [], "01.02.01");
    t.equal(errors.length, 1, "01.02.02");
    t.match(errors[0], /string/g, "01.02.03");
    t.match(errors[0], /object/g, "01.02.04");
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with string values, OK`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      ["1", "2", "3"],
      ["4", "5", "6"],
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      }
    );

    t.same(
      gathered,
      [
        ["1", "4"],
        ["2", "5"],
        ["3", "6"]
      ],
      "01.04.01"
    );
    t.same(errors, [], "01.04.02");
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with string values, not OK`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      ["1", "2"],
      ["4", "5", "6"],
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      }
    );

    t.same(
      gathered,
      [
        ["1", "4"],
        ["2", "5"]
      ],
      "01.05.01"
    );
    t.equal(errors.length, 1, "01.05.02");
    t.match(errors[0], /does not have the path/g, "01.05.03");
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with objects, opts.skipContainers=on (default)`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [{ a: "1" }, { b: "2" }, { c: "3" }],
      [{ a: "4" }, { b: "5" }],
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      }
    );
    t.same(
      gathered,
      [
        ["1", "4"],
        ["2", "5"]
      ],
      "01.06.01"
    );
    t.same(errors, [], "01.06.02");
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with objects, opts.skipContainers=off`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [{ a: "1" }, { b: "2" }, { c: "3" }],
      [{ a: "4" }, { b: "5" }],
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      err => {
        errors.push(err);
      },
      { skipContainers: false }
    );

    t.same(
      gathered,
      [
        ["1", "4"], // <---- skipped [{ a: "1" }, { b: "2" }, { c: "3" }] because it's at the root level
        ["2", "5"]
      ],
      "01.07.01"
    );
    t.same(errors, [], "01.07.02");
    t.end();
  }
);

// 02. opts.arrayStrictComparison
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${32}m${`NOT STRICT`}\u001b[${39}m`} + ${`\u001b[${31}m${`skipContainers`}\u001b[${39}m`}`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [
        { key1: "a", key2: "b" },
        { key1: "x", key2: "y" }
      ],
      [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" }
      ],
      (leftSideVal, rightSideVal) => {
        if (leftSideVal === rightSideVal) {
          gathered.push([leftSideVal, rightSideVal]);
        } else {
          errors.push([leftSideVal, rightSideVal]);
        }
      },
      () => {},
      { skipContainers: false, arrayStrictComparison: false }
    );

    t.same(
      gathered,
      [
        ["x", "x"],
        ["y", "y"],
        ["a", "a"],
        ["b", "b"]
      ],
      "02.01.01"
    );
    t.same(errors, [], "02.01.02");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${31}m${`STRICT`}\u001b[${39}m`}     + ${`\u001b[${31}m${`skipContainers`}\u001b[${39}m`}`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [
        { key1: "a", key2: "b" },
        { key1: "x", key2: "y" }
      ],
      [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" }
      ],
      (leftSideVal, rightSideVal) => {
        if (leftSideVal === rightSideVal) {
          gathered.push([leftSideVal, rightSideVal]);
        } else {
          errors.push([leftSideVal, rightSideVal]);
        }
      },
      () => {},
      { skipContainers: false, arrayStrictComparison: true }
    );

    t.same(gathered, [], "02.02.01");
    t.same(
      errors,
      [
        [
          {
            key1: "a",
            key2: "b"
          },
          {
            key1: "x",
            key2: "y"
          }
        ],
        ["a", "x"],
        ["b", "y"],
        [
          {
            key1: "x",
            key2: "y"
          },
          {
            key1: "a",
            key2: "b"
          }
        ],
        ["x", "a"],
        ["y", "b"]
      ],
      "02.02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${32}m${`NOT STRICT`}\u001b[${39}m`} + ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [
        { key1: "a", key2: "b" },
        { key1: "x", key2: "y" }
      ],
      [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" }
      ],
      (leftSideVal, rightSideVal) => {
        if (leftSideVal === rightSideVal) {
          gathered.push([leftSideVal, rightSideVal]);
        } else {
          errors.push([leftSideVal, rightSideVal]);
        }
      },
      () => {},
      { skipContainers: true, arrayStrictComparison: false }
    );

    t.same(
      gathered,
      [
        ["x", "x"],
        ["y", "y"],
        ["a", "a"],
        ["b", "b"]
      ],
      "02.03.01"
    );
    t.same(errors, [], "02.03.02");
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${31}m${`STRICT`}\u001b[${39}m`}     + ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [
        { key1: "a", key2: "b" },
        { key1: "x", key2: "y" }
      ],
      [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" }
      ],
      (leftSideVal, rightSideVal) => {
        if (leftSideVal === rightSideVal) {
          gathered.push([leftSideVal, rightSideVal]);
        } else {
          errors.push([leftSideVal, rightSideVal]);
        }
      },
      () => {},
      { skipContainers: true, arrayStrictComparison: true }
    );

    t.same(gathered, [], "02.04.01");
    t.same(
      errors,
      [
        ["a", "x"],
        ["b", "y"],
        ["x", "a"],
        ["y", "b"]
      ],
      "02.04.02"
    );
    t.end();
  }
);

// 03. further combinations
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${36}m${`deeper nested`}\u001b[${39}m`} - ${`\u001b[${31}m${`skipContainers`}\u001b[${39}m`}`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      {
        a: [
          { key1: "a", key2: "b" },
          { key1: "x", key2: "y" }
        ]
      },
      {
        a: [
          { key1: "x", key2: "y" },
          { key1: "a", key2: "b" }
        ]
      },
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      () => {},
      { skipContainers: false }
    );

    t.same(
      gathered,
      [
        [
          [
            {
              key1: "a",
              key2: "b"
            },
            {
              key1: "x",
              key2: "y"
            }
          ],
          [
            {
              key1: "x",
              key2: "y"
            },
            {
              key1: "a",
              key2: "b"
            }
          ]
        ],
        ["x", "x"],
        ["y", "y"],
        ["a", "a"],
        ["b", "b"]
      ],
      "03.01.01"
    );
    t.same(errors, [], "03.01.02");
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${36}m${`deeper nested`}\u001b[${39}m`} - ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      {
        a: [
          { key1: "a", key2: "b" },
          { key1: "x", key2: "y" }
        ]
      },
      {
        a: [
          { key1: "x", key2: "y" },
          { key1: "a", key2: "b" }
        ]
      },
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      () => {},
      { skipContainers: true }
    );

    t.same(
      gathered,
      [
        ["x", "x"],
        ["y", "y"],
        ["a", "a"],
        ["b", "b"]
      ],
      "03.02.01"
    );
    t.same(errors, [], "03.02.02");
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - one object inside each array`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [{ key1: "a", key2: "b" }],
      [{ key1: "a", key2: "b" }],
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      errStr => {
        errors.push(errStr);
      },
      {} // default opts
    );

    t.same(
      gathered,
      [
        ["a", "a"],
        ["b", "b"]
      ],
      "03.03.01"
    );
    t.same(errors, [], "03.03.02");
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - one object inside each array`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 5, "/"]]
          }
        },
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]]
          }
        }
      ],
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]]
          }
        },
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 5, "/"]]
          }
        }
      ],
      (leftSideVal, rightSideVal) => {
        gathered.push([leftSideVal, rightSideVal]);
      },
      errStr => {
        errors.push(errStr);
      },
      {} // default opts
    );

    // console.log(
    //   `${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
    //     gathered,
    //     null,
    //     4
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`errors`}\u001b[${39}m`} = ${JSON.stringify(
    //     errors,
    //     null,
    //     4
    //   )}`
    // );
    t.same(
      gathered,
      [
        ["tag-closing-backslash", "tag-closing-backslash"],
        [2, 2],
        [1, 1],
        [2, 2],
        ["Wrong slash - backslash.", "Wrong slash - backslash."],
        [1, 1],
        [2, 2],
        ["tag-closing-backslash", "tag-closing-backslash"],
        [2, 2],
        [4, 4],
        [5, 5],
        ["Replace backslash with slash.", "Replace backslash with slash."],
        [4, 4],
        [5, 5],
        ["/", "/"]
      ],
      "03.04.01"
    );
    t.same(errors, [], "03.04.02");
    t.end();
  }
);

// 04. array and further keys
// -----------------------------------------------------------------------------

// TODO - possible when ast-monkey-traverse branch skip instruction is enabled
// currently monkey stops via stop.now=true but we need extra function, 1) to
// skip current branch and continue further at same level, 2) to skip current
// and go up and continue, thus skipping all further siblings
//
// t.test(`04.01 - ${`\u001b[${35}m${`continuing`}\u001b[${39}m`} - extra key - ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`, t => {
//   const gathered = [];
//   const errors = [];
//
//   deepContains(
//     {
//       a: [
//         { key1: "a", key2: "b" },
//         { key1: "x", key2: "y" }
//       ],
//       b: "c"
//     },
//     {
//       a: [
//         { key1: "x", key2: "y" },
//         { key1: "a", key2: "b" }
//       ],
//       b: "d" // <------ monkey must not fully stop and process this key onwards
//     },
//     (leftSideVal, rightSideVal) => {
//       gathered.push([leftSideVal, rightSideVal]);
//     },
//     () => {},
//     { skipContainers: true }
//   );
//
//   console.log(
//     `${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
//       gathered,
//       null,
//       4
//     )}`
//   );
//   t.same(
//     gathered,
//     [
//       ["x", "x"],
//       ["y", "y"],
//       ["a", "a"],
//       ["b", "b"],
//       ["d", "c"] // TODO
//     ],
//     "04.01.01"
//   );
//   t.same(errors, [], "04.01.02");
// });

// 05. tree1 is superset
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${35}m${`continuing`}\u001b[${39}m`} - tree 1 has one more than tree 2`,
  t => {
    const gathered = [];
    const errors = [];

    deepContains(
      [
        { key1: "a", key2: "b" },
        { key1: "k", key2: "l" },
        { key1: "x", key2: "y" }
      ],
      [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" }
      ],
      (leftSideVal, rightSideVal) => {
        if (leftSideVal === rightSideVal) {
          gathered.push([leftSideVal, rightSideVal]);
        } else {
          errors.push([leftSideVal, rightSideVal]);
        }
      },
      () => {},
      { skipContainers: true }
    );

    t.same(
      gathered,
      [
        ["x", "x"],
        ["y", "y"],
        ["a", "a"],
        ["b", "b"]
      ],
      "05.01.01"
    );
    t.same(errors, [], "05.01.02");
    t.end();
  }
);
