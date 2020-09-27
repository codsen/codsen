import tap from "tap";
import objectPath from "object-path";
import get from "../dist/ast-get-values-by-key.esm";

tap.test("01 - just a plain object", (t) => {
  const source = {
    tag: "html",
  };

  t.strictSame(
    get(source, "tag"),
    [
      {
        val: "html",
        path: "tag",
      },
    ],
    "01.01"
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.equal(objectPath.get(source, "tag"), "html", "01.02");

  t.strictSame(
    get(
      {
        Tag: "html",
      },
      "tag"
    ),
    [],
    "01.03"
  );
  t.end();
});

tap.test("02 - single plain object within array", (t) => {
  const source = [
    {
      tag: "html",
    },
  ];
  t.strictSame(
    get(source, "tag"),
    [
      {
        val: "html",
        path: "0.tag",
      },
    ],
    "02.01"
  );
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.equal(objectPath.get(source, "0.tag"), "html", "02.02");
  t.end();
});

tap.test("03 - string in array as result", (t) => {
  const source = {
    tag: ["html"],
  };
  const res = [
    {
      val: ["html"],
      path: "tag",
    },
  ];
  t.strictSame(get(source, "tag"), res, "03.01");
  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.strictSame(objectPath.get(source, "tag"), ["html"], "03.02");
  t.end();
});

tap.test("04 - two strings as result", (t) => {
  t.strictSame(
    get(
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
      "tag"
    ),
    [
      {
        val: "html1",
        path: "0.tag",
      },
      { val: "html2", path: "1.tag" },
    ],
    "04"
  );
  t.end();
});

tap.test("05 - query by key, returns mixed results", (t) => {
  t.strictSame(
    get(
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
      "tag"
    ),
    [
      { val: ["html1"], path: "0.tag" },
      { val: { html2: "html2" }, path: "1.tag" },
      { val: "html3", path: "2.tag" },
    ],
    "05"
  );
  t.end();
});

tap.test("06 - deep tree", (t) => {
  const source = [
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
  const retrievedPath = "0.a.b.0.c.d.0.e.f.0.g.h.tag";
  t.strictSame(
    get(source, "tag"),
    [{ val: "html", path: retrievedPath }],
    "06.01"
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.equal(objectPath.get(source, retrievedPath), "html", "06.02");
  t.end();
});

tap.test("07 - query returns an array", (t) => {
  t.strictSame(
    get(
      [
        {
          tag: ["z"],
        },
      ],
      "tag"
    ),
    [{ val: ["z"], path: "0.tag" }],
    "07"
  );
  t.end();
});

tap.test("08 - query returns a string", (t) => {
  t.strictSame(
    get(
      [
        {
          tag: "z",
        },
      ],
      "tag"
    ),
    [{ val: "z", path: "0.tag" }],
    "08"
  );
  t.end();
});

tap.test("09 - query returns array with two objects", (t) => {
  const source = [
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
  const retrievedValue = [
    {
      a: "a",
      b: "b",
    },
    {
      c: "c",
      d: "d",
    },
  ];
  t.strictSame(
    get(source, "tag"),
    [
      {
        val: retrievedValue,
        path: "0.tag",
      },
    ],
    "09.01"
  );

  // double check, is the result's path pointing to exactly the same value if
  // queries via object-path library:
  t.strictSame(objectPath.get(source, "0.tag"), retrievedValue, "09.02");
  t.end();
});

tap.test("10 - no results query", (t) => {
  t.strictSame(
    get(
      {
        style: "html",
      },
      "tag"
    ),
    [],
    "10"
  );
  t.end();
});
