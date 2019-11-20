// avanotonly

// rule: bad-named-html-entity-malformed-nbsp
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. missing letters
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - group rule`, t => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-html-entity": 2
    }
  });
  t.is(applyFixes(str, messages), "abc&nbsp;def");
  deepContains(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed NBSP.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.02 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - exact rule`, t => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-malformed-nbsp": 2
    }
  });
  t.is(applyFixes(str, messages), "abc&nbsp;def");
  deepContains(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed NBSP.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${33}m${`void tag`}\u001b[${39}m`} - rule by wildcard`, t => {
  const str = `abc&nsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-*": 2
    }
  });
  t.is(applyFixes(str, messages), "abc&nbsp;def");
  deepContains(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-malformed-nbsp",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Malformed NBSP.",
        fix: {
          ranges: [[3, 8, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});
