// rule: tag-space-between-slash-and-bracket
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
// const astDeepContains = require("ast-deep-contains");

// 1. no opts
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`, t => {
  const str = "<br/ >";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-space-between-slash-and-bracket": 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-between-slash-and-bracket",
      severity: 2,
      idxFrom: 4,
      idxTo: 5,
      line: 1,
      column: 5,
      message: "Bad whitespace.",
      fix: {
        ranges: [[4, 5]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "<br/>");
  t.end();
});

t.test(`01.02 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one space`, t => {
  const str = "<br/ >";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-between-slash-and-bracket",
      severity: 2,
      idxFrom: 4,
      idxTo: 5,
      line: 1,
      column: 5,
      message: "Bad whitespace.",
      fix: {
        ranges: [[4, 5]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "<br/>");
  t.end();
});

t.test(`01.03 - ${`\u001b[${33}m${`no opts`}\u001b[${39}m`} - one tab`, t => {
  const str = "<br/\t>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      tag: 2
    }
  });
  t.match(messages, [
    {
      ruleId: "tag-space-between-slash-and-bracket",
      severity: 2,
      idxFrom: 4,
      idxTo: 5,
      line: 1,
      column: 5,
      message: "Bad whitespace.",
      fix: {
        ranges: [[4, 5]]
      }
    }
  ]);
  t.equal(applyFixes(str, messages), "<br/>");
  t.end();
});
