import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no target, error level 0`,
  (t) => {
    const str = `<a class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no target, error level 1`,
  (t) => {
    const str = `<a class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no target, error level 2`,
  (t) => {
    const str = `<a class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<a target='dynamic'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div target="something">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-target",
          idxFrom: 5,
          idxTo: 23,
          fix: null,
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz target="something" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-target",
          idxFrom: 5,
          idxTo: 23,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

// 03. whitespace
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<a target="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-target",
          idxFrom: 11,
          idxTo: 11,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - surrounding whitespace`,
  (t) => {
    const str = `<a target=" something ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-target": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a target="something">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-target",
          idxFrom: 11,
          idxTo: 22,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [11, 12],
              [21, 22],
            ],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);
