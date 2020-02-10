const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. basic
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - off`, t => {
  const str = "z </b>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 0
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - warn`, t => {
  const str = "z </b>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 1
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "tag-missing-opening",
      severity: 1,
      idxFrom: 2,
      idxTo: 6,
      message: `Opening tag is missing.`,
      fix: null
    }
  ]);
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - err`, t => {
  const str = "z </b>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-missing-opening": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "tag-missing-opening",
      severity: 2,
      idxFrom: 2,
      idxTo: 6,
      message: `Opening tag is missing.`,
      fix: null
    }
  ]);
  t.end();
});

t.test(
  `01.04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - via blanket rule, severity 1`,
  t => {
    const str = "z </b>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 1
      }
    });
    t.equal(applyFixes(str, messages), str, "01.04.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-missing-opening",
          severity: 1,
          idxFrom: 2,
          idxTo: 6,
          message: `Opening tag is missing.`,
          fix: null
        }
      ],
      "01.04.01"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - via blanket rule, severity 2`,
  t => {
    const str = "z </b>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        tag: 2
      }
    });
    t.equal(applyFixes(str, messages), str, "01.05.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-missing-opening",
          severity: 2,
          idxFrom: 2,
          idxTo: 6,
          message: `Opening tag is missing.`,
          fix: null
        }
      ],
      "01.05.02"
    );
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - no issue here`,
  t => {
    const str = "<style>\n\n</style>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-missing-opening": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "01.06.01");
    t.same(messages, [], "01.06.02");
    t.end();
  }
);
