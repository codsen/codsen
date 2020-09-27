import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no media, error level 0`,
  (t) => {
    const str = `<html><style>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no media, error level 1`,
  (t) => {
    const str = `<html><style>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no media, error level 2`,
  (t) => {
    const str = `<html><style>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const healthyValues = [
      "all",
      "aural",
      "braille",
      "embossed",
      "handheld",
      "print",
      "projection",
      "screen",
      "speech",
      "tty",
      "tv",
    ];
    const linter = new Linter();
    healthyValues.forEach((healthyValue) => {
      const str = `<style media="${healthyValue}">`;
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-media": 2,
        },
      });
      t.equal(applyFixes(str, messages), str);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div media="screen">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-media",
          idxFrom: 5,
          idxTo: 19,
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
    const str = `<zzz media="screen" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-media",
          idxFrom: 5,
          idxTo: 19,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<style media="screeen">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 2,
      },
    });
    // will fix:
    t.equal(applyFixes(str, messages), `<style media="screen">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-media",
          idxFrom: 14,
          idxTo: 21,
          message: `Did you mean "screen"?`,
          fix: {
            ranges: [[14, 21, "screen"]],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - still catches whitespace on legit`,
  (t) => {
    const str = `<style media=" screen">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<style media="screen">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-media",
          idxFrom: 14,
          idxTo: 15,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[14, 15]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);
