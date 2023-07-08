import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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
