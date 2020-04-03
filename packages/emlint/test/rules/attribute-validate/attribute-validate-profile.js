const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 0`,
  (t) => {
    const str = `<head><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 1`,
  (t) => {
    const str = `<head><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 2`,
  (t) => {
    const str = `<head><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, one URI`,
  (t) => {
    const str = `<head profile="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, two URI's`,
  (t) => {
    const str = `<head profile="https://codsen.com https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
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
    const str = `<div profile='https://codsen.com'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 5,
        idxTo: 33,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz profile="https://codsen.com" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 5,
        idxTo: 33,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two non-URI's`,
  (t) => {
    const str = `<head profile="z?? y??">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 15,
        idxTo: 18,
        message: `Should be an URI.`,
        fix: null,
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 19,
        idxTo: 22,
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
    const str = `<head profile=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<head profile="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 15,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[15, 16]],
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
    const str = `<HEAD profile=" abc?? ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<head profile="abc??">`);
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        idxFrom: 1,
        idxTo: 5,
        message: `Bad tag name case.`,
        fix: {
          ranges: [[1, 5, "head"]],
        },
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 15,
        idxTo: 22,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [15, 16],
            [21, 22],
          ],
        },
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 16,
        idxTo: 21,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    // notice wrong tag name case:
    const str = `<HEAD profile=" abc. \tdef. ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<head profile="abc. def.">`);
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        idxFrom: 1,
        idxTo: 5,
        message: `Bad tag name case.`,
        fix: {
          ranges: [[1, 5, "head"]],
        },
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 15,
        idxTo: 27,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [15, 16],
            [26, 27],
          ],
        },
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 16,
        idxTo: 20,
        message: `Should be an URI.`,
        fix: null,
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 20,
        idxTo: 22,
        message: `Should be a single space.`,
        fix: {
          ranges: [[21, 22]],
        },
      },
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 22,
        idxTo: 26,
        message: `Should be an URI.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - first space retained`,
  (t) => {
    const str = `<head profile="https://codsen.com \t\t https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // will fix:
    t.equal(
      applyFixes(str, messages),
      `<head profile="https://codsen.com https://detergent.io">`
    );
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 33,
        idxTo: 37,
        message: `Should be a single space.`,
        fix: {
          ranges: [[34, 37]], // <---- notice we keep space at index 33
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - last space retained`,
  (t) => {
    const str = `<head profile="https://codsen.com\t\t\t https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // will fix:
    t.equal(
      applyFixes(str, messages),
      `<head profile="https://codsen.com https://detergent.io">`
    );
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 33,
        idxTo: 37,
        message: `Should be a single space.`,
        fix: {
          ranges: [[33, 36]], // <---- notice we keep space at index 36
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - all tabs`,
  (t) => {
    const str = `<head profile="https://codsen.com\t\t\t\thttps://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // will fix:
    t.equal(
      applyFixes(str, messages),
      `<head profile="https://codsen.com https://detergent.io">`
    );
    t.match(messages, [
      {
        ruleId: "attribute-validate-profile",
        idxFrom: 33,
        idxTo: 37,
        message: `Should be a single space.`,
        fix: {
          ranges: [[33, 37, " "]], // <---- we need intervention here, replacing whole thing with a space
        },
      },
    ]);
    t.end();
  }
);
