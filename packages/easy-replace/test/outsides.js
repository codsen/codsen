import tap from "tap";
import er from "../dist/easy-replace.esm";

// ==============================
// outsides
// ==============================

tap.test("01 - left and right outsides as arrays (majority found)", (t) => {
  t.equal(
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
  t.end();
});

tap.test("02 - left and right outsides as arrays (one found)", (t) => {
  t.equal(
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
  t.end();
});

tap.test("03 - outsides as arrays, beyond found maybes", (t) => {
  t.equal(
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
  t.end();
});

tap.test("04 - outsides as arrays blocking maybes", (t) => {
  t.equal(
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
  t.end();
});

tap.test("05 - maybes matching outsides, blocking them", (t) => {
  t.equal(
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
  t.end();
});

tap.test("06 - maybes matching outsides, blocking them", (t) => {
  t.equal(
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
  t.end();
});

tap.test("07 - maybes matching outsides, found", (t) => {
  t.equal(
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
  t.end();
});

tap.test("08 - maybes matching outsides, mismatching", (t) => {
  t.equal(
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
  t.end();
});

tap.test("09 - rightOutside & with case-insensitive flag", (t) => {
  t.equal(
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
  t.equal(
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
  t.equal(
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
  t.end();
});
