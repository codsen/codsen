import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// api tests
// -----------------------------------------------------------------------------

test("01 - fourth argument doesn't break anything", () => {
  equal(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, true),
    false,
    "01.01",
  );
  equal(
    compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" }, null, false),
    false,
    "01.02",
  );
});

test.run();
