const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. type="only"
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`type only`}\u001b[${39}m`} - off`, t => {
  const str = "<!--[if mso]>x<[endif]-->";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "comment-only-closing-malformed": 0
    }
  });
  t.equal(applyFixes(str, messages), str, "01.01.01");
  t.same(messages, [], "01.01.02");
  t.end();
});

t.test(
  `01.02 - ${`\u001b[${33}m${`type only`}\u001b[${39}m`} - error level`,
  t => {
    const str = "<!--[if mso]>x<[endif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-only-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.02.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-only-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 25,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 25, "<![endif]-->"]]
          }
        }
      ],
      "01.02.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`type only`}\u001b[${39}m`} - 1 instead of !`,
  t => {
    const str = "<!--[if mso]>x<1[endif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-only-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.03.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-only-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 26,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 26, "<![endif]-->"]]
          }
        }
      ],
      "01.03.02"
    );
    t.end();
  }
);
