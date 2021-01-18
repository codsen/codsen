import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no lang, error level 0`,
  (t) => {
    const str = `<html><p>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no lang, error level 1`,
  (t) => {
    const str = `<html><p>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no lang, error level 2`,
  (t) => {
    const str = `<html><p>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
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
      "fr-Brai",
      "ja-Kana",
      "es-013",
      "es-ES",
      "ru-Cyrl-BY",
      "en-GB",
      "FR",
      "am-et",
      "x-default",
      "pt-pt",
      "fr-fr",
    ];
    const linter = new Linter();
    healthyValues.forEach((healthyValue) => {
      const str = `<span lang="${healthyValue}">`;
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-lang": 2,
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

// <applet lang="de">
tap.only(
  `05 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const badParentTags = [
      "applet",
      "base",
      // "basefont",
      // "br",
      // "frame",
      // "frameset",
      // "iframe",
      // "param",
      // "script",
    ];
    const linter = new Linter();
    badParentTags.forEach((badParentTag) => {
      const str = `<${badParentTag} lang="de">`;
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-lang": 2,
        },
      });
      // can't fix:
      t.equal(applyFixes(str, messages), str);
      t.match(
        messages,
        [
          {
            ruleId: "attribute-validate-lang",
            idxFrom: badParentTag.length + 2,
            idxTo: badParentTag.length + 2 + 9,
            fix: null,
          },
        ],
        badParentTag
      );
      t.equal(messages.length, 1);
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - another recognised tag`,
  (t) => {
    const str = `<script lang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 8,
          idxTo: 17,
          fix: null,
        },
      ],
      "06.02"
    );
    t.equal(messages.length, 1);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div lang="a-DE">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 11,
          idxTo: 15,
          message: `Starts with singleton, "a".`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.equal(messages.length, 1);
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - still catches whitespace on legit`,
  (t) => {
    const str = `<a lang=" de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<a lang="de">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 9,
          idxTo: 10,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[9, 10]],
          },
        },
      ],
      "08.02"
    );
    t.equal(messages.length, 1);
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - invalid language tag and whitespace`,
  (t) => {
    // notice wrong tag name case - it won't get reported because
    // that's different rule and we didn't ask for it
    const str = `<A lang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<A lang="123">`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 9,
          idxTo: 14,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [9, 10],
              [13, 14],
            ],
          },
        },
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 10,
          idxTo: 13,
          message: `Unrecognised language subtag, "123".`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.equal(messages.length, 2);
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`value`}\u001b[${39}m`} - invalid language tag and whitespace + tag name case`,
  (t) => {
    const str = `<A lang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
        "tag-name-case": 2, // <--------------- !
      },
    });
    t.equal(applyFixes(str, messages), `<a lang="123">`, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "tag-name-case",
          idxFrom: 1,
          idxTo: 2,
          message: "Bad tag name case.",
          fix: {
            ranges: [[1, 2, "a"]],
          },
        },
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 9,
          idxTo: 14,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [9, 10],
              [13, 14],
            ],
          },
        },
        {
          ruleId: "attribute-validate-lang",
          idxFrom: 10,
          idxTo: 13,
          message: `Unrecognised language subtag, "123".`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.equal(messages.length, 3);
    t.end();
  }
);
