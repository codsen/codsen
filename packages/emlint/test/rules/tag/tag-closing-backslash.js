// avanotonly

// rule: tag-closing-backslash
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

const BACKSLASH = "\u005C";

// 01. void tag, no "tag-void-slash" rule
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - tight`, t => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 4, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.02 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - space in front, rule prohibits it`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": 2
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - space in front, rule prohibits it`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "never"]
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.04 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - space in front, rule demands it`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[4, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.05 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - one tab, rule demands space`, t => {
  const str = `<br\t${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 5,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 5, " /"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.06 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - two tabs, rule demands space`, t => {
  const str = `<br\t\t${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, " /"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.07 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - tight`, t => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 4, " /"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 02. void tag, with "tag-void-slash" rule
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tight`, t => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2 // default is "always"
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 4, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.02 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tight`, t => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"] // hardcoded default
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 4, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.03 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tight`, t => {
  const str = `<br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"] // off
    }
  });
  t.is(applyFixes(str, messages), "<br>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        message: "Delete this.",
        fix: {
          ranges: [[3, 4]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// SPACE IN FRONT

test(`02.04 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${`no tag-space-before-closing-slash`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2 // default
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.05 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${`no tag-space-before-closing-slash`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"] // hardcoded default
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.06 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${`no tag-space-before-closing-slash`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"] // off
    }
  });
  t.is(applyFixes(str, messages), "<br>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Delete this.",
        fix: {
          ranges: [[3, 6]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// "tag-space-before-closing-slash" = always

test(`02.07 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${32}m${`always`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[4, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.08 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${32}m${`always`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"],
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[4, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.09 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${32}m${`always`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"],
      "tag-space-before-closing-slash": [2, "always"] // doesn't matter!
    }
  });
  t.is(applyFixes(str, messages), "<br>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Delete this.",
        fix: {
          ranges: [[3, 6]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// "tag-space-before-closing-slash" = never

test(`02.10 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${31}m${`never`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-slash": [2, "never"]
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.11 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${31}m${`never`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"],
      "tag-space-before-closing-slash": [2, "never"]
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[3, 6, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.12 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${`tag-space-before-closing-slash`}\u001b[${39}m`}=${`\u001b[${31}m${`never`}\u001b[${39}m`}`, t => {
  const str = `<br  ${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"],
      "tag-space-before-closing-slash": [2, "never"] // doesn't matter
    }
  });
  t.is(applyFixes(str, messages), "<br>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 3,
        idxTo: 6,
        message: "Delete this.",
        fix: {
          ranges: [[3, 6]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 03 not a void tag
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - not void tag`, t => {
  const str = `<div${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Delete this.",
        fix: {
          ranges: [[4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`03.02 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space request ignored`, t => {
  const str = `<div${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Delete this.",
        fix: {
          ranges: [[4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`03.03 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - space request ignored`, t => {
  const str = `<div${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Delete this.",
        fix: {
          ranges: [[4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`03.04 - ${`\u001b[${33}m${`with tag-void-slash`}\u001b[${39}m`} - tag-void-slash does not matter`, t => {
  const str = `<div${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-slash": [2, "always"],
      "tag-void-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Delete this.",
        fix: {
          ranges: [[4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 04. backslash in front of a void tag name
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts`, t => {
  const str = `<${BACKSLASH}br>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
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
          ranges: [[1, 2]]
        }
      },
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 4,
        idxTo: 4,
        message: "Missing slash.",
        fix: {
          ranges: [[4, 4, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`04.02 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - slash, no opts`, t => {
  const str = `<${BACKSLASH}br/>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
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
          ranges: [[1, 2]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`04.03 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts, whitespace`, t => {
  const str = `<${BACKSLASH}br\t>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
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
          ranges: [[1, 2]]
        }
      },
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Missing slash.",
        fix: {
          ranges: [[4, 5, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`04.04 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - combo with rule "tag-void-slash"`, t => {
  const str = `<${BACKSLASH}br>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"]
    }
  });
  t.is(applyFixes(str, messages), "<br>");
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
          ranges: [[1, 2]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`04.05 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts, whitespace`, t => {
  const str = `<${BACKSLASH}br\t>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
  console.log(
    `${`\u001b[${33}m${`messages`}\u001b[${39}m`} = ${JSON.stringify(
      messages,
      null,
      4
    )}`
  );
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
          ranges: [[1, 2]]
        }
      },
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Missing slash.",
        fix: {
          ranges: [[4, 5, " /"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`04.06 - ${`\u001b[${33}m${`in front of a void tag`}\u001b[${39}m`} - no slash, no opts, whitespace`, t => {
  const str = `<${BACKSLASH}br >`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-slash": [2, "always"]
    }
  });
  t.is(applyFixes(str, messages), "<br />");
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
          ranges: [[1, 2]]
        }
      },
      {
        ruleId: "tag-void-slash",
        severity: 2,
        idxFrom: 5,
        idxTo: 5,
        message: "Missing slash.",
        fix: {
          ranges: [[5, 5, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 05. backslash in front of a non-void tag name
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, tight`, t => {
  const str = `<${BACKSLASH}div>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<div>");
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
          ranges: [[1, 2]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`05.02 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, leading space`, t => {
  const str = `< ${BACKSLASH}div>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 1,
        idxTo: 3,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[1, 3]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`05.03 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, trailing space`, t => {
  const str = `<${BACKSLASH} div>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 1,
        idxTo: 3,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[1, 3]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`05.04 - ${`\u001b[${33}m${`in front of a non-void tag`}\u001b[${39}m`} - div, spaced`, t => {
  const str = `< ${BACKSLASH} div>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-closing-backslash": 2
    }
  });
  t.is(applyFixes(str, messages), "<div>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 1,
        idxTo: 4,
        message: "Wrong slash - backslash.",
        fix: {
          ranges: [[1, 4]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 06. extreme case - backslashes on both sides
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${36}m${`both sides`}\u001b[${39}m`} - extreme case`, t => {
  const str = `<${BACKSLASH}br${BACKSLASH}>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  t.is(applyFixes(str, messages), "<br/>");
  console.log(
    `${`\u001b[${33}m${`messages`}\u001b[${39}m`} = ${JSON.stringify(
      messages,
      null,
      4
    )}`
  );
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
          ranges: [[1, 2]]
        }
      },
      {
        ruleId: "tag-closing-backslash",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        message: "Replace backslash with slash.",
        fix: {
          ranges: [[4, 5, "/"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});
