import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// infinite loop cases
// ==============================

test("01 - infinite loop, no maybes, emoji", () => {
  equal(
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
      "🐴",
    ),
    "🐴🦄🐴🦄🐴",
    "test 8.1",
  );
});

test("02 - infinite loop, maybes, multiple findings, emoji", () => {
  equal(
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
      "🐴",
    ),
    "🐴🐴🐴",
    "test 8.2",
  );
});

test("03 - infinite loop protection, emoji replaced with itself", () => {
  equal(
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
      "🐴",
    ),
    "🐴",
    "test 8.3",
  );
});

test("04 - infinite loop protection, right outside", () => {
  equal(
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
      "🐴",
    ),
    "🐴🦄🐴🦄🐴",
    "test 8.4",
  );
});

test("05 - infinite loop protection, multiples", () => {
  equal(
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
      "🌟",
    ),
    "🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🌟🦄",
    "test 8.5",
  );
});

test("06 - simple infinite loop case", () => {
  equal(
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
      "a",
    ),
    "a",
    "test 8.6",
  );
});

test("07 - infinite loop, not found", () => {
  equal(
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
      "a",
    ),
    "",
    "test 8.7",
  );
});

test.run();
