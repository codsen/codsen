import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// missing bits
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"broken code"}\u001b[${39}m`} - quotes missing`, () => {
  let s1 = '<abc de=fg hi="jkl">';
  not.ok(isOpening(s1, 0), "01.01");
  ok(
    isOpening(s1, 0, {
      allowCustomTagNames: true,
    }),
    "01.01",
  );
});

test.run();
