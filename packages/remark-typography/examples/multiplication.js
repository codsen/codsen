// Convert a multiplication marker

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

assert.equal(
  remark().use(fixTypography).processSync("3 x 4").toString().trim(),
  "3 × 4",
);
