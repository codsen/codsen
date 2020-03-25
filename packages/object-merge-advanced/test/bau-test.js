/* eslint max-len:0 */

const t = require("tap");
// const clone = require("lodash.clonedeep");
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
// Normal assignments with default value, false
// ==============================

t.test("01.01 - simple objects, no key clash", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: "a",
      },
      {
        b: "b",
      }
    ),
    {
      a: "a",
      b: "b",
    },
    "01.01.01"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
      },
      {
        a: "a",
      }
    ),
    {
      a: "a",
      b: "b",
    },
    "01.01.02"
  );

  // https://stackoverflow.com/a/51148924/3943954
  const x = { a: { a: 1 } };
  const y = { a: { b: 1 } };
  t.same(
    mergeAdvanced(x, y),
    {
      a: {
        a: 1,
        b: 1,
      },
    },
    "01.01.03"
  );
  t.end();
});

t.test("01.02 - different types, no key clash", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: ["b1", "b2", "b3"],
        a: "a",
      },
      {
        d: null,
        c: { c: "c" },
      }
    ),
    {
      a: "a",
      b: ["b1", "b2", "b3"],
      c: { c: "c" },
      d: null,
    },
    "01.02.01"
  );
  t.same(
    mergeAdvanced(
      {
        d: null,
        c: { c: "c" },
      },
      {
        b: ["b1", "b2", "b3"],
        a: "a",
      }
    ),
    {
      a: "a",
      b: ["b1", "b2", "b3"],
      c: { c: "c" },
      d: null,
    },
    "01.02.02"
  );
  t.end();
});

t.test("01.03 - string vs string value clash", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: "a",
      },
      {
        a: "c",
      }
    ),
    {
      a: "c",
      b: "b",
    },
    "01.03.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: "c",
      },
      {
        b: "b",
        a: "a",
      }
    ),
    {
      a: "a",
      b: "b",
    },
    "01.03.02"
  );
  t.end();
});

t.test("01.04 - array vs array value clash", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: ["a"],
      },
      {
        a: ["c"],
      }
    ),
    {
      a: ["a", "c"],
      b: "b",
    },
    "01.04.01"
  );
  // t.same(
  //   mergeAdvanced(
  //     {
  //       a: ['c']
  //     },
  //     {
  //       b: 'b',
  //       a: ['a']
  //     }
  //   ),
  //   {
  //     a: ['c', 'a'],
  //     b: 'b'
  //   },
  //   '01.04.02')
  t.end();
});

t.test("01.05 - object vs object value clash", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: { c: "c" },
      },
      {
        b: "b",
        a: { a: "a" },
      }
    ),
    {
      a: {
        c: "c",
        a: "a",
      },
      b: "b",
    },
    "01.05"
  );
  t.end();
});

t.test("01.06 - array vs empty array", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: ["a1", "a2"],
      },
      {
        a: [],
      }
    ),
    {
      a: ["a1", "a2"],
      b: "b",
    },
    "01.06.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: [],
      },
      {
        b: "b",
        a: ["a1", "a2"],
      }
    ),
    {
      a: ["a1", "a2"],
      b: "b",
    },
    "01.06.02"
  );
  t.end();
});

t.test("01.07 - object vs empty array - object wins", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: { x: "y" },
      },
      {
        a: [],
      }
    ),
    {
      a: { x: "y" },
      b: "b",
    },
    "01.07.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: [],
      },
      {
        b: "b",
        a: { x: "y" },
      }
    ),
    {
      a: { x: "y" },
      b: "b",
    },
    "01.07.02"
  );
  t.end();
});

t.test("01.08 - string vs empty array - string wins", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: "a",
      },
      {
        a: [],
      }
    ),
    {
      a: "a",
      b: "b",
    },
    "01.08.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: [],
      },
      {
        b: "b",
        a: "a",
      }
    ),
    {
      a: "a",
      b: "b",
    },
    "01.08.02"
  );
  t.end();
});

t.test("01.09 - empty array vs empty array", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: [],
      },
      {
        a: [],
      }
    ),
    {
      a: [],
      b: "b",
    },
    "01.09.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: [],
      },
      {
        b: "b",
        a: [],
      }
    ),
    {
      a: [],
      b: "b",
    },
    "01.09.02"
  );
  t.end();
});

t.test("01.10 - string vs array", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: ["a"],
      },
      {
        a: "a",
      }
    ),
    {
      a: ["a"],
      b: "b",
    },
    "01.10.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: "a",
      },
      {
        b: "b",
        a: ["a"],
      }
    ),
    {
      a: ["a"],
      b: "b",
    },
    "01.10.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: "a",
      },
      {
        a: ["a"],
      }
    ),
    {
      a: ["a"],
      b: "b",
    },
    "01.10.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: ["a"],
      },
      {
        b: "b",
        a: "a",
      }
    ),
    {
      a: ["a"],
      b: "b",
    },
    "01.10.04"
  );
  t.end();
});

