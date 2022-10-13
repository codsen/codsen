import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

// const leftSingleQuote = "\u2018";
// const ellipsis = "\u2026";
const rightSingleQuote = "\u2019";
const rawNbsp = "\u00A0";
// const leftDoubleQuote = "\u201C";
// const rightDoubleQuote = "\u201D";
// const singlePrime = "\u2032";
// const doublePrime = "\u2033";
// const nDash = "\u2013";
// const mDash = "\u2014";

// -----------------------------------------------------------------------------

test(`01 - code + apostrophe`, async () => {
  equal(
    (
      await remark()
        .use(fixTypography, {})
        .process("The `deno`'s and `verb`'s approaches.")
    )
      .toString()
      .trim(),
    `The \`deno\`${rightSingleQuote}s and \`verb\`${rightSingleQuote}s approaches.`
  );
});

test(`02 - code + apostrophe, widows kick in`, async () => {
  equal(
    (
      await remark()
        .use(fixTypography, {})
        .process("The `deno`'s and `verb`'s approaches are very interesting.")
    )
      .toString()
      .trim(),
    `The \`deno\`${rightSingleQuote}s and \`verb\`${rightSingleQuote}s approaches are very${rawNbsp}interesting.`
  );
});

test.run();
