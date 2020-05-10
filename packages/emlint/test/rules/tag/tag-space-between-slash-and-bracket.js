// rule: tag-space-between-slash-and-bracket
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
// import astDeepContains from "ast-deep-contains");

// 1. no opts
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`,
  (t) => {
    const str = "<br/ >";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-between-slash-and-bracket": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-between-slash-and-bracket",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          line: 1,
          column: 5,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "01.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`,
  (t) => {
    const str = "<br/ >";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-between-slash-and-bracket",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          line: 1,
          column: 5,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "02.02");
    t.end();
  }
);

tap.test(`03 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one tab`, (t) => {
  const str = "<br/\t>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2,
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "tag-space-between-slash-and-bracket",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        column: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [[4, 5]],
        },
      },
    ],
    "03.01"
  );
  t.equal(applyFixes(str, messages), "<br/>", "03.02");
  t.end();
});
