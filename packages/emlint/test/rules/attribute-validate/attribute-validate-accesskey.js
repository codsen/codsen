import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accesskey, error level 0`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accesskey, error level 1`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no accesskey, error level 2`,
  (t) => {
    const str = `<a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
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
    const str = `<a accesskey='z'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, encoded`,
  (t) => {
    const str = `<a accesskey="&pound;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div accesskey="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accesskey",
          idxFrom: 5,
          idxTo: 18,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz accesskey="z" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accesskey",
          idxFrom: 5,
          idxTo: 18,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`a wrong value`}\u001b[${39}m`} - more than 1 char, raw`,
  (t) => {
    const str = `z <a accesskey="abc" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accesskey",
          idxFrom: 16,
          idxTo: 19,
          message: `Should be a single character (escaped or not).`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, encoded`,
  (t) => {
    const str = `z <a accesskey=" &pound;">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-accesskey": 2,
      },
    });
    t.equal(applyFixes(str, messages), `z <a accesskey="&pound;">`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-accesskey",
          idxFrom: 16,
          idxTo: 17,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[16, 17]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);
