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

// 1. basic tests
test("01 - a single tag", () => {
  let str = "< a>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[1, 2]],
        },
      },
    ],
    "01.01"
  );
  equal(applyFixes(str, messages), "<a>", "01.01");
});

test("02 - a single closing tag, space before slash", () => {
  let str = "\n<\t\t/a>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 2,
        idxTo: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [[2, 4]],
        },
      },
    ],
    "02.01"
  );
  equal(applyFixes(str, messages), "\n</a>", "02.01");
});

test("03 - a single closing tag, space after slash", () => {
  let str = "\n</\t\ta>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 3,
        idxTo: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 5]],
        },
      },
    ],
    "03.01"
  );
  equal(applyFixes(str, messages), "\n</a>", "03.01");
});

test("04 - a single closing tag, space before and after slash", () => {
  let str = "\n<\t/\ta>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 2,
        idxTo: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [2, 3],
            [4, 5],
          ],
        },
      },
    ],
    "04.01"
  );
  equal(applyFixes(str, messages), "\n</a>", "04.01");
});

test("05 - in front of repeated slash", () => {
  let str = "< // a>";
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 5,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [1, 2],
            [4, 5],
          ],
        },
      },
    ],
    "05.01"
  );
  equal(applyFixes(str, messages), "<//a>", "05.01");
});

test("06 - in front of backslash", () => {
  let str = `< ${BACKSLASH} a>`;
  let messages = verify(not, str, {
    rules: {
      tag: 2,
    },
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 4,
        message: "Bad whitespace.",
        fix: {
          ranges: [
            [1, 2],
            [3, 4],
          ],
        },
      },
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
    equal,
    fail
  );
  equal(applyFixes(str, messages), "<a>", "06.01");
});

test("07 - should not trigger when opening brackets are missing", () => {
  let str = '<div> div class="x">';
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  equal(messages, [], "07.01");
});

// 02. XML
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${36}m${"XML tags"}\u001b[${39}m`} - basic`, () => {
  let str = '< ?xml version="1.0" encoding="UTF-8"?>';
  let messages = verify(not, str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[1, 2]],
        },
      },
    ],
    "08.01"
  );
  equal(
    applyFixes(str, messages),
    '<?xml version="1.0" encoding="UTF-8"?>',
    "08.01"
  );
});

test.run();
