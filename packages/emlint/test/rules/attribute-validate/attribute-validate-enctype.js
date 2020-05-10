import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no enctype, error level 0`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no enctype, error level 1`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no enctype, error level 2`,
  (t) => {
    const str = `<form>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, common`,
  (t) => {
    const str = `<form enctype='text/plain'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, rare MIME type`,
  (t) => {
    const str = `<form enctype="application/dssc+xml">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<form enctype=' text/plain'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form enctype='text/plain'>`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 15,
          idxTo: 16,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[15, 16]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<form enctype='text/plain '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form enctype='text/plain'>`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 25,
          idxTo: 26,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[25, 26]],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<form enctype='  text/plain  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<form enctype='text/plain'>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 15,
          idxTo: 30,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [15, 17],
              [27, 30],
            ],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<form enctype="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 15,
          idxTo: 18,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div enctype="text/plain">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 5,
          idxTo: 25,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz enctype="text/plain">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 5,
          idxTo: 25,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out of whack value`,
  (t) => {
    const str = `<form enctype="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-enctype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-enctype",
          idxFrom: 15,
          idxTo: 22,
          message: `Unrecognised value: "tralala".`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);
