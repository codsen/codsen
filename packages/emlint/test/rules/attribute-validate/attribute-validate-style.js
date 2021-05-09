import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no style, error level 0`,
  (t) => {
    const str = `<td>`;
    const messages = verify(t, str, {
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
    const messages = verify(t, str, {
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
    const messages = verify(t, str, {
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
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value`,
  (t) => {
    const str = `<td style="">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 4,
          idxTo: 12,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "05.02"
    );
    t.equal(messages.length, 1, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<td style="  \t">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-style",
          idxFrom: 4,
          idxTo: 15,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "06.02"
    );
    t.equal(messages.length, 1, "06.03");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<td style=" font-size: 10px;">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "07.01"
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
      "07.02"
    );
    t.equal(messages.length, 1, "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<td style="font-size: 10px; ">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;">`,
      "08.01"
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
      "08.02"
    );
    t.equal(messages.length, 1, "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<td style="  font-size: 10px;  ">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<td style="font-size: 10px;">`, "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - whitespace inbetween`,
  (t) => {
    const str = `<td style="font-size:  10px;"></td>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "10.01"
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
      "10.02"
    );
    t.equal(messages.length, 1, "10.03");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size:\t10px;"></td>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<td style="font-size: 10px;"></td>`,
      "11.01"
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
      "11.02"
    );
    t.equal(messages.length, 1, "11.03");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size:\t 10px;"></td>`;
    const fixed = `<td style="font-size: 10px;"></td>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - tab inbetween`,
  (t) => {
    const str = `<td style="font-size: \t10px;"></td>`;
    const fixed = `<td style="font-size: 10px;"></td>`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "13");
    t.end();
  }
);

// wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - wrong parent tag`,
  (t) => {
    const str = `<html style="font-size: 10px;">`;
    const messages = verify(t, str, {
      rules: {
        "attribute-validate-style": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
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
      "14.02"
    );
    t.equal(messages.length, 1, "14.03");
    t.end();
  }
);

// rogue semi
// -----------------------------------------------------------------------------

tap.test(`15 - two semis, tight`, (t) => {
  const str = `<div style="float: left;;"></div>`;
  const fixed = `<div style="float: left;"></div>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "15.01");
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
    "15.02"
  );
  t.equal(messages.length, 1, "15.03");
  t.end();
});

// ESP tokens
// -----------------------------------------------------------------------------

tap.todo(`16 - don't add semi after ESP tokens`, (t) => {
  const str = `<td style="color: red;
    {% if so %}text-align: left;{% endif %}
float: left;">x</td>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-validate-style": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "16");
  t.end();
});
