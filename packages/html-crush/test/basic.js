import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
// eslint-disable-next-line no-unused-vars
import { crush, defaults, version } from "../dist/html-crush.esm.js";
import { m } from "./util/util.js";

test("01 - full", () => {
  let { result, applicableOpts, ranges } = m(equal, " <a> \n <b> ", {
    removeLineBreaks: true,
  });

  equal(result, "<a> <b>", "01.01");
  equal(
    ranges,
    [
      [0, 1],
      [4, 7, " "],
      [10, 11],
    ],
    "01.02",
  );
  equal(
    applicableOpts,
    {
      removeHTMLComments: false,
      removeCSSComments: false,
    },
    "01.03",
  );
});

test("02 - deletes trailing space", () => {
  compare(
    ok,
    m(equal, " <a> \n <b> ", {
      removeLineBreaks: true,
    }),
    {
      result: "<a> <b>",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "01.01",
  );
  compare(
    ok,
    m(equal, " <a>\n<b> ", {
      removeLineBreaks: true,
    }),
    {
      result: "<a> <b>",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "01.02",
  );
  compare(
    ok,
    m(equal, " <section> \n <article> ", {
      removeLineBreaks: true,
    }),
    {
      result: "<section><article>",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "01.03",
  );
});

test("03 - retains trailing linebreak", () => {
  compare(
    ok,
    m(equal, " <a> \n <b> \n", {
      removeLineBreaks: true,
    }),
    {
      result: "<a> <b>\n",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "02",
  );
});

test("04 - trailing line break", () => {
  compare(
    ok,
    m(equal, " a \n b \n", {
      removeLineBreaks: true,
    }),
    {
      result: "a b\n",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "03",
  );
});

test("05 - multiple line breaks", () => {
  compare(
    ok,
    m(equal, " a \n b\n\n\nc ", {
      removeLineBreaks: true,
    }),
    {
      result: "a b c",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "04",
  );
});

test("06 - ends with character", () => {
  compare(
    ok,
    m(equal, " a \n b\n\n\nc", {
      removeLineBreaks: true,
    }),
    {
      result: "a b c",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "05",
  );
});

test("07 - tags, end with character", () => {
  compare(
    ok,
    m(equal, " <x> \n <y>\n\n\n<z>", {
      removeLineBreaks: true,
    }),
    {
      result: "<x><y><z>",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "06.01",
  );
  compare(
    ok,
    m(equal, " <a> \n <b>\n\n\n<i>\n\n\n<c>", {
      removeLineBreaks: true,
    }),
    {
      result: "<a> <b> <i><c>",
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "06.02",
  );
});

test("08 - comments", () => {
  let src = "<!--<![endif]-->";
  compare(
    ok,
    m(equal, src, {
      removeLineBreaks: true,
    }),
    {
      result: src,
      applicableOpts: {
        removeHTMLComments: true,
        removeCSSComments: false,
      },
    },
    "07",
  );
});

test("09 - CRLF", () => {
  let src = "<table>\r\n<tr>";
  compare(
    ok,
    m(equal, src, {
      removeLineBreaks: true,
    }).result,
    "<table><tr>",
    "08",
  );
});

test.run();
