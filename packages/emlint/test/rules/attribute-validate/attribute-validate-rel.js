import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rel, error level 0`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rel, error level 1`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rel, error level 2`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`,
  (t) => {
    const str = `<a rel='nofollow'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, link`,
  (t) => {
    const str = `<link rel='nofollow'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, link`,
  (t) => {
    const str = `<link rel="icon" href="https://www.codsen.com/favicon.ico" type="image/x-icon"/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<a rel=' nofollow'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a rel='nofollow'>`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 8,
          idxTo: 9,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[8, 9]],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<a rel='nofollow '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a rel='nofollow'>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 16,
          idxTo: 17,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[16, 17]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<a rel='  nofollow  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a rel='nofollow'>`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 8,
          idxTo: 21,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [8, 10],
              [18, 21],
            ],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<a rel="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 8,
          idxTo: 11,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div rel="nofollow">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 5,
          idxTo: 19,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz rel="nofollow">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 5,
          idxTo: 19,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `13 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`,
  (t) => {
    const str = `<a rel="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 8,
          idxTo: 15,
          message: `Unrecognised value: "tralala".`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case nofollow`,
  (t) => {
    const str = `<a rel="NOFOLLOW">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": 2,
      },
    });
    // all fine
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(messages, [], "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case nofollow`,
  (t) => {
    const str = `<a rel="NOFOLLOW">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rel": [2, "enforceLowercase"],
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<a rel="nofollow">`, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rel",
          idxFrom: 8,
          idxTo: 16,
          message: `Should be lowercase.`,
          fix: {
            ranges: [[8, 16, "nofollow"]],
          },
        },
      ],
      "15.02"
    );
    t.end();
  }
);
