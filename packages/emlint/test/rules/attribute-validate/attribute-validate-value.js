import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 0`,
  (t) => {
    ["input", "option", "param", "button", "li"].forEach((tagName) => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-value": 0,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 1`,
  (t) => {
    ["input", "option", "param", "button", "li"].forEach((tagName) => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-value": 1,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 2`,
  (t) => {
    ["input", "option", "param", "button", "li"].forEach((tagName) => {
      const str = `<${tagName}>`;
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-value": 2,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<input value=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input value="1">`, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 14,
          idxTo: 15,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[14, 15]],
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<input value="7 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input value="7">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
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
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<input value="  6  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input value="6">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 14,
          idxTo: 19,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [14, 16],
              [17, 19],
            ],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<input value="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 14,
          idxTo: 17,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div value="9">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 5,
          idxTo: 14,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz value="9" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 5,
          idxTo: 14,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

// 04. input/option/param/button - CDATA type
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${35}m${`value - input/option/param/button`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<input value="Submit form">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(messages, [], "10.02");
    t.end();
  }
);

// 05. li
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<li value="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
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
  `12 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<li value=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 11,
          idxTo: 12,
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
  `13 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<li value="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 12,
          idxTo: 14,
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
  `14 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - with units`,
  (t) => {
    const str = `<li value="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 12,
          idxTo: 14,
          message: `Sequence number should not be in pixels.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - zero`,
  (t) => {
    const str = `<li value="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-value",
          idxFrom: 11,
          idxTo: 12,
          message: `Zero not allowed.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);
