/* eslint-disable no-multi-str */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

// ==============================
// One-level plain objects
// ==============================

test("01 - delete a value which is string", () => {
  let actual = deleteKey(
    {
      a: "a",
      b: "b",
    },
    {
      key: "b",
      val: "b",
    },
  );
  let intended = {
    a: "a",
  };

  equal(actual, intended, "01.01");
});

test("02 - delete a value which is plain object", () => {
  let actual = deleteKey(
    {
      a: "a",
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
    },
  );
  let intended = {
    a: "a",
  };

  equal(actual, intended, "02.01");
});

test("03 - delete two values, plain objects, cleanup=false", () => {
  let actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: false,
    },
  );
  let intended = {
    a: { e: [{}] },
  };

  equal(actual, intended, "03.01");
});

test("04 - delete two values, plain objects, cleanup=true", () => {
  let actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: true,
    },
  );
  let intended = {};

  equal(actual, intended, "04.01");
});

test("05 - delete two values which are plain objects (on default)", () => {
  let actual = deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
    },
  );
  let intended = {};

  equal(actual, intended, "05.01");
});

test("06 - delete a value which is an array", () => {
  let actual = deleteKey(
    {
      a: "a",
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
    },
  );
  let intended = {
    a: "a",
  };

  equal(actual, intended, "06.01");
});

test("07 - delete two values which are arrays, cleanup=false", () => {
  let actual = deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
      cleanup: false,
    },
  );
  let intended = {
    a: { e: [{}] },
  };

  equal(actual, intended, "07.01");
});

test("08 - delete two values which are arrays, cleanup=default", () => {
  let actual = deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
    },
  );
  let intended = {};

  equal(actual, intended, "08.01");
});

// ==============================
// Omit value to target all keys
// ==============================

test("09 - simple plain object, couple instances found", () => {
  let source = {
    a: "a",
    b: "whatever",
    c: [{ b: "whatever as well" }],
  };
  equal(
    deleteKey(source, {
      key: "b",
    }),
    {
      a: "a",
    },
    "09.01",
  );
  equal(
    deleteKey(source, {
      key: "b",
      only: "o", // object
    }),
    {
      a: "a",
    },
    "09.02",
  );
  equal(
    deleteKey(source, {
      key: "b",
      only: "a", // array
    }),
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever as well" }],
    },
    "09.03",
  );
  equal(
    deleteKey(source, {
      key: "b",
      only: "any", // same behaviour as defaults
    }),
    {
      a: "a",
    },
    "09.04",
  );

  // ensure no mutation happened:
  equal(
    source,
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever as well" }],
    },
    "09.05",
  );
});

test("10 - simple plain object, cleanup", () => {
  equal(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: ["a"],
      },
      {
        key: "a",
        only: "array",
      },
    ),
    {
      a: "a",
      b: "whatever",
    },
    "10.01",
  );
  equal(
    deleteKey(
      {
        a: "a",
        b: "whatever",
        c: ["a"],
      },
      {
        key: "a",
        only: "object",
      },
    ),
    {
      b: "whatever",
      c: ["a"],
    },
    "10.02",
  );
  equal(
    deleteKey(
      {
        a: "apples",
        b: "whatever",
        c: ["chapels"],
      },
      {
        key: "*s",
        only: "a", // only target arrays
      },
    ),
    {
      a: "apples",
      b: "whatever",
    },
    "10.03",
  );
  equal(
    deleteKey(
      {
        a: "apples",
        b: "whatever",
        c: ["chapels"],
      },
      {
        key: "*s",
        only: "a", // only target arrays
        cleanup: false,
      },
    ),
    {
      a: "apples",
      b: "whatever",
      c: [],
    },
    "10.04",
  );
});

test("11 - nested array/plain objects, multiple instances found", () => {
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
      },
    ),
    [{ a: "a" }],
    "11.01",
  );
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
        only: "object",
      },
    ),
    [{ a: "a" }],
    "11.02",
  );
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
        only: "array",
      },
    ),
    [
      {
        a: "a",
        b: "delete this key",
        c: [{ b: "and this as well" }],
      },
      {
        b: ["and this key too", "together with this"],
        d: { e: { f: { g: { b: "and this, no matter how deep-nested" } } } },
      },
    ],
    "11.03",
  );
});

test("12 - nested array/plain objects, multiple instances found, false", () => {
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: [{ b: "and this as well" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: { f: { g: { b: "and this, no matter how deep-nested" } } },
          },
        },
      ],
      {
        key: "b",
        cleanup: false,
      },
    ),
    [
      {
        a: "a",
        c: [{}],
      },
      {
        d: { e: { f: { g: {} } } },
      },
    ],
    "12.01",
  );
});

