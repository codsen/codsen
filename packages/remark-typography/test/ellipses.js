import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";
import { ellipsis, rightSingleQuote, rawNbsp } from "codsen-utils";

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
