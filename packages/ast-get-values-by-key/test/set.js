import tap from "tap";
import { getByKey } from "../dist/ast-get-values-by-key.esm";

tap.test("01 - string replaced", (t) => {
  t.strictSame(
    getByKey(
      {
        tag: "html",
      },
      "tag",
      ["style"]
    ),
    {
      tag: "style",
    },
    "01"
  );
  t.end();
});

tap.test("02 - string within array replaced", (t) => {
  t.strictSame(
    getByKey(
      {
        tag: ["html"],
      },
      "tag",
      [["style"]]
    ),
    {
      tag: ["style"],
    },
    "02"
  );
  t.end();
});

tap.test("03 - value is object and is replaced", (t) => {
  t.strictSame(
    getByKey(
      {
        tag: {
          a: "b",
        },
      },
      "tag",
      [
        {
          c: "d",
        },
      ]
    ),
    {
      tag: {
        c: "d",
      },
    },
    "03"
  );
  t.end();
});

tap.test("04 - two objects replaced", (t) => {
  t.strictSame(
    getByKey(
      [
        {
          tag: {
            a: "b",
          },
        },
        {
          tag: {
            x: "y",
          },
        },
      ],
      "tag",
      [
        {
          c: "d",
        },
        {
          m: "n",
        },
      ]
    ),
    [
      {
        tag: {
          c: "d",
        },
      },
      {
        tag: {
          m: "n",
        },
      },
    ],
    "04"
  );
  t.end();
});

tap.test("05 - simple edit", (t) => {
  t.strictSame(
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
      ["html3", "html4"]
    ),
    [
      {
        tag: "html3",
        attrs: {
          lang: "en",
        },
        content: ["\n"],
      },
      {
        tag: "html4",
        attrs: {
          lang: "en",
        },
        content: ["\n"],
      },
    ],
    "05"
  );
  t.end();
});

tap.test("06 - replaced to an empty string", (t) => {
  t.strictSame(
    getByKey(
      {
        tag: "html",
      },
      "tag",
      ""
    ),
    {
      tag: "",
    },
    "06 - empty string given as a replacement"
  );
  t.end();
});

tap.test("07 - not enough replacement values given", (t) => {
  t.strictSame(
    getByKey(
      {
        meta: [
          {
            tag: "no1",
          },
          {
            tag: "no2",
          },
          {
            tag: "no3",
          },
        ],
      },
      "tag",
      ["", ""]
    ),
    {
      meta: [
        {
          tag: "",
        },
        {
          tag: "",
        },
        {
          tag: "no3",
        },
      ],
    },
    "07 - still works"
  );
  t.end();
});

tap.test("08 - no results replacement", (t) => {
  t.strictSame(
    getByKey(
      {
        style: "html",
      },
      "tag",
      ["meta"]
    ),
    {
      style: "html",
    },
    "08"
  );
  t.end();
});
