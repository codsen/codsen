import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - no marginheight`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${36}m${`validation`}\u001b[${39}m`} - width in px`,
  (t) => {
    const str = `<frame marginheight="600px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginheight="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        message: `Remove px.`,
      },
    ]);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<frame marginheight=" 600">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginheight="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        message: `Remove whitespace.`,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<frame marginheight="600 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginheight="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        message: `Remove whitespace.`,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - copious whitespace around`,
  (t) => {
    const str = `<frame marginheight="  600  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame marginheight="600">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        message: `Remove whitespace.`,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.04 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and px`,
  (t) => {
    const str = `<frame marginheight="50\tpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 23,
        idxTo: 26,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.05 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - between number and %`,
  (t) => {
    const str = `<frame marginheight="50\t%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 23,
        idxTo: 25,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.06 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<frame marginheight="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 21,
        idxTo: 24,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.07 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`,
  (t) => {
    const str = `<frame marginheight="px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 21,
        idxTo: 23,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.08 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unit only`,
  (t) => {
    const str = `<frame marginheight="%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 21,
        idxTo: 22,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.09 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<frame marginheight="6z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 22,
        idxTo: 23,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.11 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - unrecognised unit`,
  (t) => {
    const str = `<frame marginheight="6 a z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 22,
        idxTo: 26,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.12 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, legit unit`,
  (t) => {
    const str = `<frame marginheight="1a0%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 22,
        idxTo: 25,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.13 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - letter in the middle of digits, bad unit`,
  (t) => {
    const str = `<frame marginheight="1a0z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 22,
        idxTo: 25,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.14 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, %`,
  (t) => {
    const str = `<frame marginheight="100%%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 24,
        idxTo: 26,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `02.15 - ${`\u001b[${36}m${`messy`}\u001b[${39}m`} - duplicate units, px`,
  (t) => {
    const str = `<frame marginheight="100pxpx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 24,
        idxTo: 28,
        message: `Should be integer, no units.`,
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
    const str = `<br marginheight="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 4,
        idxTo: 22,
        fix: null,
      },
    ]);
    t.end();
  }
);

tap.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz marginheight="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-marginheight": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-marginheight",
        idxFrom: 5,
        idxTo: 23,
        fix: null,
      },
    ]);
    t.end();
  }
);
