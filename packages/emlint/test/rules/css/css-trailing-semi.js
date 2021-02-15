import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 00. false positives
// -----------------------------------------------------------------------------

tap.test(`01 - not style`, (t) => {
  const str = `<img alt="color: red">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

// always
// -----------------------------------------------------------------------------

tap.test(`02 - one style, always`, (t) => {
  const str = `<style>.a{color:red}</style><body>a</body>`;
  const fixed = `<style>.a{color:red;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
    ],
    "02.02"
  );
  t.end();
});

tap.test(`03 - one style, always, inner whitespace`, (t) => {
  const str = `<style>.a{color:red }</style><body>a</body>`;
  const fixed = `<style>.a{color:red; }</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [1, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.match(
    messages,
    [
      {
        severity: 1,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
    ],
    "03.02"
  );
  t.end();
});

tap.test(`04 - two styles, always`, (t) => {
  const str = `<style>.a{text-align:left; color:red}</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left; color:red;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04");
  t.end();
});

tap.test(`05 - two styles with space, always`, (t) => {
  const str = `<style>.a{text-align:left; color:red }</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left; color:red; }</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05");
  t.end();
});

tap.test(`06 - two styles, default=always`, (t) => {
  const str = `<style>.a{text-align:left; color:red\n}</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left; color:red;\n}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06");
  t.end();
});

tap.test(`07 - nothing to fix`, (t) => {
  const str = `<style>.a{\ntext-align:left;\ncolor:red;\n}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), str, "07.01");
  t.strictSame(messages, [], "07.02");
  t.end();
});

// never
// -----------------------------------------------------------------------------

tap.test(`08 - one style, never`, (t) => {
  const str = `<style>.a{color:red;}</style><body>a</body>`;
  const fixed = `<style>.a{color:red}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Remove the semicolon.",
        idxFrom: 10,
        idxTo: 20,
        fix: {
          ranges: [[19, 20]],
        },
      },
    ],
    "08.02"
  );
  t.end();
});

tap.test(`09 - two styles, never`, (t) => {
  const str = `<style>.a{text-align:left;color:red;}</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left;color:red}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09");
  t.end();
});

tap.test(`10 - two styles, never, trailing whitespace`, (t) => {
  const str = `<style>.a{text-align:left;color:red; }</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left;color:red }</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "10");
  t.end();
});
