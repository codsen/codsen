import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isNumeric } from "../../dist/csv-sort.esm.js";

test("01 - various numeric inputs", () => {
  ["0", "1", "1.1", "99.00"].forEach((input) => {
    ok(isNumeric(input), `the following is actually not numeric: ${input}`);
  });
});

test("02 - various not numeric inputs", () => {
  [true, "true", "1K", "a", null, "null", false, "false", ""].forEach(
    (input) => {
      not.ok(isNumeric(input), `the following is actually numeric: ${input}`);
    },
  );
});

test.run();
