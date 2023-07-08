import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { expander as e } from "../dist/string-range-expander.esm.js";

// -----------------------------------------------------------------------------

test("01 - one side only", () => {
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
    }),
    [3, 6],
    "01.01",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      extendToOneSide: false,
    }),
    [3, 6],
    "01.02",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      extendToOneSide: "right",
    }),
    [4, 6],
    "01.03",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      extendToOneSide: "left",
    }),
    [3, 5],
    "01.04",
  );
});

test.run();
