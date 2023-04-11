// Quick Take

import { strict as assert } from "assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

(async () => {
  assert.equal(
    (await remark().use(fixTypography, {}).process("Yes that's true but..."))
      .toString()
      .trim(),
    "Yes that\u2019s true\u00A0but\u2026"
  );
})();
