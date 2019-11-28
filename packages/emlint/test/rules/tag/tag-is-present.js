// avanotonly

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 1. no config - nothing happens
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - off`, t => {
  const str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": 0
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

test(`01.02 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - warn`, t => {
  const str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": 1
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

test(`01.03 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": 2
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

// 02. flagging up tags by their names
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - flags one, exact match`, t => {
  const str = "<h1><div><zzz><yo><br/><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": [2, "h1"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[0, 4]]
        }
      },
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 43,
        idxTo: 48,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[43, 48]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<div><zzz><yo><br/><a></a><script></yo>");
});

test(`02.02 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - flags one, match by wildcard`, t => {
  const str = "<h1><div><zzz><yo><br/><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": [2, "h*"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 0,
        idxTo: 4,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[0, 4]]
        }
      },
      {
        ruleId: "tag-is-present",
        severity: 2,
        idxFrom: 43,
        idxTo: 48,
        message: "h1 is not allowed.",
        fix: {
          ranges: [[43, 48]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<div><zzz><yo><br/><a></a><script></yo>");
});
