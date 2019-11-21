// avanotonly

// rule: bad-named-html-entity-multiple-encoding
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. double encoding on nbsp
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, t => {
  const str = `abc&amp;nbsp;def`;
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
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 1`, t => {
  const str = `abc&amp;nbsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-multiple-encoding": 1
    }
  });
  t.is(applyFixes(str, messages), "abc&nbsp;def");
  deepContains(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 1,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 2`, t => {
  const str = `abc&amp;nbsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-multiple-encoding": 2
    }
  });
  t.is(applyFixes(str, messages), "abc&nbsp;def");
  deepContains(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard`, t => {
  const str = `abc&amp;nbsp;def`;
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
        ruleId: "bad-named-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule - off`, t => {
  const str = `abc&amp;nbsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-html-entity": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`01.06 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule, severity level 0 - off`, t => {
  const str = `abc&amp;nbsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-multiple-encoding": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`01.07 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - rule by wildcard - off`, t => {
  const str = `abc&amp;nbsp;def`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "bad-named-html-entity-*": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});