test("13 - mixed array and object findings", () => {
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
      },
    ),
    [{ a: "a" }],
    "13.01",
  );
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
        only: "whatever",
      },
    ),
    [{ a: "a" }],
    "13.02",
  );
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
      ],
      {
        key: "b",
        only: "object",
      },
    ),
    [
      {
        a: "a",
        c: ["b", "b"],
      },
    ],
    "13.03",
  );
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
        only: "arrays",
      },
    ),
    [
      {
        a: "a",
        b: "delete this key",
        c: [{ b: "d" }],
      },
      {
        b: ["and this key too", "together with this"],
        d: { e: { f: { g: [{ b: "and this, no matter how deep-nested" }] } } },
      },
    ],
    "13.04",
  );
  equal(
    deleteKey(
      [
        {
          a: "a",
          b: "delete this key",
          c: ["b", "b", { b: "d" }],
        },
        {
          b: ["and this key too", "together with this"],
          d: {
            e: {
              f: { g: ["b", { b: "and this, no matter how deep-nested" }] },
            },
          },
        },
      ],
      {
        key: "b",
        only: "object",
      },
    ),
    [
      {
        a: "a",
        c: ["b", "b"],
      },
      {
        d: { e: { f: { g: ["b"] } } },
      },
    ],
    "13.05",
  );
});

// ==============================
// Omit key to target all keys with a given value
// ==============================

test("14 - targets all keys by value, cleanup=true", () => {
  let actual = deleteKey(
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever" }],
    },
    {
      val: "whatever",
    },
  );
  let intended = {
    a: "a",
  };

  equal(actual, intended, "14.01");
});

test("15 - targets all keys by value, cleanup=false", () => {
  let actual = deleteKey(
    {
      a: "a",
      b: "whatever",
      c: [{ b: "whatever" }],
    },
    {
      val: "whatever",
      cleanup: false,
    },
  );
  let intended = {
    a: "a",
    c: [{}],
  };

  equal(actual, intended, "15.01");
});

// ======================================
// Carcasses cleanup functionality checks
// ======================================

// v2.0+
// empty tag's parent will be deleted just if it does not have any non-empty values in other keys
// in the following case, key "d" is deleted because it's dead branch.
// But once we go "upstream" from "d" to higher, we don't touch "cousin" key "b":
test('16 - deletion limited to level where non-empty "uncles" exist', () => {
  let actual = deleteKey(
    {
      a: "a",
      b: [[{}]],
      c: "c",
      d: {
        e: "",
      },
    },
    {
      key: "e",
      val: "",
      cleanup: true,
    },
  );
  let intended = {
    a: "a",
    b: [[{}]],
    c: "c",
  };

  equal(actual, intended, "16.01");
});

test("17 - deletion of empty things is limited in arrays too", () => {
  let actual = deleteKey(
    [
      [
        {
          a: "",
        },
      ],
      {},
      {
        b: "b",
      },
      ["c"],
    ],
    {
      key: "a",
      val: "",
      cleanup: true,
    },
  );
  let intended = [
    {},
    {
      b: "b",
    },
    ["c"],
  ];

  equal(actual, intended, "17.01");
});

// ==============================
// Throws
// ==============================

test("18 - both key and value missing - throws", () => {
  throws(
    () => {
      deleteKey({ a: "a" }, {});
    },
    /THROW_ID_04/,
    "18.01",
  );
});

test("19 - nonsensical options object - throws", () => {
  throws(
    () => {
      deleteKey({ a: "a" }, { z: "z" });
    },
    /THROW_ID_04/,
    "19.01",
  );
});

test("20 - nonsensical options object - throws", () => {
  throws(
    () => {
      deleteKey({ a: "a" }, 1);
    },
    /THROW_ID_04/,
    "20.01",
  );
});

test("21 - no input args - throws", () => {
  throws(
    () => {
      deleteKey();
    },
    /THROW_ID_01/,
    "21.01",
  );
});

test("22 - wrong input args - throws", () => {
  throws(
    () => {
      deleteKey(
        { a: "a" },
        {
          key: 1,
          val: null,
          cleanup: true,
        },
      );
    },
    /opts\.key/g,
    "22.01",
  );
});

test("23 - wrong input args - throws", () => {
  throws(
    () => {
      deleteKey(
        { a: "a" },
        {
          key: 1,
          val: null,
          cleanup: "zzz",
        },
      );
    },
    /opts\.key/,
    "23.01",
  );
});

