import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - all severity levels`, () => {
  let str = `<table>
  <tr>
    <td style="padding-top: 10px;">
      a
    </td>
    <td>
      b
    </td>
  </tr>
</table>`;

  // severity: warn (0)
  let messages1 = verify(not, str, {
    rules: {
      "email-td-sibling-padding": 0,
    },
  });
  equal(applyFixes(str, messages1), str, "01.01");
  equal(messages1, [], "01.02");

  // severity: warn (1)
  let messages2 = verify(not, str, {
    rules: {
      "email-td-sibling-padding": 1,
    },
  });
  equal(applyFixes(str, messages2), str, "01.03");
  compare(
    ok,
    messages2,
    [
      {
        ruleId: "email-td-sibling-padding",
        severity: 1,
        idxFrom: 30,
        idxTo: 48,
        message: "Don't set padding on TD when sibling TD's are present.",
        fix: null,
      },
    ],
    "01.04"
  );

  // severity: error (2)
  let messages3 = verify(not, str, {
    rules: {
      "email-td-sibling-padding": 2,
    },
  });
  equal(applyFixes(str, messages3), str, "01.04");
  compare(
    ok,
    messages3,
    [
      {
        ruleId: "email-td-sibling-padding",
        severity: 2,
        idxFrom: 30,
        idxTo: 48,
        message: "Don't set padding on TD when sibling TD's are present.",
        fix: null,
      },
    ],
    "01.06"
  );
});

test.run();
