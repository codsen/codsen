import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// searchFor + rightMaybe
// ==============================

test("01 - right maybe found", () => {
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄bc",
    "test 3.1.1"
  );
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄bc",
    "test 3.1.2"
  );
});

test("02 - two replacements with one rightmaybe, nearby", () => {
  equal(
    er(
      "ab🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 3.2.1"
  );
  equal(
    er(
      "ab🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 3.2.2"
  );
});

test("03 - two consecutive right maybes", () => {
  equal(
    er(
      "ab🦄🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: "🐴",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 3.3.1"
  );
  equal(
    er(
      "ab🦄🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: ["🐴"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 3.3.2"
  );
});

test("04 - futile right maybe", () => {
  equal(
    er(
      "'🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "'d",
    "test 3.4.1"
  );
  equal(
    er(
      "'🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "'d",
    "test 3.4.2"
  );
});

test("05 - \\n as search string plus right maybe", () => {
  equal(
    er(
      "\na\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\n",
        rightMaybe: "a",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaa",
    "test 3.5.1"
  );
  equal(
    er(
      "\na\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\n",
        rightMaybe: ["a"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaa",
    "test 3.5.2"
  );
});

test("06 - \\n as both searchFor and right maybe, replaced", () => {
  equal(
    er(
      "\n\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\n",
        rightMaybe: "\n",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aa",
    "test 3.6.1"
  );
  equal(
    er(
      "\n\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\n",
        rightMaybe: ["\n"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aa",
    "test 3.6.2"
  );
});

test("07 - rightMaybe with line breaks", () => {
  equal(
    er(
      "a\n\na",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "\n\na",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b",
    "test 3.7.1"
  );
  equal(
    er(
      "a\n\na",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: ["\n\na"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b",
    "test 3.7.2"
  );
});

test("08 - specific case of semi infinite loop with maybe", () => {
  equal(
    er(
      "aaaaab",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "b",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaaaa",
    "test 3.8.1"
  );
  equal(
    er(
      "aaaaab",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: ["b"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaaaa",
    "test 3.8.2"
  );
});

test("09 - three right maybes (some found)", () => {
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["x", "c", "🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄bc",
    "test 3.9"
  );
});

test("10 - three right maybes (searchFor not found)", () => {
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🍺",
        rightMaybe: ["🦄", "🐴", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄🐴🦄c",
    "test 3.10"
  );
});

test("11 - three right maybes (maybes not found)", () => {
  equal(
    er(
      "🍺🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🍺",
        rightMaybe: ["x", "y", "z"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      1
    ),
    "1🦄🐴🦄c",
    "test 3.11"
  );
});

test("12 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "🐴 ",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "🍺", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b ",
    "test 3.12.1"
  );
});

test("13 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "a🦄🐴🦄🍺c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "🍺", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄b🍺c",
    "test 3.13"
  );
});

test("14 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "a🦄🐴🍺🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "🍺", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄b🦄c",
    "test 3.14"
  );
});

test("15 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "🍺", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄bc",
    "test 3.15"
  );
});

test("16 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "a🦄🐴🦄🍺c a🦄🐴🍺🦄c a🦄🐴🦄c 🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "🍺", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄b🍺c a🦄b🦄c a🦄bc b",
    "test 3.16"
  );
});

test("17 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "🦄y🦄 🦄y🦄 🦄y🦄 y",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "y",
        rightMaybe: ["🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "🦄b 🦄b 🦄b b",
    "test 3.17"
  );
});

test("18 - three right maybes (multiple hungry finds)", () => {
  equal(
    er(
      "🦄y🦄 🦄y🦄 🦄y🦄 y",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "y",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "🦄b 🦄b 🦄b b",
    "test 3.18"
  );
});
// if leftMaybe is simply merged and not iterated, and is queried to exist
// explicitly as string on the right side of the searchFor, it will not be
// found if the order of array is wrong, yet characters are all the same.

test("19 - sneaky array conversion situation", () => {
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["c", "🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄bc",
    "test 3.19-1"
  );
  equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄bc",
    "test 3.19-2"
  );
});

test("20 - normal words, few of them, rightMaybe as array", () => {
  equal(
    er(
      "this protection is promoting the proper propaganda",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "pro",
        rightMaybe: ["tection", "mot", "p", "paganda"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "test"
    ),
    "this test is testing the tester test",
    "test 3.20"
  );
});

test("21 - rightMaybe is array, but with only 1 null value", () => {
  equal(
    er(
      "some text",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "look for me",
        rightMaybe: [null],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "replace with me"
    ),
    "some text",
    "test 3.21"
  );
});

test("22 - rightMaybe is couple integers in an array", () => {
  equal(
    er(
      "1234",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: 2,
        rightMaybe: [3, 4],
        rightOutside: "",
        rightOutsideNot: "",
      },
      9
    ),
    "194",
    "test 3.22"
  );
});

test("23 - sneaky case of overlapping rightMaybes", () => {
  equal(
    er(
      "this is a word to be searched for",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "word",
        rightMaybe: [" to", " to be", "word to be"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "x"
    ),
    "this is a x searched for",
    "test 3.23"
  );
});

test("24 - case-insensitive flag", () => {
  equal(
    er(
      "aaaC",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "aaa",
        rightMaybe: ["x", "y", "z"],
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          rightMaybe: true,
        },
      },
      "x"
    ),
    "xC",
    "test 3.24"
  );
});

test.run();
