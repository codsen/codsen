// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

function makeInput(keyCount) {
  return Object.fromEntries(
    Array.from({ length: keyCount }, (_, index) => [`key${index}`, false]),
  );
}

test("01 - enforces the eager combination limit after overrides", () => {
  equal(combinations(makeInput(13)).length, 8192, "01.01");
  equal(combinations(makeInput(14)).length, 16_384, "01.02");
  throws(
    () => combinations(makeInput(15)),
    /object-boolean-combinations\/combinations\(\): \[THROW_ID_04\].*15 unpinned keys.*32768 rows \(2\^15\).*maximum of 16384/,
    "01.03",
  );
  throws(
    () => combinations(makeInput(54)),
    /object-boolean-combinations\/combinations\(\): \[THROW_ID_04\].*54 unpinned keys.*2\^54 rows.*maximum of 16384/,
    "01.04",
  );
  equal(
    combinations(makeInput(15), { key14: "fixed" }).length,
    16_384,
    "01.05",
  );
});

test.run();
