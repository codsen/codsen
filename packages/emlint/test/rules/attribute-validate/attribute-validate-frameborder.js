import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no frameborder, error level 0`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no frameborder, error level 1`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no frameborder, error level 2`,
  (t) => {
    const str = `<frame>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, frame`,
  (t) => {
    const str = `<frame frameborder="1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, iframe`,
  (t) => {
    const str = `<iframe frameborder="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
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
    const str = `<frame frameborder=' 0'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame frameborder='0'>`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
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
    t.is(messages.length, 1, "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<frame frameborder='0 '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame frameborder='0'>`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
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
    const str = `<frame frameborder='  0  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frame frameborder='0'>`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
          idxFrom: 20,
          idxTo: 26,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [20, 22],
              [23, 26],
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
    const str = `<frame frameborder="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
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

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div frameborder="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
          idxFrom: 5,
          idxTo: 20,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz frameborder="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
          idxFrom: 5,
          idxTo: 20,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`,
  (t) => {
    const str = `<frame frameborder="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-frameborder": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-frameborder",
          idxFrom: 20,
          idxTo: 27,
          message: `Should be "0|1".`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);
