// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

// 01. basic functionality
// -----------------------------------------------------------------------------

test(`01 - basics - second is a subset of the first`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    { a: "1", b: "2", c: "3" },
    { a: "1", b: "2" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );

  equal(
    gathered,
    [
      ["1", "1"],
      ["2", "2"],
    ],
    "01.01",
  );
  equal(errors, [], "01.02");
});

test(`02 - basics - first is a subset of the second (error)`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );

  equal(
    gathered,
    [
      ["1", "1"],
      ["2", "2"],
    ],
    "02.01",
  );
  equal(errors.length, 1, "02.02");
  match(errors[0], /does not have the path "c"/g, "02.03");
});

test(`03 - basics - types mismatch`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    "z",
    { a: "1", b: "2", c: "3" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );

  equal(gathered, [], "03.01");
  equal(errors.length, 1, "03.02");
  match(errors[0], /string/g, "03.03");
  match(errors[0], /object/g, "03.04");
});

test(`04 - basics - arrays with string values, OK`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    ["1", "2", "3"],
    ["4", "5", "6"],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );

  equal(
    gathered,
    [
      ["1", "4"],
      ["2", "5"],
      ["3", "6"],
    ],
    "04.01",
  );
  equal(errors, [], "04.02");
});

test(`05 - basics - arrays with string values, not OK`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    ["1", "2"],
    ["4", "5", "6"],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );

  equal(
    gathered,
    [
      ["1", "4"],
      ["2", "5"],
    ],
    "05.01",
  );
  equal(errors.length, 1, "05.02");
  match(errors[0], /does not have the path/g, "05.03");
});

test(`06 - basics - arrays with objects, opts.skipContainers=on (default)`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [{ a: "1" }, { b: "2" }, { c: "3" }],
    [{ a: "4" }, { b: "5" }],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );
  equal(
    gathered,
    [
      ["1", "4"],
      ["2", "5"],
    ],
    "06.01",
  );
  equal(errors, [], "06.02");
});

test(`07 - basics - arrays with objects, opts.skipContainers=off`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [{ a: "1" }, { b: "2" }, { c: "3" }],
    [{ a: "4" }, { b: "5" }],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
    { skipContainers: false },
  );

  equal(
    gathered,
    [
      ["1", "4"], // <---- skipped [{ a: "1" }, { b: "2" }, { c: "3" }] because it's at the root level
      ["2", "5"],
    ],
    "07.01",
  );
  equal(errors, [], "07.02");
});

// 02. opts.arrayStrictComparison
// -----------------------------------------------------------------------------

