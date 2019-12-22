const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no charset, error level 0`,
  t => {
    const str = `<a><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no charset, error level 1`,
  t => {
    const str = `<a><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no charset, error level 2`,
  t => {
    const str = `<a><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  t => {
    const str = `<a charset='utf-8'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<div charset='utf-8'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charset",
        idxFrom: 5,
        idxTo: 20,
        message: `Tag "div" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz charset="utf-8" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charset",
        idxFrom: 5,
        idxTo: 20,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<link charset="utf-z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charset",
        idxFrom: 15,
        idxTo: 20,
        message: `Unrecognised value: "utf-z".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - multiple, with space`,
  t => {
    const str = `<a charset="utf-7, utf-8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charset",
        idxFrom: 12,
        idxTo: 24,
        message: `Unrecognised value: "utf-7, utf-8".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - multiple, without space`,
  t => {
    const str = `<a charset="utf-7,utf-8">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-charset": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-charset",
        idxFrom: 12,
        idxTo: 23,
        message: `Unrecognised value: "utf-7,utf-8".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - empty`, t => {
  const str = `<script charset="">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-charset": 2
    }
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-charset",
      idxFrom: 17,
      idxTo: 17,
      message: `Missing value.`,
      fix: null
    }
  ]);
  t.end();
});
