const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
// const astDeepContains = require("ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - off`,
  t => {
    const str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "media-malformed": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - warn`,
  t => {
    const str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "media-malformed": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - error`,
  t => {
    const str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "media-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(`01.04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - screeen`, t => {
  const str = `<style>
  @media screeen and (color), projection and (color) {zzz}
</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "media-malformed": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "media-malformed",
      severity: 2,
      idxFrom: 17,
      idxTo: 24,
      message: `Unrecognised "screeen".`,
      fix: null
    }
  ]);
  t.end();
});

// 02. False positives
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`false positives`}\u001b[${39}m`} - not media`,
  t => {
    const str = `<style>
  @supports screeen and (color), projection and (color) {zzz}
</style>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "media-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);
