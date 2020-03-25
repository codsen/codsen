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
        "attribute-validate-hreflang": 0,
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
        "attribute-validate-hreflang": 1,
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
        "attribute-validate-hreflang": 2,
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
    const str = `<a href="https://codsen.com" hreflang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
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
    const str = `<link href="https://codsen.com" hreflang="hy-Latn-IT-arevela">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
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
    const str = `<div hreflang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 5,
        idxTo: 18,
        message: `Tag "div" can't have this attribute.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz hreflang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 5,
        idxTo: 18,
        message: `Tag "zzz" can't have this attribute.`,
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
    const str = `<a hreflang="a-DE">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 13,
        idxTo: 17,
        message: `Starts with singleton, "a".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<a hreflang=" de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a hreflang="de">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 13,
        idxTo: 14,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[13, 14]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    // notice wrong tag name case - it won't get reported because
    // that's different rule and we didn't ask for it
    const str = `<A hreflang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<A hreflang="123">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 13,
        idxTo: 18,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [13, 14],
            [17, 18],
          ],
        },
      },
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 14,
        idxTo: 17,
        message: `Unrecognised language subtag, "123".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    const str = `<A hreflang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a hreflang="123">`);
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        idxFrom: 1,
        idxTo: 2,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 2, "a"]],
        },
      },
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 13,
        idxTo: 18,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [13, 14],
            [17, 18],
          ],
        },
      },
      {
        ruleId: "attribute-validate-hreflang",
        idxFrom: 14,
        idxTo: 17,
        message: `Unrecognised language subtag, "123".`,
        fix: null,
      },
    ]);
    t.end();
  }
);
