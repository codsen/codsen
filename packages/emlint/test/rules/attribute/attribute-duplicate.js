const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 00. false positives
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - value-less attributes`,
  t => {
    const str = `<td class="z"><a class="z">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0
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
    const str = `<td class="z"><a class="z">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0
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
    const str = `<td class="z"><a class="z">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0
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
    const str = `<td nowrap><a class="z">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 01. checks
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - off`, t => {
  const str = `<a class="bb" id="cc" class="dd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-duplicate": 0
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - on`, t => {
  const str = `<a class="bb" id="bb" class="dd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-duplicate": 2
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-duplicate",
      idxFrom: 22,
      idxTo: 32,
      message: `Duplicate attribute "class".`,
      fix: null
    }
  ]);
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - on`, t => {
  const str = `<a class="bb" class="bb" class="dd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-duplicate": 2
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-duplicate", // second and onwards is reported, not first
      idxFrom: 14,
      idxTo: 24,
      message: `Duplicate attribute "class".`,
      fix: null
    },
    {
      ruleId: "attribute-duplicate",
      idxFrom: 25,
      idxTo: 35,
      message: `Duplicate attribute "class".`,
      fix: null
    }
  ]);
  t.end();
});
