/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

tap.test("01.pt1 - finds by key in a simple object #1", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const intended = [
    {
      index: 1,
      key: "a",
      val: {
        b: "c",
      },
      path: [1],
    },
  ];
  t.strictSame(find(input, { key: "a", val: undefined }), intended, "01.01");

  // absence of the second arg:
  t.strictSame(find(input, { key: "a" }), intended, "01.02");

  // null would mean actual null being there (which is not), so it's not going to find any:
  t.strictSame(
    find(input, { key: "a", val: null }),
    null, // <---- !!!! null means no findings !!!!
    "01.03"
  );
  t.end();
});

tap.test("02.pt2 - finds by key in a simple object, with glob", (t) => {
  const input = {
    a1: {
      b1: "c1",
    },
    a2: {
      b2: "c2",
    },
    z1: {
      x1: "y1",
    },
  };
  const intended = [
    {
      index: 1,
      key: "a1",
      val: {
        b1: "c1",
      },
      path: [1],
    },
    {
      index: 3,
      key: "a2",
      val: {
        b2: "c2",
      },
      path: [3],
    },
  ];
  t.strictSame(find(input, { key: "a*", val: undefined }), intended, "02.01");

  // absence of the second arg:
  t.strictSame(find(input, { key: "a*" }), intended, "02.02");

  // null would mean actual null being there (which is not), so it's not going to find any:
  t.strictSame(
    find(input, { key: "a*", val: null }),
    null, // <---- !!!! null means no findings !!!!
    "02.03"
  );
  t.end();
});

tap.test("03.pt1 - finds by key in a simple object #2", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const intended = [
    {
      index: 2,
      key: "b",
      val: "c",
      path: [1, 2],
    },
  ];
  // second arg hardcoded null - won't find any because input has no null's:
  t.strictSame(find(input, { key: "b", val: null }), null, "03.01");

  // absence of the second arg:
  t.strictSame(find(input, { key: "b" }), intended, "03.02");

  // second arg hardcoded undefined:
  t.strictSame(find(input, { key: "b", val: undefined }), intended, "03.03");
  t.end();
});

tap.test("04.pt2 - finds by key in a simple object, with glob", (t) => {
  const input = {
    a: {
      b1: "c1",
      b2: "c2",
      z: "y",
    },
  };
  const intended = [
    {
      index: 2,
      key: "b1",
      val: "c1",
      path: [1, 2],
    },
    {
      index: 3,
      key: "b2",
      val: "c2",
      path: [1, 3],
    },
  ];
  // second arg hardcoded null - won't find any because input has no null's:
  t.strictSame(find(input, { key: "b*", val: null }), null, "04.01");

  // absence of the second arg:
  t.strictSame(find(input, { key: "b*" }), intended, "04.02");

  // second arg hardcoded undefined:
  t.strictSame(find(input, { key: "b*", val: undefined }), intended, "04.03");
  t.end();
});

tap.test("05.pt1 - does not find by key in a simple object", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = "z";
  const actual = find(input, { key });
  const intended = null;

  t.strictSame(actual, intended, "05");
  t.end();
});

tap.test("06.pt2 - does not find by key in a simple object, with glob", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = "z*";
  const actual = find(input, { key });
  const intended = null;

  t.strictSame(actual, intended, "06");
  t.end();
});

tap.test("07.pt1 - finds by key in simple arrays #1", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "a";
  const actual = find(input, { key });
  const intended = [
    {
      index: 1,
      key: "a",
      val: undefined,
      path: [1],
    },
  ];
  t.strictSame(actual, intended, "07");
  t.end();
});

tap.test("08.pt2 - finds by key in simple arrays, with glob", (t) => {
  const input = ["a", "azzz", [["b"], "c"]];
  const key = "a*";
  const actual = find(input, { key });
  const intended = [
    {
      index: 1,
      key: "a",
      val: undefined,
      path: [1],
    },
    {
      index: 2,
      key: "azzz",
      val: undefined,
      path: [2],
    },
  ];
  t.strictSame(actual, intended, "08");
  t.end();
});

