// Quick Take

import { strict as assert } from "assert";
import { Linter } from "../dist/emlint.esm.js";
const linter = new Linter();

// Correct "not" type Outlook conditional would be:
// <!--[if !mso]><!-->
//   <span class="foo">z</span>
// <!--<![endif]-->

// We have a "not" type opening but "only" type
// closing:
const messages = linter.verify(
  `<!--[if !mso]><!-->
  <span class="foo">z</span>
<![endif]-->`,
  {
    rules: {
      all: 2,
    },
  }
);

assert.deepEqual(messages, [
  {
    line: 3,
    column: 1,
    severity: 2,
    ruleId: "comment-mismatching-pair",
    message: `Add "<!--".`,
    idxFrom: 49,
    idxTo: 61,
    fix: {
      ranges: [[49, 49, "<!--"]],
    },
    keepSeparateWhenFixing: true,
  },
]);
