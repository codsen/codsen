/* eslint-disable @typescript-eslint/no-unused-vars */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm.js";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

test("01.pt1 - finds by key in a simple object #1", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let intended = [
    {
      index: 1,
      key: "a",
      val: {
        b: "c",
      },
      path: [1],
    },
  ];
  equal(find(input, { key: "a", val: undefined }), intended, "01.01");

  // absence of the second arg:
  equal(find(input, { key: "a" }), intended, "01.02");

  // null would mean actual null being there (which is not), so it's not going to find any:
  equal(find(input, { key: "a", val: null }), [], "01.03");
});

test("02.pt2 - finds by key in a simple object, with glob", () => {
  let input = {
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
  let intended = [
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
  equal(find(input, { key: "a*", val: undefined }), intended, "02.01");

  // absence of the second arg:
  equal(find(input, { key: "a*" }), intended, "02.02");

  // null would mean actual null being there (which is not), so it's not going to find any:
  equal(find(input, { key: "a*", val: null }), [], "02.03");
});

test("03.pt1 - finds by key in a simple object #2", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let intended = [
    {
      index: 2,
      key: "b",
      val: "c",
      path: [1, 2],
    },
  ];
  // second arg hardcoded null - won't find any because input has no null's:
  equal(find(input, { key: "b", val: null }), [], "03.01");

  // absence of the second arg:
  equal(find(input, { key: "b" }), intended, "03.02");

  // second arg hardcoded undefined:
  equal(find(input, { key: "b", val: undefined }), intended, "03.03");
});

test("04.pt2 - finds by key in a simple object, with glob", () => {
  let input = {
    a: {
      b1: "c1",
      b2: "c2",
      z: "y",
    },
  };
  let intended = [
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
  equal(find(input, { key: "b*", val: null }), [], "04.01");

  // absence of the second arg:
  equal(find(input, { key: "b*" }), intended, "04.02");

  // second arg hardcoded undefined:
  equal(find(input, { key: "b*", val: undefined }), intended, "04.03");
});

test("05.pt1 - does not find by key in a simple object", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let key = "z";
  let actual = find(input, { key });
  let intended = [];

  equal(actual, intended, "05.01");
});

test("06.pt2 - does not find by key in a simple object, with glob", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let key = "z*";
  let actual = find(input, { key });
  let intended = [];

  equal(actual, intended, "06.01");
});

test("07.pt1 - finds by key in simple arrays #1", () => {
  let input = ["a", [["b"], "c"]];
  let key = "a";
  let actual = find(input, { key });
  let intended = [
    {
      index: 1,
      key: "a",
      val: undefined,
      path: [1],
    },
  ];
  equal(actual, intended, "07.01");
});

