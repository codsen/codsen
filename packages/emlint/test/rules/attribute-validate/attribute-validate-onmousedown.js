import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no onmousedown, error level 0`,
  (t) => {
    const str = `<input class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no onmousedown, error level 1`,
  (t) => {
    const str = `<input class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no onmousedown, error level 2`,
  (t) => {
    const str = `<input class="z">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 2,
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
    const str = `<input onmousedown='js'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 2,
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
    const str = `<html onmousedown="something">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-onmousedown",
          idxFrom: 6,
          idxTo: 29,
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
    const str = `<zzz onmousedown="something" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(messages, [], "06.02");
    t.end();
  }
);

// 03. whitespace
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<input onmousedown="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-onmousedown",
          idxFrom: 20,
          idxTo: 20,
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
    const str = `<input onmousedown=" something ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-onmousedown": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<input onmousedown="something">`,
      "08.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-onmousedown",
          idxFrom: 20,
          idxTo: 31,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [20, 21],
              [30, 31],
            ],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);
