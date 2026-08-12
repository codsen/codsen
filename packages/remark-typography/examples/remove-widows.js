// Keep the last two words together

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

assert.equal(
  remark()
    .use(fixTypography)
    .processSync("this is a long ending")
    .toString()
    .trim(),
  "this is a long ending",
);
