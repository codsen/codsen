import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { remark } from "remark";
import { multiplicationSign, rawNbsp } from "codsen-utils";

import fixTypography from "../dist/remark-typography.esm.js";

// -----------------------------------------------------------------------------

test(`01`, async () => {
  equal(
    (await remark().use(fixTypography, {}).process("10px x 20px x 30px"))
      .toString()
      .trim(),
    `10px ${multiplicationSign} 20px ${multiplicationSign}${rawNbsp}30px`,
    "01.01"
  );
});

test.run();
