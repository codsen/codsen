const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
// const astDeepContains = require("ast-deep-contains");

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
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`type only`}\u001b[${39}m`} - off`, t => {
  const str = "<!--[if mso]>x<[endif]-->";
  const fixed = "<!--[if mso]>x<![endif]-->";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "comment-only-closing-malformed": 2
    }
  });
  t.equal(applyFixes(str, messages), fixed);
  t.match(messages, [
    {
      ruleId: "comment-only-closing-malformed",
      severity: 2,
      idxFrom: 14,
      idxTo: 25,
      message: `Exclamation mark missing.`,
      fix: {
        ranges: [[15, 15, "!"]]
      }
    }
  ]);
  t.end();
});
