// rule: character-unspaced-punctuation
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// 01. basic tests, no config
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`,
  (t) => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": 0,
      },
    });
    t.strictSame(messages, [], "01.01");
    t.equal(applyFixes(str, messages), str, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`,
  (t) => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": 1,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-unspaced-punctuation",
          severity: 1,
          idxFrom: 11,
          idxTo: 12,
          message: "Add a space.",
          fix: {
            ranges: [[12, 12, " "]],
          },
        },
        {
          ruleId: "character-unspaced-punctuation",
          severity: 1,
          idxFrom: 15,
          idxTo: 16,
          message: "Add a space.",
          fix: {
            ranges: [[16, 16, " "]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>", "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link`,
  (t) => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-unspaced-punctuation",
          severity: 2,
          idxFrom: 11,
          idxTo: 12,
          message: "Add a space.",
          fix: {
            ranges: [[12, 12, " "]],
          },
        },
        {
          ruleId: "character-unspaced-punctuation",
          severity: 2,
          idxFrom: 15,
          idxTo: 16,
          message: "Add a space.",
          fix: {
            ranges: [[16, 16, " "]],
          },
        },
      ],
      "03.01"
    );
    t.equal(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>", "03.02");
    t.end();
  }
);

// 02. with config
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - text inside anchor link, right side missing`,
  (t) => {
    const str = "<a>Click me!Now?Yes!</a>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-unspaced-punctuation": [
          1,
          {
            questionMark: {
              whitespaceLeft: "never",
              whitespaceRight: "always",
            },
            exclamationMark: {
              whitespaceLeft: "never",
              whitespaceRight: "always",
            },
            semicolon: {
              whitespaceLeft: "never",
              whitespaceRight: "always",
            },
          },
        ],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-unspaced-punctuation",
          severity: 1,
          idxFrom: 11,
          idxTo: 12,
          message: "Add a space.",
          fix: {
            ranges: [[12, 12, " "]],
          },
        },
        {
          ruleId: "character-unspaced-punctuation",
          severity: 1,
          idxFrom: 15,
          idxTo: 16,
          message: "Add a space.",
          fix: {
            ranges: [[16, 16, " "]],
          },
        },
      ],
      "04.01"
    );
    t.equal(applyFixes(str, messages), "<a>Click me! Now? Yes!</a>", "04.02");
    t.end();
  }
);

tap.test(`05 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - French`, (t) => {
  const str = "-Les pommes ou les oranges?-Les pommes!";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-unspaced-punctuation": [
        2,
        {
          questionMark: {
            whitespaceLeft: "always",
            whitespaceRight: "always",
          },
          exclamationMark: {
            whitespaceLeft: "always",
            whitespaceRight: "always",
          },
          semicolon: {
            whitespaceLeft: "never",
            whitespaceRight: "always",
          },
        },
      ],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "character-unspaced-punctuation",
        severity: 2,
        idxFrom: 26,
        idxTo: 27,
        message: "Add a space.",
        fix: {
          ranges: [[26, 26, " "]],
        },
      },
      {
        ruleId: "character-unspaced-punctuation",
        severity: 2,
        idxFrom: 26,
        idxTo: 27,
        message: "Add a space.",
        fix: {
          ranges: [[27, 27, " "]],
        },
      },
      {
        ruleId: "character-unspaced-punctuation",
        severity: 2,
        idxFrom: 38,
        idxTo: 39,
        message: "Add a space.",
        fix: {
          ranges: [[38, 38, " "]],
        },
      },
    ],
    "05.01"
  );
  t.equal(
    applyFixes(str, messages),
    "-Les pommes ou les oranges ? -Les pommes !",
    "05.02"
  );
  t.end();
});