t.test("01.11 - string vs object", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: "a",
      },
      {
        a: { c: "c" },
      }
    ),
    {
      a: { c: "c" },
      b: "b",
    },
    "01.11.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: { c: "c" },
      },
      {
        b: "b",
        a: "a",
      }
    ),
    {
      a: { c: "c" },
      b: "b",
    },
    "01.11.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: { c: "c" },
      },
      {
        a: "a",
      }
    ),
    {
      a: { c: "c" },
      b: "b",
    },
    "01.11.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: "a",
      },
      {
        b: "b",
        a: { c: "c" },
      }
    ),
    {
      a: { c: "c" },
      b: "b",
    },
    "01.11.04"
  );
  t.end();
});

t.test("01.12 - object vs array", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: {
          c: "c",
        },
      },
      {
        a: ["c"],
      }
    ),
    {
      a: ["c"],
      b: "b",
    },
    "01.12.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: ["c"],
      },
      {
        b: "b",
        a: {
          c: "c",
        },
      }
    ),
    {
      a: ["c"],
      b: "b",
    },
    "01.12.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: ["c"],
      },
      {
        a: {
          c: "c",
        },
      }
    ),
    {
      a: ["c"],
      b: "b",
    },
    "01.12.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: {
          c: "c",
        },
      },
      {
        b: "b",
        a: ["c"],
      }
    ),
    {
      a: ["c"],
      b: "b",
    },
    "01.12.04"
  );
  t.end();
});

t.test("01.13 - empty object vs empty array", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: [],
      },
      {
        a: {},
      }
    ),
    {
      a: [],
      b: "b",
    },
    "01.13.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: {},
      },
      {
        b: "b",
        a: [],
      }
    ),
    {
      a: [],
      b: "b",
    },
    "01.13.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: {},
      },
      {
        a: [],
      }
    ),
    {
      a: [],
      b: "b",
    },
    "01.13.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: [],
      },
      {
        b: "b",
        a: {},
      }
    ),
    {
      a: [],
      b: "b",
    },
    "01.13.04"
  );
  t.end();
});

t.test("01.14 - empty string vs object", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: "",
      },
      {
        a: {
          c: "c",
        },
      }
    ),
    {
      a: {
        c: "c",
      },
      b: "b",
    },
    "01.14.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: {
          c: "c",
        },
      },
      {
        b: "b",
        a: "",
      }
    ),
    {
      a: {
        c: "c",
      },
      b: "b",
    },
    "01.14.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: {
          c: "c",
        },
      },
      {
        a: "",
      }
    ),
    {
      a: {
        c: "c",
      },
      b: "b",
    },
    "01.14.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: "",
      },
      {
        b: "b",
        a: {
          c: "c",
        },
      }
    ),
    {
      a: {
        c: "c",
      },
      b: "b",
    },
    "01.14.04"
  );
  t.end();
});

t.test("01.15 - object values are arrays and get merged", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: [
          {
            c: ["c"],
          },
          {
            d: "d",
          },
        ],
      },
      {
        a: [
          {
            c: "c",
          },
          {
            d: ["d"],
          },
        ],
      }
    ),
    {
      a: [
        {
          c: ["c"],
        },
        {
          d: ["d"],
        },
      ],
      b: "b",
    },
    "01.15.01"
  );
  t.end();
});

t.test("01.16 - object values are objects and get merged", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: {
          c: "c",
          d: ["d", "e", "f"],
        },
      },
      {
        a: {
          c: ["c", "d", "e"],
          d: "d",
        },
      }
    ),
    {
      a: {
        c: ["c", "d", "e"],
        d: ["d", "e", "f"],
      },
      b: "b",
    },
    "01.16.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: {
          c: ["c", "d", "e"],
          d: "d",
        },
      },
      {
        b: "b",
        a: {
          c: "c",
          d: ["d", "e", "f"],
        },
      }
    ),
    {
      a: {
        c: ["c", "d", "e"],
        d: ["d", "e", "f"],
      },
      b: "b",
    },
    "01.16.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: {
          d: "d",
          c: ["c", "d", "e"],
        },
      },
      {
        a: {
          d: ["d", "e", "f"],
          c: "c",
        },
      }
    ),
    {
      a: {
        c: ["c", "d", "e"],
        d: ["d", "e", "f"],
      },
      b: "b",
    },
    "01.16.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: {
          d: ["d", "e", "f"],
          c: "c",
        },
      },
      {
        b: "b",
        a: {
          d: "d",
          c: ["c", "d", "e"],
        },
      }
    ),
    {
      a: {
        c: ["c", "d", "e"],
        d: ["d", "e", "f"],
      },
      b: "b",
    },
    "01.16.04"
  );
  t.end();
});

t.test("01.17 - merging booleans", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: [
          {
            b: false,
          },
        ],
      },
      {
        a: false,
      }
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "01.17.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: false,
      },
      {
        a: [
          {
            b: false,
          },
        ],
      }
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    "01.17.02"
  );
  t.end();
});

