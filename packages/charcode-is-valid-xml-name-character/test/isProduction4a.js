import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

// -----------------------------------------------------------------------------
// isProduction4a
// -----------------------------------------------------------------------------

test("01 - isProduction4a()", () => {
  equal(isProduction4a("a"), true, "01.01");
  equal(isProduction4a("?"), false, "01.02");
  equal(isProduction4a("-"), true, "01.03");
  equal(isProduction4a("1"), true, "01.04");
  equal(isProduction4a(":"), true, "01.05");
  equal(isProduction4a("_"), true, "01.06");
  equal(
    isProduction4a("\uD800\uDC00"), // #x10000
    true,
    "01.07",
  );
  equal(
    isProduction4a("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.08",
  );
});

test.run();
