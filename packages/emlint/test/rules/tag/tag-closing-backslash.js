import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { deepContains } from "ast-deep-contains";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

function fail(s) {
  throw new Error(s);
}

const BACKSLASH = "\u005C";

// 01. void tag, no "tag-void-slash" rule
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - tight`, () => {
  let str = `<br${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "01.01");
  compare(
    ok,
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
});

test(`02 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - space in front, rule prohibits it`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "02.01");
  compare(
    ok,
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
});

test(`03 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - space in front, rule prohibits it`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), "<br/>", "03.01");
  compare(
    ok,
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
});

test(`04 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - space in front, rule demands it`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "04.01");
});

test(`05 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - one tab, rule demands space`, () => {
  let str = `<br\t${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "05.01");
});

test(`06 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - two tabs, rule demands space`, () => {
  let str = `<br\t\t${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "06.01");
});

test(`07 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - tight`, () => {
  let str = `<br${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "07.01");
});

// 02. void tag, with "tag-void-slash" rule
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - tight`, () => {
  let str = `<br${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2, // default is "always"
    },
  });
  equal(applyFixes(str, messages), "<br/>", "08.01");
  compare(
    ok,
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
});

test(`09 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - tight`, () => {
  let str = `<br${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"], // hardcoded default
    },
  });
  equal(applyFixes(str, messages), "<br/>", "09.01");
  compare(
    ok,
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
});

test(`10 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - tight`, () => {
  let str = `<br${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"], // off
    },
  });
  equal(applyFixes(str, messages), "<br>", "10.01");
  compare(
    ok,
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
});

// SPACE IN FRONT

test(`11 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${"no tag-space-before-closing-bracket"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2, // default
    },
  });
  equal(applyFixes(str, messages), "<br/>", "11.01");
  compare(
    ok,
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
});

