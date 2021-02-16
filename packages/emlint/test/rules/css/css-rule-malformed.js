import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// missing semi on a non-last rule
// -----------------------------------------------------------------------------

tap.test(`01 - 1/2`, (t) => {
  const str = `<style>.a{color:red\ntext-align:left;}</style><body>a</body>`;
  const fixed = `<style>.a{color:red;\ntext-align:left;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "01.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
    ],
    "01.02"
  );
  t.end();
});

tap.test(`02 - 1/3, 2/3`, (t) => {
  const str = `<style>.a{color:red\n\ntext-align:left\n\nfloat:right}</style><body>a</body>`;
  const fixed = `<style>.a{color:red;\n\ntext-align:left;\n\nfloat:right}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 21,
        idxTo: 36,
        fix: {
          ranges: [[36, 36, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-rule-malformed",
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
  t.equal(messages.length, 2, "02.03");
  t.end();
});

tap.test(`03 - 1/3, 2/3`, (t) => {
  const str = `<style>.a{color:red;\n\ntext-align:left\n\nfloat:right}</style><body>a</body>`;
  const fixed = `<style>.a{color:red;\n\ntext-align:left;\n\nfloat:right}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 22,
        idxTo: 37,
        fix: {
          ranges: [[37, 37, ";"]],
        },
      },
    ],
    "03.02"
  );
  t.equal(messages.length, 1, "03.03");
  t.end();
});

// semi only
// -----------------------------------------------------------------------------

tap.test(`04 - one semi, tight`, (t) => {
  const str = `<style>.a{;}</style><body>a</body>`;
  const fixed = `<style>.a{}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      // "css-rule-malformed": 2,
      all: 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Delete rogue character.",
        idxFrom: 7,
        idxTo: 12,
        fix: {
          ranges: [[10, 11]],
        },
      },
    ],
    "04.02"
  );
  t.end();
});

tap.test(`05 - two semis, tight`, (t) => {
  const str = `<style>.a{;;}</style><body>a</body>`;
  const fixed = `<style>.a{}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      // "css-rule-malformed": 2,
      all: 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Delete rogue characters.",
        idxFrom: 7,
        idxTo: 13,
        fix: {
          ranges: [[10, 12]],
        },
      },
    ],
    "05.02"
  );
  t.end();
});

// value missing
// -----------------------------------------------------------------------------

tap.test(`06 - nothing after semi`, (t) => {
  const str = `<style>.a{color:}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "06.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Missing value.",
        idxFrom: 10,
        idxTo: 16,
        fix: null,
      },
    ],
    "06.02"
  );
  t.end();
});

tap.test(`07 - value and semi missing, followed by correct rule`, (t) => {
  const str = `<style>.a{ color \n\ntext-align:left;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "07.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Missing value.",
        idxFrom: 11,
        idxTo: 16,
        fix: null,
      },
    ],
    "07.02"
  );
  t.end();
});
