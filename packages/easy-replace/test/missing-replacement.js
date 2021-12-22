import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// missing replacement value = asking for delete mode
// ==============================

test("01 - empty string as replacement = deletion mode", () => {
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
      ""
    ),
    "aa",
    "test 10.1"
  );
});

test("02 - null as replacement = deletion mode", () => {
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
      null
    ),
    "aa",
    "test 10.2"
  );
});

test("03 - replacement bool, nothing left", () => {
  equal(
    er(
      "🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      true
    ),
    "",
    "test 10.3"
  );
});

test("04 - replacement Bool, nothing left, searchFor Integer", () => {
  equal(
    er(
      "2",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: 2,
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      false
    ),
    "",
    "test 10.4"
  );
});

test("05 - nothing left, replacement undefined", () => {
  equal(
    er(
      "fljlh fdlg ldfhgl abc aldjsdlflkjd ljfl fgklh fl",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "fljlh fdlg ldfhgl abc aldjsdlflkjd ljfl fgklh fl",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      undefined
    ),
    "",
    "test 10.5"
  );
});

test("06 - nothing left - more undefined", () => {
  equal(
    er(
      "zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "zzz",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      undefined
    ),
    "",
    "test 10.6"
  );
});

test("07 - emoji, null replacement, both outsides found", () => {
  equal(
    er(
      "a🦄🐴🦄a",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      null
    ),
    "a🦄🦄a",
    "test 10.7"
  );
});

test("08 - raw integers everywhere must work too", () => {
  equal(
    er(
      6,
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: 6,
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      9
    ),
    "9",
    "test 10.8"
  );
});

test("09 - searchFor is an array of 1 element", () => {
  equal(
    er(
      "a b c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: ["b"],
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "a d c",
    "test 10.9"
  );
});

test("10 - searchFor is an array of few elements (no find)", () => {
  equal(
    er(
      "a b c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: ["b", "x"],
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "a b c",
    "test 10.10"
  );
});

test("11 - searchFor is an array of few elements (won't work)", () => {
  equal(
    er(
      "a bx c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: ["b", "x"],
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "a bx c",
    "test 10.11"
  );
});

test.run();
