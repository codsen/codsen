import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

test("01 - string replaced", () => {
  equal(
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
    "01.01"
  );
});

test("02 - string within array replaced", () => {
  equal(
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
    "02.01"
  );
});

test("03 - value is object and is replaced", () => {
  equal(
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
    "03.01"
  );
});

test("04 - two objects replaced", () => {
  equal(
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
    "04.01"
  );
});

test("05 - simple edit", () => {
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
    "05.01"
  );
});

test("06 - replaced to an empty string", () => {
  equal(
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
    "06.01"
  );
});

test("07 - not enough replacement values given", () => {
  equal(
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
    "07.01"
  );
});

test("08 - no results replacement", () => {
  equal(
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
    "08.01"
  );
});

test.run();
