import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no for, error level 0`,
  (t) => {
    const str = `<label>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no for, error level 1`,
  (t) => {
    const str = `<label>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no for, error level 2`,
  (t) => {
    const str = `<label>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy for`,
  (t) => {
    const str = `<label for='abc'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<label for=" abcde">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<label for="abcde">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 12,
          idxTo: 13,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[12, 13]],
          },
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<label for="abcde ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<label for="abcde">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 17,
          idxTo: 18,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[17, 18]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - one for, copious whitespace around`,
  (t) => {
    const str = `<label for="  abcde  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<label for="abcde">`, "07.01");
    t.match(
      messages,
      [
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
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<label for="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 12,
          idxTo: 15,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<label for="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 7,
          idxTo: 13,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - two values, space-separated`,
  (t) => {
    const str = `<label for="abc def">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 12,
          idxTo: 19,
          message: `Should be one value, no spaces.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. name checks
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`value checks`}\u001b[${39}m`} - value starts with hash`,
  (t) => {
    const str = `<label for="#abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), `<label for="abc">`, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 12,
          idxTo: 13,
          message: `Remove hash.`,
          fix: {
            ranges: [[12, 13]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`value checks`}\u001b[${39}m`} - value starts with hash`,
  (t) => {
    const str = `<label for=".abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 12,
          idxTo: 16,
          message: `Wrong id name.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`value checks`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `<label for=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-for": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-for",
          idxFrom: 12,
          idxTo: 13,
          message: `Wrong id name.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);
