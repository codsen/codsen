import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

// const leftSingleQuote = "\u2018";
const ellipsis = "\u2026";
const rightSingleQuote = "\u2019";
const rawNbsp = "\u00A0";
// const leftDoubleQuote = "\u201C";
// const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";
// const nDash = "\u2013";
// const mDash = "\u2014";

// -----------------------------------------------------------------------------

test(`01 - apostrophes and ellipsis`, async () => {
  equal(
    (await remark().use(fixTypography, {}).process("Yes that's true but..."))
      .toString()
      .trim(),
    `Yes that${rightSingleQuote}s true${rawNbsp}but${ellipsis}`,
    "01.01"
  );
});

test(`02 - tackles strictly three dot sequences, nothing else`, async () => {
  let source =
    "Pragmatical croodles..............page 11\nInconsequential brapples..............page 21";
  equal(
    (await remark().use(fixTypography, {}).process(source)).toString().trim(),
    source,
    "02.01"
  );
});

test.run();
