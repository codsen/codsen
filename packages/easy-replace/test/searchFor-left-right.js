import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// searchFor + both left and right
// ==============================

test("01 - left and right maybes as emoji", () => {
  equal(
    er(
      "a🦄🐴🦄a",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "z"
    ),
    "aza",
    "test 4.1.1"
  );
  equal(
    er(
      "a🦄🐴🦄a",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄"],
        searchFor: "🐴",
        rightMaybe: ["🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "z"
    ),
    "aza",
    "test 4.1.2"
  );
});

test("02 - left and right maybes as text", () => {
  equal(
    er(
      "abc abc abc",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "b",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "z"
    ),
    "z z z",
    "test 4.2.1"
  );
  equal(
    er(
      "abc abc abc",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["a", "c"],
        searchFor: "b",
        rightMaybe: ["a", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "z"
    ),
    "z z z",
    "test 4.2.2"
  );
});

test("03 - left+right maybes, middle & end of word #1", () => {
  equal(
    er(
      "zzzabc zzzzabczzz abczzzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "b",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "z"
    ),
    "zzzz zzzzzzzz zzzzz",
    "test 4.3"
  );
});

test("04 - left+right maybes, middle & end of word #2", () => {
  equal(
    er(
      "zzz🦄🐴🦄 zzzz🦄🐴🦄zzz 🦄🐴🦄zzzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "z"
    ),
    "zzzz zzzzzzzz zzzzz",
    "test 4.4"
  );
});

test("05 - normal words", () => {
  equal(
    er(
      "aaa some test text testing for somebody",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["some "],
        searchFor: "te",
        rightMaybe: ["st", "xt", "sting"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "check"
    ),
    "aaa check check check for somebody",
    "test 4.5"
  );
});

test.run();
