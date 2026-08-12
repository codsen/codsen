// Convert straight quotes and apostrophes

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

assert.equal(
  remark()
    .use(fixTypography)
    .processSync(`'single' and "double"`)
    .toString()
    .trim(),
  "‘single’ and “double”",
);
