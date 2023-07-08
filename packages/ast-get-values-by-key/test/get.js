import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import objectPath from "object-path";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

test("01 - just a plain object", () => {
  let source = {
    tag: "html",
  };

  equal(
    getByKey(source, "tag"),
    [
      {
        val: "html",
        path: "tag",
      },
    ],
    "01.01",
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  equal(objectPath.get(source, "tag"), "html", "01.02");

  equal(
    getByKey(
      {
        Tag: "html",
      },
      "tag",
    ),
    [],
    "01.03",
  );
});

test("02 - single plain object within array", () => {
  let source = [
    {
      tag: "html",
    },
  ];
  equal(
    getByKey(source, "tag"),
    [
      {
        val: "html",
        path: "0.tag",
      },
    ],
    "02.01",
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  equal(objectPath.get(source, "0.tag"), "html", "02.02");
});

test("03 - string in array as result", () => {
  let source = {
    tag: ["html"],
  };
  let res = [
    {
      val: ["html"],
      path: "tag",
    },
  ];
  equal(getByKey(source, "tag"), res, "03.01");
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  equal(objectPath.get(source, "tag"), ["html"], "03.02");
});

test("04 - two strings as result", () => {
  equal(
    getByKey(
      [
        {
          tag: "html1",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: "html2",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
      ],
      "tag",
    ),
    [
      {
        val: "html1",
        path: "0.tag",
      },
      { val: "html2", path: "1.tag" },
    ],
    "04.01",
  );
});

test("05 - query by key, returns mixed results", () => {
  equal(
    getByKey(
      [
        {
          tag: ["html1"],
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: { html2: "html2" },
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
        {
          tag: "html3",
          attrs: {
            lang: "en",
          },
          content: ["\n"],
        },
      ],
      "tag",
    ),
    [
      { val: ["html1"], path: "0.tag" },
      { val: { html2: "html2" }, path: "1.tag" },
      { val: "html3", path: "2.tag" },
    ],
    "05.01",
  );
});

test("06 - deep tree", () => {
  let source = [
    {
      a: {
        b: [
          {
            c: {
              d: [
                {
                  e: {
                    f: [
                      {
                        g: {
                          h: {
                            tag: "html",
                          },
                        },
                      },
                    ],
                  },
                },
                "whatnot",
              ],
            },
          },
          "also here too",
        ],
      },
    },
  ];
  let retrievedPath = "0.a.b.0.c.d.0.e.f.0.g.h.tag";
  equal(
    getByKey(source, "tag"),
    [{ val: "html", path: retrievedPath }],
    "06.01",
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  equal(objectPath.get(source, retrievedPath), "html", "06.02");
});

test("07 - query returns an array", () => {
  equal(
    getByKey(
      [
        {
          tag: ["z"],
        },
      ],
      "tag",
    ),
    [{ val: ["z"], path: "0.tag" }],
    "07.01",
  );
});

test("08 - query returns a string", () => {
  equal(
    getByKey(
      [
        {
          tag: "z",
        },
      ],
      "tag",
    ),
    [{ val: "z", path: "0.tag" }],
    "08.01",
  );
});

test("09 - query returns array with two objects", () => {
  let source = [
    {
      tag: [
        {
          a: "a",
          b: "b",
        },
        {
          c: "c",
          d: "d",
        },
      ],
    },
  ];
  let retrievedValue = [
    {
      a: "a",
      b: "b",
    },
    {
      c: "c",
      d: "d",
    },
  ];
  equal(
    getByKey(source, "tag"),
    [
      {
        val: retrievedValue,
        path: "0.tag",
      },
    ],
    "09.01",
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  equal(objectPath.get(source, "0.tag"), retrievedValue, "09.02");
});

test("10 - no results query", () => {
  equal(
    getByKey(
      {
        style: "html",
      },
      "tag",
    ),
    [],
    "10.01",
  );
});

test.run();
