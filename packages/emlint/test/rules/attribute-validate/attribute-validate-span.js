import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 0`,
  (t) => {
    const str = `<col>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 1`,
  (t) => {
    const str = `<col>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no span, error level 2`,
  (t) => {
    const str = `<col>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy span, zero`,
  (t) => {
    const str = `<col span='1'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy span, non-zero`,
  (t) => {
    const str = `<colgroup span="3">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
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
    const str = `<col span=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<col span="1">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 11,
          idxTo: 12,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[11, 12]],
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
    const str = `<col span="1 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<col span="1">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 12,
          idxTo: 13,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[12, 13]],
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
    const str = `<col span="  1  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<col span="1">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 11,
          idxTo: 16,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [11, 13],
              [14, 16],
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
    const str = `<col span="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 11,
          idxTo: 14,
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
    const str = `<col span="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 11,
          idxTo: 12,
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
    const str = `<col span=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 11,
          idxTo: 12,
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
    const str = `<col span="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 12, // <--- starts at the first non-digit char
          idxTo: 14,
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
  const str = `<col span="1px">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // Can't fix because opts.customPxMessage is on.
  // A user mistakenly set pixels whereas value is a count number.
  t.equal(applyFixes(str, messages), str, "13.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 12, // <--- starts at the first non-digit char
        idxTo: 14,
        message: `Columns number is not in pixels.`,
        fix: null,
      },
    ],
    "13.02"
  );
  t.end();
});

tap.test(`14 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - zero`, (t) => {
  const str = `<col span="0">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-span": 2,
    },
  });
  // can't fix:
  t.equal(applyFixes(str, messages), str, "14.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-span",
        idxFrom: 11,
        idxTo: 12,
        message: `Zero not allowed.`,
        fix: null,
      },
    ],
    "14.02"
  );
  t.end();
});

tap.test(
  `15 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, col`,
  (t) => {
    const str = `<col span="01">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 11,
          idxTo: 13,
          message: `Number padded with zero.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`value`}\u001b[${39}m`} - padded with zero, colgroup`,
  (t) => {
    const str = `<colgroup span="01">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 16,
          idxTo: 18,
          message: `Number padded with zero.`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

// 04. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `17 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div span="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 5,
          idxTo: 13,
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
    const str = `<zzz span="0" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-span": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-span",
          idxFrom: 5,
          idxTo: 13,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);
