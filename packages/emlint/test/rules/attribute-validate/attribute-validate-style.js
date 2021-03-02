import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 0`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 1`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 2`,
  (t) => {
    const str = `<td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy style, zero`,
  (t) => {
    const str = `<td style='font-size: 10px;'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
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
    const str = `<td style=" font-size: 10px;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "05.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 11,
          idxTo: 12,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[11, 12]],
          },
        },
      ],
      "05.02"
    );
    t.equal(messages.length, 1, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<td style="font-size: 10px; ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "06.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 27,
          idxTo: 28,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[27, 28]],
          },
        },
      ],
      "06.02"
    );
    t.equal(messages.length, 1, "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<td style="  font-size: 10px;  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td style="font-size: 10px;">`, "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - whitespace inbetween`,
  (t) => {
    const str = `<td style="font-size:  10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "08.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 11,
          idxTo: 28,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[22, 23]],
          },
        },
      ],
      "08.02"
    );
    t.equal(messages.length, 1, "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size:\t10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "09.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 21,
          idxTo: 22,
          message: `Replace whitespace.`,
          fix: {
            ranges: [[21, 22, " "]],
          },
        },
      ],
      "09.02"
    );
    t.equal(messages.length, 1, "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size:\t 10px;"></td>`;
    const fixed = `<td style="font-size: 10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size: \t10px;"></td>`;
    const fixed = `<td style="font-size: 10px;"></td>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<td style="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 11,
          idxTo: 14,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.equal(messages.length, 1, "12.03");
    t.end();
  }
);

// wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `13 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - wrong parent tag`,
  (t) => {
    const str = `<html style="font-size: 10px;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 6,
          idxTo: 30,
          fix: null,
        },
      ],
      "13.02"
    );
    t.equal(messages.length, 1, "13.03");
    t.end();
  }
);

// rogue semi
// -----------------------------------------------------------------------------

tap.test(`14 - two semis, tight`, (t) => {
  const str = `<div style="float: left;;"></div>`;
  const fixed = `<div style="float: left;"></div>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "14.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-style",
        idxFrom: 24,
        idxTo: 25,
        message: `Rogue semicolon.`,
        fix: { ranges: [[24, 25]] },
      },
    ],
    "14.02"
  );
  t.equal(messages.length, 1, "14.03");
  t.end();
});
