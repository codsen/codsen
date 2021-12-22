/* eslint no-unused-vars:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

// -----------------------------------------------------------------------------
// isProduction4
// -----------------------------------------------------------------------------

test("01 - isProduction4()", () => {
  equal(isProduction4("a"), true, "01.01");
  equal(isProduction4("Z"), true, "01.02");
  equal(isProduction4("?"), false, "01.03");
  equal(isProduction4("-"), false, "01.04");
  equal(isProduction4("1"), false, "01.05");
  equal(isProduction4(":"), true, "01.06");
  equal(isProduction4("_"), true, "01.07");
  equal(
    isProduction4("\uD800\uDC00"), // #x10000
    true,
    "01.08"
  );
  equal(
    isProduction4("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.09"
  );
});

test.run();
