import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// random tests from the front lines
// ==============================

test("01 - special case #1", () => {
  equal(
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
      "&nbsp;",
    ),
    "&fnof;",
    "test 14.1",
  );
});

test("02 - special case #2", () => {
  equal(
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
      "b",
    ),
    "b a🦄b🍺c a🦄b🦄c a🦄bc abc b",
    "test 14.1",
  );
});

test.run();
