import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 0`,
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
      t.same(messages, []);
    });
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 1`,
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
      t.same(messages, []);
    });
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no value, error level 2`,
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
      t.same(messages, []);
    });
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<input value=" 1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input value="1">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 14,
        idxTo: 15,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[14, 15]],
        },
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<input value="7 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input value="7">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 15,
        idxTo: 16,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[15, 16]],
        },
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<input value="  6  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<input value="6">`);
    t.match(messages, [
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
    ]);
    t.end();
  }
);

tap.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<input value="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 14,
        idxTo: 17,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div value="9">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 5,
        idxTo: 14,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz value="9" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 5,
        idxTo: 14,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. input/option/param/button - CDATA type
// -----------------------------------------------------------------------------

tap.test(
  `04.01 - ${`\u001b[${35}m${`value - input/option/param/button`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<input value="Submit form">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, []);
    t.end();
  }
);

// 05. li
// -----------------------------------------------------------------------------

tap.test(
  `05.01 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - string as value`,
  (t) => {
    const str = `<li value="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 11,
        idxTo: 12,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `05.03 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - dot as value`,
  (t) => {
    const str = `<li value=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 11,
        idxTo: 12,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `05.04 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - a rational number`,
  (t) => {
    const str = `<li value="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 12,
        idxTo: 14,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `05.05 - ${`\u001b[${35}m${`value - li`}\u001b[${39}m`} - with units`,
  (t) => {
    const str = `<li value="1px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 12,
        idxTo: 14,
        message: `Sequence number should not be in pixels.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `05.06 - ${`\u001b[${35}m${`value - font`}\u001b[${39}m`} - zero`,
  (t) => {
    const str = `<li value="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-value": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-value",
        idxFrom: 11,
        idxTo: 12,
        message: `Zero not allowed.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
