import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// no searchFor + no maybes + outsides
// ==============================

tap.test("01 - one rightOutside, not found", (t) => {
  t.equal(
    er(
      "aaa🦄a bbbb🦄 cccc🦄",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "aaa🦄a bbbb🦄 cccc🦄",
    "test 7.1"
  );
  t.end();
});

tap.test("02 - one leftOutside, not found", (t) => {
  t.equal(
    er(
      "🦄aaaa 🦄bbbb 🦄cccc",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "🦄aaaa 🦄bbbb 🦄cccc",
    "test 7.2"
  );
  t.end();
});

tap.test("03 - one leftOutside, not found + null replacement", (t) => {
  t.equal(
    er(
      "aa🦄aa bb🦄bb cc🦄cc",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      null
    ),
    "aa🦄aa bb🦄bb cc🦄cc",
    "test 7.3"
  );
  t.end();
});

tap.test("04 - leftOutside and replacement are null", (t) => {
  t.equal(
    er(
      "aaaa bbbb cccc",
      {
        leftOutside: null,
      },
      null
    ),
    "aaaa bbbb cccc",
    "test 7.4"
  );
  t.end();
});

tap.test("05 - left outside and replacement are undefined", (t) => {
  t.equal(
    er(
      "aaaa bbbb cccc",
      {
        leftOutside: undefined,
      },
      undefined
    ),
    "aaaa bbbb cccc",
    "test 7.5"
  );
  t.end();
});
