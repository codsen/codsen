import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// searchFor + only outsides
// ==============================

test("01 - both outsides only, emoji, found", () => {
  equal(
    er(
      "🦄 🐴 🦄",
      {
        leftOutsideNot: "",
        leftOutside: "🦄 ",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: " 🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "🦄 z 🦄",
    "test 5.1.1"
  );
  equal(
    er(
      "🦄 🐴 🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄 "],
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: [" 🦄"],
        rightOutsideNot: "",
      },
      "z"
    ),
    "🦄 z 🦄",
    "test 5.1.2"
  );
});

test("02 - both outsides only, emoji, not found", () => {
  equal(
    er(
      "a 🐴 a",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "a 🐴 a",
    "test 5.2"
  );
});

test("03 - both outsides, emoji, not found", () => {
  equal(
    er(
      "🦄 🐴 a",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: " ",
        searchFor: "🐴",
        rightMaybe: " ",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "🦄 🐴 a",
    "test 5.3"
  );
});

test("04 - both outsides, emoji, not found #1", () => {
  equal(
    er(
      "a 🐴 a🦄",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "a 🐴 a🦄",
    "test 5.4"
  );
});

test("05 - both outsides, emoji, not found #2", () => {
  equal(
    er(
      "kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk",
    "test 5.5"
  );
});

test("06 - line break as rightOutside, found", () => {
  equal(
    er(
      "aaab\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      "c"
    ),
    "aaac\n",
    "test 5.6"
  );
});

test("07 - line breaks as both outsides", () => {
  equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      "c"
    ),
    "aaa\nc\n",
    "test 5.7"
  );
});

test("08 - \\n as outsides, replacement = undefined", () => {
  equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      undefined
    ),
    "aaa\n\n",
    "test 5.8"
  );
});

test("09 - line breaks as outsides, replacement = Bool", () => {
  equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      true
    ),
    "aaa\n\n",
    "test 5.9"
  );
});

test("10 - line breaks as outsides, replacement = null", () => {
  equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      null
    ),
    "aaa\n\n",
    "test 5.10"
  );
});

test("11 - left outside requirement not satisfied for replacement to happen", () => {
  equal(
    er("aaaBBBccc", {
      leftOutsideNot: "",
      leftOutside: "x",
      leftMaybe: "",
      searchFor: "bbb",
      rightMaybe: "",
      rightOutside: "z",
      rightOutsideNot: "",
      i: {
        searchFor: true,
        leftOutside: true,
      },
    }),
    "aaaBBBccc",
    "test 5.11 - did not replace because of o.leftOutside"
  );
});

test("12 - right outside requirement not satisfied for replacement to happen", () => {
  equal(
    er("aaaBBBccc", {
      leftOutsideNot: "",
      leftOutside: "x",
      leftMaybe: "",
      searchFor: "bbb",
      rightMaybe: "",
      rightOutside: "z",
      rightOutsideNot: "",
      i: {
        searchFor: true,
        rightOutside: true,
      },
    }),
    "aaaBBBccc",
    "test 5.12 - did not replace because of o.rightOutside"
  );
});

test.run();
