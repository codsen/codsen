import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// searchFor + maybes + outsides
// ==============================

tap.test("01 - maybes and outsides, emoji - full set", (t) => {
  t.equal(
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
  t.end();
});

tap.test("02 - maybes + outsides - 1 of maybes not found #1", (t) => {
  t.equal(
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
  t.end();
});

tap.test("03 - maybes + outsides - 1 of maybes not found #2", (t) => {
  t.equal(
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
  t.end();
});

tap.test("04 - maybes and outsides, emoji - neither of maybes", (t) => {
  t.equal(
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
  t.end();
});

tap.test("05 - multiple findings with maybes and outsides", (t) => {
  t.equal(
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
  t.end();
});

tap.test("06 - multiple findings with maybes and not-outsides", (t) => {
  t.equal(
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
  t.end();
});

tap.test("07 - maybes and outsides, arrays", (t) => {
  t.equal(
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
  t.end();
});
