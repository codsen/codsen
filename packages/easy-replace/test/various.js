import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// random tests from the front lines
// ==============================

tap.test("01 - special case #1", (t) => {
  t.equal(
    er(
      "&fnof;",
      {
        leftOutsideNot: "e",
        leftOutside: "",
        leftMaybe: "&",
        searchFor: "nsp;",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "&nbsp;"
    ),
    "&fnof;",
    "test 14.1"
  );
  t.end();
});

tap.test("02 - special case #2", (t) => {
  t.equal(
    er(
      "🐴 a🦄🐴🦄🍺c a🦄🐴🍺🦄c a🦄🐴🦄c a🐴🍺c 🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: ["🦄", "🍺", "c"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b a🦄b🍺c a🦄b🦄c a🦄bc abc b",
    "test 14.1"
  );
  t.end();
});
