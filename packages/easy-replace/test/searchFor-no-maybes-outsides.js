import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// no searchFor + no maybes + outsides
// ==============================

test("01 - one rightOutside, not found", () => {
  equal(
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
      "🌟",
    ),
    "aaa🦄a bbbb🦄 cccc🦄",
    "test 7.1",
  );
});

test("02 - one leftOutside, not found", () => {
  equal(
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
      "🌟",
    ),
    "🦄aaaa 🦄bbbb 🦄cccc",
    "test 7.2",
  );
});

test("03 - one leftOutside, not found + null replacement", () => {
  equal(
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
      null,
    ),
    "aa🦄aa bb🦄bb cc🦄cc",
    "test 7.3",
  );
});

test("04 - leftOutside and replacement are null", () => {
  equal(
    er(
      "aaaa bbbb cccc",
      {
        leftOutside: null,
      },
      null,
    ),
    "aaaa bbbb cccc",
    "test 7.4",
  );
});

test("05 - left outside and replacement are undefined", () => {
  equal(
    er(
      "aaaa bbbb cccc",
      {
        leftOutside: undefined,
      },
      undefined,
    ),
    "aaaa bbbb cccc",
    "test 7.5",
  );
});

test.run();
