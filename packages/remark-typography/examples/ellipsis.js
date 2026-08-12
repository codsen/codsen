// Convert a three-dot ellipsis

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

assert.equal(
  remark().use(fixTypography).processSync("Wait...").toString().trim(),
  "Wait…",
);
