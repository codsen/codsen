// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { extractVars as e } from "../dist/string-extract-sass-vars.esm.js";

// -----------------------------------------------------------------------------

test("01 - opts.cb - custom override of a value", () => {
  equal(
    e("$grey: #ccc;", {
      cb: (val) => {
        if (val === "#ccc") {
          return "#cccccc";
        }
        return val;
      },
    }),
    {
      grey: "#cccccc",
    },
    "01.01",
  );
});

test.run();
