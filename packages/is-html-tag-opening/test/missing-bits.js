// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// missing bits
// -----------------------------------------------------------------------------

test(`01 - broken code - quotes missing`, () => {
  let s1 = '<abc de=fg hi="jkl">';
  not.ok(isOpening(s1, 0), "01.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "01.01",
  );
});

test.run();
