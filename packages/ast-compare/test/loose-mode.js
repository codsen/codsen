import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// loose mode
// -----------------------------------------------------------------------------

test("01 - hungryForWhitespace, empty strings within arrays", () => {
  equal(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      },
    ),
    false,
    "01.01",
  );
  equal(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    true,
    "01.02",
  );
  equal(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
    ),
    false,
    "01.03",
  );
  equal(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    true,
    "01.04",
  );
});

test.run();
