import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no valuetype, error level 0`,
  (t) => {
    const str = `<param>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no valuetype, error level 1`,
  (t) => {
    const str = `<param>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no valuetype, error level 2`,
  (t) => {
    const str = `<param>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, param`,
  (t) => {
    const str = `<param valuetype="data">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
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
    const str = `<param valuetype=' data'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<param valuetype='data'>`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 18,
          idxTo: 19,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[18, 19]],
          },
        },
      ],
      "05.02"
    );
    t.is(messages.length, 1, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<param valuetype='data '>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<param valuetype='data'>`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 22,
          idxTo: 23,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[22, 23]],
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
    const str = `<param valuetype='  data  \t'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<param valuetype='data'>`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 18,
          idxTo: 27,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [18, 20],
              [24, 27],
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
    const str = `<param valuetype="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 18,
          idxTo: 21,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div valuetype="data">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 5,
          idxTo: 21,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz valuetype="data">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 5,
          idxTo: 21,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 04. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - out-of-whack value`,
  (t) => {
    const str = `<param valuetype="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 18,
          idxTo: 25,
          message: `Should be "data|ref|object".`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`validation`}\u001b[${39}m`} - wrong case`,
  (t) => {
    const str = `<param valuetype="DATA">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-valuetype": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<param valuetype="data">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-valuetype",
          idxFrom: 18,
          idxTo: 22,
          message: `Should be lowercase.`,
          fix: {
            ranges: [[18, 22, "data"]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);
