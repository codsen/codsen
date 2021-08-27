import tap from "tap";
import { er } from "../dist/easy-replace.esm.js";

// ==============================
// infinite loop cases
// ==============================

tap.test("01 - infinite loop, no maybes, emoji", (t) => {
  t.equal(
    er(
      "🐴🦄🐴🦄🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "🐴"
    ),
    "🐴🦄🐴🦄🐴",
    "test 8.1"
  );
  t.end();
});

tap.test("02 - infinite loop, maybes, multiple findings, emoji", (t) => {
  t.equal(
    er(
      "🐴🦄🐴🦄🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "🦄",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "🐴"
    ),
    "🐴🐴🐴",
    "test 8.2"
  );
  t.end();
});

tap.test("03 - infinite loop protection, emoji replaced with itself", (t) => {
  t.equal(
    er(
      "🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "🐴"
    ),
    "🐴",
    "test 8.3"
  );
  t.end();
});

tap.test("04 - infinite loop protection, right outside", (t) => {
  t.equal(
    er(
      "🐴🦄🐴🦄🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "🐴"
    ),
    "🐴🦄🐴🦄🐴",
    "test 8.4"
  );
  t.end();
});

tap.test("05 - infinite loop protection, multiples", (t) => {
  t.equal(
    er(
      "🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🦄🦄🦄",
      {
        leftOutsideNot: "a",
        leftOutside: "🦄🦄🦄",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: "🦄",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🌟🦄",
    "test 8.5"
  );
  t.end();
});

tap.test("06 - simple infinite loop case", (t) => {
  t.equal(
    er(
      "a",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "a",
    "test 8.6"
  );
  t.end();
});

tap.test("07 - infinite loop, not found", (t) => {
  t.equal(
    er(
      "",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "",
    "test 8.7"
  );
  t.end();
});
