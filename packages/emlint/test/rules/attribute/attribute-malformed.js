// avanotonly

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 00. false positives
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`, t => {
  const str = `<td nowrap >`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`00.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`, t => {
  const str = `<td nowrap>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`00.03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`, t => {
  const str = `<td nowrap/>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`00.04 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`, t => {
  const str = `<br nowrap />`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`00.05 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`, t => {
  const str = `</td nowrap nowrap>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

// 01. no config
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, t => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, t => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1
    }
  });
  t.is(applyFixes(str, messages), `<a b="c" d='e'>`);
  deepContains(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 1,
        idxFrom: 3,
        idxTo: 7,
        message: `Equal is missing.`,
        fix: {
          ranges: [[4, 4, "="]]
        }
      },
      {
        ruleId: "attribute-malformed",
        severity: 1,
        idxFrom: 8,
        idxTo: 12,
        message: `Equal is missing.`,
        fix: {
          ranges: [[9, 9, "="]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2
    }
  });
  t.is(applyFixes(str, messages), `<a b="c" d='e'>`);
  deepContains(
    messages,
    [
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 3,
        idxTo: 7,
        message: `Equal is missing.`,
        fix: {
          ranges: [[4, 4, "="]]
        }
      },
      {
        ruleId: "attribute-malformed",
        severity: 2,
        idxFrom: 8,
        idxTo: 12,
        message: `Equal is missing.`,
        fix: {
          ranges: [[9, 9, "="]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// TODO - both mismatching quote types and equal missing
