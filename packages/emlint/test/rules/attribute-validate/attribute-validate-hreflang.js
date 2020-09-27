import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 0`,
  (t) => {
    const str = `<a><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 1`,
  (t) => {
    const str = `<a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 2`,
  (t) => {
    const str = `<a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<a href="https://codsen.com" hreflang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<link href="https://codsen.com" hreflang="hy-Latn-IT-arevela">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div hreflang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-hreflang",
          idxFrom: 5,
          idxTo: 18,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz hreflang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-hreflang",
          idxFrom: 5,
          idxTo: 18,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<a hreflang="a-DE">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-hreflang",
          idxFrom: 13,
          idxTo: 17,
          message: `Starts with singleton, "a".`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<a hreflang=" de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a hreflang="de">`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-hreflang",
          idxFrom: 13,
          idxTo: 14,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[13, 14]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
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
    t.equal(applyFixes(str, messages), `<A hreflang="123">`, "10.01");
    t.match(
      messages,
      [
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
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    const str = `<A hreflang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-hreflang": 2,
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a hreflang="123">`, "11.01");
    t.match(
      messages,
      [
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
      ],
      "11.02"
    );
    t.end();
  }
);
