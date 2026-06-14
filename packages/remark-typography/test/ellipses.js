// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { ellipsis, rawNbsp, rightSingleQuote } from "codsen-utils";
import { remark } from "remark";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

// -----------------------------------------------------------------------------

test("01 - apostrophes and ellipsis", async () => {
  equal(
    (await remark().use(fixTypography, {}).process("Yes that's true but..."))
      .toString()
      .trim(),
    `Yes that${rightSingleQuote}s true${rawNbsp}but${ellipsis}`,
    "01.01",
  );
});

test("02 - tackles strictly three dot sequences, nothing else", async () => {
  let source =
    "Pragmatical croodles..............page 11\nInconsequential brapples..............page 21";
  equal(
    (await remark().use(fixTypography, {}).process(source)).toString().trim(),
    source,
    "02.01",
  );
});

test.run();
