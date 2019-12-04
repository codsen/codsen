const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 00. false positives
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  t => {
    const str = `<td nowrap >`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  t => {
    const str = `<td nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  t => {
    const str = `<td nowrap/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  t => {
    const str = `<br nowrap />`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  t => {
    const str = `</td nowrap nowrap>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 01. no config
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - off`, t => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 0
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, t => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1
    }
  });
  t.equal(applyFixes(str, messages), `<a b="c" d='e'>`);
  t.match(messages, [
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
  ]);
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = `<a b"c" d'e'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2
    }
  });
  t.equal(applyFixes(str, messages), `<a b="c" d='e'>`);
  t.match(messages, [
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
  ]);
  t.end();
});

// TODO - both mismatching quote types and equal missing
