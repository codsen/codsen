import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// 01. basic
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - don't raise on void tags`,
  (t) => {
    const str = "</br>";
    const fixed = "<br>";
    const messages = verify(t, str, {
      rules: {
        "tag-void-frontal-slash": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "01.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-void-frontal-slash",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: `Remove frontal slash.`,
          fix: { ranges: [[1, 2]] },
        },
      ],
      "01.02"
    );
    t.is(messages.length, 1, "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - fixed completely, severity 1`,
  (t) => {
    const str = "</br>";
    const fixed = "<br/>";
    const messages = verify(t, str, {
      rules: {
        tag: 1,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "02.01");
    t.match(
      messages,
      [
        {
          severity: 1,
          message: "Remove frontal slash.",
          fix: {
            ranges: [[1, 2]],
          },
          ruleId: "tag-void-frontal-slash",
          idxFrom: 0,
          idxTo: 5,
        },
        {
          severity: 1,
          ruleId: "tag-void-slash",
          message: "Missing slash.",
          idxFrom: 0,
          idxTo: 5,
          fix: {
            ranges: [[4, 4, "/"]],
          },
        },
      ],
      "02.02"
    );
    t.equal(messages.length, 2, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - fixed completely, severity 2`,
  (t) => {
    const str = "</br>";
    const fixed = "<br/>";
    const messages = verify(t, str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "03.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          message: "Remove frontal slash.",
          fix: {
            ranges: [[1, 2]],
          },
          ruleId: "tag-void-frontal-slash",
          idxFrom: 0,
          idxTo: 5,
        },
        {
          severity: 2,
          ruleId: "tag-void-slash",
          message: "Missing slash.",
          idxFrom: 0,
          idxTo: 5,
          fix: {
            ranges: [[4, 4, "/"]],
          },
        },
      ],
      "03.02"
    );
    t.equal(messages.length, 2, "03.03");
    t.end();
  }
);
