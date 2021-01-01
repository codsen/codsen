import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// searchFor + both left and right
// ==============================

tap.test("01 - left and right maybes as emoji", (t) => {
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
      "z"
    ),
    "aza",
    "test 4.1.1"
  );
  t.equal(
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
  t.end();
});

tap.test("02 - left and right maybes as text", (t) => {
  t.equal(
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
  t.equal(
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
  t.end();
});

tap.test("03 - left+right maybes, middle & end of word #1", (t) => {
  t.equal(
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
  t.end();
});

tap.test("04 - left+right maybes, middle & end of word #2", (t) => {
  t.equal(
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
  t.end();
});

tap.test("05 - normal words", (t) => {
  t.equal(
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
  t.end();
});
