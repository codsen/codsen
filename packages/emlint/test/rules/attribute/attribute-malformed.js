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
  const str = `<a class"b" id'c'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1
    }
  });
  t.equal(applyFixes(str, messages), `<a class="b" id='c'>`);
  t.match(messages, [
    {
      ruleId: "attribute-malformed",
      severity: 1,
      idxFrom: 3,
      idxTo: 11,
      message: `Equal is missing.`,
      fix: {
        ranges: [[8, 8, "="]]
      }
    },
    {
      ruleId: "attribute-malformed",
      severity: 1,
      idxFrom: 12,
      idxTo: 17,
      message: `Equal is missing.`,
      fix: {
        ranges: [[14, 14, "="]]
      }
    }
  ]);
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - warn`, t => {
  const str = `<a class"b" id'c'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2
    }
  });
  t.equal(applyFixes(str, messages), `<a class="b" id='c'>`);
  t.match(messages, [
    {
      ruleId: "attribute-malformed",
      severity: 2,
      idxFrom: 3,
      idxTo: 11,
      message: `Equal is missing.`,
      fix: {
        ranges: [[8, 8, "="]]
      }
    },
    {
      ruleId: "attribute-malformed",
      severity: 2,
      idxFrom: 12,
      idxTo: 17,
      message: `Equal is missing.`,
      fix: {
        ranges: [[14, 14, "="]]
      }
    }
  ]);
  t.end();
});

// TODO - both mismatching quote types and equal missing

// 02. mis-typed
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = `<td clas="w100p">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 2
    }
  });
  t.equal(applyFixes(str, messages), `<td class="w100p">`);
  t.match(messages, [
    {
      ruleId: "attribute-malformed",
      idxFrom: 4,
      idxTo: 8,
      message: `Probably meant "class".`,
      fix: {
        ranges: [[4, 8, "class"]]
      }
    }
  ]);
  t.end();
});

t.test(`02.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - err`, t => {
  const str = `<td zzzz="w100p">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-malformed": 1
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-malformed",
      idxFrom: 4,
      idxTo: 8,
      message: `Unrecognised attribute "zzzz".`,
      fix: null
    }
  ]);
  t.end();
});

// 03. repeated opening quotes
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double`,
  t => {
    const str = `<table width=""100">\n  zzz\n</table>`;
    const fixed = `<table width="100">\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 1
      }
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed);
    t.match(messages, [
      {
        ruleId: "attribute-malformed",
        idxFrom: 7,
        idxTo: 19,
        message: `Delete repeated opening quotes.`,
        fix: {
          ranges: [[13, 14]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - single`,
  t => {
    const str = `<table width=''100'>\n  zzz\n</table>`;
    const fixed = `<table width='100'>\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 1
      }
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed);
    t.match(messages, [
      {
        ruleId: "attribute-malformed",
        idxFrom: 7,
        idxTo: 19,
        message: `Delete repeated opening quotes.`,
        fix: {
          ranges: [[13, 14]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - single quotes instead of equal`,
  t => {
    const str = `<table width''100'>\n  zzz\n</table>`;
    const fixed = `<table width='100'>\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2
      }
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${32}m${`repeated opening`}\u001b[${39}m`} - double quotes instead of equal`,
  t => {
    const str = `<table width""100">\n  zzz\n</table>`;
    const fixed = `<table width="100">\n  zzz\n</table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-malformed": 2
      }
    });
    // will fix:
    t.equal(applyFixes(str, messages), fixed);
    t.end();
  }
);

// -----------------------------------------------------------------------------
