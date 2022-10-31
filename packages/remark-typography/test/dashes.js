import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

// const leftSingleQuote = "\u2018";
// const ellipsis = "\u2026";
// const rightSingleQuote = "\u2019";
// const leftDoubleQuote = "\u201C";
// const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";
// const nDash = "\u2013";
const mDash = "\u2014";
const rawNbsp = "\u00A0";

// -----------------------------------------------------------------------------

test(`01 - spaced m-dashes`, async () => {
  equal(
    (await remark().use(fixTypography, {}).process("Some text - more text."))
      .toString()
      .trim(),
    `Some text${rawNbsp}${mDash} more${rawNbsp}text.`,
    "01.01"
  );
});

test(`02 - ignores tight dashes`, async () => {
  equal(
    (await remark().use(fixTypography, {}).process("Some text-more text."))
      .toString()
      .trim(),
    `Some text-more text.`,
    "02.01"
  );
});

test.run();
