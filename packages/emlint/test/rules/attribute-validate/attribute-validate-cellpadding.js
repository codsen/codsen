import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cellpadding, error level 0`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cellpadding, error level 1`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cellpadding, error level 2`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy cellpadding, px without units`,
  (t) => {
    const str = `<table cellpadding='0'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy cellpadding, percentages`,
  (t) => {
    const str = `<table cellpadding="10%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<table cellpadding=" 0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table cellpadding="0">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 20,
          idxTo: 21,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[20, 21]],
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
    const str = `<table cellpadding="0 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table cellpadding="0">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 21,
          idxTo: 22,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[21, 22]],
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
    const str = `<table cellpadding="  0  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table cellpadding="0">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 20,
          idxTo: 25,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [20, 22],
              [23, 25],
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
    const str = `<table cellpadding="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 20,
          idxTo: 23,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<table cellpadding="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 20,
          idxTo: 21,
          message: `Should be integer, either no units or percentage.`,
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
    const str = `<table cellpadding=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 20,
          idxTo: 21,
          message: `Should be integer, either no units or percentage.`,
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
    const str = `<table cellpadding="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 21, // <--- starts at the first non-digit char
          idxTo: 23,
          message: `Should be integer, either no units or percentage.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, (t) => {
  const str = `<table cellpadding="1px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-cellpadding": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), `<table cellpadding="1">`, "13.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-cellpadding",
        idxFrom: 21, // <--- starts at the first non-digit char
        idxTo: 23,
        message: `Remove px.`,
        fix: {
          ranges: [[21, 23]],
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
    const str = `<div cellpadding="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 5,
          idxTo: 20,
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
    const str = `<zzz cellpadding="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cellpadding": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-cellpadding",
          idxFrom: 5,
          idxTo: 20,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);
