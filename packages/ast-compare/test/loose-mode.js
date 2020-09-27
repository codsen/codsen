import tap from "tap";
import compare from "../dist/ast-compare.esm";

// loose mode
// -----------------------------------------------------------------------------

tap.test("01 - hungryForWhitespace, empty strings within arrays", (t) => {
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    false,
    "01.01"
  );
  t.strictSame(
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
      }
    ),
    true,
    "01.02"
  );
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      }
    ),
    false,
    "01.03"
  );
  t.strictSame(
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
      }
    ),
    true,
    "01.04"
  );
  t.end();
});
