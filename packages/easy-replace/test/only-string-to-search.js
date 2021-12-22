import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// only the string to search for
// ==============================

test("01 - replace letter with letter", () => {
  equal(
    er(
      "a b c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "a d c",
    "test 1.1"
  );
  equal(
    er(
      "a b c",
      {
        searchFor: "b",
      },
      "d"
    ),
    "a d c",
    "test 1.1"
  );
});

test("02 - replace 1 emoji with 1 emoji", () => {
  equal(
    er(
      "🐴 🦄 🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "💖"
    ),
    "🐴 💖 🐴",
    "test 1.2"
  );
});

test("03 - replace 3 consecutive emoji with emoji", () => {
  equal(
    er(
      "a 🦄🦄🦄 a",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "💖"
    ),
    "a 💖💖💖 a",
    "test 1.3"
  );
});

test("04 - gorilla emoji - in escaped JS", () => {
  equal(
    er(
      "ljghdfjkgzh\ud83e\udd8dlkgljd",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\ud83e\udd8d",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      " Gorilla "
    ),
    "ljghdfjkgzh Gorilla lkgljd",
    "test 1.4 - http://unicode-table.com/en/1F98D/"
  );
});

test("05 - gorilla emoji - in raw", () => {
  equal(
    er(
      "ljghdfjkgzh🦍lkgljd",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦍",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "gorilla"
    ),
    "ljghdfjkgzhgorillalkgljd",
    "test 1.5 - http://unicode-table.com/en/1F98D/"
  );
});

test("06 - won't find a letter", () => {
  equal(
    er(
      "a b c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "z",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "a b c",
    "test 1.6"
  );
});

test("07 - won't find emoji, with new lines", () => {
  equal(
    er(
      "a\nb\nc",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "a\nb\nc",
    "test 1.7"
  );
});

test("08 - replacement with new lines", () => {
  equal(
    er(
      "a\nb",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a\nb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "c\nd"
    ),
    "c\nd",
    "test 1.8"
  );
});

test("09 - multiple letter findings", () => {
  equal(
    er(
      "a a a a a b",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "c"
    ),
    "c c c c c b",
    "test 1.9"
  );
});

test("10 - single digit of string type replaced", () => {
  equal(
    er(
      "0",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "0",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "1"
    ),
    "1",
    "test 1.10"
  );
});

test("11 - single digit of integer type replaced", () => {
  equal(
    er(
      0,
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "0",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      1
    ),
    "1",
    "test 1.11"
  );
});

test("12 - source and replacement are of integer type", () => {
  equal(
    er(
      0,
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: 0,
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      1
    ),
    "1",
    "test 1.12"
  );
});

test("13 - all raw integers: source, replacement and searchFor", () => {
  equal(
    er(
      0,
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: 0,
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      1
    ),
    "1",
    "test 1.13"
  );
});

test("14 - multiple consecutive letter replacements", () => {
  equal(
    er(
      "aaavvvvccccc",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "v",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "aaabbbbccccc",
    "test 1.14"
  );
});

test.run();
