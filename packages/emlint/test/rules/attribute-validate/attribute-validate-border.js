import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no border, error level 0`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no border, error level 1`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no border, error level 2`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy border`,
  (t) => {
    const str = `<table border='0'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<table border=" 0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table border="0">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 15,
          idxTo: 16,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[15, 16]],
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
    const str = `<table border="0 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table border="0">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 16,
          idxTo: 17,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[16, 17]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<table border="  0  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table border="0">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 15,
          idxTo: 20,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [15, 17],
              [18, 20],
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
    const str = `<table border="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 15,
          idxTo: 18,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<table border="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 15,
          idxTo: 16,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - value as string, space too`,
  (t) => {
    const str = `<table border=" z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can fix only partially:
    t.equal(applyFixes(str, messages), `<table border="z">`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 15,
          idxTo: 16,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[15, 16]],
          },
        },
        {
          ruleId: "attribute-validate-border",
          idxFrom: 16,
          idxTo: 17,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<table border=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 15,
          idxTo: 16,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<table border="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 16, // <--- starts at the first non-digit char
          idxTo: 18,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, (t) => {
  const str = `<table border="1px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-border": 2,
    },
  });
  // can fix:
  t.equal(applyFixes(str, messages), `<table border="1">`, "13.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-border",
        idxFrom: 16, // <--- starts at the first non-digit char
        idxTo: 18,
        message: `Remove px.`,
        fix: {
          ranges: [[16, 18]],
        },
      },
    ],
    "13.02"
  );
  t.end();
});

// 04. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div border="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 5,
          idxTo: 15,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz border="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-border": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-border",
          idxFrom: 5,
          idxTo: 15,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);
