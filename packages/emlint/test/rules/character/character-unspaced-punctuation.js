// avanotonly

// rule: character-unspaced-punctuation
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. basic tests, no config
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`, t => {
  const str = "<a>Click me!Now?Yes!</a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-unspaced-punctuation": 0
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

test(`01.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`, t => {
  const str = "<a>Click me!Now?Yes!</a>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-unspaced-punctuation": 1
    }
  });
  deepContains(
    messages,
    [
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
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>");
});

// 02. with config
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link, right side missing`, t => {
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
  deepContains(
    messages,
    [
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
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>");
});

test(`02.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link, left side missing`, t => {
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
  deepContains(
    messages,
    [
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
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "-Les pommes ou les oranges ? -Les pommes !");
});