tap.test("09.pt1 - finds by key in simple arrays #2", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "b";
  const actual = find(input, { key });
  const intended = [
    {
      index: 4,
      key: "b",
      val: undefined,
      path: [2, 3, 4],
    },
  ];
  t.strictSame(actual, intended, "09");
  t.end();
});

tap.test("10.pt2 - finds by key in simple arrays, with globs", (t) => {
  const input = ["a", [["zzz", "b", "bbb"], "c"]];
  const key = "b*";
  const actual = find(input, { key });
  const intended = [
    {
      index: 5,
      key: "b",
      val: undefined,
      path: [2, 3, 5],
    },
    {
      index: 6,
      key: "bbb",
      val: undefined,
      path: [2, 3, 6],
    },
  ];
  t.strictSame(actual, intended, "10");
  t.end();
});

tap.test("11.pt1 - finds by key in simple arrays #3", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "c";
  const actual = find(input, { key, val: undefined });
  const intended = [
    {
      index: 5,
      key: "c",
      val: undefined,
      path: [2, 5],
    },
  ];
  t.strictSame(actual, intended, "11");
  t.end();
});

tap.test("12.pt2 - finds by key in simple arrays, with glob", (t) => {
  const input = ["apples", [["hackles"], "crackles"]];
  const key = "*ackles";
  const actual = find(input, { key, val: undefined });
  const intended = [
    {
      index: 4,
      key: "hackles",
      val: undefined,
      path: [2, 3, 4],
    },
    {
      index: 5,
      key: "crackles",
      val: undefined,
      path: [2, 5],
    },
  ];
  t.strictSame(actual, intended, "12");
  t.end();
});

tap.test("13.pt1 - does not find by key in simple arrays", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "d";
  const actual = find(input, { key });
  const intended = null;
  t.strictSame(actual, intended, "13");
  t.end();
});

tap.test("14.pt2 - does not find by key in simple arrays, with globs", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "lexicographer*";
  const actual = find(input, { key });
  const intended = null;
  t.strictSame(actual, intended, "14");
  t.end();
});

tap.test("15 - finds by key in simple arrays #3", (t) => {
  const input = ["a", [["b"], "c"]];
  const key = "c";
  const actual = find(input, { key });
  const intended = [
    {
      index: 5,
      key: "c",
      val: undefined,
      path: [2, 5],
    },
  ];
  t.strictSame(actual, intended, "15");
  t.end();
});

tap.test("16 - finds by value in a simple object - string", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = null;
  const val = "c";
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: "c",
      path: [1, 2],
    },
  ];
  t.strictSame(actual, intended, "16");
  t.end();
});

tap.test("17.pt1 - finds by value in a simple object - object", (t) => {
  const input = {
    a: {
      b: "c",
    },
  };
  const key = null;
  const val = { b: "c" };
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 1,
      key: "a",
      val: { b: "c" },
      path: [1],
    },
  ];
  t.strictSame(actual, intended, "17");
  t.end();
});

tap.test(
  "18.pt2 - finds by value in a simple object - object, with globs",
  (t) => {
    const input = {
      a: {
        b: "c1",
      },
      k: {
        b: "c2",
      },
      z: {
        x: "y",
      },
    };
    const key = null;
    const val = { b: "c*" };
    const actual = find(input, { key, val });
    const intended = [
      {
        index: 1,
        key: "a",
        val: { b: "c1" },
        path: [1],
      },
      {
        index: 3,
        key: "k",
        val: { b: "c2" },
        path: [3],
      },
    ];
    t.strictSame(actual, intended, "18");
    t.end();
  }
);

tap.test("19 - finds by value in a simple object - array", (t) => {
  const input = {
    a: {
      b: ["c"],
    },
  };
  const key = null;
  const val = ["c"];
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: ["c"],
      path: [1, 2],
    },
  ];
  t.strictSame(actual, intended, "19");
  t.end();
});

