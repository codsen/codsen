import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";
import { rawNbsp, rawMDash } from "codsen-utils";

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
