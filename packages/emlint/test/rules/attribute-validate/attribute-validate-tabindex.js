import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no tabindex, error level 0`,
  (t) => {
    const str = `<textarea>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no tabindex, error level 1`,
  (t) => {
    const str = `<textarea>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no tabindex, error level 2`,
  (t) => {
    const str = `<textarea>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy tabindex`,
  (t) => {
    const str = `<textarea tabindex='1'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
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
    const str = `<textarea tabindex=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<textarea tabindex="1">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 20,
          idxTo: 21,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[20, 21]],
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
    const str = `<textarea tabindex="1 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<textarea tabindex="1">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 21,
          idxTo: 22,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[21, 22]],
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
    const str = `<textarea tabindex="  9  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<textarea tabindex="9">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
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
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<textarea tabindex="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
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

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<textarea tabindex="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 20,
          idxTo: 21,
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
  `10 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<textarea tabindex=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 20,
          idxTo: 21,
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
  `11 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<textarea tabindex="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 21, // <--- tabindexs at the first non-digit char
          idxTo: 23,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(`12 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - with units`, (t) => {
  const str = `<textarea tabindex="1px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  // Can't fix because opts.customPxMessage is on.
  // A user mistakenly set pixels whereas value is a count number.
  t.equal(applyFixes(str, messages), str, "12.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-tabindex",
        idxFrom: 21, // <--- tabindexs at the first non-digit char
        idxTo: 23,
        message: `Tabbing order number should not be in pixels.`,
        fix: null,
      },
    ],
    "12.02"
  );
  t.end();
});

tap.test(`13 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - zero`, (t) => {
  const str = `<textarea tabindex="0">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-tabindex": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "13.01");
  t.match(messages, [], "13.02");
  t.end();
});

tap.test(
  `14 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, textarea`,
  (t) => {
    const str = `<textarea tabindex="01">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 20,
          idxTo: 22,
          message: `Number padded with zero.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, textarea`,
  (t) => {
    const str = `<textarea tabindex="32768">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 20,
          idxTo: 25,
          message: `Maximum, 32767 exceeded.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

// 04. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `16 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div tabindex="9">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 5,
          idxTo: 17,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz tabindex="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-tabindex": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-tabindex",
          idxFrom: 5,
          idxTo: 17,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);
