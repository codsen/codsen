/* eslint max-len:0 */

import tap from "tap";
// import clone from "lodash.clonedeep";
import mergeAdvanced from "../dist/object-merge-advanced.esm";
// import equal from "deep-equal";

tap.test(
  "17.01 - \u001b[33mOPTS\u001b[39m - opts.useNullAsExplicitFalse, simple merges",
  (t) => {
    //
    // ===
    // ===  PART 1. Baseline.
    // ===

    // So, first let's establish the default behaviour
    t.same(
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
      "17.01.01.01 - control, case #79 - false. Null is lower in rank than any Boolean."
    );
    t.same(
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
      "17.01.01.02 - control, case #79 - true. Null is lower in rank than any Boolean."
    );

    // ===

    t.same(
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
      "17.01.02.01 - control, case #88 - false"
    );
    t.same(
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
      "17.01.02.02 - control, case #88 - true"
    );

    // ===
    // ===  PART 2. Real deal.
    // ===

    // Onto the null-as-explicit-false mode then.

    t.same(
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
      "17.01.03.01 - null-as-explicit-false, case #79 - false"
    );
    t.same(
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
      "17.01.03.02 - null-as-explicit-false, case #79 - true"
    );

    // ===

    t.same(
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
      "17.01.04.01 - null-as-explicit-false, case #88 - false"
    );
    t.same(
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
      "17.01.04.02 - null-as-explicit-false, case #88 - true"
    );
    t.end();
  }
);

tap.test(
  "17.02 - \u001b[33mOPTS\u001b[39m - opts.useNullAsExplicitFalse, null vs. non-Booleans, cases #81-90",
  (t) => {
    t.same(
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
      "17.02.01 - #81 - null vs non-empty array"
    );
    t.same(
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
      "17.02.02 - #82 - null vs. empty array"
    );
    t.same(
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
      "17.02.03 - #83 - null vs. non-empty plain object"
    );
    t.same(
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
      "17.02.04 - #84 - null vs. empty plain object"
    );
    t.same(
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
      "17.02.05 - #85 - null vs. non-empty string"
    );
    t.same(
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
      "17.02.06 - #86 - null vs. non-empty string"
    );
    t.same(
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
      "17.02.07 - #87 - null vs. num"
    );
    t.same(
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
      "17.02.08.01 - #88 - null vs. bool, true"
    );
    t.same(
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
      "17.02.08.02 - #88 - null vs. bool, false"
    );
    t.same(
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
      "17.02.09 - #89 - null vs. null"
    );
    t.same(
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
      "17.02.10 - #90 - null vs. null"
    );
    t.end();
  }
);

tap.test(
  "17.03 - \u001b[33mOPTS\u001b[39m - opts.useNullAsExplicitFalse, non-Booleans vs. null, cases #9, 19, 29, 39, 49...99",
  (t) => {
    t.same(
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
      "17.03.01 - #9 - null vs non-empty array"
    );
    t.same(
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
      "17.03.02 - #19 - null vs. empty array"
    );
    t.same(
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
      "17.03.03 - #29 - null vs. non-empty plain object"
    );
    t.same(
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
      "17.03.04 - #39 - null vs. empty plain object"
    );
    t.same(
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
      "17.03.05 - #49 - null vs. non-empty string"
    );
    t.same(
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
      "17.03.06 - #59 - null vs. non-empty string"
    );
    t.same(
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
      "17.03.07 - #69 - null vs. num"
    );
    t.same(
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
      "17.03.08.01 - #79 - null vs. bool, true"
    );
    t.same(
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
      "17.03.08.02 - #79 - null vs. bool, false"
    );
    t.same(
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
      "17.03.09 - #89 - null vs. null"
    );
    t.same(
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
      "17.03.10 - #99 - null vs. null"
    );
    t.end();
  }
);

tap.test(
  "17.04 - \u001b[33mOPTS\u001b[39m - opts.hardConcatKeys - basic cases",
  (t) => {
    t.same(
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
      "17.04.01"
    );
    t.same(
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
      "17.04.02"
    );
    t.same(
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
      "17.04.03"
    );
    t.same(
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
      "17.04.03"
    );
    t.end();
  }
);
