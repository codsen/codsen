const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no marginwidth`,
  t => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`,
  t => {
    const str = `<frame marginwidth="600px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        message: `Remove px.`
      }
    ]);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`,
  t => {
    const str = `<frame marginwidth=" 600">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        message: `Remove whitespace.`
      }
    ]);
    t.end();
  }
);

t.test(`02.02 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`, t => {
  const str = `<frame marginwidth="600 ">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2
    }
  });
  t.equal(applyFixes(str, messages), `<frame marginwidth="600">`);
  t.match(messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      message: `Remove whitespace.`
    }
  ]);
  t.end();
});

t.test(
  `02.03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<frame marginwidth="  600  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        message: `Remove whitespace.`
      }
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`,
  t => {
    const str = `<frame marginwidth="50\tpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 22,
        idxTo: 25,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`,
  t => {
    const str = `<frame marginwidth="50\t%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 22,
        idxTo: 24,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  t => {
    const str = `<frame marginwidth="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 20,
        idxTo: 23,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`02.07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, t => {
  const str = `<frame marginwidth="px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 20,
      idxTo: 22,
      message: `Should be integer, no units.`,
      fix: null
    }
  ]);
  t.end();
});

t.test(`02.08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, t => {
  const str = `<frame marginwidth="%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-marginwidth",
      idxFrom: 20,
      idxTo: 21,
      message: `Should be integer, no units.`,
      fix: null
    }
  ]);
  t.end();
});

t.test(
  `02.09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  t => {
    const str = `<frame marginwidth="6z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 21,
        idxTo: 22,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  t => {
    const str = `<frame marginwidth="6 a z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 21,
        idxTo: 25,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`,
  t => {
    const str = `<frame marginwidth="1a0%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 21,
        idxTo: 24,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`,
  t => {
    const str = `<frame marginwidth="1a0z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 21,
        idxTo: 24,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  t => {
    const str = `<frame marginwidth="100%%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 23,
        idxTo: 25,
        message: `Should be integer, no units.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`,
  t => {
    const str = `<frame marginwidth="100pxpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 23,
        idxTo: 27,
        message: `Should be integer, no units.`,
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
    const str = `<br marginwidth="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 4,
        idxTo: 21,
        message: `Tag "br" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz marginwidth="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 5,
        idxTo: 22,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);
