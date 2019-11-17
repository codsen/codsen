// avanotonly

// rule: tag-space-between-slash-and-bracket
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 1. no opts
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`, t => {
  const str = "<br/ >";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-between-slash-and-bracket": 2
    }
  });
  deepContains(
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
          ranges: [[4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<br/>");
});

test(`01.02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one tab`, t => {
  const str = "<br/\t>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-between-slash-and-bracket": 2
    }
  });
  deepContains(
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
          ranges: [[4, 5]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<br/>");
});
