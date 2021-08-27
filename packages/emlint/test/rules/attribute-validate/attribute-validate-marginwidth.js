import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no marginwidth`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`,
  (t) => {
    const str = `<frame marginwidth="600px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`, "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          message: `Remove px.`,
        },
      ],
      "02.02"
    );
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<frame marginwidth=" 600">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`, "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          message: `Remove whitespace.`,
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<frame marginwidth="600 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          message: `Remove whitespace.`,
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<frame marginwidth="  600  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginwidth="600">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          message: `Remove whitespace.`,
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`,
  (t) => {
    const str = `<frame marginwidth="50\tpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 22,
          idxTo: 25,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`,
  (t) => {
    const str = `<frame marginwidth="50\t%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 22,
          idxTo: 24,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<frame marginwidth="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 20,
          idxTo: 23,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(`09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<frame marginwidth="px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "09.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 20,
        idxTo: 22,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ],
    "09.02"
  );
  t.end();
});

tap.test(`10 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`, (t) => {
  const str = `<frame marginwidth="%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-marginwidth": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "10.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-marginwidth",
        idxFrom: 20,
        idxTo: 21,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ],
    "10.02"
  );
  t.end();
});

tap.test(
  `11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<frame marginwidth="6z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 21,
          idxTo: 22,
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
  `12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<frame marginwidth="6 a z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 21,
          idxTo: 25,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`,
  (t) => {
    const str = `<frame marginwidth="1a0%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 21,
          idxTo: 24,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`,
  (t) => {
    const str = `<frame marginwidth="1a0z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 21,
          idxTo: 24,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  (t) => {
    const str = `<frame marginwidth="100%%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 23,
          idxTo: 25,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`,
  (t) => {
    const str = `<frame marginwidth="100pxpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 23,
          idxTo: 27,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `17 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<br marginwidth="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 4,
          idxTo: 21,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz marginwidth="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginwidth": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-marginwidth",
          idxFrom: 5,
          idxTo: 22,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);
