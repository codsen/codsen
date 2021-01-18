// rule: tag-closing-backslash
// -----------------------------------------------------------------------------

import tap from "tap";
import { deepContains } from "ast-deep-contains";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

const BACKSLASH = "\u005C";

// 01. void tag, no "tag-void-slash" rule
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - tight`, (t) => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  t.equal(applyFixes(str, messages), "<br/>", "01.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 4, "/"]],
        },
      },
    ],
    "01.02"
  );
  t.end();
});

tap.test(
  `02 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - space in front, rule prohibits it`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, "/"]],
          },
        },
      ],
      "02.02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - space in front, rule prohibits it`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, "/"]],
          },
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - space in front, rule demands it`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 6, "/"]],
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - one tab, rule demands space`,
  (t) => {
    const str = `<br\t${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 5,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 5, " /"]],
          },
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - two tabs, rule demands space`,
  (t) => {
    const str = `<br\t\t${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, " /"]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(`07 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - tight`, (t) => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), "<br />", "07.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 4, " /"]],
        },
      },
    ],
    "07.02"
  );
  t.end();
});

// 02. void tag, with "tag-void-slash" rule
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tight`,
  (t) => {
    const str = `<br${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": 2, // default is "always"
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 4, "/"]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tight`,
  (t) => {
    const str = `<br${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "always"], // hardcoded default
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 4, "/"]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tight`,
  (t) => {
    const str = `<br${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "never"], // off
      },
    });
    t.equal(applyFixes(str, messages), "<br>", "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          message: "Delete this.",
          fix: {
            ranges: [[3, 4]],
          },
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// SPACE IN FRONT

tap.test(
  `11 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${`no tag-space-before-closing-slash`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": 2, // default
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, "/"]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${`no tag-space-before-closing-slash`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "always"], // hardcoded default
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, "/"]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${`no tag-space-before-closing-slash`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "never"], // off
      },
    });
    t.equal(applyFixes(str, messages), "<br>", "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Delete this.",
          fix: {
            ranges: [[3, 6]],
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

// "tag-space-before-closing-slash" = always

tap.test(
  `14 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${32}m${`always`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 6, "/"]],
          },
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${32}m${`always`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "always"],
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 6, "/"]],
          },
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${32}m${`always`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "never"],
        "tag-space-before-closing-slash": [2, "always"], // doesn't matter!
      },
    });
    t.equal(applyFixes(str, messages), "<br>", "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Delete this.",
          fix: {
            ranges: [[3, 6]],
          },
        },
      ],
      "16.02"
    );
    t.end();
  }
);

// "tag-space-before-closing-slash" = never

tap.test(
  `17 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${31}m${`never`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": 2,
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, "/"]],
          },
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${31}m${`never`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "always"],
        "tag-space-before-closing-slash": [2, "never"],
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[3, 6, "/"]],
          },
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${31}m${`never`}\u001b[${39}m`}`,
  (t) => {
    const str = `<br  ${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "never"],
        "tag-space-before-closing-slash": [2, "never"], // doesn't matter
      },
    });
    t.equal(applyFixes(str, messages), "<br>", "19.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 3,
          idxTo: 6,
          message: "Delete this.",
          fix: {
            ranges: [[3, 6]],
          },
        },
      ],
      "19.02"
    );
    t.end();
  }
);

// 03 not a void tag
// -----------------------------------------------------------------------------

tap.test(
  `20 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - not void tag`,
  (t) => {
    const str = `<div${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<div>", "20.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Delete this.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space request ignored`,
  (t) => {
    const str = `<div${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<div>", "21.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Delete this.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "21.02"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space request ignored`,
  (t) => {
    const str = `<div${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), "<div>", "22.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-missing-closing",
          severity: 2,
          idxFrom: 0,
          idxTo: 6,
          message: "Closing tag is missing.",
          fix: null,
        },
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Delete this.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "22.02"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tag-void-slash does not matter`,
  (t) => {
    const str = `<div${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-space-before-closing-slash": [2, "always"],
        "tag-void-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<div>", "23.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Delete this.",
          fix: {
            ranges: [[4, 5]],
          },
        },
      ],
      "23.02"
    );
    t.end();
  }
);

// 04. backslash in front of a void tag name
// -----------------------------------------------------------------------------

tap.test(
  `24 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts`,
  (t) => {
    const str = `<${BACKSLASH}br>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "24.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 4,
          idxTo: 4,
          message: "Missing slash.",
          fix: {
            ranges: [[4, 4, "/"]],
          },
        },
      ],
      "24.02"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - slash, no opts`,
  (t) => {
    const str = `<${BACKSLASH}br/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "25.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
      ],
      "25.02"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts, whitespace`,
  (t) => {
    const str = `<${BACKSLASH}br\t>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "26");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - combo with rule "tag-void-slash"`,
  (t) => {
    const str = `<${BACKSLASH}br>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": [2, "never"],
      },
    });
    t.equal(applyFixes(str, messages), "<br>", "27.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
      ],
      "27.02"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts, whitespace`,
  (t) => {
    const str = `<${BACKSLASH}br\t>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "28.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Missing slash.",
          fix: {
            ranges: [[4, 5, " /"]],
          },
        },
      ],
      "28.02"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts, whitespace`,
  (t) => {
    const str = `<${BACKSLASH}br >`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
        "tag-void-slash": 2,
        "tag-space-before-closing-slash": [2, "always"],
      },
    });
    t.equal(applyFixes(str, messages), "<br />", "29.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
        {
          ruleId: "tag-void-slash",
          severity: 2,
          idxFrom: 5,
          idxTo: 5,
          message: "Missing slash.",
          fix: {
            ranges: [[5, 5, "/"]],
          },
        },
      ],
      "29.02"
    );
    t.end();
  }
);

// 05. backslash in front of a non-void tag name
// -----------------------------------------------------------------------------

tap.test(
  `30 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, tight`,
  (t) => {
    const str = `<${BACKSLASH}div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<div>", "30.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
      ],
      "30.02"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, leading space`,
  (t) => {
    const str = `< ${BACKSLASH}div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "< div>", "31.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 2,
          idxTo: 3,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[2, 3]],
          },
        },
      ],
      "31.02"
    );
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, trailing space`,
  (t) => {
    const str = `<${BACKSLASH} div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "< div>", "32.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
      ],
      "32.02"
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, spaced`,
  (t) => {
    const str = `< ${BACKSLASH} div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-closing-backslash": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<  div>", "33.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 2,
          idxTo: 3,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[2, 3]],
          },
        },
      ],
      "33.02"
    );
    t.end();
  }
);

// 06. extreme case - backslashes on both sides
// -----------------------------------------------------------------------------

tap.test(
  `34 - ${`\u001b[${36}m${`both sides`}\u001b[${39}m`} - extreme case`,
  (t) => {
    const str = `<${BACKSLASH}br${BACKSLASH}>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    t.equal(applyFixes(str, messages), "<br/>", "34");
    deepContains(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
        },
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 5, "/"]],
          },
        },
      ],
      t.is,
      t.fail
    );
    t.end();
  }
);
