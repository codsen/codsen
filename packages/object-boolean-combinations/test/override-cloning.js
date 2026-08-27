// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

test("01 - does not read unmatched override values", () => {
  const fixed = { mode: "safe" };
  const override = { fixed };
  let unrelatedReads = 0;
  Object.defineProperty(override, "unrelated", {
    enumerable: true,
    get() {
      unrelatedReads++;
      throw new Error("unmatched getter must not run");
    },
  });

  const rows = combinations({ fixed: false, varied: false }, override);

  equal(unrelatedReads, 0, "01.01");
  equal(
    rows,
    [
      { varied: false, fixed: { mode: "safe" } },
      { varied: true, fixed: { mode: "safe" } },
    ],
    "01.02",
  );
  is.not(rows[0].fixed, fixed, "01.03");
});

test("02 - clones participating values as one graph", () => {
  const shared = { mode: "safe" };
  const cycle = {};
  cycle.self = cycle;
  const rows = combinations(
    { first: false, second: false, cycle: false, varied: false },
    { first: shared, second: shared, cycle },
  );

  equal(rows.length, 2, "02.01");
  is.not(rows[0].first, shared, "02.02");
  is(rows[0].first, rows[0].second, "02.03");
  is.not(rows[0].cycle, cycle, "02.04");
  is(rows[0].cycle.self, rows[0].cycle, "02.05");
});

test.run();
