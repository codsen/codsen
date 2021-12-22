import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// searchFor + maybes + outsides
// ==============================

test("01 - maybes and outsides, emoji - full set", () => {
  equal(
    er(
      "a🦄🐴💘b",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "💘",
        rightOutside: "b",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "a🌟b",
    "test 6.1"
  );
});

test("02 - maybes + outsides - 1 of maybes not found #1", () => {
  equal(
    er(
      "a🦄🐴b",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "💘",
        rightOutside: "b",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "a🌟b",
    "test 6.2"
  );
});

test("03 - maybes + outsides - 1 of maybes not found #2", () => {
  equal(
    er(
      "a🐴💘b",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "💘",
        rightOutside: "b",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "a🌟b",
    "test 6.3"
  );
});

test("04 - maybes and outsides, emoji - neither of maybes", () => {
  equal(
    er(
      "a🐴b",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "💘",
        rightOutside: "b",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "a🌟b",
    "test 6.4"
  );
});

test("05 - multiple findings with maybes and outsides", () => {
  equal(
    er(
      "a🦄🐴💘b a🦄🐴💘b a🦄🐴💘b",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "💘",
        rightOutside: "b",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "a🌟b a🌟b a🌟b",
    "test 6.5"
  );
});

test("06 - multiple findings with maybes and not-outsides", () => {
  equal(
    er(
      "z🦄🐴💘b a🦄🐴💘z a🦄🐴💘b z🦄🐴💘z",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "💘",
        rightOutside: "",
        rightOutsideNot: "b",
      },
      "🌟"
    ),
    "z🦄🐴💘b a🦄🐴💘z a🦄🐴💘b z🌟z",
    "test 6.6"
  );
});

test("07 - maybes and outsides, arrays", () => {
  equal(
    er(
      "a🦄🐴💘b a💘🐴🦄b a🦄🐴🦄b a💘🐴💘b",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: ["🦄", "💘", "a", "b"],
        searchFor: "🐴",
        rightMaybe: ["🦄", "💘", "a", "b"],
        rightOutside: "b",
        rightOutsideNot: "",
      },
      "🌟"
    ),
    "a🌟b a🌟b a🌟b a🌟b",
    "test 6.7"
  );
});

test.run();
