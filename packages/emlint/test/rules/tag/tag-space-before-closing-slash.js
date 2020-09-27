// rule: tag-space-before-closing-slash
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
// import astDeepContains from "ast-deep-contains");

// 1. no opts
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space present, warning`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 1,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 1,
          idxFrom: 3,
          idxTo: 4,
          line: 1,
          column: 4,
          message: "Bad whitespace.",
          fix: {
            ranges: [[3, 4]],
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
  `02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space present, error`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          line: 1,
          column: 4,
          message: "Bad whitespace.",
          fix: {
            ranges: [[3, 4]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space missing, warning`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 1,
      },
    });
    t.strictSame(messages, [], "03.01");
    t.equal(applyFixes(str, messages), str, "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - defaults, no opts, space missing, error`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": 2,
      },
    });
    t.strictSame(messages, [], "04.01");
    t.equal(applyFixes(str, messages), str, "04.02");
    t.end();
  }
);

// 02. space present
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=never, warning`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "never"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 1,
          idxFrom: 3,
          idxTo: 4,
          line: 1,
          column: 4,
          message: "Bad whitespace.",
          fix: {
            ranges: [[3, 4]],
          },
        },
      ],
      "05.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=never, error`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never", "tralala"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          line: 1,
          column: 4,
          message: "Bad whitespace.",
          fix: {
            ranges: [[3, 4]],
          },
        },
      ],
      "06.01"
    );
    t.equal(applyFixes(str, messages), "<br/>", "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=always, warning`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "always"],
      },
    });
    t.strictSame(messages, [], "07.01");
    t.equal(applyFixes(str, messages), str, "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`with opts, space present`}\u001b[${39}m`} - space present, opts=always, error`,
  (t) => {
    const str = "<br />";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.strictSame(messages, [], "08.01");
    t.equal(applyFixes(str, messages), str, "08.02");
    t.end();
  }
);

// 03. space missing
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=always, warning`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "always"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 1,
          idxFrom: 3,
          idxTo: 3,
          line: 1,
          column: 4,
          message: "Missing space.",
          fix: {
            ranges: [[3, 3, " "]],
          },
        },
      ],
      "09.01"
    );
    t.equal(applyFixes(str, messages), "<br />", "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=always, error`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 3,
          idxTo: 3,
          line: 1,
          column: 4,
          message: "Missing space.",
          fix: {
            ranges: [[3, 3, " "]],
          },
        },
      ],
      "10.01"
    );
    t.equal(applyFixes(str, messages), "<br />", "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=never, warning`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [1, "never"],
      },
    });
    t.strictSame(messages, [], "11.01");
    t.equal(applyFixes(str, messages), str, "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`with opts, space missing`}\u001b[${39}m`} - opts=never, error`,
  (t) => {
    const str = "<br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.strictSame(messages, [], "12.01");
    t.equal(applyFixes(str, messages), str, "12.02");
    t.end();
  }
);

// 04. many tags with different situation
// -----------------------------------------------------------------------------

tap.test(
  `13 - ${`\u001b[${35}m${`mixed`}\u001b[${39}m`} - opts=always`,
  (t) => {
    const str = "<br/><hr/><hr /><br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(messages.length, 3, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 3,
          idxTo: 3,
          line: 1,
          column: 4,
          message: "Missing space.",
          fix: {
            ranges: [[3, 3, " "]],
          },
        },
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 8,
          idxTo: 8,
          line: 1,
          column: 9,
          message: "Missing space.",
          fix: {
            ranges: [[8, 8, " "]],
          },
        },
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 19,
          idxTo: 19,
          line: 1,
          column: 20,
          message: "Missing space.",
          fix: {
            ranges: [[19, 19, " "]],
          },
        },
      ],
      "13.02"
    );
    t.equal(applyFixes(str, messages), "<br /><hr /><hr /><br />", "13.03");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`mixed`}\u001b[${39}m`} - opts=never, deletes a space`,
  (t) => {
    const str = "<br/><hr/><hr  /><br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(messages.length, 1, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 13,
          idxTo: 15,
          line: 1,
          column: 14,
          message: "Bad whitespace.",
          fix: {
            ranges: [[13, 15]],
          },
        },
      ],
      "14.02"
    );
    t.equal(applyFixes(str, messages), "<br/><hr/><hr/><br/>", "14.03");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`mixed`}\u001b[${39}m`} - opts=never, deletes a tab`,
  (t) => {
    const str = "<br/><hr/><hr\t/><br/>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(messages.length, 1, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-space-before-closing-slash",
          severity: 2,
          idxFrom: 13,
          idxTo: 14,
          line: 1,
          column: 14,
          message: "Bad whitespace.",
          fix: {
            ranges: [[13, 14]],
          },
        },
      ],
      "15.02"
    );
    t.equal(applyFixes(str, messages), "<br/><hr/><hr/><br/>", "15.03");
    t.end();
  }
);
