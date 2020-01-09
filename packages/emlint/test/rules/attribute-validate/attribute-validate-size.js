const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 0`,
  t => {
    ["hr", "font", "input", "basefont", "select"].forEach(tagName => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 0
        }
      });
      t.equal(applyFixes(str, messages), str);
      t.same(messages, []);
    });
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 1`,
  t => {
    ["hr", "font", "input", "basefont", "select"].forEach(tagName => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 1
        }
      });
      t.equal(applyFixes(str, messages), str);
      t.same(messages, []);
    });
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no size, error level 2`,
  t => {
    ["hr", "font", "input", "basefont", "select"].forEach(tagName => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 2
        }
      });
      t.equal(applyFixes(str, messages), str);
      t.same(messages, []);
    });
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  t => {
    const str = `<hr size=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    t.equal(applyFixes(str, messages), `<hr size="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 10,
        idxTo: 11,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[10, 11]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<hr size="7 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    t.equal(applyFixes(str, messages), `<hr size="7">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 11,
        idxTo: 12,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[11, 12]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<hr size="  6  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    t.equal(applyFixes(str, messages), `<hr size="6">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 10,
        idxTo: 15,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [10, 12],
            [13, 15]
          ]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  t => {
    const str = `<hr size="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 10,
        idxTo: 13,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<div size="1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 5,
        idxTo: 13,
        message: `Tag "div" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz size="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 5,
        idxTo: 13,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 04. hr
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - string as value`,
  t => {
    const str = `<hr size="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 10,
        idxTo: 11,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - dot as value`,
  t => {
    const str = `<hr size=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 10,
        idxTo: 11,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - a rational number`,
  t => {
    const str = `<hr size="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 11,
        idxTo: 13,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - with units`,
  t => {
    const str = `<hr size="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    t.equal(applyFixes(str, messages), `<hr size="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 11,
        idxTo: 13,
        message: `Remove px.`,
        fix: {
          ranges: [[11, 13]]
        }
      }
    ]);
    t.end();
  }
);

t.test(`04.05 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - zero`, t => {
  const str = `<hr size="0">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, []);
  t.end();
});

t.test(
  `04.06 - ${`\u001b[${35}m${`value - hr`}\u001b[${39}m`} - value like font's with plus`,
  t => {
    const str = `<hr size="+2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 10,
        idxTo: 12,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 05. font
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - healthy font`,
  t => {
    [
      "1",
      "-1",
      "+1",
      "2",
      "-2",
      "+2",
      "3",
      "-3",
      "+3",
      "4",
      "-4",
      "+4",
      "5",
      "-5",
      "+5",
      "6",
      "-6",
      "+6",
      "7",
      "-7",
      "+7"
    ].forEach(value => {
      const str = `<font size="${value}">`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-size": 2
        }
      });
      t.equal(applyFixes(str, messages), str);
      t.same(messages, []);
    });
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - string as value`,
  t => {
    const str = `<font size="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 13,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - dot as value`,
  t => {
    const str = `<font size=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 13,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.04 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - a rational number`,
  t => {
    const str = `<font size="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 13,
        idxTo: 15,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.05 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - with units`,
  t => {
    const str = `<font size="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    t.equal(applyFixes(str, messages), `<font size="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 13,
        idxTo: 15,
        message: `Remove px.`,
        fix: {
          ranges: [[13, 15]]
        }
      }
    ]);
    t.end();
  }
);

t.test(`05.06 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - zero`, t => {
  const str = `<font size="0">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, []);
  t.end();
});

t.test(
  `05.07 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`,
  t => {
    const str = `<font size="8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 13,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.08 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`,
  t => {
    const str = `<font size="+8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 14,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.09 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - eight`,
  t => {
    const str = `<font size="-8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 14,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`05.10 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - 99`, t => {
  const str = `<font size="99">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-size": 2
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-size",
      idxFrom: 12,
      idxTo: 14,
      message: `Should be integer 1-7, plus/minus are optional.`,
      fix: null
    }
  ]);
  t.end();
});

t.test(
  `05.11 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - repeated plus`,
  t => {
    const str = `<font size="++2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 15,
        message: `Repeated plus.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.12 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - repeated plus`,
  t => {
    const str = `<font size="- --2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 17,
        message: `Repeated minus.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.13 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - plus-space-legit digit`,
  t => {
    const str = `<font size="+\t2">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 15,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.14 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - plus-space-bad digit`,
  t => {
    const str = `<font size="+\t99">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-size": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-size",
        idxFrom: 12,
        idxTo: 16,
        message: `Should be integer 1-7, plus/minus are optional.`,
        fix: null
      }
    ]);
    t.end();
  }
);
