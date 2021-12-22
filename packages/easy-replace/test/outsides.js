import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// outsides
// ==============================

test("01 - left and right outsides as arrays (majority found)", () => {
  equal(
    er(
      "🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄", "💘", "doesn't exist", "this one too"],
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: ["more stuff here", "and here", "🦄", "💘"],
        rightOutsideNot: "",
      },
      "c"
    ),
    "🐴 a🦄c💘a a💘c🦄a a💘c💘a a🦄c🦄a 🐴",
    "test 11.1"
  );
});

test("02 - left and right outsides as arrays (one found)", () => {
  equal(
    er(
      "🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄", "doesn't exist", "this one too"],
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: ["more stuff here", "and here", "💘"],
        rightOutsideNot: "",
      },
      "c"
    ),
    "🐴 a🦄c💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴",
    "test 11.2"
  );
});

test("03 - outsides as arrays, beyond found maybes", () => {
  equal(
    er(
      "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["a"],
        leftMaybe: ["🦄", "💘"],
        searchFor: "🐴",
        rightMaybe: ["🦄", "💘"],
        rightOutside: ["a"],
        rightOutsideNot: "",
      },
      "c"
    ),
    "🦄🐴 aca aca aca aca 🐴🦄",
    "test 11.3"
  );
});

test("04 - outsides as arrays blocking maybes", () => {
  equal(
    er(
      "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["b"],
        leftMaybe: ["🦄", "💘"],
        searchFor: "🐴",
        rightMaybe: ["🦄", "💘"],
        rightOutside: ["b"],
        rightOutsideNot: "",
      },
      "whatevs"
    ),
    "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
    "test 11.4"
  );
});

test("05 - maybes matching outsides, blocking them", () => {
  equal(
    er(
      "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄", "💘"],
        leftMaybe: ["🦄", "💘"],
        searchFor: "🐴",
        rightMaybe: ["🦄", "💘"],
        rightOutside: ["🦄", "💘"],
        rightOutsideNot: "",
      },
      "whatevs"
    ),
    "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
    "test 11.5"
  );
});

test("06 - maybes matching outsides, blocking them", () => {
  equal(
    er(
      "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄", "💘"],
        leftMaybe: ["🦄", "💘"],
        searchFor: "🐴",
        rightMaybe: ["🦄", "💘"],
        rightOutside: ["🦄", "💘"],
        rightOutsideNot: "",
      },
      "whatevs"
    ),
    "🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄",
    "test 11.6"
  );
});

test("07 - maybes matching outsides, found", () => {
  equal(
    er(
      "🦄🐴🦄 a💘🦄🐴💘🦄a a🦄💘🐴🦄💘a a💘💘🐴💘💘a a🦄🦄🐴🦄🦄a 🦄🐴🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄", "💘"],
        leftMaybe: ["🦄", "💘"],
        searchFor: "🐴",
        rightMaybe: ["🦄", "💘"],
        rightOutside: ["🦄", "💘"],
        rightOutsideNot: "",
      },
      "c"
    ),
    "🦄🐴🦄 a💘c🦄a a🦄c💘a a💘c💘a a🦄c🦄a 🦄🐴🦄",
    "test 11.6"
  );
});

test("08 - maybes matching outsides, mismatching", () => {
  equal(
    er(
      "🍺🐴🍺 a💘🍺🐴🌟🦄a a🦄🌟🐴🍺💘a a💘🌟🐴🌟💘a a🦄🍺🐴🍺🦄a 🌟🐴🌟",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄", "💘"],
        leftMaybe: ["🍺", "🌟"],
        searchFor: "🐴",
        rightMaybe: ["🍺", "🌟"],
        rightOutside: ["🦄", "💘"],
        rightOutsideNot: "",
      },
      "c"
    ),
    "🍺🐴🍺 a💘c🦄a a🦄c💘a a💘c💘a a🦄c🦄a 🌟🐴🌟",
    "test 11.6"
  );
});

test("09 - rightOutside & with case-insensitive flag", () => {
  equal(
    er(
      "aaaBBBccc aaazzzCCC aaaCCC",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "aaa",
        rightMaybe: "",
        rightOutside: "u",
        rightOutsideNot: "",
      },
      "!"
    ),
    "aaaBBBccc aaazzzCCC aaaCCC",
    "test 11.7.1 - nothing matches, without flag"
  );
  equal(
    er(
      "aaaBBBccc aaazzzCCC aaaCCC",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "aaa",
        rightMaybe: "",
        rightOutside: "u",
        rightOutsideNot: "",
        i: {
          rightOutside: true,
        },
      },
      "!"
    ),
    "aaaBBBccc aaazzzCCC aaaCCC",
    "test 11.7.2 - nothing matches, with flag"
  );
  equal(
    er(
      "aaaBBBccc aaazzzCCC aaaCCC",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "aaa",
        rightMaybe: "",
        rightOutside: "c",
        rightOutsideNot: "",
        i: {
          rightOutside: true,
        },
      },
      "!"
    ),
    "aaaBBBccc aaazzzCCC !CCC",
    "test 11.7.3 - one match, with flag"
  );
});

test.run();
