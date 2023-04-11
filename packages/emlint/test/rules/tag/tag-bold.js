import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - off`, () => {
  let str = "<bold>z</bold>";
  let messages = verify(not, str, {
    rules: {
      "tag-bold": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - warn`, () => {
  let str = "<bold>z</bold>";
  let messages = verify(not, str, {
    rules: {
      "tag-bold": 1,
    },
  });
  equal(applyFixes(str, messages), "<strong>z</strong>", "02.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 1,
        idxFrom: 0,
        idxTo: 6,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[1, 5, "strong"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 1,
        idxFrom: 7,
        idxTo: 14,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[9, 13, "strong"]],
        },
      },
    ],
    "02.02"
  );
});

test(`03 - ${`\u001b[${33}m${"no config"}\u001b[${39}m`} - err`, () => {
  let str = "<bold>z</bold>";
  let messages = verify(not, str, {
    rules: {
      "tag-bold": 2,
    },
  });
  equal(applyFixes(str, messages), "<strong>z</strong>", "03.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[1, 5, "strong"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[9, 13, "strong"]],
        },
      },
    ],
    "03.02"
  );
});

// 02. config
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${32}m${"config"}\u001b[${39}m`} - config is arr`, () => {
  let str = "<bold>z</bold>";
  let messages = verify(not, str, {
    rules: {
      "tag-bold": [2],
    },
  });
  equal(applyFixes(str, messages), "<strong>z</strong>", "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[1, 5, "strong"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[9, 13, "strong"]],
        },
      },
    ],
    "04.02"
  );
});

test(`05 - ${`\u001b[${32}m${"config"}\u001b[${39}m`} - strong is suggested`, () => {
  let str = "<bold>z</bold>";
  let messages = verify(not, str, {
    rules: {
      "tag-bold": [2, "strong"],
    },
  });
  equal(applyFixes(str, messages), "<strong>z</strong>", "05.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[1, 5, "strong"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[9, 13, "strong"]],
        },
      },
    ],
    "05.02"
  );
});

test(`06 - ${`\u001b[${32}m${"config"}\u001b[${39}m`} - b is suggested`, () => {
  let str = "<bold>z</bold>";
  let messages = verify(not, str, {
    rules: {
      "tag-bold": [2, "b"],
    },
  });
  equal(applyFixes(str, messages), "<b>z</b>", "06.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 0,
        idxTo: 6,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[1, 5, "b"]],
        },
      },
      {
        ruleId: "tag-bold",
        severity: 2,
        idxFrom: 7,
        idxTo: 14,
        message: 'Tag "bold" does not exist in HTML.',
        fix: {
          ranges: [[9, 13, "b"]],
        },
      },
    ],
    "06.02"
  );
});

test.run();
