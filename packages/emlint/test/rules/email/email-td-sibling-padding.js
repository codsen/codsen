import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - all severity levels`,
  (t) => {
    const str = `<table>
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
    const messages1 = verify(t, str, {
      rules: {
        "email-td-sibling-padding": 0,
      },
    });
    t.equal(applyFixes(str, messages1), str, "01.01");
    t.strictSame(messages1, [], "01.02");

    // severity: warn (1)
    const messages2 = verify(t, str, {
      rules: {
        "email-td-sibling-padding": 1,
      },
    });
    t.equal(applyFixes(str, messages2), str, "01.03");
    t.match(
      messages2,
      [
        {
          ruleId: "email-td-sibling-padding",
          severity: 1,
          idxFrom: 30,
          idxTo: 48,
          message: `Don't set padding on TD when sibling TD's are present.`,
          fix: null,
        },
      ],
      "01.04"
    );

    // severity: error (2)
    const messages3 = verify(t, str, {
      rules: {
        "email-td-sibling-padding": 2,
      },
    });
    t.equal(applyFixes(str, messages3), str, "01.05");
    t.match(
      messages3,
      [
        {
          ruleId: "email-td-sibling-padding",
          severity: 2,
          idxFrom: 30,
          idxTo: 48,
          message: `Don't set padding on TD when sibling TD's are present.`,
          fix: null,
        },
      ],
      "01.06"
    );

    t.end();
  }
);
