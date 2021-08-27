import tap from "tap";
import { er } from "../dist/easy-replace.esm.js";

// ==============================
// missing replacement value = asking for delete mode
// ==============================

tap.test("01 - empty string as replacement = deletion mode", (t) => {
  t.equal(
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
  t.end();
});

tap.test("02 - null as replacement = deletion mode", (t) => {
  t.equal(
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
  t.end();
});

tap.test("03 - replacement bool, nothing left", (t) => {
  t.equal(
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
  t.end();
});

tap.test("04 - replacement Bool, nothing left, searchFor Integer", (t) => {
  t.equal(
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
  t.end();
});

tap.test("05 - nothing left, replacement undefined", (t) => {
  t.equal(
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
  t.end();
});

tap.test("06 - nothing left - more undefined", (t) => {
  t.equal(
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
  t.end();
});

tap.test("07 - emoji, null replacement, both outsides found", (t) => {
  t.equal(
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
  t.end();
});

tap.test("08 - raw integers everywhere must work too", (t) => {
  t.equal(
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
  t.end();
});

tap.test("09 - searchFor is an array of 1 element", (t) => {
  t.equal(
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
  t.end();
});

tap.test("10 - searchFor is an array of few elements (no find)", (t) => {
  t.equal(
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
  t.end();
});

tap.test("11 - searchFor is an array of few elements (won't work)", (t) => {
  t.equal(
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
  t.end();
});
