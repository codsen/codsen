// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rawMDash, rawNbsp } from "codsen-utils";
import { remark } from "remark";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import fixTypography from "../dist/remark-typography.esm.js";

// -----------------------------------------------------------------------------

test("01 - spaced m-dashes", async () => {
  equal(
    (await remark().use(fixTypography, {}).process("Some text - more text."))
      .toString()
      .trim(),
    `Some text${rawNbsp}${rawMDash} more${rawNbsp}text.`,
    "01.01",
  );
});

test("02 - ignores tight dashes", async () => {
  equal(
    (await remark().use(fixTypography, {}).process("Some text-more text."))
      .toString()
      .trim(),
    "Some text-more text.",
    "02.01",
  );
});

test.run();
