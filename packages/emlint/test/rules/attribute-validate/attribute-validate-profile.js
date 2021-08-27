import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 0`,
  (t) => {
    const str = `<head><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 1`,
  (t) => {
    const str = `<head><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 2`,
  (t) => {
    const str = `<head><form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, one URI`,
  (t) => {
    const str = `<head profile="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, two URI's`,
  (t) => {
    const str = `<head profile="https://codsen.com https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
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
    const str = `<div profile='https://codsen.com'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-profile",
          idxFrom: 5,
          idxTo: 33,
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
    const str = `<zzz profile="https://codsen.com" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-profile",
          idxFrom: 5,
          idxTo: 33,
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
  `08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two non-URI's`,
  (t) => {
    const str = `<head profile="z?? y??">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
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
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<head profile=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<head profile="https://codsen.com">`,
      "09.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-profile",
          idxFrom: 15,
          idxTo: 16,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[15, 16]],
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
    // notice wrong tag name case:
    const str = `<HEAD profile=" abc?? ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-profile": 2,
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<head profile="abc??">`, "10.01");
    t.match(
      messages,
      [
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
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
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
    t.equal(applyFixes(str, messages), `<head profile="abc. def.">`, "11.01");
    t.match(
      messages,
      [
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
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - first space retained`,
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
      `<head profile="https://codsen.com https://detergent.io">`,
      "12.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-profile",
          idxFrom: 33,
          idxTo: 37,
          message: `Should be a single space.`,
          fix: {
            ranges: [[34, 37]], // <---- notice we keep space at index 33
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - last space retained`,
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
      `<head profile="https://codsen.com https://detergent.io">`,
      "13.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-profile",
          idxFrom: 33,
          idxTo: 37,
          message: `Should be a single space.`,
          fix: {
            ranges: [[33, 36]], // <---- notice we keep space at index 36
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - all tabs`,
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
      `<head profile="https://codsen.com https://detergent.io">`,
      "14.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-profile",
          idxFrom: 33,
          idxTo: 37,
          message: `Should be a single space.`,
          fix: {
            ranges: [[33, 37, " "]], // <---- we need intervention here, replacing whole thing with a space
          },
        },
      ],
      "14.02"
    );
    t.end();
  }
);
