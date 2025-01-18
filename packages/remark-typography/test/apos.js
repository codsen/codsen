import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";
import { rightSingleQuote, rawNbsp } from "codsen-utils";

import fixTypography from "../dist/remark-typography.esm.js";

// -----------------------------------------------------------------------------

test("01 - code + apostrophe", async () => {
  equal(
    (
      await remark()
        .use(fixTypography, {})
        .process("The `deno`'s and `verb`'s approaches.")
    )
      .toString()
      .trim(),
    `The \`deno\`${rightSingleQuote}s and \`verb\`${rightSingleQuote}s approaches.`,
    "01.01",
  );
});

test("02 - code + apostrophe, widows kick in", async () => {
  equal(
    (
      await remark()
        .use(fixTypography, {})
        .process("The `deno`'s and `verb`'s approaches are very interesting.")
    )
      .toString()
      .trim(),
    `The \`deno\`${rightSingleQuote}s and \`verb\`${rightSingleQuote}s approaches are very${rawNbsp}interesting.`,
    "02.01",
  );
});

test.run();
