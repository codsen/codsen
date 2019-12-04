// rule: character-unspaced-punctuation
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");

const { applyFixes } = require("../../../t-util/util");

// 01. basic tests, no config
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`,
  t => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": 0
      }
    });
    t.same(messages, []);
    t.equal(applyFixes(str, messages), str);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`,
  t => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": 1
      }
    });
    t.match(messages, [
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 11,
        idxTo: 12,
        message: "Add a space.",
        fix: {
          ranges: [[12, 12, " "]]
        }
      },
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 15,
        idxTo: 16,
        message: "Add a space.",
        fix: {
          ranges: [[16, 16, " "]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>");
    t.end();
  }
);

// 02. with config
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link, right side missing`,
  t => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": [
          1,
          {
            questionMark: {
              whitespaceLeft: "never",
              whitespaceRight: "always"
            },
            exclamationMark: {
              whitespaceLeft: "never",
              whitespaceRight: "always"
            },
            semicolon: {
              whitespaceLeft: "never",
              whitespaceRight: "always"
            }
          }
        ]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 11,
        idxTo: 12,
        message: "Add a space.",
        fix: {
          ranges: [[12, 12, " "]]
        }
      },
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 15,
        idxTo: 16,
        message: "Add a space.",
        fix: {
          ranges: [[16, 16, " "]]
        }
      }
    ]);
    t.equal(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link, left side missing`,
  t => {
    const str = "-Les pommes ou les oranges?-Les pommes!";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": [
          1,
          {
            questionMark: {
              whitespaceLeft: "always",
              whitespaceRight: "always"
            },
            exclamationMark: {
              whitespaceLeft: "always",
              whitespaceRight: "always"
            },
            semicolon: {
              whitespaceLeft: "never",
              whitespaceRight: "always"
            }
          }
        ]
      }
    });
    t.match(messages, [
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 26,
        idxTo: 27,
        message: "Add a space.",
        fix: {
          ranges: [[26, 26, " "]]
        }
      },
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 26,
        idxTo: 27,
        message: "Add a space.",
        fix: {
          ranges: [[27, 27, " "]]
        }
      },
      {
        ruleId: "character-unspaced-punctuation",
        severity: 1,
        idxFrom: 38,
        idxTo: 39,
        message: "Add a space.",
        fix: {
          ranges: [[38, 38, " "]]
        }
      }
    ]);
    t.equal(
      applyFixes(str, messages),
      "-Les pommes ou les oranges ? -Les pommes !"
    );
    t.end();
  }
);
