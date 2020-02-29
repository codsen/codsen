const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. type="simple"
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - off, missing dash`,
  t => {
    const str = "<!--z->";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str, "01.01.01");
    t.same(messages, [], "01.01.02");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - error, missing dash, text inside`,
  t => {
    const str = "<!--z->";
    const fixed = "<!--z-->";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.02.01");
    t.same(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          line: 1,
          column: 6,
          severity: 2,
          idxFrom: 5,
          idxTo: 7,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[5, 7, "-->"]]
          }
        }
      ],
      "01.02.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - error, missing dash, tag inside`,
  t => {
    const str = `<!--<img class="z"/>->`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.03.01");
    t.same(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 22,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[20, 22, "-->"]]
          }
        }
      ],
      "01.03.02"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space`,
  t => {
    const str = `<!--<img class="z"/>-- >`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.04.01");
    t.same(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 24,
          message: "Remove whitespace.",
          fix: {
            ranges: [[22, 23]]
          }
        }
      ],
      "01.04.02"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue excl mark`,
  t => {
    const str = `<!--<img class="z"/>--!>`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.05.01");
    t.same(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 24,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[20, 24, "-->"]]
          }
        }
      ],
      "01.05.02"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue single character, z`,
  t => {
    const str = `<!--<img class="z"/>--z>`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.05.01");
    t.same(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 24,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[20, 24, "-->"]]
          }
        }
      ],
      "01.05.02"
    );
    t.end();
  }
);

// 02. type="only"
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - off`, t => {
  const str = "<!--[if mso]>x<[endif]-->";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "comment-closing-malformed": 0
    }
  });
  t.equal(applyFixes(str, messages), str, "02.01.01");
  t.same(messages, [], "02.01.02");
  t.end();
});

t.test(
  `02.02 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - error level`,
  t => {
    const str = "<!--[if mso]>x<[endif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "02.02.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 25,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 25, "<![endif]-->"]]
          }
        }
      ],
      "02.02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - 1 instead of !`,
  t => {
    const str = "<!--[if mso]>x<1[endif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "02.03.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 26,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 26, "<![endif]-->"]]
          }
        }
      ],
      "02.03.02"
    );
    t.end();
  }
);

// 03. type="not"
// -----------------------------------------------------------------------------

// TODO
