const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cite, error level 0`,
  (t) => {
    const str = `<del><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cite, error level 1`,
  (t) => {
    const str = `<del><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cite, error level 2`,
  (t) => {
    const str = `<del><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
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
    const str = `<blockquote cite='https://codsen.com'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
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
    const str = `<div cite='https://codsen.com'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cite",
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
    const str = `<zzz cite="https://codsen.com" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cite",
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
    const str = `<blockquote cite="z??">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cite",
        idxFrom: 18,
        idxTo: 21,
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
    const str = `<blockquote cite=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<blockquote cite="https://codsen.com">`
    );
    t.match(messages, [
      {
        ruleId: "attribute-validate-cite",
        idxFrom: 18,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[18, 19]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    const str = `<blockquote cite=" z?? ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cite": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<blockquote cite="z??">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cite",
        idxFrom: 18,
        idxTo: 23,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [18, 19],
            [22, 23],
          ],
        },
      },
      {
        ruleId: "attribute-validate-cite",
        idxFrom: 19,
        idxTo: 22,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
