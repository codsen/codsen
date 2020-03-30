const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 0`,
  (t) => {
    const str = `<a><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 1`,
  (t) => {
    const str = `<a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 2`,
  (t) => {
    const str = `<a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<a href="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<area href="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<link href="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<base href='https://codsen.com'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
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
  (t) => {
    const str = `<div href="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-href",
        idxFrom: 5,
        idxTo: 30,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz href="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-href",
        idxFrom: 5,
        idxTo: 30,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<a href="zzz??">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-href",
        idxFrom: 9,
        idxTo: 14,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<a href=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a href="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-href",
        idxFrom: 9,
        idxTo: 10,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[9, 10]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    // notice wrong tag name case:
    const str = `<A href=" zzz?? ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<A href="zzz??">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-href",
        idxFrom: 9,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [9, 10],
            [15, 16],
          ],
        },
      },
      {
        ruleId: "attribute-validate-href",
        idxFrom: 10,
        idxTo: 15,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - whitespace within a legit URL`,
  (t) => {
    const str = `<a href="https://  codsen .com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-href": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a href="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-href",
        idxFrom: 9,
        idxTo: 30,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [17, 19],
            [25, 26],
          ],
        },
      },
    ]);
    t.end();
  }
);
