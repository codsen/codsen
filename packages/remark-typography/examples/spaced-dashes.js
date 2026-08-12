// Convert a spaced dash

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

assert.equal(
  remark()
    .use(fixTypography)
    .processSync("Some text - more text.")
    .toString()
    .trim(),
  "Some text — more text.",
);
