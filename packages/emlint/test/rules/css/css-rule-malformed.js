import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
import { deepContains } from "ast-deep-contains";

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
  deepContains(
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
    t.is,
    t.fail
  );
  t.equal(messages.length, 2, "02.02");
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

tap.test(`08`, (t) => {
  const str = `<style>.a{color: red !important float: left}</style>`;
  const fixed = `<style>.a{color: red !important; float: left;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
      "css-trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08");
  deepContains(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 31,
        fix: {
          ranges: [[31, 31, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 32,
        idxTo: 43,
        fix: {
          ranges: [[43, 43, ";"]],
        },
      },
    ],
    t.is,
    t.fail
  );
  t.end();
});

// rogue semi in front of important
// -----------------------------------------------------------------------------

tap.test(`09`, (t) => {
  const str = `<style>.a{color:red; !important;}</style>`;
  const fixed = `<style>.a{color:red !important;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Delete the semicolon.",
        idxFrom: 19,
        idxTo: 20,
        fix: {
          ranges: [[19, 20]],
        },
      },
    ],
    "09.02"
  );
  t.end();
});

tap.test(`10 - impotant [sic]`, (t) => {
  const str = `<style>.a{color:red;!impotant;}</style>`;
  const fixed = `<style>.a{color:red !important;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "10");
  deepContains(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Delete the semicolon.",
        idxFrom: 19,
        idxTo: 20,
        fix: {
          ranges: [[19, 20, " "]],
        },
      },
      {
        severity: 2,
        ruleId: "css-rule-malformed",
        message: "Malformed !important.",
        idxFrom: 20,
        idxTo: 29,
        fix: {
          ranges: [[20, 29, "!important"]],
        },
      },
    ],
    t.is,
    t.fail
  );
  t.end();
});

// mis-spelled !important
// -----------------------------------------------------------------------------

tap.test(`11 - impotant [sic] - with space in front`, (t) => {
  const str = `<style>.a{color:red !impotant;}</style>`;
  const fixed = `<style>.a{color:red !important;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "11");
  t.end();
});

tap.test(`12 - impotant [sic] - without space in front`, (t) => {
  const str = `<style>.a{color:red!impotant}</style>`;
  const fixed = `<style>.a{color:red!important}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "12");
  t.end();
});

tap.test(`13 - important without excl mark`, (t) => {
  const str = `<style>.a{color:red important}</style>`;
  const fixed = `<style>.a{color:red !important}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "13");
  t.end();
});

tap.test(`14 - important with number one instead of excl mark`, (t) => {
  const str = `<style>.a{color:red 1important}</style>`;
  const fixed = `<style>.a{color:red !important}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "14");
  t.end();
});

// whitespace in front of colon/semi
// -----------------------------------------------------------------------------

tap.test(`15 - space after colon/semi`, (t) => {
  const str = `<style>.a{ color : red ; }</style>`;
  const fixed = `<style>.a{ color: red; }</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "15");
  t.end();
});

tap.test(`16 - no space after colon/semi`, (t) => {
  const str = `<style>.a{color :red ;}</style>`;
  const fixed = `<style>.a{color:red;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "16");
  t.end();
});

tap.test(`17`, (t) => {
  const str = `<style>.a{color : red;}</style>`;
  const fixed = `<style>.a{color: red;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "17");
  t.end();
});

tap.test(`18`, (t) => {
  const str = `<style>.a{color : red ; text-align : left ;}</style>`;
  const fixed = `<style>.a{color: red; text-align: left;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "18");
  t.end();
});

// some other character is in place of a colon
// -----------------------------------------------------------------------------

tap.test(`19`, (t) => {
  const str = `<style>.a{color/red;}</style>`;
  const fixed = `<style>.a{color:red;}</style>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "css-rule-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "19");
  t.end();
});