// ==============================
// Tests on real HTML
// ==============================

test("24 - real parsed HTML #1", () => {
  let actual = deleteKey(
    [
      "<!DOCTYPE html>",
      {
        tag: "html",
        attrs: {
          lang: "en",
        },
        content: [
          {
            tag: "head",
            content: [
              {
                tag: "div",
              },
            ],
          },
          {
            tag: "body",
            content: [
              {
                tag: "table",
                attrs: {
                  class: "",
                  width: "100%",
                  border: "0",
                  cellpadding: "0",
                  cellspacing: "0",
                },
                content: [
                  {
                    tag: "tr",
                    content: [
                      {
                        tag: "td",
                        attrs: {
                          class: "",
                        },
                        content: [
                          {
                            tag: "img",
                            attrs: {
                              src: "spacer.gif",
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    {
      key: "class",
      val: "",
    },
  );
  let intended = [
    "<!DOCTYPE html>",
    {
      tag: "html",
      attrs: {
        lang: "en",
      },
      content: [
        {
          tag: "head",
          content: [
            {
              tag: "div",
            },
          ],
        },
        {
          tag: "body",
          content: [
            {
              tag: "table",
              attrs: {
                width: "100%",
                border: "0",
                cellpadding: "0",
                cellspacing: "0",
              },
              content: [
                {
                  tag: "tr",
                  content: [
                    {
                      tag: "td",
                      content: [
                        {
                          tag: "img",
                          attrs: {
                            src: "spacer.gif",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  equal(actual, intended, "24.01");
});

test("25 - real parsed HTML #2", () => {
  let actual = deleteKey(
    [
      {
        tag: "table",
        attrs: {
          class: "",
          width: "100%",
        },
      },
    ],
    {
      key: "class",
      val: "",
    },
  );
  let intended = [
    {
      tag: "table",
      attrs: {
        width: "100%",
      },
    },
  ];
  equal(actual, intended, "25.01");
});

test("26 - real parsed HTML #3", () => {
  let actual = deleteKey(
    {
      a: {
        b: "",
        c: "d",
        e: "f",
      },
    },
    {
      key: "b",
      val: "",
      cleanup: false,
    },
  );
  let intended = {
    a: {
      c: "d",
      e: "f",
    },
  };
  equal(actual, intended, "26.01");
});

test("27 - real parsed HTML #4", () => {
  let actual = deleteKey(
    {
      a: {
        b: "",
        c: "d",
      },
    },
    {
      key: "b",
      val: "",
      cleanup: true,
    },
  );
  let intended = {
    a: {
      c: "d",
    },
  };
  equal(actual, intended, "27.01");
});

// ======================================
// Prove input args are not being mutated
// ======================================

test("28 - does not mutate input args", () => {
  let obj1 = {
    a: "a",
    b: "b",
  };
  let unneededRes = deleteKey(obj1, {
    key: "b",
    val: "b",
  });
  ok(unneededRes, "28.01"); // dummy to prevent JS Standard swearing
  equal(
    obj1,
    {
      a: "a",
      b: "b",
    },
    "28.02",
  ); // real deal
});

// ===============
// Tests on arrays
// ===============

test("29 - delete a value which is empty string", () => {
  let actual = deleteKey(
    {
      a: ["b", "", "c"],
    },
    {
      key: "",
    },
  );
  let intended = {
    a: ["b", "c"],
  };

  equal(actual, intended, "29.01");
});

test("30 - delete a value which is non-empty string", () => {
  let actual = deleteKey(
    {
      a: ["b", "", "c", "b"],
    },
    {
      key: "b",
    },
  );
  let intended = {
    a: ["", "c"],
  };

  equal(actual, intended, "30.01");
});

test("31 - delete a value which is non-empty string, with wildcards", () => {
  let actual = deleteKey(
    {
      a: ["beep", "", "c", "boop"],
    },
    {
      key: "b*p",
    },
  );
  let intended = {
    a: ["", "c"],
  };

  equal(actual, intended, "31.01");
});

test("32 - delete a value which is a non-empty string, with wildcards, only on arrays", () => {
  let actual = deleteKey(
    {
      a: ["beep", "", "c", "boop"],
      bap: "bap",
    },
    {
      key: "b*p",
      only: "array",
    },
  );
  let intended = {
    a: ["", "c"],
    bap: "bap",
  };

  equal(actual, intended, "32.01");
});

// ==============================
// Globbing tests
// ==============================

test("33 - wildcard deletes two keys have string values", () => {
  // by key

  let actual = deleteKey(
    {
      axx: "xxxx",
      ayy: "yyyy",
      b: "b",
    },
    {
      key: "a*",
    },
  );
  let intended = {
    b: "b",
  };

  equal(actual, intended, "33.01");
});

test("34 - wildcard deletes two keys have string values", () => {
  // by value
  // ---------------------------------------------------------------------------

  let actual = deleteKey(
    {
      axx: "xxxx",
      ayy: "yyyy",
      b: "b",
    },
    {
      key: "*xx",
    },
  );
  let intended = {
    ayy: "yyyy",
    b: "b",
  };

  equal(actual, intended, "34.01");

  // by both key and value, with wildcards, includes sneaky close positives
  // ---------------------------------------------------------------------------
});

test("35 - wildcard deletes two keys have string values", () => {
  let actual = deleteKey(
    {
      axx: "yyy x",
      notmatching_key: "yyy x",
      ayy: "zzz x",
      azz: "not matching value",
      b: "b",
    },
    {
      key: "a*",
      val: "*x",
    },
  );
  let intended = {
    notmatching_key: "yyy x",
    azz: "not matching value",
    b: "b",
  };

  equal(actual, intended, "35.01");
});

test("36 - wildcard deletes keys with plain object values, by key", () => {
  let actual = deleteKey(
    {
      apples: "a",
      brambles: { c: "d" },
      crawls: "e",
    },
    {
      key: "*les",
    },
  );
  let intended = {
    crawls: "e",
  };

  equal(actual, intended, "36.01");
});

test("37 - wildcard delete two values, plain objects", () => {
  //
  // cleanup=false
  // ---------------------------------------------------------------------------

  let actual = deleteKey(
    {
      a: { e: [{ brunch: { c: "d" } }] },
      brother: { c: "d" },
    },
    {
      key: "br*",
      val: { c: "d" },
      cleanup: false,
    },
  );
  let intended = {
    a: { e: [{}] },
  };

  equal(actual, intended, "37.01");
});

test("38 - wildcard delete two values, plain objects", () => {
  //
  // cleanup=true
  // ---------------------------------------------------------------------------

  let actual = deleteKey(
    {
      a: { e: [{ brunch: { c: "d" } }] },
      brother: { c: "d" },
    },
    {
      key: "br*",
      val: { c: "d" },
      cleanup: true,
    },
  );
  let intended = {};

  equal(actual, intended, "38.01");
});

test("39 - issue #8 - undefined as a value", () => {
  let actual = deleteKey(
    {
      __typename: "sd",
      entryPoint: "a",
    },
    {
      key: "__typename",
    },
  );
  let intended = {
    entryPoint: "a",
  };

  equal(actual, intended, "39.01");
});

test("40 - issue #8 - undefined as a value, outside deletion path", () => {
  equal(
    deleteKey(
      {
        __typename: "sd",
        entryPoint: undefined,
      },
      {
        key: "__typename",
        cleanup: true, // <---
      },
    ),
    {
      entryPoint: undefined,
    },
    "40.01",
  );
});

test("41 - issue #8 - undefined as a value, outside deletion path", () => {
  equal(
    deleteKey(
      {
        __typename: "sd",
        entryPoint: undefined,
      },
      {
        key: "__typename",
        cleanup: false, // <---
      },
    ),
    {
      entryPoint: undefined,
    },
    "41.01",
  );
});

test("42 - issue #8 - undefined as a value, outside deletion path", () => {
  let input = {
    a: { __typename: "sd" },
    entryPoint: undefined,
  };

  // since "entrypoint" is not in the way of deletion path, it is retained,
  // no matter the "cleanup" setting
  equal(
    deleteKey(input, {
      key: "__typename",
      cleanup: true, // <---
    }),
    {
      entryPoint: undefined,
    },
    "42.01",
  );
  equal(
    deleteKey(input, {
      key: "__typename",
      cleanup: false, // <---
    }),
    {
      a: {},
      entryPoint: undefined,
    },
    "42.02",
  );
});

test("43 - issue #8", () => {
  let input = {
    a: { __typename: "sd", b: undefined, c: "" },
    entryPoint: undefined,
  };

  equal(
    deleteKey(input, {
      key: "__typename",
      cleanup: true, // <---
    }),
    {
      a: { b: undefined, c: "" },
      entryPoint: undefined,
    },
    "43.01",
  );
  equal(
    deleteKey(input, {
      key: "__typename",
      cleanup: false, // <---
    }),
    {
      a: { b: undefined, c: "" },
      entryPoint: undefined,
    },
    "43.02",
  );
});

test.run();
