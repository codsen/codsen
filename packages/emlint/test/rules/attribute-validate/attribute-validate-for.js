import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no for, error level 0`,
  (t) => {
    const str = `<label>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no for, error level 1`,
  (t) => {
    const str = `<label>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no for, error level 2`,
  (t) => {
    const str = `<label>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy for`,
  (t) => {
    const str = `<label for='abc'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<label for=" abcde">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<label for="abcde">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 13,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[12, 13]],
        },
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<label for="abcde ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<label for="abcde">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 17,
        idxTo: 18,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[17, 18]],
        },
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - one for, copious whitespace around`,
  (t) => {
    const str = `<label for="  abcde  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<label for="abcde">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 22,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [12, 14],
            [19, 22],
          ],
        },
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<label for="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 15,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<label for="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 12,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - two values, space-separated`,
  (t) => {
    const str = `<label for="abc def">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 19,
        message: `Should be one value, no spaces.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. name checks
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - ${`\u001b[${35}m${`value checks`}\u001b[${39}m`} - value starts with hash`,
  (t) => {
    const str = `<label for="#abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), `<label for="abc">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 13,
        message: `Remove hash.`,
        fix: {
          ranges: [[12, 13]],
        },
      },
    ]);
    t.end();
  }
);

tap.test(
  `03.02 - ${`\u001b[${35}m${`value checks`}\u001b[${39}m`} - value starts with hash`,
  (t) => {
    const str = `<label for=".abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 16,
        message: `Wrong id name.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `03.03 - ${`\u001b[${35}m${`value checks`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `<label for=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-for",
        idxFrom: 12,
        idxTo: 13,
        message: `Wrong id name.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