test("08.pt2 - finds by key in simple arrays, with glob", () => {
  let input = ["a", "azzz", [["b"], "c"]];
  let key = "a*";
  let actual = find(input, { key });
  let intended = [
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
  equal(actual, intended, "08.01");
});

test("09.pt1 - finds by key in simple arrays #2", () => {
  let input = ["a", [["b"], "c"]];
  let key = "b";
  let actual = find(input, { key });
  let intended = [
    {
      index: 4,
      key: "b",
      val: undefined,
      path: [2, 3, 4],
    },
  ];
  equal(actual, intended, "09.01");
});

test("10.pt2 - finds by key in simple arrays, with globs", () => {
  let input = ["a", [["zzz", "b", "bbb"], "c"]];
  let key = "b*";
  let actual = find(input, { key });
  let intended = [
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
  equal(actual, intended, "10.01");
});

test("11.pt1 - finds by key in simple arrays #3", () => {
  let input = ["a", [["b"], "c"]];
  let key = "c";
  let actual = find(input, { key, val: undefined });
  let intended = [
    {
      index: 5,
      key: "c",
      val: undefined,
      path: [2, 5],
    },
  ];
  equal(actual, intended, "11.01");
});

test("12.pt2 - finds by key in simple arrays, with glob", () => {
  let input = ["apples", [["hackles"], "crackles"]];
  let key = "*ackles";
  let actual = find(input, { key, val: undefined });
  let intended = [
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
  equal(actual, intended, "12.01");
});

test("13.pt1 - does not find by key in simple arrays", () => {
  let input = ["a", [["b"], "c"]];
  let key = "d";
  let actual = find(input, { key });
  let intended = [];
  equal(actual, intended, "13.01");
});

test("14.pt2 - does not find by key in simple arrays, with globs", () => {
  let input = ["a", [["b"], "c"]];
  let key = "lexicographer*";
  let actual = find(input, { key });
  let intended = [];
  equal(actual, intended, "14.01");
});

test("15 - finds by key in simple arrays #3", () => {
  let input = ["a", [["b"], "c"]];
  let key = "c";
  let actual = find(input, { key });
  let intended = [
    {
      index: 5,
      key: "c",
      val: undefined,
      path: [2, 5],
    },
  ];
  equal(actual, intended, "15.01");
});

test("16 - finds by value in a simple object - string", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let key = null;
  let val = "c";
  let actual = find(input, { key, val });
  let intended = [
    {
      index: 2,
      key: "b",
      val: "c",
      path: [1, 2],
    },
  ];
  equal(actual, intended, "16.01");
});

test("17.pt1 - finds by value in a simple object - object", () => {
  let input = {
    a: {
      b: "c",
    },
  };
  let key = null;
  let val = { b: "c" };
  let actual = find(input, { key, val });
  let intended = [
    {
      index: 1,
      key: "a",
      val: { b: "c" },
      path: [1],
    },
  ];
  equal(actual, intended, "17.01");
});

test("18.pt2 - finds by value in a simple object - object, with globs", () => {
  let input = {
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
  let key = null;
  let val = { b: "c*" };
  let actual = find(input, { key, val });
  let intended = [
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
  equal(actual, intended, "18.01");
});

test("19 - finds by value in a simple object - array", () => {
  let input = {
    a: {
      b: ["c"],
    },
  };
  let key = null;
  let val = ["c"];
  let actual = find(input, { key, val });
  let intended = [
    {
      index: 2,
      key: "b",
      val: ["c"],
      path: [1, 2],
    },
  ];
  equal(actual, intended, "19.01");
});

test("20 - finds by value in a simple object - empty array", () => {
  let input = {
    a: {
      b: [],
      c: [],
    },
  };
  let key = null;
  let val = [];
  let actual = find(input, { key, val });
  let intended = [
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
  equal(actual, intended, "20.01");
});

test("21 - finds by value in a simple object - empty object", () => {
  let input = {
    a: {
      b: {},
      c: {},
    },
  };
  let key = null;
  let val = {};
  let actual = find(input, { key, val });
  let intended = [
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
  equal(actual, intended, "21.01");
});

test("22 - finds multiple nested keys by key and value in mixed #1", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    c: { d: "e" },
  };
  let key = "c";
  let val = { d: "e" };
  let actual = find(input, { key, val });
  let intended = [
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
  equal(actual, intended, "22.01");
});

test("23 - finds multiple nested keys by key and value in mixed #2", () => {
  let input = {
    a: { b: [{ c: { d: "e" } }] },
    c: { d: ["d"] },
  };
  // ---------------------------
  equal(find(input, { key: "d", val: null }), [], "23.01");
  // ---------------------------
  equal(
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
    "23.02",
  );
  // ---------------------------
  equal(
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
    "23.03",
  );
  // ---------------------------
  // arrays only:
  equal(
    find(input, { key: "d", only: "arrays" }),
    [
      {
        index: 8,
        key: "d",
        val: undefined,
        path: [6, 7, 8],
      },
    ],
    "23.04",
  );
  // ---------------------------
  // objects only:
  equal(
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
    "23.05",
  );
  // ---------------------------
  // any:
  equal(
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
    "23.06",
  );
});

test("24 - like 02.15, but with sneaky objects where values are null, tricking the algorithm", () => {
  let input = {
    a: { b: [{ c: { d: null } }] },
    c: { d: ["d"] },
  };
  // ---------------------------
  equal(
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
    "24.01",
  );
  // ---------------------------
  equal(
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
    "24.02",
  );
  // ---------------------------
  // arrays only:
  equal(
    find(input, { key: "d", only: "arrays" }),
    [
      {
        index: 8,
        key: "d",
        val: undefined,
        path: [6, 7, 8],
      },
    ],
    "24.03",
  );
  // ---------------------------
  // objects only:
  equal(
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
    "24.04",
  );
  // ---------------------------
  // any:
  equal(
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
    "24.05",
  );
});

test.run();
