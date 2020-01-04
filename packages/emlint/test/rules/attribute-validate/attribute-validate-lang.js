const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 0`,
  t => {
    const str = `<html><p>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 1`,
  t => {
    const str = `<html><p>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no href, error level 2`,
  t => {
    const str = `<html><p>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  t => {
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
      "fr-fr"
    ];
    const linter = new Linter();
    healthyValues.forEach(healthyValue => {
      const str = `<span lang="${healthyValue}">`;
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-lang": 2
        }
      });
      t.equal(applyFixes(str, messages), str);
      t.same(messages, []);
    });
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const badParentTags = [
      "base",
      "head",
      "html",
      "meta",
      "script",
      "style",
      "title"
    ];
    const linter = new Linter();
    badParentTags.forEach(badParentTag => {
      const str = `<${badParentTag} lang="de">`;
      const messages = linter.verify(str, {
        rules: {
          "attribute-validate-lang": 2
        }
      });
      // can't fix:
      t.equal(applyFixes(str, messages), str);
      t.match(messages, [
        {
          ruleId: "attribute-validate-lang",
          idxFrom: badParentTag.length + 2,
          idxTo: badParentTag.length + 2 + 9,
          message: `Tag "${badParentTag}" can't have this attribute.`,
          fix: null
        }
      ]);
    });
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - another recognised tag`,
  t => {
    const str = `<script lang="de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 8,
        idxTo: 17,
        message: `Tag "script" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<div lang="a-DE">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 11,
        idxTo: 15,
        message: `Starts with singleton, "a".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit`,
  t => {
    const str = `<a lang=" de">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2
      }
    });
    t.equal(applyFixes(str, messages), `<a lang="de">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 9,
        idxTo: 10,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[9, 10]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - invalid language tag and whitespace`,
  t => {
    // notice wrong tag name case - it won't get reported because
    // that's different rule and we didn't ask for it
    const str = `<A lang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2
      }
    });
    t.equal(applyFixes(str, messages), `<A lang="123">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 9,
        idxTo: 14,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [9, 10],
            [13, 14]
          ]
        }
      },
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 10,
        idxTo: 13,
        message: `Unrecognised language subtag, "123".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - invalid language tag and whitespace + tag name case`,
  t => {
    const str = `<A lang=" 123 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-lang": 2,
        "tag-name-case": 2 // <--------------- !
      }
    });
    t.equal(applyFixes(str, messages), `<a lang="123">`);
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        idxFrom: 1,
        idxTo: 2,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 2, "a"]]
        }
      },
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 9,
        idxTo: 14,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [9, 10],
            [13, 14]
          ]
        }
      },
      {
        ruleId: "attribute-validate-lang",
        idxFrom: 10,
        idxTo: 13,
        message: `Unrecognised language subtag, "123".`,
        fix: null
      }
    ]);
    t.end();
  }
);