t.test("01.18 - merging undefined", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: undefined,
      },
      {
        a: "a",
      }
    ),
    {
      a: "a",
    },
    "01.18.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: "a",
      },
      {
        a: undefined,
      }
    ),
    {
      a: "a",
    },
    "01.18.02"
  );
  t.end();
});

t.test("01.19 - merging null", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: "a",
      }
    ),
    {
      a: "a",
    },
    "01.19.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: "a",
      },
      {
        a: null,
      }
    ),
    {
      a: "a",
    },
    "01.19.02"
  );
  t.end();
});

t.test("01.20 - boolean vs boolean merge (#78)", (t) => {
  // base 2^2 combinations, default behaviour - OR logical operation
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: true,
      },
      {
        a: false,
      }
    ),
    {
      a: true,
      b: "b",
    },
    "01.20.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: false,
      },
      {
        b: "b",
        a: true,
      }
    ),
    {
      a: true,
      b: "b",
    },
    "01.20.02"
  );
  t.same(
    mergeAdvanced(
      {
        a: false,
      },
      {
        b: "b",
        a: false,
      }
    ),
    {
      a: false,
      b: "b",
    },
    "01.20.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: true,
      },
      {
        b: "b",
        a: true,
      }
    ),
    {
      a: true,
      b: "b",
    },
    "01.20.04"
  );
  // !opts.mergeBoolsUsingOrNotAnd - AND logical operation
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: true,
      },
      {
        a: false,
      },
      {
        mergeBoolsUsingOrNotAnd: false,
      }
    ),
    {
      a: false,
      b: "b",
    },
    "01.20.05"
  );
  t.same(
    mergeAdvanced(
      {
        a: false,
      },
      {
        b: "b",
        a: true,
      },
      {
        mergeBoolsUsingOrNotAnd: false,
      }
    ),
    {
      a: false,
      b: "b",
    },
    "01.20.06"
  );
  t.same(
    mergeAdvanced(
      {
        a: false,
      },
      {
        b: "b",
        a: false,
      },
      {
        mergeBoolsUsingOrNotAnd: false,
      }
    ),
    {
      a: false,
      b: "b",
    },
    "01.20.07"
  );
  t.same(
    mergeAdvanced(
      {
        a: true,
      },
      {
        b: "b",
        a: true,
      },
      {
        mergeBoolsUsingOrNotAnd: false,
      }
    ),
    {
      a: true,
      b: "b",
    },
    "01.20.08"
  );
  t.end();
});

t.test("01.21 - boolean vs undefined merge (#80)", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: true,
      },
      {
        a: undefined,
      }
    ),
    {
      a: true,
      b: "b",
    },
    "01.21.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: undefined,
      },
      {
        b: "b",
        a: true,
      }
    ),
    {
      a: true,
      b: "b",
    },
    "01.21.02"
  );
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: false,
      },
      {
        a: undefined,
      }
    ),
    {
      a: false,
      b: "b",
    },
    "01.21.03"
  );
  t.same(
    mergeAdvanced(
      {
        a: undefined,
      },
      {
        b: "b",
        a: false,
      }
    ),
    {
      a: false,
      b: "b",
    },
    "01.21.04"
  );
  t.end();
});

t.test("01.22 - null vs empty object merge (#84)", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: {},
      },
      {
        a: null,
      }
    ),
    {
      a: {},
      b: "b",
    },
    "01.22.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: null,
      },
      {
        b: "b",
        a: {},
      }
    ),
    {
      a: {},
      b: "b",
    },
    "01.22.02"
  );
  t.end();
});

t.test("01.23 - null vs. undefined (#90)", (t) => {
  t.same(
    mergeAdvanced(
      {
        b: "b",
        a: null,
      },
      {
        a: undefined,
      }
    ),
    {
      a: null,
      b: "b",
    },
    "01.23.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: undefined,
      },
      {
        b: "b",
        a: null,
      }
    ),
    {
      a: null,
      b: "b",
    },
    "01.23.02"
  );
  t.end();
});

t.test("01.24 - no clash, just filling missing values", (t) => {
  function f() {
    return null;
  }
  t.same(
    mergeAdvanced(
      {
        b: "b",
      },
      {
        a: f,
      }
    ),
    {
      a: f,
      b: "b",
    },
    "01.24.01"
  );
  t.same(
    mergeAdvanced(
      {
        a: f,
      },
      {
        b: "b",
      }
    ),
    {
      a: f,
      b: "b",
    },
    "01.24.02"
  );
  t.end();
});

t.test("01.25 - arrays and opts.ignoreKeys", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: [1, 2, 3],
      },
      {
        a: [4, 5, 6],
      },
      {
        ignoreKeys: "a",
      }
    ),
    {
      a: [1, 2, 3],
    },
    "01.25.01"
  );
  t.end();
});

t.test("01.26 - arrays and opts.ignoreKeys", (t) => {
  t.same(
    mergeAdvanced(
      {
        a: [1, 2, 3],
      },
      {
        a: [4, 5, 6],
      },
      {
        hardMergeKeys: "a",
      }
    ),
    {
      a: [4, 5, 6],
    },
    "01.26.01"
  );
  t.end();
});