tap.test("20 - finds by value in a simple object - empty array", (t) => {
  const input = {
    a: {
      b: [],
      c: [],
    },
  };
  const key = null;
  const val = [];
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: [],
      path: [1, 2],
    },
    {
      index: 3,
      key: "c",
      val: [],
      path: [1, 3],
    },
  ];
  t.strictSame(actual, intended, "20");
  t.end();
});

tap.test("21 - finds by value in a simple object - empty object", (t) => {
  const input = {
    a: {
      b: {},
      c: {},
    },
  };
  const key = null;
  const val = {};
  const actual = find(input, { key, val });
  const intended = [
    {
      index: 2,
      key: "b",
      val: {},
      path: [1, 2],
    },
    {
      index: 3,
      key: "c",
      val: {},
      path: [1, 3],
    },
  ];
  t.strictSame(actual, intended, "21");
  t.end();
});

tap.test(
  "22 - finds multiple nested keys by key and value in mixed #1",
  (t) => {
    const input = {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: "e" },
    };
    const key = "c";
    const val = { d: "e" };
    const actual = find(input, { key, val });
    const intended = [
      {
        index: 4,
        key: "c",
        val: {
          d: "e",
        },
        path: [1, 2, 3, 4],
      },
      {
        index: 6,
        key: "c",
        val: {
          d: "e",
        },
        path: [6],
      },
    ];
    t.strictSame(actual, intended, "22");
    t.end();
  }
);

tap.test(
  "23 - finds multiple nested keys by key and value in mixed #2",
  (t) => {
    const input = {
      a: { b: [{ c: { d: "e" } }] },
      c: { d: ["d"] },
    };
    // ---------------------------
    t.strictSame(
      find(input, { key: "d", val: null }),
      null,
      "23.01 - Null is a valid value! It's not found in the input!"
    );
    // ---------------------------
    t.strictSame(
      find(input, { key: "d", val: undefined }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "23.02 - hardcoded undefined as a value"
    );
    // ---------------------------
    t.strictSame(
      find(input, { key: "d" }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "23.03 - default behaviour, val is not hardcoded - should be the same as null"
    );
    // ---------------------------
    // arrays only:
    t.strictSame(
      find(input, { key: "d", only: "arrays" }),
      [
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "23.04 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // objects only:
    t.strictSame(
      find(input, { key: "d", only: "objects" }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
      ],
      "23.05 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // any:
    t.strictSame(
      find(input, { key: "d", only: "whatever" }),
      [
        {
          index: 5,
          key: "d",
          val: "e",
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "23.06 - finds only array instances and omits object-ones"
    );
    t.end();
  }
);

tap.test(
  "24 - like 02.15, but with sneaky objects where values are null, tricking the algorithm",
  (t) => {
    const input = {
      a: { b: [{ c: { d: null } }] },
      c: { d: ["d"] },
    };
    // ---------------------------
    t.strictSame(
      find(input, { key: "d", val: undefined }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "24.01 - default behaviour, val is hardcoded `undefined`"
    );
    // ---------------------------
    t.strictSame(
      find(input, { key: "d" }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "24.02 - default behaviour, val is not hardcoded - should be the same as null"
    );
    // ---------------------------
    // arrays only:
    t.strictSame(
      find(input, { key: "d", only: "arrays" }),
      [
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "24.03 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // objects only:
    t.strictSame(
      find(input, { key: "d", only: "objects" }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
      ],
      "24.04 - finds only array instances and omits object-ones"
    );
    // ---------------------------
    // any:
    t.strictSame(
      find(input, { key: "d", only: "whatever" }),
      [
        {
          index: 5,
          key: "d",
          val: null,
          path: [1, 2, 3, 4, 5],
        },
        {
          index: 7,
          key: "d",
          val: ["d"],
          path: [6, 7],
        },
        {
          index: 8,
          key: "d",
          val: undefined,
          path: [6, 7, 8],
        },
      ],
      "24.05 - finds only array instances and omits object-ones"
    );
    t.end();
  }
);