test(`08 - opts.arrayStrictComparison - elements are objects, order is wrong, ${`\u001b[${32}m${"NOT STRICT"}\u001b[${39}m`} + ${`\u001b[${31}m${"skipContainers"}\u001b[${39}m`}`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [
      { key1: "a", key2: "b" },
      { key1: "x", key2: "y" },
    ],
    [
      { key1: "x", key2: "y" },
      { key1: "a", key2: "b" },
    ],
    (leftSideVal, rightSideVal) => {
      if (leftSideVal === rightSideVal) {
        gathered.push([leftSideVal, rightSideVal]);
      } else {
        errors.push([leftSideVal, rightSideVal]);
      }
    },
    () => {},
    { skipContainers: false, arrayStrictComparison: false },
  );

  equal(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"],
    ],
    "08.01",
  );
  equal(errors, [], "08.02");
});

test(`09 - opts.arrayStrictComparison - elements are objects, order is wrong, ${`\u001b[${31}m${"STRICT"}\u001b[${39}m`}     + ${`\u001b[${31}m${"skipContainers"}\u001b[${39}m`}`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [
      { key1: "a", key2: "b" },
      { key1: "x", key2: "y" },
    ],
    [
      { key1: "x", key2: "y" },
      { key1: "a", key2: "b" },
    ],
    (leftSideVal, rightSideVal) => {
      if (leftSideVal === rightSideVal) {
        gathered.push([leftSideVal, rightSideVal]);
      } else {
        errors.push([leftSideVal, rightSideVal]);
      }
    },
    () => {},
    { skipContainers: false, arrayStrictComparison: true },
  );

  equal(gathered, [], "09.01");
  equal(
    errors,
    [
      [
        {
          key1: "a",
          key2: "b",
        },
        {
          key1: "x",
          key2: "y",
        },
      ],
      ["a", "x"],
      ["b", "y"],
      [
        {
          key1: "x",
          key2: "y",
        },
        {
          key1: "a",
          key2: "b",
        },
      ],
      ["x", "a"],
      ["y", "b"],
    ],
    "09.02",
  );
});

test(`10 - opts.arrayStrictComparison - elements are objects, order is wrong, ${`\u001b[${32}m${"NOT STRICT"}\u001b[${39}m`} + ${`\u001b[${32}m${"skipContainers"}\u001b[${39}m`}`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [
      { key1: "a", key2: "b" },
      { key1: "x", key2: "y" },
    ],
    [
      { key1: "x", key2: "y" },
      { key1: "a", key2: "b" },
    ],
    (leftSideVal, rightSideVal) => {
      if (leftSideVal === rightSideVal) {
        gathered.push([leftSideVal, rightSideVal]);
      } else {
        errors.push([leftSideVal, rightSideVal]);
      }
    },
    () => {},
    { skipContainers: true, arrayStrictComparison: false },
  );

  equal(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"],
    ],
    "10.01",
  );
  equal(errors, [], "10.02");
});

test(`11 - opts.arrayStrictComparison - elements are objects, order is wrong, ${`\u001b[${31}m${"STRICT"}\u001b[${39}m`}     + ${`\u001b[${32}m${"skipContainers"}\u001b[${39}m`}`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [
      { key1: "a", key2: "b" },
      { key1: "x", key2: "y" },
    ],
    [
      { key1: "x", key2: "y" },
      { key1: "a", key2: "b" },
    ],
    (leftSideVal, rightSideVal) => {
      if (leftSideVal === rightSideVal) {
        gathered.push([leftSideVal, rightSideVal]);
      } else {
        errors.push([leftSideVal, rightSideVal]);
      }
    },
    () => {},
    { skipContainers: true, arrayStrictComparison: true },
  );

  equal(gathered, [], "11.01");
  equal(
    errors,
    [
      ["a", "x"],
      ["b", "y"],
      ["x", "a"],
      ["y", "b"],
    ],
    "11.02",
  );
});

// 03. further combinations
// -----------------------------------------------------------------------------

test(`12 - deeper nested - ${`\u001b[${31}m${"skipContainers"}\u001b[${39}m`}`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    {
      a: [
        { key1: "a", key2: "b" },
        { key1: "x", key2: "y" },
      ],
    },
    {
      a: [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" },
      ],
    },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    () => {},
    { skipContainers: false },
  );

  equal(
    gathered,
    [
      [
        [
          {
            key1: "a",
            key2: "b",
          },
          {
            key1: "x",
            key2: "y",
          },
        ],
        [
          {
            key1: "x",
            key2: "y",
          },
          {
            key1: "a",
            key2: "b",
          },
        ],
      ],
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"],
    ],
    "12.01",
  );
  equal(errors, [], "12.02");
});

test(`13 - deeper nested - ${`\u001b[${32}m${"skipContainers"}\u001b[${39}m`}`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    {
      a: [
        { key1: "a", key2: "b" },
        { key1: "x", key2: "y" },
      ],
    },
    {
      a: [
        { key1: "x", key2: "y" },
        { key1: "a", key2: "b" },
      ],
    },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    () => {},
    { skipContainers: true },
  );

  equal(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"],
    ],
    "13.01",
  );
  equal(errors, [], "13.02");
});

test(`14 - opts.arrayStrictComparison - one object inside each array`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [{ key1: "a", key2: "b" }],
    [{ key1: "a", key2: "b" }],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (errStr) => {
      errors.push(errStr);
    },
    {}, // default opts
  );

  equal(
    gathered,
    [
      ["a", "a"],
      ["b", "b"],
    ],
    "14.01",
  );
  equal(errors, [], "14.02");
});

test(`15 - opts.arrayStrictComparison - one object inside each array`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[4, 5, "/"]],
        },
      },
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[1, 2]],
        },
      },
    ],
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[1, 2]],
        },
      },
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[4, 5, "/"]],
        },
      },
    ],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (errStr) => {
      errors.push(errStr);
    },
    {}, // default opts
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
  equal(
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
      ["/", "/"],
    ],
    "15.01",
  );
  equal(errors, [], "15.02");
});

// 04. array and further keys
// -----------------------------------------------------------------------------

// TODO - possible when ast-monkey-traverse branch skip instruction is enabled
// currently monkey stops via stop.now=true but we need extra function, 1) to
// skip current branch and continue further at same level, 2) to skip current
// and go up and continue, thus skipping all further siblings
//
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
//   equal(
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
//   equal(errors, [], "04.01.02");
// });

// 05. tree1 is superset
// -----------------------------------------------------------------------------

test(`16 - continuing - tree 1 has one more than tree 2`, () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [
      { key1: "a", key2: "b" },
      { key1: "k", key2: "l" },
      { key1: "x", key2: "y" },
    ],
    [
      { key1: "x", key2: "y" },
      { key1: "a", key2: "b" },
    ],
    (leftSideVal, rightSideVal) => {
      if (leftSideVal === rightSideVal) {
        gathered.push([leftSideVal, rightSideVal]);
      } else {
        errors.push([leftSideVal, rightSideVal]);
      }
    },
    () => {},
    { skipContainers: true },
  );

  equal(
    gathered,
    [
      ["x", "x"],
      ["y", "y"],
      ["a", "a"],
      ["b", "b"],
    ],
    "16.01",
  );
  equal(errors, [], "16.02");
});

test("17 - unordered arrays compare every object", () => {
  let gathered = [];
  let errors = [];

  deepContains(
    [{ a: 1 }, { b: 2 }, { c: 3 }],
    [{ c: 3 }, { a: 1 }, { b: 2 }],
    (leftSideVal, rightSideVal, path) => {
      gathered.push([leftSideVal, rightSideVal, path]);
    },
    (error) => {
      errors.push(error);
    },
  );

  equal(
    gathered,
    [
      [3, 3, "c"],
      [1, 1, "a"],
      [2, 2, "b"],
    ],
    "17.01",
  );
  equal(errors, [], "17.02");
});

test.run();