test(`12 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${"no tag-space-before-closing-bracket"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"], // hardcoded default
    },
  });
  equal(applyFixes(str, messages), "<br/>", "12.01");
  compare(
    ok,
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
});

test(`13 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, rule prohibits it, ${`\u001b[${35}m${"no tag-space-before-closing-bracket"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"], // off
    },
  });
  equal(applyFixes(str, messages), "<br>", "13.01");
  compare(
    ok,
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
});

// "tag-space-before-closing-bracket" = always

test(`14 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${"tag-space-before-closing-bracket"}\u001b[${39}m`}=${`\u001b[${32}m${"always"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "14.01");
});

test(`15 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${"tag-space-before-closing-bracket"}\u001b[${39}m`}=${`\u001b[${32}m${"always"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"],
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "15.01");
});

test(`16 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${"tag-space-before-closing-bracket"}\u001b[${39}m`}=${`\u001b[${32}m${"always"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"],
      "tag-space-before-closing-bracket": [2, "always"], // doesn't matter!
    },
  });
  equal(applyFixes(str, messages), "<br >", "16.01");
});

// "tag-space-before-closing-bracket" = never

test(`17 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${"tag-space-before-closing-bracket"}\u001b[${39}m`}=${`\u001b[${31}m${"never"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), "<br/>", "17.01");
  compare(
    ok,
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
});

test(`18 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${"tag-space-before-closing-bracket"}\u001b[${39}m`}=${`\u001b[${31}m${"never"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "always"],
      "tag-space-before-closing-bracket": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), "<br/>", "18.01");
  compare(
    ok,
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
});

test(`19 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space in front, ${`\u001b[${36}m${"tag-space-before-closing-bracket"}\u001b[${39}m`}=${`\u001b[${31}m${"never"}\u001b[${39}m`}`, () => {
  let str = `<br  ${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"],
      "tag-space-before-closing-bracket": [2, "never"], // doesn't matter
    },
  });
  equal(applyFixes(str, messages), "<br>", "19.01");
  compare(
    ok,
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
});

// 03 not a void tag
// -----------------------------------------------------------------------------

test(`20 - ${`\u001b[${33}m${"void tag"}\u001b[${39}m`} - not void tag`, () => {
  let str = `<div${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "<div>", "20.01");
  compare(
    ok,
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
});

test(`21 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space request ignored`, () => {
  let str = `<div${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<div >", "21.01");
});

test(`22 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - space request ignored`, () => {
  let str = `<div${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), "<div>", "22.01");
  compare(
    ok,
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
});

test(`23 - ${`\u001b[${33}m${"with tag-void-slash"}\u001b[${39}m`} - tag-void-slash does not matter`, () => {
  let str = `<div${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
      "tag-void-slash": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<div >", "23.01");
});

// 04. backslash in front of a void tag name
// -----------------------------------------------------------------------------

test(`24 - ${`\u001b[${33}m${"in front of a void tag"}\u001b[${39}m`} - no slash, no opts`, () => {
  let str = `<${BACKSLASH}br>`;
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "24.01");
  compare(
    ok,
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
        idxFrom: 0,
        idxTo: 5,
        message: "Missing slash.",
        fix: {
          ranges: [[4, 5, "/>"]],
        },
      },
    ],
    "24.02"
  );
});

test(`25 - ${`\u001b[${33}m${"in front of a void tag"}\u001b[${39}m`} - slash, no opts`, () => {
  let str = `<${BACKSLASH}br/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "25.01");
  compare(
    ok,
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
});

test(`26 - ${`\u001b[${33}m${"in front of a void tag"}\u001b[${39}m`} - no slash, no opts, whitespace`, () => {
  let str = `<${BACKSLASH}br\t>`;
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "26.01");
});

test(`27 - ${`\u001b[${33}m${"in front of a void tag"}\u001b[${39}m`} - combo with rule "tag-void-slash"`, () => {
  let str = `<${BACKSLASH}br>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": [2, "never"],
    },
  });
  equal(applyFixes(str, messages), "<br>", "27.01");
  compare(
    ok,
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
});

test(`28 - ${`\u001b[${33}m${"in front of a void tag"}\u001b[${39}m`} - no slash, no opts, whitespace`, () => {
  let str = `<${BACKSLASH}br\t>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "28.01");
});

test(`29 - ${`\u001b[${33}m${"in front of a void tag"}\u001b[${39}m`} - no slash, no opts, whitespace`, () => {
  let str = `<${BACKSLASH}br >`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
      "tag-void-slash": 2,
      "tag-space-before-closing-bracket": [2, "always"],
    },
  });
  equal(applyFixes(str, messages), "<br />", "29.01");
  compare(
    ok,
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
        idxFrom: 0,
        idxTo: 6,
        message: "Missing slash.",
        fix: {
          ranges: [[5, 6, "/>"]],
        },
      },
    ],
    "29.02"
  );
});

// 05. backslash in front of a non-void tag name
// -----------------------------------------------------------------------------

test(`30 - ${`\u001b[${33}m${"in front of a non-void tag"}\u001b[${39}m`} - div, tight`, () => {
  let str = `<${BACKSLASH}div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "<div>", "30.01");
  compare(
    ok,
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
});

test(`31 - ${`\u001b[${33}m${"in front of a non-void tag"}\u001b[${39}m`} - div, leading space`, () => {
  let str = `< ${BACKSLASH}div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "< div>", "31.01");
  compare(
    ok,
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
});

test(`32 - ${`\u001b[${33}m${"in front of a non-void tag"}\u001b[${39}m`} - div, trailing space`, () => {
  let str = `<${BACKSLASH} div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "< div>", "32.01");
  compare(
    ok,
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
});

test(`33 - ${`\u001b[${33}m${"in front of a non-void tag"}\u001b[${39}m`} - div, spaced`, () => {
  let str = `< ${BACKSLASH} div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-closing-backslash": 2,
    },
  });
  equal(applyFixes(str, messages), "<  div>", "33.01");
  compare(
    ok,
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
});

// 06. extreme case - backslashes on both sides
// -----------------------------------------------------------------------------

test(`34 - ${`\u001b[${36}m${"both sides"}\u001b[${39}m`} - extreme case`, () => {
  let str = `<${BACKSLASH}br${BACKSLASH}>`;
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  equal(applyFixes(str, messages), "<br/>", "34.01");
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
    equal,
    fail
  );
});

test.run();
