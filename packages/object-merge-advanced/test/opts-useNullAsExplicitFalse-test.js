/* eslint max-len:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import clone from "lodash.clonedeep";
import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";
// import equal from "deep-equal";

test("01 - \u001b[33mOPTS\u001b[39m - opts.useNullAsExplicitFalse, simple merges", () => {
  //
  // ===
  // ===  PART 1. Baseline.
  // ===

  // So, first let's establish the default behaviour
  equal(
    mergeAdvanced(
      {
        a: false,
      },
      {
        a: null,
      }
    ),
    {
      a: false,
    },
    "01.01 - control, case #79 - false. Null is lower in rank than any Boolean."
  );
  equal(
    mergeAdvanced(
      {
        a: true,
      },
      {
        a: null,
      }
    ),
    {
      a: true,
    },
    "01.02 - control, case #79 - true. Null is lower in rank than any Boolean."
  );

  // ===

  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: false,
      }
    ),
    {
      a: false,
    },
    "01.03 - control, case #88 - false"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: true,
      }
    ),
    {
      a: true,
    },
    "01.04 - control, case #88 - true"
  );

  // ===
  // ===  PART 2. Real deal.
  // ===

  // Onto the null-as-explicit-false mode then.

  equal(
    mergeAdvanced(
      {
        a: false,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "01.05 - null-as-explicit-false, case #79 - false"
  );
  equal(
    mergeAdvanced(
      {
        a: true,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "01.06 - null-as-explicit-false, case #79 - true"
  );

  // ===

  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: false,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "01.07 - null-as-explicit-false, case #88 - false"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: true,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "01.08 - null-as-explicit-false, case #88 - true"
  );
});

test("02 - \u001b[33mOPTS\u001b[39m - opts.useNullAsExplicitFalse, null vs. non-Booleans, cases #81-90", () => {
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: ["a"],
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.01 - #81 - null vs non-empty array"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: [],
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.02 - #82 - null vs. empty array"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: { b: "c" },
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.03 - #83 - null vs. non-empty plain object"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: {},
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.04 - #84 - null vs. empty plain object"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: "zzz",
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.05 - #85 - null vs. non-empty string"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: "",
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.06 - #86 - null vs. non-empty string"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: 1,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.07 - #87 - null vs. num"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: true,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.08 - #88 - null vs. bool, true"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: false,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.09 - #88 - null vs. bool, false"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.10 - #89 - null vs. null"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: undefined,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "02.11 - #90 - null vs. null"
  );
});

test("03 - \u001b[33mOPTS\u001b[39m - opts.useNullAsExplicitFalse, non-Booleans vs. null, cases #9, 19, 29, 39, 49...99", () => {
  equal(
    mergeAdvanced(
      {
        a: ["a"],
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.01 - #9 - null vs non-empty array"
  );
  equal(
    mergeAdvanced(
      {
        a: [],
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.02 - #19 - null vs. empty array"
  );
  equal(
    mergeAdvanced(
      {
        a: { b: "c" },
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.03 - #29 - null vs. non-empty plain object"
  );
  equal(
    mergeAdvanced(
      {
        a: {},
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.04 - #39 - null vs. empty plain object"
  );
  equal(
    mergeAdvanced(
      {
        a: "zzz",
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.05 - #49 - null vs. non-empty string"
  );
  equal(
    mergeAdvanced(
      {
        a: "",
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.06 - #59 - null vs. non-empty string"
  );
  equal(
    mergeAdvanced(
      {
        a: 1,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.07 - #69 - null vs. num"
  );
  equal(
    mergeAdvanced(
      {
        a: true,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.08 - #79 - null vs. bool, true"
  );
  equal(
    mergeAdvanced(
      {
        a: false,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.09 - #79 - null vs. bool, false"
  );
  equal(
    mergeAdvanced(
      {
        a: null,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.10 - #89 - null vs. null"
  );
  equal(
    mergeAdvanced(
      {
        a: undefined,
      },
      {
        a: null,
      },
      {
        useNullAsExplicitFalse: true,
      }
    ),
    {
      a: null,
    },
    "03.11 - #99 - null vs. null"
  );
});

test("04 - \u001b[33mOPTS\u001b[39m - opts.hardConcatKeys - basic cases", () => {
  equal(
    mergeAdvanced(
      {
        a: [0, 1, 2],
      },
      {
        a: [3, 4, 5],
      },
      {
        hardArrayConcatKeys: ["a"],
      }
    ),
    {
      a: [0, 1, 2, 3, 4, 5],
    },
    "04.01"
  );
  equal(
    mergeAdvanced(
      {
        a: [{ a: 0 }, { a: 1 }, { a: 2 }],
      },
      {
        a: [{ a: 0 }, { a: 1 }, { a: 2 }],
      },
      {
        hardArrayConcatKeys: ["a"],
      }
    ),
    {
      a: [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 0 }, { a: 1 }, { a: 2 }],
    },
    "04.02"
  );
  equal(
    mergeAdvanced(
      {
        a: [1, 2, 3],
        b: [1, 2, 3],
        c: [{ a: 1 }, { a: 2 }, { a: 3 }],
      },
      {
        a: [4, 5, 6],
        b: [4, 5, 6],
        c: [{ a: 4 }, { a: 5 }, { a: 6 }],
      },
      {
        hardArrayConcatKeys: ["a"],
      }
    ),
    {
      a: [1, 2, 3, 4, 5, 6],
      b: [1, 4, 2, 5, 3, 6], // no objects, so an "orderer" concat happend
      c: [{ a: 4 }, { a: 5 }, { a: 6 }], // objects so
    },
    "04.03"
  );
  equal(
    mergeAdvanced(
      {
        a: [1, 2, 3],
        b: [1, 2, 3],
        c: [{ a: 1 }, { a: 2 }, { a: 3 }],
      },
      {
        a: [4, 5, 6],
        b: [4, 5, 6],
        c: [{ a: 4 }, { a: 5 }, { a: 6 }],
      },
      {
        hardArrayConcat: true,
      }
    ),
    {
      a: [1, 2, 3, 4, 5, 6],
      b: [1, 2, 3, 4, 5, 6],
      c: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }], // objects so
    },
    "04.04"
  );
});

test.run();
