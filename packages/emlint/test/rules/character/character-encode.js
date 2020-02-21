// rule: character-encode
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// 01. basic tests, no config
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`,
  t => {
    const str = "fsdhkfdfgh kj ";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2
      }
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`,
  t => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&pound;100");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`,
  t => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 1
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&pound;100");
    t.end();
  }
);

// 02. basic tests, no config
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - named`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "named"]
    }
  });
  t.match(messages, [
    {
      ruleId: "character-encode",
      severity: 2,
      idxFrom: 0,
      idxTo: 1,
      line: 1,
      message: "Unencoded pound sign character.",
      fix: {
        ranges: [[0, 1, "&pound;"]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "&pound;100");
  t.end();
});

t.test(
  `02.02 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - numeric`,
  t => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "numeric"]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&#xA3;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&#xA3;100");
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - missing`,
  t => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&pound;100");
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - unrecognised`,
  t => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "yo"]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&pound;100");
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - within ESP tag`,
  t => {
    const str = "{%- if count > 1 -%}{%- if count > 1 -%}";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2
      }
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

// 03. Email-unfriendly entities
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`,
  t => {
    const str = "\u0424"; // &Fcy; or Ф
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 1
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&#x424;");
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`,
  t => {
    const str = "\u0424"; // &Fcy; or Ф
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "named"]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&#x424;");
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`,
  t => {
    const str = "\u0424"; // &Fcy; or Ф
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "numeric"]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&#x424;");
    t.end();
  }
);

// 04. visible HTML-unfriendly characters within ASCII
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${33}m${`HTML-unfriendly`}\u001b[${39}m`} - brackets and quotes into named`,
  t => {
    const str = `><'"&`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "named"]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded greater than character.",
        fix: {
          ranges: [[0, 1, "&gt;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        message: "Unencoded less than character.",
        fix: {
          ranges: [[1, 2, "&lt;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        message: "Unencoded double quotes character.",
        fix: {
          ranges: [[3, 4, "&quot;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        message: "Unencoded ampersand character.",
        fix: {
          ranges: [[4, 5, "&amp;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&gt;&lt;'&quot;&amp;");
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${33}m${`HTML-unfriendly`}\u001b[${39}m`} - brackets and quotes into numeric`,
  t => {
    const str = `><'"&`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "numeric"]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded greater than character.",
        fix: {
          ranges: [[0, 1, "&#x3E;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        message: "Unencoded less than character.",
        fix: {
          ranges: [[1, 2, "&#x3C;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        message: "Unencoded double quotes character.",
        fix: {
          ranges: [[3, 4, "&#x22;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        message: "Unencoded ampersand character.",
        fix: {
          ranges: [[4, 5, "&#x26;"]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "&#x3E;&#x3C;'&#x22;&#x26;");
    t.end();
  }
);
