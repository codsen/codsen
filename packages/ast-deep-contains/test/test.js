import test from "ava";
import deepContains from "../dist/ast-deep-contains.esm";

// 01. basic functionality
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - second is a subset of the first`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["1", "1"],
      ["2", "2"]
    ],
    "01.01.01"
  );
  t.deepEqual(errors, [], "01.01.02");
});

test(`01.02 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - first is a subset of the second (error)`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["1", "1"],
      ["2", "2"]
    ],
    "01.02.01"
  );
  t.is(errors.length, 1, "01.02.02");
  t.regex(errors[0], /does not have the path "c"/g, "01.02.03");
});

test(`01.03 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - types mismatch`, t => {
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

  t.deepEqual(gathered, [], "01.02.01");
  t.is(errors.length, 1, "01.02.02");
  t.regex(errors[0], /string/g, "01.02.03");
  t.regex(errors[0], /object/g, "01.02.04");
});

test(`01.04 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with string values, OK`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["1", "4"],
      ["2", "5"],
      ["3", "6"]
    ],
    "01.04.01"
  );
  t.deepEqual(errors, [], "01.04.02");
});

test(`01.05 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with string values, not OK`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["1", "4"],
      ["2", "5"]
    ],
    "01.05.01"
  );
  t.is(errors.length, 1, "01.05.02");
  t.regex(errors[0], /does not have the path/g, "01.05.03");
});

test(`01.06 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with objects, opts.skipContainers=on (default)`, t => {
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
  t.deepEqual(
    gathered,
    [
      ["1", "4"],
      ["2", "5"]
    ],
    "01.06.01"
  );
  t.deepEqual(errors, [], "01.06.02");
});

test(`01.07 - ${`\u001b[${34}m${`basics`}\u001b[${39}m`} - arrays with objects, opts.skipContainers=off`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["1", "4"], // <---- skipped [{ a: "1" }, { b: "2" }, { c: "3" }] because it's at the root level
      ["2", "5"]
    ],
    "01.07.01"
  );
  t.deepEqual(errors, [], "01.07.02");
});

// 02. opts.arrayStrictComparison
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${32}m${`NOT STRICT`}\u001b[${39}m`} + ${`\u001b[${31}m${`skipContainers`}\u001b[${39}m`}`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"]
    ],
    "02.01.01"
  );
  t.deepEqual(errors, [], "02.01.02");
});

test(`02.02 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${31}m${`STRICT`}\u001b[${39}m`}     + ${`\u001b[${31}m${`skipContainers`}\u001b[${39}m`}`, t => {
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

  t.deepEqual(gathered, [], "02.02.01");
  t.deepEqual(
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
});

test(`02.03 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${32}m${`NOT STRICT`}\u001b[${39}m`} + ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"]
    ],
    "02.03.01"
  );
  t.deepEqual(errors, [], "02.03.02");
});

test(`02.04 - ${`\u001b[${36}m${`opts.arrayStrictComparison`}\u001b[${39}m`} - elements are objects, order is wrong, ${`\u001b[${31}m${`STRICT`}\u001b[${39}m`}     + ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`, t => {
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

  t.deepEqual(gathered, [], "02.04.01");
  t.deepEqual(
    errors,
    [
      ["a", "x"],
      ["b", "y"],
      ["x", "a"],
      ["y", "b"]
    ],
    "02.04.02"
  );
});

// 03. further combinations
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${36}m${`deeper nested`}\u001b[${39}m`} - ${`\u001b[${31}m${`skipContainers`}\u001b[${39}m`}`, t => {
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

  t.deepEqual(
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
  t.deepEqual(errors, [], "03.01.02");
});

test(`03.02 - ${`\u001b[${36}m${`deeper nested`}\u001b[${39}m`} - ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"]
    ],
    "03.02.01"
  );
  t.deepEqual(errors, [], "03.02.02");
});

// 04. array and further keys
// -----------------------------------------------------------------------------

// TODO - possible when ast-monkey-traverse branch skip instruction is enabled
// currently monkey stops via stop.now=true but we need extra function, 1) to
// skip current branch and continue further at same level, 2) to skip current
// and go up and continue, thus skipping all further siblings
// test(`04.01 - ${`\u001b[${35}m${`continuing`}\u001b[${39}m`} - extra key - ${`\u001b[${32}m${`skipContainers`}\u001b[${39}m`}`, t => {
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
//   t.deepEqual(
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
//   t.deepEqual(errors, [], "04.01.02");
// });

// 05. tree1 is superset
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${35}m${`continuing`}\u001b[${39}m`} - tree 1 has one more than tree 2`, t => {
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

  t.deepEqual(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"]
    ],
    "05.01.01"
  );
  t.deepEqual(errors, [], "05.01.02");
});
