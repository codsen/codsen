// avanotonly

import test from "ava";
import { Linter } from "../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../t-util/util";

// 1. basic tests
test(`01.01 - a single tag`, t => {
  const str = "< a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        column: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[1, 2]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<a>");
});

test(`01.02 - a single closing tag, space before slash`, t => {
  const str = "\n<\t\t/a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 2,
        idxTo: 4,
        line: 2,
        column: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[2, 4]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "\n</a>");
});

test(`01.03 - a single closing tag, space after slash`, t => {
  const str = "\n</\t\ta>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 3,
        idxTo: 5,
        line: 2,
        column: 3,
        message: "Bad whitespace.",
        fix: {
          ranges: [[3, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "\n</a>");
});

test(`01.04 - a single closing tag, space before and after slash`, t => {
  const str = "\n<\t/\ta>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-space-after-opening-bracket",
        severity: 2,
        idxFrom: 2,
        idxTo: 5,
        line: 2,
        column: 2,
        message: "Bad whitespace.",
        fix: {
          ranges: [[2, 3], [4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "\n</a>");
});
