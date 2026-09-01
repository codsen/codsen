// Fix apostrophes following inline code nodes

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

assert.equal(
  remark()
    .use(fixTypography)
    .processSync("The `deno`'s and `verb`'s approaches.")
    .toString()
    .trim(),
  "The `deno`’s and `verb`’s\u00A0approaches.",
);
